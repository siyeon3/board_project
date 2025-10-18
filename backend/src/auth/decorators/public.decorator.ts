import { SetMetadata } from '@nestjs/common';

/**
 * Public 데코레이터
 * 인증 없이 접근 가능한 엔드포인트에 사용
 */
export const Public = () => SetMetadata('isPublic', true);
