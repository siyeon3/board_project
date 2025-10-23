# 게시판 프로젝트

React와 NestJS를 사용한 풀스택 게시판 애플리케이션입니다.

## 기술 스택

### 백엔드

- **NestJS**: Node.js 프레임워크
- **MongoDB**: NoSQL 데이터베이스 (Mongoose)
- **Redis**: 캐싱 및 세션 관리
- **JWT**: 인증 시스템 (Access/Refresh Token)
- **OpenAI**: ChatGPT API 연동
- **TypeScript**: 프로그래밍 언어

### 프론트엔드

- **React 19**: UI 라이브러리
- **TypeScript**: 프로그래밍 언어
- **Tailwind CSS**: 스타일링 프레임워크
- **Framer Motion**: 애니메이션 라이브러리
- **Swiper**: 이미지 슬라이더
- **Axios**: HTTP 클라이언트

## 프로젝트 구조

```
board_project/
├── backend/                # NestJS 백엔드
│   ├── src/
│   │   ├── posts/         # 게시판 모듈
│   │   │   ├── dto/       # Data Transfer Objects
│   │   │   ├── entities/  # TypeORM 엔티티
│   │   │   ├── posts.controller.ts
│   │   │   ├── posts.service.ts
│   │   │   └── posts.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── database.sqlite    # SQLite 데이터베이스 파일
│
└── frontend/              # React 프론트엔드
    ├── src/
    │   ├── components/    # React 컴포넌트
    │   │   ├── PostList.tsx      # 게시글 목록
    │   │   ├── PostDetail.tsx    # 게시글 상세
    │   │   └── PostForm.tsx      # 게시글 작성/수정
    │   ├── services/      # API 서비스
    │   │   ├── api.ts
    │   │   └── postService.ts
    │   ├── types/         # TypeScript 타입 정의
    │   └── App.tsx
    └── package.json
```

## 기능

### 인증 시스템
- ✅ JWT 기반 회원가입/로그인
- ✅ Access Token + Refresh Token (Redis 저장)
- ✅ 비밀번호 암호화 (bcrypt)
- ✅ 비밀번호 변경

### 게시판
- ✅ 게시글 CRUD (작성, 조회, 수정, 삭제)
- ✅ 게시글 검색 (제목, 내용, 작성자)
- ✅ 페이지네이션 (10개씩 표시)
- ✅ 댓글 작성 및 관리

### AI 챗봇
- ✅ ChatGPT API 연동 (GPT-3.5-turbo)
- ✅ 실시간 대화
- ✅ Rate Limiting (분당 10회, 일일 100회)

### 동적 UI
- ✅ 크래프톤 스타일 랜딩 페이지
- ✅ 이미지 슬라이더 (자동 재생, 페이드 효과)
- ✅ 스크롤 기반 색상 변화
- ✅ 패럴랙스 효과
- ✅ 부드러운 애니메이션

## 설치 및 실행

### 1. 백엔드 실행

```bash
cd backend
npm install
npm run start:dev
```

백엔드 서버가 `http://localhost:3000`에서 실행됩니다.

### 2. 프론트엔드 실행

새 터미널을 열고:

```bash
cd frontend
npm install
npm start
```

프론트엔드가 `http://localhost:3001`에서 실행됩니다.

## API 엔드포인트

### 인증 API

| Method | Endpoint          | 설명              | 인증 필요 |
| ------ | ----------------- | ----------------- | --------- |
| POST   | `/auth/register`  | 회원가입          | ❌        |
| POST   | `/auth/login`     | 로그인            | ❌        |
| POST   | `/auth/logout`    | 로그아웃          | ✅        |
| POST   | `/auth/refresh`   | 토큰 갱신         | ✅        |
| GET    | `/auth/me`        | 내 정보 조회      | ✅        |
| PATCH  | `/auth/password`  | 비밀번호 변경     | ✅        |

### 게시글 API

| Method | Endpoint     | 설명                     | 인증 필요 |
| ------ | ------------ | ------------------------ | --------- |
| GET    | `/posts`     | 게시글 목록 조회 (페이지네이션, 검색) | ❌ |
| GET    | `/posts/:id` | 특정 게시글 조회         | ❌        |
| POST   | `/posts`     | 새 게시글 작성           | ✅        |
| PATCH  | `/posts/:id` | 게시글 수정              | ✅        |
| DELETE | `/posts/:id` | 게시글 삭제              | ✅        |

#### 게시글 목록 조회 Query Parameters
- `search`: 검색어 (제목, 내용 검색)
- `author`: 작성자 필터
- `page`: 페이지 번호 (기본값: 1)
- `limit`: 페이지당 게시글 수 (기본값: 10)

예시: `GET /posts?search=React&page=2&limit=10`

### 댓글 API

| Method | Endpoint                 | 설명           | 인증 필요 |
| ------ | ------------------------ | -------------- | --------- |
| POST   | `/comments/:postId`      | 댓글 작성      | ✅        |
| GET    | `/comments/post/:postId` | 댓글 목록 조회 | ❌        |
| PATCH  | `/comments/:id`          | 댓글 수정      | ✅        |
| DELETE | `/comments/:id`          | 댓글 삭제      | ✅        |

### 챗봇 API

