import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RateLimitGuard } from './guards/rate-limit.guard';
import { DailyLimitGuard } from './guards/daily-limit.guard';
import { ChatbotService } from './chatbot.service';
import { ChatDto, ChatResponse } from './dto/chat.dto';

@Controller('chatbot')
@UseGuards(JwtAuthGuard, RateLimitGuard, DailyLimitGuard)
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  /**
   * 챗봇과 대화
   * POST /chatbot/chat
   */
  @Post('chat')
  async chat(@Body() chatDto: ChatDto, @Request() req: any): Promise<ChatResponse> {
    const userId = req.user.userId;
    return this.chatbotService.chat(chatDto.message, userId);
  }

  /**
   * 게시글 제목 제안
   * POST /chatbot/suggest-title
   */
  @Post('suggest-title')
  async suggestTitle(@Body() body: { content: string }): Promise<{ title: string }> {
    const title = await this.chatbotService.suggestTitle(body.content);
    return { title };
  }
}
