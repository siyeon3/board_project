import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import PostsPage from './pages/PostsPage';
import ChangePassword from './pages/ChangePassword';
import LandingPage from './pages/LandingPage';
import Chatbot from './components/Chatbot';

/**
 * 레이아웃 래퍼 컴포넌트
 * 랜딩 페이지에서는 헤더를 숨김
 */
function AppContent() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-50">
      {!isLandingPage && <Header />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isLandingPage && <Chatbot />}
    </div>
  );
}

/**
 * 메인 App 컴포넌트
 * 라우팅 및 인증 컨텍스트 관리
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
