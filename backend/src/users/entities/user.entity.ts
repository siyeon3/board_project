import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * 사용자 엔티티
 * MongoDB 컬렉션: users
 */
@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: null })
  lastLoginAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// 비밀번호 필드는 조회 시 기본적으로 제외
UserSchema.set('toJSON', {
  transform: function (_doc, ret) {
    delete ret.password;
    return ret;
  },
});
