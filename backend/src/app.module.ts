import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { UsersModule } from './users/users.module';

/**
 * 애플리케이션 루트 모듈
 * MongoDB 데이터베이스 설정 및 전체 모듈 통합
 */
@Module({
  imports: [
    // 환경변수 설정
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // MongoDB 데이터베이스 연결
    MongooseModule.forRoot('mongodb://localhost:27017/board'),
    // Redis 모듈
    RedisModule,
    // 사용자 모듈
    UsersModule,
    // 인증 모듈
    AuthModule,
    // 게시글 모듈
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
