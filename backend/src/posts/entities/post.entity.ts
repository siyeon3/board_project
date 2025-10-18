import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * 게시글 스키마
 * MongoDB의 posts 컬렉션과 매핑
 */
@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ required: true })
  title: string; // 게시글 제목

  @Prop({ required: true })
  content: string; // 게시글 내용

  @Prop({ required: true })
  author: string; // 작성자

  createdAt?: Date; // 생성일 (timestamps: true로 자동 생성)
  updatedAt?: Date; // 수정일 (timestamps: true로 자동 생성)
}

export const PostSchema = SchemaFactory.createForClass(Post);
