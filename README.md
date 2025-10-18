# 게시판 프로젝트

React와 NestJS를 사용한 풀스택 게시판 애플리케이션입니다.

## 기술 스택

### 백엔드

- **NestJS**: Node.js 프레임워크
- **TypeORM**: ORM (Object-Relational Mapping)
- **SQLite**: 데이터베이스 (개발용)
- **TypeScript**: 프로그래밍 언어

### 프론트엔드

- **React**: UI 라이브러리
- **TypeScript**: 프로그래밍 언어
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

- ✅ 게시글 목록 조회
- ✅ 게시글 상세보기
- ✅ 게시글 작성
- ✅ 게시글 수정
- ✅ 게시글 삭제

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

### 게시글 API

| Method | Endpoint     | 설명             |
| ------ | ------------ | ---------------- |
| GET    | `/posts`     | 모든 게시글 조회 |
| GET    | `/posts/:id` | 특정 게시글 조회 |
| POST   | `/posts`     | 새 게시글 작성   |
| PATCH  | `/posts/:id` | 게시글 수정      |
| DELETE | `/posts/:id` | 게시글 삭제      |

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

### posts 테이블

| 컬럼      | 타입     | 설명               |
| --------- | -------- | ------------------ |
| id        | INTEGER  | 기본키 (자동 증가) |
| title     | VARCHAR  | 게시글 제목        |
| content   | TEXT     | 게시글 내용        |
| author    | VARCHAR  | 작성자             |
| createdAt | DATETIME | 생성일시           |
| updatedAt | DATETIME | 수정일시           |

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

## 주의사항

- 현재 SQLite를 사용하고 있어 개발용으로만 적합합니다.
- 프로덕션 환경에서는 PostgreSQL 또는 MySQL로 변경해야 합니다.
- `synchronize: true` 옵션은 개발 환경에서만 사용하세요.

## 향후 개발 계획

- [ ] 로그인,토큰,캐시,사용자 인증
- [ ] 댓글 기능
- [ ] 파일 업로드
- [ ] 페이지네이션
- [ ] 검색 기능
- [ ] PostgreSQL/MySQL 마이그레이션

## 라이선스

MIT
