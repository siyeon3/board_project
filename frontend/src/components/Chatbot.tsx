import React, { useState } from 'react';
import { sendChatMessage, ChatResponse } from '../services/chatbotService';
import { useNavigate } from 'react-router-dom';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  tokensUsed?: number;
  cached?: boolean;
  relatedPosts?: Array<{
    _id: string;
    title: string;
    author: string;
    category: string;
  }>;
}

const Chatbot: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response: ChatResponse = await sendChatMessage(input);
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.reply,
        tokensUsed: response.tokensUsed,
        cached: response.cached,
        relatedPosts: response.relatedPosts,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        role: 'assistant',
        content: error.response?.data?.message || '오류가 발생했습니다. 다시 시도해주세요.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* 챗봇 토글 버튼 */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      )}

      {/* 챗봇 창 */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-2xl w-96 h-[500px] flex flex-col">
          {/* 헤더 */}
          <div className="bg-blue-500 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">AI 도우미</h3>
            <button onClick={() => setIsOpen(false)} className="hover:bg-blue-600 rounded p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-10">
                <p>무엇을 도와드릴까요?</p>
                <p className="text-sm mt-2">게시글 작성, 질문 등을 물어보세요!</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white border border-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  {msg.role === 'assistant' && msg.tokensUsed !== undefined && (
                    <p className="text-xs text-gray-400 mt-1">
                      {msg.cached ? '캐시됨' : `토큰: ${msg.tokensUsed}`}
                    </p>
                  )}
                  {msg.role === 'assistant' && msg.relatedPosts && msg.relatedPosts.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 font-semibold mb-2">관련 게시글:</p>
                      <div className="space-y-2">
                        {msg.relatedPosts.map((post) => (
                          <button
                            key={post._id}
                            onClick={() => {
                              navigate(`/posts/${post._id}`);
                              setIsOpen(false);
                            }}
                            className="w-full text-left p-2 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition-colors"
                          >
                            <p className="text-xs font-medium text-gray-800">{post.title}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {post.author} • {post.category}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 입력 영역 */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="메시지를 입력하세요..."
                maxLength={500}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                전송
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">{input.length}/500</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
