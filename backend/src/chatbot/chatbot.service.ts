import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { RedisService } from '../redis/redis.service';
import { ChatResponse } from './dto/chat.dto';
import { Post } from '../posts/entities/post.entity';

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);
  private genAI: GoogleGenerativeAI | null;
  private readonly model: string;
  private readonly maxTokens: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    @InjectModel(Post.name)
    private readonly postModel: Model<Post>,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey || apiKey === 'undfine' || apiKey === 'undefined' || apiKey === 'your-gemini-api-key-here') {
      this.logger.warn('GEMINI_API_KEY가 설정되지 않았습니다. 더미 모드로 작동합니다.');
      this.genAI = null;
    } else {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.configService.get<string>('GEMINI_MODEL') || 'gemini-pro';
      this.logger.log(`Gemini AI 서비스 초기화 완료 (모델: ${this.model})`);
    }

    this.maxTokens = parseInt(this.configService.get<string>('CHATBOT_MAX_TOKENS') || '500');
  }

  /**
   * 게시글 검색
   * @param keywords 검색 키워드 배열
   * @returns 관련 게시글 목록 (최대 5개)
   */
  private async searchPosts(keywords: string[]): Promise<Post[]> {
    if (!keywords || keywords.length === 0) return [];

    try {
      // 키워드로 OR 검색 (제목 또는 내용에 포함)
      const query = {
        $or: keywords.flatMap(keyword => [
          { title: { $regex: keyword, $options: 'i' } },
          { content: { $regex: keyword, $options: 'i' } },
        ]),
      };

      const posts = await this.postModel
        .find(query)
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title content author category createdAt _id')
        .exec();

      this.logger.log(`키워드 [${keywords.join(', ')}]로 ${posts.length}개의 게시글 발견`);
      return posts;
    } catch (error) {
      this.logger.error('게시글 검색 실패:', error);
      return [];
    }
  }

  /**
   * AI로 키워드 추출
   * @param message 사용자 메시지
   * @returns 추출된 키워드 배열
   */
  private async extractKeywords(message: string): Promise<string[]> {
    if (!this.genAI) {
      // AI 없을 때 간단한 키워드 추출
      const simpleKeywords = message
        .toLowerCase()
        .replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, '')
        .split(/\s+/)
        .filter((word: string) => word.length > 1);
      return simpleKeywords.slice(0, 3);
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: this.model });
      const prompt = `사용자의 질문에서 게시글 검색에 사용할 핵심 키워드를 1~3개 추출하세요. 쉼표로 구분하여 키워드만 반환하세요.\n\n질문: ${message}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const keywordsText = response.text() || '';

      const keywords = keywordsText
        .split(',')
        .map((k: string) => k.trim())
        .filter((k: string) => k.length > 0);

      this.logger.log(`추출된 키워드: [${keywords.join(', ')}]`);
      return keywords;
    } catch (error) {
      this.logger.error('키워드 추출 실패:', error);
      return [];
    }
  }

  /**
   * 챗봇과 대화 (게시글 검색 기능 포함)
   * @param message 사용자 메시지
   * @param _userId 사용자 ID (rate limiting용, 향후 사용자별 캐싱에 활용 가능)
   * @returns ChatResponse
   */
  async chat(message: string, _userId: string): Promise<ChatResponse> {
    // 1. 키워드 추출
    const keywords = await this.extractKeywords(message);

    // 2. 게시글 검색
    const relatedPosts = await this.searchPosts(keywords);

    // 3. AI가 없으면 간단한 응답
    if (!this.genAI) {
      let reply = '죄송합니다. AI 서비스가 설정되지 않았습니다.';

      if (relatedPosts.length > 0) {
        reply = `"${keywords.join(', ')}" 관련 게시글 ${relatedPosts.length}개를 찾았습니다:\n\n`;
        relatedPosts.forEach((post, index) => {
          reply += `${index + 1}. ${post.title} (작성자: ${post.author})\n`;
        });
      }

      return {
        reply,
        tokensUsed: 0,
        cached: false,
        relatedPosts: relatedPosts.map(post => ({
          _id: (post as any)._id.toString(),
          title: post.title,
          author: post.author,
          category: post.category,
        })),
      };
    }

    // 4. Redis 캐시 확인
    const cacheKey = `chatbot:${message}`;
    const cached = await this.redisService.get(cacheKey);

    if (cached) {
      this.logger.log(`캐시된 응답 반환: ${message.substring(0, 30)}...`);
      return {
        reply: cached,
        tokensUsed: 0,
        cached: true,
        relatedPosts: relatedPosts.map(post => ({
          _id: (post as any)._id.toString(),
          title: post.title,
          author: post.author,
          category: post.category,
        })),
      };
    }

    try {
      // 5. 게시글 정보를 컨텍스트로 포함
      let contextMessage = message;
      if (relatedPosts.length > 0) {
        const postsContext = relatedPosts.map((post, index) =>
          `[게시글 ${index + 1}] 제목: ${post.title}, 작성자: ${post.author}, 내용: ${post.content.substring(0, 100)}...`
        ).join('\n');

        contextMessage = `사용자 질문: ${message}\n\n우리 게시판에서 찾은 관련 게시글:\n${postsContext}`;
      }

      // 6. Gemini API 호출
      const model = this.genAI.getGenerativeModel({ model: this.model });
      const systemPrompt = `당신은 친절한 게시판 도우미입니다. 사용자의 질문에 답변하고, 관련 게시글이 있으면 그 정보를 활용하여 답변하세요. 게시글을 언급할 때는 제목과 작성자를 포함하세요.`;
      const fullPrompt = `${systemPrompt}\n\n${contextMessage}`;

      const result = await model.generateContent(fullPrompt);
      const response = result.response;
      const reply = response.text() || '응답을 생성할 수 없습니다.';

      // Gemini는 토큰 사용량을 usageMetadata에서 제공
      const tokensUsed = (response as any).usageMetadata?.totalTokenCount || 0;

      // 7. 응답 캐싱 (1시간)
      await this.redisService.setex(cacheKey, 3600, reply);

      this.logger.log(`토큰 사용: ${tokensUsed}`);

      return {
        reply,
        tokensUsed,
        cached: false,
        relatedPosts: relatedPosts.map(post => ({
          _id: (post as any)._id.toString(),
          title: post.title,
          author: post.author,
          category: post.category,
        })),
      };
    } catch (error) {
      this.logger.error('Gemini API 호출 실패:', error);
      this.logger.error('에러 상세:', JSON.stringify(error, null, 2));
      throw new Error(`AI 챗봇 응답 생성에 실패했습니다: ${error.message || error}`);
    }
  }

  /**
   * 게시글 제목 제안
   * @param content 게시글 내용 (첫 200자)
   * @returns 제안된 제목
   */
  async suggestTitle(content: string): Promise<string> {
    if (!this.genAI) {
      return '제목을 입력하세요';
    }

    const truncated = content.substring(0, 200);
    const cacheKey = `title:${truncated}`;
    const cached = await this.redisService.get(cacheKey);

    if (cached) return cached;

    try {
      const model = this.genAI.getGenerativeModel({ model: this.model });
      const prompt = `게시글 내용을 읽고 적절한 제목을 하나만 제안해주세요. 20자 이내로 작성하세요.\n\n내용: ${truncated}`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const title = response.text() || '제목 없음';

      await this.redisService.setex(cacheKey, 3600, title);

      return title;
    } catch (error) {
      this.logger.error('제목 제안 실패:', error);
      return '제목 제안 실패';
    }
  }
}
