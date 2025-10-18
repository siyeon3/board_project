import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';

/**
 * 게시글 수정 DTO
 * CreatePostDto의 모든 필드를 선택적(optional)으로 만듦
 */
export class UpdatePostDto extends PartialType(CreatePostDto) {}
