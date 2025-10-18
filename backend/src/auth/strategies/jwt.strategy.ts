import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

/**
 * JWT 전략
 * Access Token 검증
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET') || 'secret',
    });
  }

  /**
   * JWT 페이로드 검증
   * @param payload JWT 페이로드
   * @returns 사용자 정보
   */
  async validate(payload: any) {

    // 사용자 존재 여부 확인
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }

    // req.user에 저장될 데이터
    return {
      userId: payload.sub,
      email: payload.email,
      username: payload.username,
    };
  }
}
