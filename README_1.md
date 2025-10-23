# 게시판 프로젝트 (Board Project)

## 📋 목차
- [프로젝트 소개](#프로젝트-소개)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [주요 기능](#주요-기능)
- [설치 및 실행 방법](#설치-및-실행-방법)
- [API 엔드포인트](#api-엔드포인트)
- [데이터베이스 스키마](#데이터베이스-스키마)
- [보안 및 인증](#보안-및-인증)

---

## 🎯 프로젝트 소개

이 프로젝트는 **풀스택 웹 게시판 애플리케이션**입니다. 사용자는 회원가입/로그인 후 게시글을 작성하고, 댓글을 달고, AI 챗봇과 대화할 수 있습니다.

### 핵심 특징
- JWT 기반 인증 시스템 (Access/Refresh Token)
- 실시간 챗봇 (ChatGPT 연동)
- Redis를 활용한 토큰 관리 및 Rate Limiting
- MongoDB를 활용한 NoSQL 데이터베이스
- Tailwind CSS를 활용한 SNS 스타일 UI
- 카테고리별 게시글 분류 시스템
- 실시간 뉴스 사이드바 (NewsAPI 연동)
- 크래프톤 스타일 인터랙티브 랜딩페이지

---

## 🛠 기술 스택

### Backend (NestJS)
- **Framework**: NestJS 11.x
- **언어**: TypeScript
- **데이터베이스**: MongoDB (Mongoose)
- **캐시/세션**: Redis (ioredis)
- **인증**: JWT (Passport, bcrypt)
- **AI**: OpenAI API (GPT-3.5-turbo)
- **뉴스**: NewsAPI.org

### Frontend (React)
- **Framework**: React 19.x
- **언어**: TypeScript
- **라우팅**: React Router DOM 7.x
- **스타일링**: Tailwind CSS
- **애니메이션**: Framer Motion
- **HTTP 클라이언트**: Axios

---

## 📁 프로젝트 구조

```
board_project/
│
├── backend/                    # NestJS 백엔드
│   ├── src/
│   │   ├── app.module.ts      # 루트 모듈 (전체 모듈 통합)
│   │   ├── main.ts            # 애플리케이션 진입점 (포트 3000)
│   │   │
│   │   ├── auth/              # 🔐 인증 모듈
│   │   │   ├── auth.controller.ts     # 회원가입, 로그인, 로그아웃, 토큰 갱신
│   │   │   ├── auth.service.ts        # JWT 발급, 검증 로직
│   │   │   ├── guards/                # JWT 가드 (인증 미들웨어)
│   │   │   ├── strategies/            # Passport JWT 전략
│   │   │   └── decorators/            # 커스텀 데코레이터 (@Public, @CurrentUser)
│   │   │
│   │   ├── users/             # 👤 사용자 모듈
│   │   │   ├── users.service.ts       # 사용자 CRUD, 비밀번호 변경
│   │   │   ├── entities/user.entity.ts # User 스키마 (email, username, password)
│   │   │   └── dto/                   # 데이터 전송 객체
│   │   │
│   │   ├── posts/             # 📝 게시글 모듈
│   │   │   ├── posts.controller.ts    # 게시글 CRUD API
│   │   │   ├── posts.service.ts       # 게시글 비즈니스 로직
│   │   │   ├── entities/post.entity.ts # Post 스키마 (title, content, author)
│   │   │   └── dto/                   # 게시글 DTO (생성, 수정)
│   │   │
│   │   ├── comments/          # 💬 댓글 모듈
│   │   │   ├── comments.controller.ts # 댓글 CRUD API
│   │   │   ├── comments.service.ts    # 댓글 비즈니스 로직
│   │   │   ├── entities/comment.entity.ts # Comment 스키마
│   │   │   └── dto/                   # 댓글 DTO
│   │   │
│   │   ├── chatbot/           # 🤖 챗봇 모듈
│   │   │   ├── chatbot.controller.ts  # 챗봇 대화 API
│   │   │   ├── chatbot.service.ts     # OpenAI API 연동
│   │   │   ├── guards/                # Rate Limiting 가드
│   │   │   └── dto/chat.dto.ts        # 챗봇 요청/응답 DTO
│   │   │
│   │   ├── news/              # 📰 뉴스 모듈
│   │   │   ├── news.controller.ts     # 뉴스 API
│   │   │   └── news.service.ts        # NewsAPI 연동
│   │   │
│   │   └── redis/             # 🔴 Redis 모듈
│   │       ├── redis.service.ts       # Redis 클라이언트 (토큰 저장, Rate Limit)
│   │       └── redis.module.ts        # Redis 모듈 설정
│   │
│   ├── .env.example           # 환경변수 템플릿
│   └── package.json           # 백엔드 의존성
│
└── frontend/                   # React 프론트엔드
    ├── src/
    │   ├── App.tsx            # 메인 앱 컴포넌트 (라우팅)
    │   ├── index.tsx          # React 진입점
    │   │
    │   ├── pages/             # 📄 페이지 컴포넌트
    │   │   ├── LandingPage.tsx       # 랜딩 페이지 (크래프톤 스타일)
    │   │   ├── PostsPage.tsx         # 게시글 목록 페이지 (3단 레이아웃)
    │   │   ├── Login.tsx             # 로그인 페이지
    │   │   ├── Register.tsx          # 회원가입 페이지
    │   │   └── ChangePassword.tsx    # 비밀번호 변경 페이지
    │   │
    │   ├── components/        # 🧩 재사용 컴포넌트
    │   │   ├── Header.tsx            # 헤더 (네비게이션, 로그아웃)
    │   │   ├── PostList.tsx          # 게시글 목록
    │   │   ├── PostDetail.tsx        # 게시글 상세
    │   │   ├── PostForm.tsx          # 게시글 작성/수정 폼
    │   │   ├── CommentSection.tsx    # 댓글 섹션
    │   │   ├── Chatbot.tsx           # 챗봇 UI (우측 하단)
    │   │   ├── NewsSidebar.tsx       # 뉴스 사이드바
    │   │   ├── ScrollSection.tsx     # 스크롤 섹션 (랜딩페이지)
    │   │   ├── ImageSlider.tsx       # 이미지 슬라이더 (랜딩페이지)
    │   │   ├── AnimatedSection.tsx   # 애니메이션 섹션 (랜딩페이지)
    │   │   └── ParallaxText.tsx      # 패럴랙스 텍스트 (랜딩페이지)
    │   │
    │   ├── contexts/          # 🌐 Context API
    │   │   └── AuthContext.tsx       # 인증 상태 관리 (로그인 여부, 사용자 정보)
    │   │
    │   └── services/          # 🌍 API 호출 서비스
    │       ├── postService.ts        # 게시글 API 호출
    │       ├── commentService.ts     # 댓글 API 호출
    │       ├── chatbotService.ts     # 챗봇 API 호출
    │       └── newsService.ts        # 뉴스 API 호출
    │
    ├── tailwind.config.js     # Tailwind CSS 설정
    └── package.json           # 프론트엔드 의존성
```

---

## 🌟 주요 기능

### 1. 인증 시스템 (Authentication)

#### JWT 기반 이중 토큰 인증
- **Access Token**: 15분 유효, API 요청 시 사용
- **Refresh Token**: 7일 유효, Access Token 갱신 시 사용
- **Redis 저장**: Refresh Token은 Redis에 저장하여 서버 재시작 시에도 유지
- **블랙리스트**: 로그아웃 시 토큰을 Redis 블랙리스트에 추가하여 무효화

#### 주요 API
- `POST /auth/register` - 회원가입 (이메일, 사용자명, 비밀번호)
- `POST /auth/login` - 로그인 (Access Token + Refresh Token 발급)
- `POST /auth/logout` - 로그아웃 (토큰 무효화)
- `POST /auth/refresh` - Access Token 갱신
- `GET /auth/me` - 현재 로그인한 사용자 정보 조회
- `PATCH /auth/password` - 비밀번호 변경

#### 보안 기능
- **bcrypt**: 비밀번호 해싱 (salt rounds 10)
- **JWT Guard**: 모든 보호된 API는 JWT 인증 필요
- **@Public 데코레이터**: 특정 API를 인증 없이 접근 가능하도록 설정

---

### 2. 게시판 기능 (Posts)

#### 게시글 CRUD
- **생성**: 인증된 사용자만 가능
- **조회**: 모든 사용자 가능 (인증 불필요)
  - 전체 목록 조회
  - **페이지네이션**: 10개씩 분할하여 조회
  - 검색 기능 (제목, 내용 검색)
  - 작성자 필터링
  - **카테고리 필터링**: 8가지 카테고리별 게시글 필터링
- **수정/삭제**: 인증된 사용자만 가능

#### 카테고리 시스템
게시글은 다음 8가지 카테고리로 분류됩니다:
- 💬 **일반** (general): 일반적인 주제
- 💻 **개발** (development): 개발 관련 주제
- 🎨 **디자인** (design): 디자인 관련 주제
- 📢 **마케팅** (marketing): 마케팅 관련 주제
- 💼 **비즈니스** (business): 비즈니스 관련 주제
- 🌟 **라이프스타일** (lifestyle): 라이프스타일 관련 주제
- 🔧 **기술** (tech): 기술 관련 주제
- 📌 **기타** (other): 기타 주제

#### 주요 API
- `POST /posts` - 게시글 작성 (인증 필요)
- `GET /posts` - 게시글 목록 조회 (공개)
  - Query: `?search=검색어` (제목/내용 검색)
  - Query: `?author=작성자` (작성자 필터)
  - Query: `?category=카테고리` (카테고리 필터)
  - Query: `?page=페이지번호` (기본값: 1)
  - Query: `?limit=개수` (기본값: 10)
  - 예시: `GET /posts?category=development&search=React&page=2&limit=10`
- `GET /posts/:id` - 게시글 상세 조회 (공개)
- `PATCH /posts/:id` - 게시글 수정 (인증 필요)
- `DELETE /posts/:id` - 게시글 삭제 (인증 필요)

#### 페이지네이션 응답 구조
```typescript
{
  posts: Post[],        // 현재 페이지의 게시글 배열
  total: number,        // 전체 게시글 수
  page: number,         // 현재 페이지 번호
  totalPages: number    // 전체 페이지 수
}
```

#### 게시글 데이터 구조
```typescript
{
  title: string,        // 제목
  content: string,      // 내용
  author: string,       // 작성자 (사용자명)
  category: string,     // 카테고리 (general, development, design, etc.)
  createdAt: Date,      // 작성일
  updatedAt: Date       // 수정일
}
```

#### 페이지네이션 작동 방식
1. **백엔드 (NestJS)**:
   - MongoDB의 `skip()`과 `limit()` 사용
   - `skip = (page - 1) * limit`으로 시작 위치 계산
   - `countDocuments()`로 전체 게시글 수 조회
   - `totalPages = Math.ceil(total / limit)`으로 전체 페이지 계산

2. **프론트엔드 (React)**:
   - 페이지 버튼 클릭 시 해당 페이지 데이터 로드
   - 최대 5개의 페이지 번호 표시
   - 이전/다음 버튼으로 페이지 이동
   - 검색/필터 변경 시 자동으로 1페이지로 리셋

3. **성능 이점**:
   - 초기 로딩 속도 향상 (10개만 로드)
   - 네트워크 트래픽 감소
   - 사용자 경험 개선 (빠른 응답)

---

### 3. 댓글 기능 (Comments)

#### 댓글 CRUD
- **생성**: 인증된 사용자만 가능
- **조회**: 모든 사용자 가능 (게시글별 댓글 목록)
- **수정/삭제**: 본인이 작성한 댓글만 가능

#### 주요 API
- `POST /comments/:postId` - 댓글 작성 (인증 필요)
- `GET /comments/post/:postId` - 특정 게시글의 댓글 목록 조회 (공개)
- `PATCH /comments/:id` - 댓글 수정 (본인만 가능)
- `DELETE /comments/:id` - 댓글 삭제 (본인만 가능)

#### 댓글 데이터 구조
```typescript
{
  postId: string,       // 게시글 ID (참조)
  content: string,      // 댓글 내용
  author: string,       // 작성자 (사용자명)
  createdAt: Date,      // 작성일
  updatedAt: Date       // 수정일
}
```

---

### 4. AI 챗봇 기능 (Chatbot)

#### OpenAI ChatGPT 연동
- **모델**: GPT-3.5-turbo
- **최대 토큰**: 500 (응답 길이 제한)
- **컨텍스트 유지**: 사용자별 대화 히스토리 저장 (Redis, 1시간 유효)

#### Rate Limiting (속도 제한)
- **분당 제한**: 10회 (1분에 10번까지 요청 가능)
- **일일 제한**: 100회 (하루 100번까지 요청 가능)
- **Redis 기반**: 사용자별로 카운트 관리

#### 주요 API
- `POST /chatbot/chat` - 챗봇과 대화 (인증 필요)
  - Request: `{ message: "안녕하세요" }`
  - Response: `{ response: "안녕하세요! 무엇을 도와드릴까요?" }`
- `POST /chatbot/suggest-title` - 게시글 제목 제안 (선택적 기능)

#### 챗봇 UI
- **위치**: 우측 하단 고정 버튼
- **토글 가능**: 클릭 시 채팅창 열림/닫힘
- **실시간 대화**: 메시지 전송 즉시 AI 응답

---

### 5. 뉴스 사이드바 (News Sidebar)

#### NewsAPI.org 연동
- **API**: NewsAPI.org (무료 100 요청/일)
- **카테고리**: 기술(Technology), 비즈니스(Business) 등
- **업데이트**: 실시간 최신 뉴스

#### 주요 기능
- **3단 레이아웃**: 왼쪽 사이드바(기술 뉴스) + 메인(게시판) + 오른쪽 사이드바(비즈니스 뉴스)
- **각 사이드바에 2개의 뉴스 표시**
- **이미지, 제목, 설명, 출처, 시간 표시**
- **외부 링크**: 클릭 시 원본 뉴스 사이트로 이동
- **반응형**: 데스크톱에서만 표시 (lg 이상)
- **Sticky**: 스크롤 시 상단에 고정

#### 주요 API
- `GET /news/top-headlines` - 최신 뉴스 가져오기 (인증 불필요)
  - Query: `?country=kr` (국가 코드)
  - Query: `?category=technology` (카테고리)
  - Query: `?pageSize=2` (가져올 뉴스 개수)

#### 더미 데이터 지원
- API 키가 없어도 더미 뉴스로 작동
- 개발 환경에서 즉시 테스트 가능

---

### 6. 랜딩 페이지 (Landing Page)

#### 크래프톤 스타일 인터랙티브 디자인
- **Framer Motion**: 부드러운 애니메이션
- **스크롤 기반 섹션 전환**: 색상 변화, 페이드 인/아웃
- **패럴랙스 효과**: 입체감 있는 스크롤 경험

#### 주요 섹션
1. **이미지 슬라이더**: 자동 재생, 페이드 효과
2. **소개**: 프로젝트 개요 및 CTA 버튼
3. **주요 기능**: 보안 인증, AI 챗봇, 실시간 댓글
4. **기술 스택**: Backend/Frontend 기술 소개
5. **시스템 아키텍처**:
   - Frontend Layer (React, Tailwind, TypeScript)
   - Backend Layer (NestJS, JWT, OpenAI, NewsAPI)
   - Data Layer (MongoDB, Redis)
   - 애니메이션된 화살표로 데이터 흐름 표현
6. **CTA**: 게시판/회원가입 유도

---

### 7. Redis 캐싱 및 세션 관리

#### Redis 사용 목적
1. **Refresh Token 저장**: 사용자별 Refresh Token 저장 (7일 TTL)
2. **토큰 블랙리스트**: 로그아웃된 토큰 무효화
3. **Rate Limiting**: 챗봇 API 호출 횟수 제한
4. **챗봇 대화 히스토리**: 사용자별 대화 내용 저장 (1시간 TTL)

#### Redis 키 구조
```
refresh_token:{userId}           # Refresh Token 저장
blacklist:{token}                # 블랙리스트 토큰
rate_limit:chatbot:{userId}      # 챗봇 분당 요청 횟수
daily_limit:chatbot:{userId}     # 챗봇 일일 요청 횟수
chatbot_history:{userId}         # 챗봇 대화 히스토리
```

---

## 🚀 설치 및 실행 방법

### 사전 요구사항
- **Node.js**: 16.x 이상
- **MongoDB**: 5.x 이상 (로컬 또는 MongoDB Atlas)
- **Redis**: 6.x 이상 (로컬 또는 Redis Cloud)
- **OpenAI API Key**: ChatGPT 기능 사용 시 필요

### 1. 프로젝트 클론
```bash
git clone <repository-url>
cd board_project
```

### 2. MongoDB 실행
```bash
# macOS (Homebrew)
brew services start mongodb-community

# 또는 직접 실행
mongod --dbpath=/path/to/data
```

### 3. Redis 실행
```bash
# macOS (Homebrew)
brew services start redis

# 또는 직접 실행
redis-server
```

### 4. 백엔드 설정 및 실행
```bash
cd backend

# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env
# .env 파일 수정 (아래 참고)

# 개발 서버 실행 (포트 3000)
npm run start:dev
```

#### .env 설정 예시
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/board

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_ACCESS_SECRET=your-super-secret-access-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Server
PORT=3000
NODE_ENV=development

# OpenAI
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-3.5-turbo
CHATBOT_MAX_TOKENS=500
CHATBOT_RATE_LIMIT=10
CHATBOT_DAILY_LIMIT=100

# News API (https://newsapi.org에서 무료 API 키 발급)
NEWS_API_KEY=your-news-api-key-here
```

**참고**: OpenAI와 News API 키가 없어도 더미 데이터로 작동합니다.

### 5. 프론트엔드 설정 및 실행
```bash
cd ../frontend

# 의존성 설치
npm install

# 개발 서버 실행 (포트 3001)
npm start
```

### 6. 접속
- **프론트엔드**: http://localhost:3001
- **백엔드 API**: http://localhost:3000

---

## 📡 API 엔드포인트

### 인증 API (`/auth`)
| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| POST | `/auth/register` | 회원가입 | ❌ |
| POST | `/auth/login` | 로그인 | ❌ |
| POST | `/auth/logout` | 로그아웃 | ✅ |
| POST | `/auth/refresh` | Token 갱신 | ✅ (Refresh) |
| GET | `/auth/me` | 내 정보 조회 | ✅ |
| PATCH | `/auth/password` | 비밀번호 변경 | ✅ |

### 게시글 API (`/posts`)
| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| POST | `/posts` | 게시글 작성 | ✅ |
| GET | `/posts` | 게시글 목록 | ❌ |
| GET | `/posts/:id` | 게시글 상세 | ❌ |
| PATCH | `/posts/:id` | 게시글 수정 | ✅ |
| DELETE | `/posts/:id` | 게시글 삭제 | ✅ |

### 댓글 API (`/comments`)
| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| POST | `/comments/:postId` | 댓글 작성 | ✅ |
| GET | `/comments/post/:postId` | 댓글 목록 | ❌ |
| PATCH | `/comments/:id` | 댓글 수정 | ✅ |
| DELETE | `/comments/:id` | 댓글 삭제 | ✅ |

### 챗봇 API (`/chatbot`)
| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| POST | `/chatbot/chat` | 챗봇 대화 | ✅ |
| POST | `/chatbot/suggest-title` | 제목 제안 | ✅ |

### 뉴스 API (`/news`)
| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| GET | `/news/top-headlines` | 최신 뉴스 조회 | ❌ |

**Query Parameters**:
- `country`: 국가 코드 (예: kr, us)
- `category`: 카테고리 (예: technology, business)
- `pageSize`: 가져올 뉴스 개수 (기본값: 4)

---

## 🗄 데이터베이스 스키마

### User (사용자)
```typescript
{
  _id: ObjectId,            // MongoDB 자동 생성 ID
  email: string,            // 이메일 (unique, 필수)
  username: string,         // 사용자명 (unique, 필수)
  password: string,         // 해시된 비밀번호
  createdAt: Date,          // 가입일
  lastLoginAt: Date         // 마지막 로그인 시간
}
```

### Post (게시글)
```typescript
{
  _id: ObjectId,            // MongoDB 자동 생성 ID
  title: string,            // 제목 (필수)
  content: string,          // 내용 (필수)
  author: string,           // 작성자 (사용자명)
  category: string,         // 카테고리 (필수, 기본값: general)
  createdAt: Date,          // 작성일
  updatedAt: Date           // 수정일
}
```

### Comment (댓글)
```typescript
{
  _id: ObjectId,            // MongoDB 자동 생성 ID
  postId: ObjectId,         // 게시글 ID (참조)
  content: string,          // 댓글 내용 (필수)
  author: string,           // 작성자 (사용자명)
  createdAt: Date,          // 작성일
  updatedAt: Date           // 수정일
}
```

---

## 🔒 보안 및 인증

### 1. 비밀번호 보안
- **bcrypt 해싱**: 모든 비밀번호는 bcrypt로 해싱하여 저장
- **Salt Rounds**: 10 (보안 수준 중상)

### 2. JWT 인증
- **Access Token**:
  - 유효기간 15분
  - 모든 API 요청에 필요
  - Header: `Authorization: Bearer <token>`
- **Refresh Token**:
  - 유효기간 7일
  - Access Token 갱신 시에만 사용
  - Redis에 저장하여 서버 재시작 시에도 유지

### 3. 토큰 무효화
- **로그아웃 시**: 토큰을 Redis 블랙리스트에 추가
- **토큰 검증**: 모든 요청마다 블랙리스트 확인

### 4. CORS 설정
- **허용 Origin**: `http://localhost:3001` (프론트엔드)
- **Credentials**: 허용 (쿠키 전송 가능)

### 5. Rate Limiting
- **챗봇 API**: 분당 10회, 일일 100회 제한
- **Redis 기반**: 사용자별 카운트 관리

---

## 🎨 UI/UX 특징

### Tailwind CSS 기반 SNS 스타일
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- **다크/라이트 컬러**: 깔끔한 그레이 톤
- **모던 UI**:
  - 그림자 효과 (shadow)
  - 부드러운 전환 (transition)
  - 호버 효과 (hover)

### 주요 페이지
1. **PostsPage**: 게시글 목록 + 작성 폼 + 상세보기
2. **Login/Register**: 인증 폼 (이메일, 사용자명, 비밀번호)
3. **ChangePassword**: 비밀번호 변경 (현재 비밀번호 확인)

### 컴포넌트 구조
- **Header**: 로고, 로그인/로그아웃 버튼, 네비게이션
- **PostList**: 게시글 카드 리스트 (카테고리 필터 포함)
- **PostDetail**: 게시글 상세 + 댓글 섹션
- **Chatbot**: 우측 하단 고정 챗봇 버튼
- **NewsSidebar**: 좌우 뉴스 사이드바 (Tech & Business News)
- **LandingPage**: 크래프톤 스타일 인터랙티브 랜딩페이지

---

## 📦 주요 의존성

### Backend
- `@nestjs/core` `@nestjs/common`: NestJS 프레임워크
- `@nestjs/mongoose`: MongoDB ORM
- `@nestjs/jwt` `@nestjs/passport`: JWT 인증
- `@nestjs/config`: 환경 변수 관리
- `ioredis`: Redis 클라이언트
- `bcrypt`: 비밀번호 해싱
- `openai`: ChatGPT API 클라이언트
- `axios`: HTTP 클라이언트 (NewsAPI 연동)
- `class-validator` `class-transformer`: DTO 검증

### Frontend
- `react` `react-dom`: React 라이브러리
- `react-router-dom`: 클라이언트 사이드 라우팅
- `axios`: HTTP 클라이언트
- `tailwindcss`: CSS 프레임워크
- `framer-motion`: 애니메이션 라이브러리

---

## 🛠 개발 도구 및 스크립트

### 테스트 데이터 생성 (seed-posts.js)

40개의 테스트 게시글을 자동으로 생성하는 스크립트입니다.

#### 실행 방법
```bash
cd backend
node seed-posts.js
```

#### 스크립트 기능
1. **테스트 사용자 생성/로그인**:
   - admin@test.com (admin / admin123)
   - developer@test.com (developer / dev123)
   - coder@test.com (coder / code123)

2. **JWT 토큰 획득**:
   - 각 사용자로 로그인하여 Access Token 받기
   - 인증이 필요한 게시글 작성 API를 위함

3. **40개 게시글 자동 생성**:
   - 다양한 제목 템플릿 (TypeScript, React, NestJS 등)
   - 랜덤 내용 및 작성자
   - 100ms 간격으로 생성 (API 부하 방지)

4. **결과 출력**:
   - 성공/실패 개수 표시
   - 10개씩 진행 상황 출력

#### 스크립트 특징
- **인증 처리**: JWT 기반 인증을 자동으로 처리
- **에러 처리**: 이미 존재하는 사용자는 무시하고 진행
- **성능 최적화**: API 부하를 줄이기 위한 딜레이 적용
- **페이지네이션 테스트**: 생성된 데이터로 페이지네이션 기능 테스트 가능

---

## 🚧 향후 개선 사항

### 기능 추가
- [ ] 게시글 좋아요/싫어요 기능
- [ ] 게시글 이미지 업로드 (AWS S3)
- [ ] 실시간 알림 (WebSocket)
- [x] 게시글 페이지네이션 ✅ (완료)
- [x] 게시글 카테고리 시스템 ✅ (완료)
- [ ] 사용자 프로필 페이지
- [ ] 게시글 정렬 옵션 (최신순, 인기순)

### 보안 강화
- [ ] 이메일 인증 (회원가입 시)
- [ ] 2단계 인증 (2FA)
- [ ] HTTPS 적용 (프로덕션)
- [ ] XSS, CSRF 방어 강화

### 성능 최적화
- [x] 게시글 페이지네이션 ✅ (완료 - 초기 로딩 속도 향상)
- [ ] 게시글 목록 캐싱 (Redis)
- [ ] 이미지 CDN 적용
- [ ] 데이터베이스 인덱싱 (author, createdAt 필드)
- [ ] API 응답 압축 (gzip)

---

## 📄 라이선스
이 프로젝트는 교육 목적으로 작성되었습니다.

---

## 👨‍💻 개발자 정보
- **프로젝트 시작일**: 2025년
- **주요 기술**: NestJS, React, MongoDB, Redis, OpenAI

---

## 📞 문의 및 지원
프로젝트에 대한 질문이나 버그 리포트는 GitHub Issues를 활용해주세요.
