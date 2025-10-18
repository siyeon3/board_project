import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Auth.css';

const ChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { accessToken, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 새 비밀번호 확인
    if (newPassword !== confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    // 비밀번호 길이 검증
    if (newPassword.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    setIsLoading(true);

    try {
      await axios.patch(
        'http://localhost:3000/auth/password',
        {
          currentPassword,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setSuccess('비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요.');

      // 3초 후 로그아웃 및 로그인 페이지로 이동
      setTimeout(async () => {
        await logout();
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || '비밀번호 변경에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>비밀번호 변경</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="currentPassword">현재 비밀번호</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              placeholder="현재 비밀번호를 입력하세요"
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">새 비밀번호</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="최소 6자 이상"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">새 비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="새 비밀번호를 다시 입력하세요"
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? '변경 중...' : '비밀번호 변경'}
          </button>
        </form>

        <div className="auth-footer">
          <button onClick={() => navigate('/')} className="back-btn">
            돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
