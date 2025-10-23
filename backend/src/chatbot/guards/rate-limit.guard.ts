import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../../redis/redis.service';

/**
 * Rate Limiting Guard
 * 사용자당 일정 시간 내 요청 횟수 제한
 */
@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly rateLimit: number;
  private readonly windowSeconds = 60; // 1분

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.rateLimit = parseInt(this.configService.get<string>('CHATBOT_RATE_LIMIT') || '10');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId;

    if (!userId) {
      throw new HttpException('인증이 필요합니다.', HttpStatus.UNAUTHORIZED);
    }

    const key = `ratelimit:chatbot:${userId}`;
    const current = await this.redisService.get(key);

    if (current && parseInt(current) >= this.rateLimit) {
      throw new HttpException(
        `요청 한도를 초과했습니다. ${this.windowSeconds}초 후 다시 시도해주세요.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // 요청 카운트 증가
    const count = current ? parseInt(current) + 1 : 1;
    await this.redisService.setex(key, this.windowSeconds, count.toString());

    return true;
  }
}
