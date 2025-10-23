import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

/**
 * 게시글 생성 DTO
 * 새 게시글 작성 시 필요한 데이터
 */
export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string; // 게시글 제목

  @IsNotEmpty()
  @IsString()
  content: string; // 게시글 내용

  @IsNotEmpty()
  @IsString()
  author: string; // 작성자

  @IsOptional()
  @IsString()
  category?: string; // 카테고리 (선택, 기본값: general)
}
