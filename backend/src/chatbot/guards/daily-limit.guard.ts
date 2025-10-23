import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../../redis/redis.service';

/**
 * 일일 전체 사용량 제한 Guard
 * 모든 사용자 통틀어서 하루 총 요청 수 제한
 */
@Injectable()
export class DailyLimitGuard implements CanActivate {
  private readonly dailyLimit: number;

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.dailyLimit = parseInt(this.configService.get<string>('CHATBOT_DAILY_LIMIT') || '100');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const today = new Date().toISOString().split('T')[0]; // 2025-10-19
    const key = `daily_limit:${today}`;

    const current = await this.redisService.get(key);
    const count = current ? parseInt(current) : 0;

    if (count >= this.dailyLimit) {
      throw new HttpException(
        '일일 사용량을 초과했습니다. 내일 다시 이용해주세요.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // 카운트 증가 (24시간 후 자동 삭제)
    const newCount = count + 1;
    await this.redisService.setex(key, 86400, newCount.toString());

    return true;
  }
}
