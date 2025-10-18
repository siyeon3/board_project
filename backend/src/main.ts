import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

/**
 * 애플리케이션 부트스트랩 함수
 * NestJS 서버 시작 및 기본 설정
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 활성화 (React 프론트엔드와 통신 허용)
  app.enableCors();

  // 전역 ValidationPipe 설정
  app.useGlobalPipes(new ValidationPipe());

  // 서버 시작 (포트: 3000)
  await app.listen(process.env.PORT ?? 3000);
  console.log(`애플리케이션이 포트 ${process.env.PORT ?? 3000}에서 실행 중입니다.`);
}
bootstrap();
