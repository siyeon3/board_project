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

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

  // 서버 시작 (포트: 환경 변수 또는 기본값 3001)
  await app.listen(port);
  console.log(`애플리케이션이 포트 ${port}에서 실행 중입니다.`);
}
bootstrap();
