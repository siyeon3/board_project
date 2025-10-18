import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RedisService } from '../../redis/redis.service';

/**
 * JWT Refresh 전략
 * Refresh Token 검증
 */
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET') || 'secret',
    });
  }

  /**
   * Refresh Token 페이로드 검증
   * @param payload JWT 페이로드
   * @returns 사용자 정보
   */
  async validate(payload: any) {
    // Redis에 저장된 Refresh Token 확인
    const storedToken = await this.redisService.getRefreshToken(payload.sub);

    if (!storedToken) {
      throw new UnauthorizedException('유효하지 않은 Refresh Token입니다.');
    }

    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}
