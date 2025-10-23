import api from './api';
import { Post, CreatePostDto, UpdatePostDto } from '../types/post';

export interface PaginatedResponse {
  posts: Post[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * 게시글 API 서비스
 * 백엔드와 통신하여 게시글 CRUD 작업 수행
 */
const postService = {
  /**
   * 모든 게시글 조회 (페이지네이션)
   * @param search 검색어 (제목 또는 내용)
   * @param author 작성자 필터
   * @param category 카테고리 필터
   * @param page 페이지 번호 (기본값: 1)
   * @param limit 페이지당 게시글 수 (기본값: 10)
   */
  async getAllPosts(
    search?: string,
    author?: string,
    category?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (author) params.append('author', author);
    if (category) params.append('category', category);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const queryString = params.toString();
    const url = `/posts?${queryString}`;

    const response = await api.get<PaginatedResponse>(url);
    return response.data;
  },

  /**
   * 특정 게시글 조회
   * @param id 게시글 ID (MongoDB ObjectId)
   */
  async getPost(id: string): Promise<Post> {
    const response = await api.get<Post>(`/posts/${id}`);
    return response.data;
  },

  /**
   * 새 게시글 작성
   * @param postData 게시글 데이터
   */
  async createPost(postData: CreatePostDto): Promise<Post> {
    const response = await api.post<Post>('/posts', postData);
    return response.data;
  },

  /**
   * 게시글 수정
   * @param id 게시글 ID (MongoDB ObjectId)
   * @param postData 수정할 데이터
   */
  async updatePost(id: string, postData: UpdatePostDto): Promise<Post> {
    const response = await api.patch<Post>(`/posts/${id}`, postData);
    return response.data;
  },

  /**
   * 게시글 삭제
   * @param id 게시글 ID (MongoDB ObjectId)
   */
  async deletePost(id: string): Promise<void> {
    await api.delete(`/posts/${id}`);
  },
};

export default postService;
