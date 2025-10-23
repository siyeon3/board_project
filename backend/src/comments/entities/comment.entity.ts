import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * 댓글 스키마
 * MongoDB의 comments 컬렉션과 매핑
 */
@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
  postId: Types.ObjectId; // 게시글 ID

  @Prop({ required: true })
  content: string; // 댓글 내용

  @Prop({ required: true })
  author: string; // 작성자 닉네임(username)

  createdAt?: Date; // 생성일 (timestamps: true로 자동 생성)
  updatedAt?: Date; // 수정일 (timestamps: true로 자동 생성)
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