| Method | Endpoint       | 설명         | 인증 필요 |
| ------ | -------------- | ------------ | --------- |
| POST   | `/chatbot/chat` | 챗봇과 대화 | ✅        |

### 요청/응답 예시

#### 게시글 작성 (POST /posts)

```json
{
  "title": "제목",
  "content": "내용",
  "author": "작성자"
}
```

#### 응답

```json
{
  "id": 1,
  "title": "제목",
  "content": "내용",
  "author": "작성자",
  "createdAt": "2024-10-18T00:00:00.000Z",
  "updatedAt": "2024-10-18T00:00:00.000Z"
}
```

## 데이터베이스 스키마

### User (사용자) - MongoDB

| 필드         | 타입     | 설명                    |
| ------------ | -------- | ----------------------- |
| \_id         | ObjectId | MongoDB 자동 생성 ID    |
| email        | String   | 이메일 (unique)         |
| username     | String   | 사용자명 (unique)       |
| password     | String   | 해시된 비밀번호 (bcrypt)|
| createdAt    | Date     | 가입일                  |
| lastLoginAt  | Date     | 마지막 로그인 시간      |

### Post (게시글) - MongoDB

| 필드      | 타입     | 설명                 |
| --------- | -------- | -------------------- |
| \_id      | ObjectId | MongoDB 자동 생성 ID |
| title     | String   | 게시글 제목          |
| content   | String   | 게시글 내용          |
| author    | String   | 작성자 (사용자명)    |
| createdAt | Date     | 작성일               |
| updatedAt | Date     | 수정일               |

### Comment (댓글) - MongoDB

| 필드      | 타입     | 설명                 |
| --------- | -------- | -------------------- |
| \_id      | ObjectId | MongoDB 자동 생성 ID |
| postId    | ObjectId | 게시글 ID (참조)     |
| content   | String   | 댓글 내용            |
| author    | String   | 작성자 (사용자명)    |
| createdAt | Date     | 작성일               |
| updatedAt | Date     | 수정일               |

### Redis 키 구조

```
refresh_token:{userId}           # Refresh Token 저장 (7일 TTL)
blacklist:{token}                # 블랙리스트 토큰
rate_limit:chatbot:{userId}      # 챗봇 분당 요청 횟수
daily_limit:chatbot:{userId}     # 챗봇 일일 요청 횟수
chatbot_history:{userId}         # 챗봇 대화 히스토리 (1시간 TTL)
```

## 개발 가이드

### 백엔드 개발

- NestJS CLI를 사용하여 새 모듈 생성:

  ```bash
  npx nest generate module [모듈명]
  npx nest generate controller [컨트롤러명]
  npx nest generate service [서비스명]
  ```

- TypeORM 엔티티는 `src/posts/entities/` 디렉토리에 작성
- DTO는 `src/posts/dto/` 디렉토리에 작성

### 프론트엔드 개발

- 새 컴포넌트는 `src/components/` 디렉토리에 작성
- API 서비스는 `src/services/` 디렉토리에 작성
- 타입 정의는 `src/types/` 디렉토리에 작성

## 주요 의존성

### Backend
- `@nestjs/core`, `@nestjs/common`: NestJS 프레임워크
- `@nestjs/mongoose`: MongoDB ORM
- `@nestjs/jwt`, `@nestjs/passport`: JWT 인증
- `ioredis`: Redis 클라이언트
- `bcrypt`: 비밀번호 해싱
- `openai`: ChatGPT API 클라이언트

### Frontend
- `react`, `react-dom`: React 라이브러리
- `react-router-dom`: 클라이언트 사이드 라우팅
- `axios`: HTTP 클라이언트
- `tailwindcss`: CSS 프레임워크
- `framer-motion`: 애니메이션 라이브러리
- `swiper`: 이미지 슬라이더
- `react-intersection-observer`: 스크롤 감지

## 환경변수 설정

백엔드 `.env` 파일 예시:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/board

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_ACCESS_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-key
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# OpenAI
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-3.5-turbo
CHATBOT_MAX_TOKENS=500
CHATBOT_RATE_LIMIT=10
CHATBOT_DAILY_LIMIT=100
```

## 개발 도구 및 스크립트

### 테스트 데이터 생성

백엔드에서 40개의 테스트 게시글 생성:

```bash
cd backend
node seed-posts.js
```

이 스크립트는 다음을 자동으로 수행합니다:
- 3명의 테스트 사용자 생성 (admin, developer, coder)
- 각 사용자로 로그인하여 JWT 토큰 획득
- 40개의 다양한 게시글 생성 (제목, 내용 랜덤)
- 페이지네이션 테스트에 유용

## 향후 개선 사항

### 기능 추가
- [ ] 게시글 좋아요/싫어요
- [ ] 이미지 업로드 (AWS S3)
- [ ] 실시간 알림 (WebSocket)
- [ ] 사용자 프로필 페이지
- [ ] 이메일 인증

### 보안 강화
- [ ] 2단계 인증 (2FA)
- [ ] HTTPS 적용
- [ ] XSS, CSRF 방어 강화

### 성능 최적화
- [ ] 게시글 목록 캐싱 (Redis)
- [ ] 이미지 CDN 적용
- [ ] 데이터베이스 인덱싱
- [ ] API 응답 압축 (gzip)

## 라이선스

MIT
