/**
 * 게시글 타입 정의
 * MongoDB ObjectId는 string 타입
 */
export interface Post {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 게시글 생성 요청 데이터 타입
 */
export interface CreatePostDto {
  title: string;
  content: string;
  author: string;
}

/**
 * 게시글 수정 요청 데이터 타입
 */
export interface UpdatePostDto {
  title?: string;
  content?: string;
  author?: string;
}
