import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';

/**
 * Redis 모듈 (전역 모듈)
 * 애플리케이션 전체에서 사용 가능
 */
@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
