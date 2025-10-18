import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT Refresh 가드
 * Refresh Token 필요
 */
@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {}
