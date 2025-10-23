import React, { useEffect, useState, useCallback } from 'react';
import { Post } from '../types/post';
import postService from '../services/postService';
import { useAuth } from '../contexts/AuthContext';

/**
 * 게시글 목록 컴포넌트 - SNS 카드 스타일 + 페이지네이션
 */
const PostList: React.FC<{ onSelectPost: (post: Post) => void; onCreateNew: () => void }> = ({
  onSelectPost,
  onCreateNew,
}) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [debouncedAuthor, setDebouncedAuthor] = useState('');

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 10;

  // 카테고리 목록
  const categories = [
    { value: '', label: '전체', emoji: '📋' },
    { value: 'general', label: '일반', emoji: '💬' },
    { value: 'development', label: '개발', emoji: '💻' },
    { value: 'design', label: '디자인', emoji: '🎨' },
    { value: 'marketing', label: '마케팅', emoji: '📢' },
    { value: 'business', label: '비즈니스', emoji: '💼' },
    { value: 'lifestyle', label: '라이프스타일', emoji: '🌟' },
    { value: 'tech', label: '기술', emoji: '🔧' },
    { value: 'other', label: '기타', emoji: '📌' },
  ];

  // Debounce 효과: 500ms 후에 검색 실행
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAuthor(authorFilter);
    }, 500);

    return () => clearTimeout(timer);
  }, [authorFilter]);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await postService.getAllPosts(
        debouncedSearch || undefined,
        debouncedAuthor || undefined,
        categoryFilter || undefined,
        currentPage,
        itemsPerPage
      );
      setPosts(data.posts);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setError(null);
    } catch (err) {
      setError('게시글을 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, debouncedAuthor, categoryFilter, currentPage, itemsPerPage]);

  // 검색어나 필터가 변경되면 1페이지로 이동
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, debouncedAuthor, categoryFilter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAuthorFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthorFilter(e.target.value);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setAuthorFilter('');
    setCategoryFilter('');
  };

  const getCategoryLabel = (value: string) => {
    const category = categories.find(cat => cat.value === value);
    return category ? `${category.emoji} ${category.label}` : value;
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await postService.deletePost(id);
        fetchPosts();
      } catch (err) {
        alert('삭제에 실패했습니다.');
        console.error(err);
      }
    }
  };

  const formatDate = (date: Date | string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diff = now.getTime() - postDate.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}일 전`;
    if (hours > 0) return `${hours}시간 전`;
    if (minutes > 0) return `${minutes}분 전`;
    return '방금 전';
  };

  if (loading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Category Filter - 탭 스타일 */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategoryFilter(cat.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                categoryFilter === cat.value
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              <span className="mr-1">{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="제목 또는 내용 검색..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Author Filter */}
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <input
                type="text"
                placeholder="작성자 필터..."
                value={authorFilter}
                onChange={handleAuthorFilterChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || authorFilter || categoryFilter) && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="font-medium">필터 초기화</span>
            </button>
          )}
        </div>

        {/* Active Filters Display */}
        {(searchTerm || authorFilter) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                검색: "{searchTerm}"
              </span>
            )}
            {authorFilter && (
              <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                작성자: "{authorFilter}"
              </span>
            )}
          </div>
        )}
      </div>

      {/* Create Post Button */}
      {user && (
        <button
          onClick={onCreateNew}
          className="w-full mb-6 p-4 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
        >
          <div className="flex items-center justify-center space-x-2 text-gray-500 group-hover:text-blue-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-medium">무슨 생각을 하고 계신가요?</span>
          </div>
        </button>
      )}

      {/* 게시글 수 표시 */}
      {total > 0 && (
        <div className="mb-4 text-sm text-gray-600">
          총 <span className="font-semibold text-blue-600">{total}</span>개의 게시글
          {totalPages > 1 && (
            <span className="ml-2">
              (페이지 {currentPage}/{totalPages})
            </span>
          )}
        </div>
      )}

      {/* Posts Feed */}
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="mt-4 text-gray-500 text-lg">
            {searchTerm || authorFilter ? '검색 결과가 없습니다' : '아직 게시글이 없습니다'}
          </p>
          <p className="mt-2 text-gray-400">
            {searchTerm || authorFilter ? '다른 검색어나 필터를 시도해보세요' : '첫 번째 글을 작성해보세요!'}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
              >
                {/* Post Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {post.author.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{post.author}</p>
                      <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
                    </div>
                  </div>

                  {user && user.username === post.author && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(post._id);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Post Content */}
                <div
                  onClick={() => onSelectPost(post)}
                  className="px-4 pb-4 cursor-pointer"
                >
                  {/* Category Badge */}
                  <div className="mb-2">
                    <span className="inline-flex items-center px-2.5 py-1 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
                      {getCategoryLabel(post.category)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-700 line-clamp-3">
                    {post.content}
                  </p>
                </div>

                {/* Post Footer */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => onSelectPost(post)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-sm font-medium">자세히 보기</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center space-x-2">
              {/* 이전 페이지 버튼 */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* 페이지 번호 */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* 다음 페이지 버튼 */}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PostList;
