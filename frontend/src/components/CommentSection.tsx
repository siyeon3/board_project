import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Comment,
  getCommentsByPostId,
  createComment,
  updateComment,
  deleteComment,
} from '../services/commentService';

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(false);

  // 댓글 목록 불러오기
  const fetchComments = async () => {
    try {
      const data = await getCommentsByPostId(postId);
      setComments(data);
    } catch (error) {
      console.error('댓글 로딩 실패:', error);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  // 댓글 작성
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setLoading(true);
    try {
      await createComment(postId, newComment);
      setNewComment('');
      fetchComments();
    } catch (error: any) {
      alert(error.response?.data?.message || '댓글 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 댓글 수정
  const handleEdit = async (commentId: string) => {
    if (!editContent.trim()) return;

    setLoading(true);
    try {
      await updateComment(commentId, editContent);
      setEditingId(null);
      setEditContent('');
      fetchComments();
    } catch (error: any) {
      alert(error.response?.data?.message || '댓글 수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 댓글 삭제
  const handleDelete = async (commentId: string) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

    setLoading(true);
    try {
      await deleteComment(commentId);
      fetchComments();
    } catch (error: any) {
      alert(error.response?.data?.message || '댓글 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 수정 모드 시작
  const startEdit = (comment: Comment) => {
    setEditingId(comment._id);
    setEditContent(comment.content);
  };

  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-xl font-semibold mb-4">댓글 ({comments.length})</h3>

      {/* 댓글 작성 폼 */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 작성하세요..."
            maxLength={500}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">{newComment.length}/500</span>
            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? '작성 중...' : '댓글 작성'}
            </button>
          </div>
        </form>
      ) : (
        <p className="text-gray-500 mb-6">댓글을 작성하려면 로그인하세요.</p>
      )}

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">첫 번째 댓글을 작성해보세요!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="bg-gray-50 rounded-lg p-4">
              {editingId === comment._id ? (
                // 수정 모드
                <div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    maxLength={500}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end space-x-2 mt-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 text-gray-600 hover:text-gray-800"
                    >
                      취소
                    </button>
                    <button
                      onClick={() => handleEdit(comment._id)}
                      disabled={loading || !editContent.trim()}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded disabled:bg-gray-300"
                    >
                      수정 완료
                    </button>
                  </div>
                </div>
              ) : (
                // 일반 모드
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-semibold text-gray-700">{comment.author}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        {new Date(comment.createdAt).toLocaleString('ko-KR')}
                      </span>
                    </div>
                    {user?.username === comment.author && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEdit(comment)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(comment._id)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-800 whitespace-pre-wrap">{comment.content}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
