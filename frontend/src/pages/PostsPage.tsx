import { useState } from 'react';
import { Post } from '../types/post';
import PostList from '../components/PostList';
import PostDetail from '../components/PostDetail';
import PostForm from '../components/PostForm';
import NewsSidebar from '../components/NewsSidebar';

/**
 * 게시판 페이지 컴포넌트
 * 게시글 목록, 상세보기, 작성/수정 화면 관리
 */
type ViewMode = 'list' | 'detail' | 'create' | 'edit';

function PostsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // 게시글 선택
  const handleSelectPost = (post: Post) => {
    setSelectedPost(post);
    setViewMode('detail');
  };

  // 새 글 작성 화면으로 전환
  const handleCreateNew = () => {
    setSelectedPost(null);
    setViewMode('create');
  };

  // 수정 화면으로 전환
  const handleEdit = () => {
    setViewMode('edit');
  };

  // 목록으로 돌아가기
  const handleBackToList = () => {
    setSelectedPost(null);
    setViewMode('list');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1800px] mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Left Sidebar - Tech News */}
          <NewsSidebar position="left" category="technology" title="🔧 Tech News" />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {viewMode === 'list' && (
              <PostList onSelectPost={handleSelectPost} onCreateNew={handleCreateNew} />
            )}

            {viewMode === 'detail' && selectedPost && (
              <PostDetail post={selectedPost} onBack={handleBackToList} onEdit={handleEdit} />
            )}

            {viewMode === 'create' && <PostForm onSuccess={handleBackToList} onCancel={handleBackToList} />}

            {viewMode === 'edit' && selectedPost && (
              <PostForm post={selectedPost} onSuccess={handleBackToList} onCancel={handleBackToList} />
            )}
          </div>

          {/* Right Sidebar - Business News */}
          <NewsSidebar position="right" category="business" title="💼 Business News" />
        </div>
      </div>
    </div>
  );
}

export default PostsPage;
