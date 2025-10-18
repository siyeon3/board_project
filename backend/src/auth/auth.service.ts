import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RedisService } from '../redis/redis.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

/**
 * 인증 서비스
 * 로그인, 로그아웃, 토큰 갱신 등
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 회원가입
   * @param createUserDto 사용자 생성 데이터
   * @returns 생성된 사용자 (비밀번호 제외)
   */
  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    // 비밀번호 필드는 toJSON에서 자동 제거됨
    return {
      message: '회원가입이 완료되었습니다.',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    };
  }

  /**
   * 로그인
   * @param loginDto 로그인 데이터
   * @returns Access Token 및 Refresh Token
   */
  async login(loginDto: LoginDto) {
    // 사용자 확인
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 일치하지 않습니다.');
    }

    // 비밀번호 확인
    if (!user.password) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 일치하지 않습니다.');
    }

    const isPasswordValid = await this.usersService.validatePassword(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 일치하지 않습니다.');
    }

    // 토큰 생성
    const tokens = await this.generateTokens(user);

    // 마지막 로그인 시간 업데이트
    await this.usersService.updateLastLogin((user as any)._id.toString());

    return {
      message: '로그인 성공',
      ...tokens,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    };
  }

  /**
   * 로그아웃
   * @param userId 사용자 ID
   * @param accessToken Access Token
   */
  async logout(userId: string, accessToken: string) {
    // Redis에서 Refresh Token 삭제
    await this.redisService.deleteRefreshToken(userId);

    // Access Token을 Blacklist에 추가 (남은 유효 시간만큼)
    const accessExpiration = this.parseExpiration(
      this.configService.get<string>('JWT_ACCESS_EXPIRATION', '15m'),
    );
    await this.redisService.addToBlacklist(accessToken, accessExpiration);

    return { message: '로그아웃 되었습니다.' };
  }

  /**
   * Access Token 갱신
   * @param userId 사용자 ID
   * @param refreshToken Refresh Token
   * @returns 새로운 Access Token
   */
  async refreshAccessToken(userId: string, refreshToken: string) {
    // Redis에서 Refresh Token 확인 (JwtRefreshStrategy에서 이미 검증됨)
    const user = await this.usersService.findById(userId);

    // 새 Access Token 생성
    const accessToken = await this.generateAccessToken(user);

    return {
      message: 'Access Token 갱신 성공',
      accessToken,
    };
  }

  /**
   * Access Token 및 Refresh Token 생성
   * @param user 사용자 정보
   * @returns Access Token 및 Refresh Token
   */
  private async generateTokens(user: any) {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      username: user.username,
    };

    // Access Token (짧은 유효기간: 15분)
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });

    // Refresh Token (긴 유효기간: 7일)
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    // Refresh Token을 Redis에 저장
    const refreshExpiration = this.parseExpiration(
      this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d'),
    );
    await this.redisService.saveRefreshToken(
      user._id.toString(),
      refreshToken,
      refreshExpiration,
    );

    return { accessToken, refreshToken };
  }

  /**
   * Access Token 생성
   * @param user 사용자 정보
   * @returns Access Token
   */
  private async generateAccessToken(user: any): Promise<string> {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      username: user.username,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });
  }

  /**
   * 만료 시간 문자열을 초로 변환
   * @param expiration 만료 시간 (예: '15m', '7d')
   * @returns 초 단위 시간
   */
  private parseExpiration(expiration: string): number {
    const unit = expiration.slice(-1);
    const value = parseInt(expiration.slice(0, -1), 10);

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 24 * 60 * 60;
      default:
        return 900; // 기본값: 15분
    }
  }
}
