import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';

/**
 * 댓글 수정 DTO
 */
export class UpdateCommentDto extends PartialType(CreateCommentDto) {}
