import React from 'react';
import { Post } from '../types/post';
import { useAuth } from '../contexts/AuthContext';
import CommentSection from './CommentSection';

/**
 * 게시글 상세보기 컴포넌트 - SNS 스타일
 */
interface PostDetailProps {
  post: Post;
  onBack: () => void;
  onEdit: () => void;
}

const PostDetail: React.FC<PostDetailProps> = ({ post, onBack, onEdit }) => {
  const { user } = useAuth();
  const isAuthor = user && user.username === post.author;

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="w-full">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-medium">목록으로 돌아가기</span>
      </button>

      {/* Post Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Post Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-semibold">
                  {post.author.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">{post.author}</p>
                <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                {post.updatedAt !== post.createdAt && (
                  <p className="text-xs text-gray-400">수정됨 · {formatDate(post.updatedAt)}</p>
                )}
              </div>
            </div>

            {isAuthor && (
              <button
                onClick={onEdit}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="text-sm font-medium">수정</span>
              </button>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
        </div>

        {/* Post Content */}
        <div className="p-6">
          <div className="prose prose-lg max-w-none">
            {post.content.split('\n').map((line, index) => (
              <p key={index} className="text-gray-700 leading-relaxed mb-4">
                {line || '\u00A0'}
              </p>
            ))}
          </div>
        </div>

        {/* Post Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>조회</span>
              </span>
            </div>
            <div className="text-xs">
              게시글 ID: {post._id}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="px-6 pb-6">
          <CommentSection postId={post._id} />
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
