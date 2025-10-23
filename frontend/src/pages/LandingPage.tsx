import React from 'react';
import { motion } from 'framer-motion';
import ScrollSection from '../components/ScrollSection';
import ImageSlider from '../components/ImageSlider';
import ParallaxText from '../components/ParallaxText';
import AnimatedSection from '../components/AnimatedSection';
import { Link } from 'react-router-dom';

/**
 * 크래프톤 스타일 랜딩 페이지
 * - 동적 이미지 슬라이더
 * - 스크롤 기반 색상 변화
 * - 패럴랙스 효과
 * - 부드러운 애니메이션
 */
const LandingPage: React.FC = () => {
  // 슬라이더에 사용할 이미지들 (실제 사용 시 이미지 URL 변경 필요)
  const sliderImages = [
    {
      url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1920',
      title: 'Welcome to Our Platform',
      description: '혁신적인 게시판 플랫폼을 경험하세요',
    },
    {
      url: 'https://images.unsplash.com/photo-1505506874110-6a7a69069a08?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8JUVDJTlBJUIwJUVDJUEzJUJDfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=900',
      title: '공유하라',
      description: '당신의 생각을',
    },
    {
      url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1920',
      title: 'Modern Technology',
      description: 'NestJS, React, MongoDB로 구축된 풀스택 애플리케이션',
    },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* 상단 네비게이션 바 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-white text-2xl font-bold">
            Board Project
          </Link>
          <div className="flex gap-4">
            <Link to="/posts">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors"
              >
                게시판
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all"
              >
                로그인
              </motion.button>
            </Link>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
              >
                회원가입
              </motion.button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 섹션 1: 메인 슬라이더 */}
      <ImageSlider images={sliderImages} autoplay delay={5000} effect="fade" />

      {/* 섹션 2: 소개 (다크 테마) */}
      <ScrollSection backgroundColor="#000000ff" textColor="#ffffff">
        <div className="container mx-auto px-4 py-20">
          <AnimatedSection direction="up">
            <h2 className="text-6xl font-bold text-center mb-8">
              차세대 게시판 플랫폼
            </h2>
            <p className="text-xl text-center text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
              JWT 인증, AI 챗봇, 실시간 댓글 시스템을 갖춘 모던한 웹 애플리케이션입니다.
              사용자 경험을 최우선으로 설계된 직관적인 인터페이스를 제공합니다.
            </p>
            <div className="flex gap-6 justify-center">
              <Link to="/posts">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-4 bg-white text-black text-xl font-bold rounded-full hover:bg-gray-200 transition-colors shadow-2xl"
                >
                  게시판 바로가기
                </motion.button>
              </Link>
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-4 bg-blue-600 text-white text-xl font-bold rounded-full hover:bg-blue-700 transition-colors shadow-2xl"
                >
                  시작하기
                </motion.button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </ScrollSection>

      {/* 섹션 3: 주요 기능 (블루 테마) */}
      <ScrollSection backgroundColor="#0073a8" textColor="#ffffff">
        <div className="container mx-auto px-4 py-20">
          <AnimatedSection direction="left" delay={0.2}>
            <h2 className="text-5xl font-bold mb-16 text-center">주요 기능</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-12">
            <AnimatedSection direction="up" delay={0.3}>
              <div className="text-center p-8 bg-white bg-opacity-10 rounded-2xl backdrop-blur-sm">
                <div className="text-6xl mb-6">🔐</div>
                <h3 className="text-2xl font-bold mb-4">보안 인증</h3>
                <p className="text-gray-200">
                  JWT 기반 이중 토큰 인증으로 안전한 사용자 관리를 제공합니다.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="up" delay={0.5}>
              <div className="text-center p-8 bg-white bg-opacity-10 rounded-2xl backdrop-blur-sm">
                <div className="text-6xl mb-6">🤖</div>
                <h3 className="text-2xl font-bold mb-4">AI 챗봇</h3>
                <p className="text-gray-200">
                  ChatGPT 기반 스마트 챗봇이 24/7 사용자를 지원합니다.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="up" delay={0.7}>
              <div className="text-center p-8 bg-white bg-opacity-10 rounded-2xl backdrop-blur-sm">
                <div className="text-6xl mb-6">💬</div>
                <h3 className="text-2xl font-bold mb-4">실시간 댓글</h3>
                <p className="text-gray-200">
                  게시글에 실시간으로 댓글을 작성하고 소통할 수 있습니다.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </ScrollSection>

      {/* 섹션 4: 기술 스택 (그린 테마) */}
      <ScrollSection backgroundColor="#1a472a" textColor="#ffffff">
        <div className="container mx-auto px-4 py-20">
          <AnimatedSection direction="right" delay={0.2}>
            <h2 className="text-5xl font-bold mb-16 text-center">기술 스택</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto">
            <AnimatedSection direction="left" delay={0.3}>
              <div className="bg-white bg-opacity-10 p-10 rounded-2xl backdrop-blur-sm">
                <h3 className="text-3xl font-bold mb-6">Backend</h3>
                <ul className="space-y-3 text-lg">
                  <li className="flex items-center">
                    <span className="mr-3">▸</span> NestJS + TypeScript
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3">▸</span> MongoDB + Mongoose
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3">▸</span> Redis + JWT
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3">▸</span> OpenAI API
                  </li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.5}>
              <div className="bg-white bg-opacity-10 p-10 rounded-2xl backdrop-blur-sm">
                <h3 className="text-3xl font-bold mb-6">Frontend</h3>
                <ul className="space-y-3 text-lg">
                  <li className="flex items-center">
                    <span className="mr-3">▸</span> React 19 + TypeScript
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3">▸</span> Tailwind CSS
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3">▸</span> Framer Motion
                  </li>
                  <li className="flex items-center">
                    <span className="mr-3">▸</span> React Router DOM
                  </li>
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </ScrollSection>

      {/* 섹션 5: 아키텍처 (퍼플 테마) */}
      <ScrollSection backgroundColor="#2d1b4e" textColor="#ffffff">
        <div className="container mx-auto px-4 py-20">
          <AnimatedSection direction="up">
            <h2 className="text-5xl font-bold mb-16 text-center">시스템 아키텍처</h2>
          </AnimatedSection>

          <div className="max-w-6xl mx-auto">
            <AnimatedSection direction="up" delay={0.2}>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-12">
                {/* 아키텍처 다이어그램 */}
                <div className="flex flex-col gap-8">
                  {/* Frontend Layer */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 rounded-2xl"
                  >
                    <h3 className="text-2xl font-bold mb-4">Frontend Layer</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white bg-opacity-20 p-4 rounded-xl text-center">
                        <div className="text-3xl mb-2">⚛️</div>
                        <div className="font-semibold">React 19</div>
                        <div className="text-sm opacity-80">UI Framework</div>
                      </div>
                      <div className="bg-white bg-opacity-20 p-4 rounded-xl text-center">
                        <div className="text-3xl mb-2">🎨</div>
                        <div className="font-semibold">Tailwind CSS</div>
                        <div className="text-sm opacity-80">Styling</div>
                      </div>
                      <div className="bg-white bg-opacity-20 p-4 rounded-xl text-center">
                        <div className="text-3xl mb-2">📝</div>
                        <div className="font-semibold">TypeScript</div>
                        <div className="text-sm opacity-80">Type Safety</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Arrow Down */}
                  <div className="flex justify-center">
                    <motion.div
                      animate={{ y: [0, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-4xl text-purple-300"
                    >
                      ↓
                    </motion.div>
                  </div>

                  {/* Backend Layer */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-gradient-to-r from-green-600 to-emerald-500 p-6 rounded-2xl"
                  >
                    <h3 className="text-2xl font-bold mb-4">Backend Layer</h3>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="bg-white bg-opacity-20 p-4 rounded-xl text-center">
                        <div className="text-3xl mb-2">🦁</div>
                        <div className="font-semibold">NestJS</div>
                        <div className="text-sm opacity-80">API Server</div>
                      </div>
                      <div className="bg-white bg-opacity-20 p-4 rounded-xl text-center">
                        <div className="text-3xl mb-2">🔐</div>
                        <div className="font-semibold">JWT Auth</div>
                        <div className="text-sm opacity-80">Security</div>
                      </div>
                      <div className="bg-white bg-opacity-20 p-4 rounded-xl text-center">
                        <div className="text-3xl mb-2">🤖</div>
                        <div className="font-semibold">OpenAI</div>
                        <div className="text-sm opacity-80">AI Chatbot</div>
                      </div>
                      <div className="bg-white bg-opacity-20 p-4 rounded-xl text-center">
                        <div className="text-3xl mb-2">📰</div>
                        <div className="font-semibold">News API</div>
                        <div className="text-sm opacity-80">Real-time News</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Arrow Down */}
                  <div className="flex justify-center">
                    <motion.div
                      animate={{ y: [0, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
                      className="text-4xl text-purple-300"
                    >
                      ↓
                    </motion.div>
                  </div>

                  {/* Data Layer */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-gradient-to-r from-orange-600 to-red-500 p-6 rounded-2xl"
                  >
                    <h3 className="text-2xl font-bold mb-4">Data Layer</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white bg-opacity-20 p-4 rounded-xl text-center">
                        <div className="text-3xl mb-2">🍃</div>
                        <div className="font-semibold">MongoDB</div>
                        <div className="text-sm opacity-80">NoSQL Database</div>
                      </div>
                      <div className="bg-white bg-opacity-20 p-4 rounded-xl text-center">
                        <div className="text-3xl mb-2">🔴</div>
                        <div className="font-semibold">Redis</div>
                        <div className="text-sm opacity-80">Cache & Session</div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Architecture Features */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="mt-12 grid md:grid-cols-3 gap-6 text-center"
                >
                  <div className="bg-white bg-opacity-10 p-6 rounded-xl">
                    <div className="text-3xl mb-3">⚡</div>
                    <div className="font-bold text-lg mb-2">고성능</div>
                    <div className="text-sm opacity-80">Redis 캐싱으로 빠른 응답 속도</div>
                  </div>
                  <div className="bg-white bg-opacity-10 p-6 rounded-xl">
                    <div className="text-3xl mb-3">🔒</div>
                    <div className="font-bold text-lg mb-2">보안</div>
                    <div className="text-sm opacity-80">JWT 이중 토큰 인증 시스템</div>
                  </div>
                  <div className="bg-white bg-opacity-10 p-6 rounded-xl">
                    <div className="text-3xl mb-3">📈</div>
                    <div className="font-bold text-lg mb-2">확장성</div>
                    <div className="text-sm opacity-80">모듈화된 아키텍처 설계</div>
                  </div>
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </ScrollSection>

      {/* 섹션 6: CTA (다크 테마) */}
      <ScrollSection backgroundColor="#000000" textColor="#ffffff">
        <div className="container mx-auto px-4 py-20 text-center">
          <ParallaxText speed={0.2}>
            <AnimatedSection direction="up">
              <h2 className="text-6xl font-bold mb-8">지금 시작하세요</h2>
              <p className="text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
                무료로 가입하고 모든 기능을 경험해보세요
              </p>
              <div className="flex gap-6 justify-center">
                <Link to="/posts">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-12 py-4 bg-white text-black text-xl font-bold rounded-full hover:bg-gray-200 transition-colors shadow-2xl"
                  >
                    게시판 보기
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-12 py-4 bg-blue-600 text-white text-xl font-bold rounded-full hover:bg-blue-700 transition-colors shadow-2xl"
                  >
                    회원가입
                  </motion.button>
                </Link>
              </div>
            </AnimatedSection>
          </ParallaxText>
        </div>
      </ScrollSection>

      {/* 푸터 */}
      <footer className="bg-black text-gray-400 py-8 text-center">
        <p>&copy; 2025 Board Project. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
