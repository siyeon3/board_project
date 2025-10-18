import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * CurrentUser 데코레이터
 * 현재 로그인한 사용자 정보 가져오기
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
