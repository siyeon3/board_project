import axiosInstance from './axiosConfig';

export interface Comment {
  _id: string;
  postId: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 댓글 생성
 */
export const createComment = async (postId: string, content: string): Promise<Comment> => {
  const response = await axiosInstance.post(`/comments/${postId}`, { content });
  return response.data;
};

/**
 * 게시글의 댓글 목록 조회
 */
export const getCommentsByPostId = async (postId: string): Promise<Comment[]> => {
  const response = await axiosInstance.get(`/comments/post/${postId}`);
  return response.data;
};

/**
 * 댓글 수정
 */
export const updateComment = async (commentId: string, content: string): Promise<Comment> => {
  const response = await axiosInstance.patch(`/comments/${commentId}`, { content });
  return response.data;
};

/**
 * 댓글 삭제
 */
export const deleteComment = async (commentId: string): Promise<void> => {
  await axiosInstance.delete(`/comments/${commentId}`);
};
