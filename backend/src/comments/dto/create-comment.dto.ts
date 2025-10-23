import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

/**
 * 댓글 생성 DTO
 */
export class CreateCommentDto {
  @IsString()
  @IsNotEmpty({ message: '댓글 내용을 입력해주세요.' })
  @MaxLength(500, { message: '댓글은 500자를 초과할 수 없습니다.' })
  content: string;
}
