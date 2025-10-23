import axiosInstance from './axiosConfig';

export interface ChatResponse {
  reply: string;
  tokensUsed: number;
  cached: boolean;
  relatedPosts?: Array<{
    _id: string;
    title: string;
    author: string;
    category: string;
  }>;
}

/**
 * 챗봇과 대화
 */
export const sendChatMessage = async (message: string): Promise<ChatResponse> => {
  const response = await axiosInstance.post('/chatbot/chat', { message });
  return response.data;
};

/**
 * 게시글 제목 제안
 */
export const suggestTitle = async (content: string): Promise<string> => {
  const response = await axiosInstance.post('/chatbot/suggest-title', { content });
  return response.data.title;
};
