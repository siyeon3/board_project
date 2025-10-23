import React, { useState, useEffect } from 'react';
import { Post, CreatePostDto } from '../types/post';
import postService from '../services/postService';
import { useAuth } from '../contexts/AuthContext';

/**
 * 게시글 작성/수정 폼 컴포넌트
 */
interface PostFormProps {
  post?: Post; // 수정 모드일 경우 전달되는 게시글
  onSuccess: () => void;
  onCancel: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ post, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<CreatePostDto>({
    title: '',
    content: '',
    author: user?.username || '',
    category: 'general',
  });
  const [loading, setLoading] = useState(false);

  // 카테고리 목록
  const categories = [
    { value: 'general', label: '일반', emoji: '💬' },
    { value: 'development', label: '개발', emoji: '💻' },
    { value: 'design', label: '디자인', emoji: '🎨' },
    { value: 'marketing', label: '마케팅', emoji: '📢' },
    { value: 'business', label: '비즈니스', emoji: '💼' },
    { value: 'lifestyle', label: '라이프스타일', emoji: '🌟' },
    { value: 'tech', label: '기술', emoji: '🔧' },
    { value: 'other', label: '기타', emoji: '📌' },
  ];

  // 수정 모드일 경우 초기 데이터 설정
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        author: post.author,
        category: post.category || 'general',
      });
    }
  }, [post]);

  // 입력값 변경 처리
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    // 작성자 정보 확인
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      setLoading(true);

      // 작성자 정보를 현재 로그인한 사용자로 설정
      const postData = {
        ...formData,
        author: user.username,
      };

      if (post) {
        // 수정 모드
        await postService.updatePost(post._id, postData);
        alert('게시글이 수정되었습니다.');
      } else {
        // 작성 모드
        await postService.createPost(postData);
        alert('게시글이 작성되었습니다.');
      }
      onSuccess();
    } catch (err) {
      alert('작업에 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {post ? '게시글 수정' : '새 게시글 작성'}
        </h1>
        <p className="text-gray-500">
          {post ? '게시글 내용을 수정해보세요' : '당신의 생각을 자유롭게 공유해보세요'}
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Author Info */}
          {user && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">작성자</p>
                  <p className="font-semibold text-gray-900">{user.username}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="p-6 space-y-6">
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                카테고리
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                제목
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="게시글 제목을 입력하세요"
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                내용
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="내용을 입력하세요&#10;&#10;여러 줄로 작성할 수 있습니다."
                rows={12}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <p className="mt-2 text-sm text-gray-500">
                {formData.content.length}자
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>처리 중...</span>
                </span>
              ) : (
                post ? '수정하기' : '작성하기'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
