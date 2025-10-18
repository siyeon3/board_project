import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdatePasswordDto } from '../users/dto/update-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';

/**
 * 인증 컨트롤러
 * 회원가입, 로그인, 로그아웃, 토큰 갱신 등
 */
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * 회원가입
   * @param createUserDto 사용자 생성 데이터
   */
  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  /**
   * 로그인
   * @param loginDto 로그인 데이터
   */
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  /**
   * 로그아웃
   * @param req Express Request
   */
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: any) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    return await this.authService.logout(req.user.userId, token);
  }

  /**
   * Access Token 갱신
   * @param req Express Request
   */
  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refresh(@Req() req: any) {
    return await this.authService.refreshAccessToken(
      req.user.userId,
      req.user.refreshToken,
    );
  }

  /**
   * 현재 로그인한 사용자 정보 조회
   * @param user 현재 사용자 (JWT에서 추출)
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@CurrentUser() user: any) {
    const userInfo = await this.usersService.findById(user.userId);
    return {
      id: userInfo._id,
      email: userInfo.email,
      username: userInfo.username,
      createdAt: userInfo.createdAt,
      lastLoginAt: userInfo.lastLoginAt,
    };
  }

  /**
   * 비밀번호 변경
   * @param user 현재 사용자
   * @param updatePasswordDto 비밀번호 변경 데이터
   */
  @UseGuards(JwtAuthGuard)
  @Patch('password')
  async updatePassword(
    @CurrentUser() user: any,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    await this.usersService.updatePassword(user.userId, updatePasswordDto);
    return { message: '비밀번호가 성공적으로 변경되었습니다.' };
  }
}
