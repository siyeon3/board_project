import api from './api';
import { Post, CreatePostDto, UpdatePostDto } from '../types/post';

/**
 * 게시글 API 서비스
 * 백엔드와 통신하여 게시글 CRUD 작업 수행
 */
const postService = {
  /**
   * 모든 게시글 조회
   */
  async getAllPosts(): Promise<Post[]> {
    const response = await api.get<Post[]>('/posts');
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
