import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

/**
 * 챗봇 요청 DTO
 */
export class ChatDto {
  @IsString()
  @IsNotEmpty({ message: '메시지를 입력해주세요.' })
  @MaxLength(500, { message: '메시지는 500자를 초과할 수 없습니다.' })
  message: string;
}

/**
 * 챗봇 응답 인터페이스
 */
export interface ChatResponse {
  reply: string;
  tokensUsed: number;
  cached: boolean;
  relatedPosts?: Array<{
    _id: string;
    title: string;
    author: string;
    category: string;
  }>;
}
