import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

/**
 * Redis 서비스
 * Refresh Token 및 세션 관리용
 */
@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redisClient: Redis;

  constructor(private readonly configService: ConfigService) {
    this.redisClient = new Redis({
      host: this.configService.get<string>('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    this.redisClient.on('connect', () => {
      console.log('Redis connected successfully');
    });

    this.redisClient.on('error', (err) => {
      console.error('Redis connection error:', err);
    });
  }

  /**
   * Refresh Token 저장
   * @param userId 사용자 ID
   * @param refreshToken Refresh Token
   * @param ttl Time to Live (초 단위)
   */
  async saveRefreshToken(
    userId: string,
    refreshToken: string,
    ttl: number,
  ): Promise<void> {
    const key = `refresh_token:${userId}`;
    await this.redisClient.setex(key, ttl, refreshToken);
  }

  /**
   * Refresh Token 조회
   * @param userId 사용자 ID
   * @returns Refresh Token 또는 null
   */
  async getRefreshToken(userId: string): Promise<string | null> {
    const key = `refresh_token:${userId}`;
    return await this.redisClient.get(key);
  }

  /**
   * Refresh Token 삭제 (로그아웃)
   * @param userId 사용자 ID
   */
  async deleteRefreshToken(userId: string): Promise<void> {
    const key = `refresh_token:${userId}`;
    await this.redisClient.del(key);
  }

  /**
   * Blacklist에 Access Token 추가 (로그아웃 시)
   * @param token Access Token
   * @param ttl Time to Live (초 단위)
   */
  async addToBlacklist(token: string, ttl: number): Promise<void> {
    const key = `blacklist:${token}`;
    await this.redisClient.setex(key, ttl, 'true');
  }

  /**
   * Blacklist에 토큰이 있는지 확인
   * @param token Access Token
   * @returns Blacklist 포함 여부
   */
  async isBlacklisted(token: string): Promise<boolean> {
    const key = `blacklist:${token}`;
    const result = await this.redisClient.get(key);
    return result !== null;
  }

  /**
   * 모듈 종료 시 Redis 연결 해제
   */
  async onModuleDestroy() {
    await this.redisClient.quit();
  }

  /**
   * Redis 클라이언트 직접 접근 (필요 시)
   */
  getClient(): Redis {
    return this.redisClient;
  }
}
