# Redis Token 관리 가이드

## 🔍 토큰 확인 방법

### 1. Redis CLI로 확인
```bash
# Redis 컨테이너 접속
docker exec -it redis redis-cli

# 저장된 모든 키 확인
KEYS *

# Refresh Token 확인 (예시)
GET refresh_token:673262c8e4f5a1b2c3d4e5f6

# Blacklist 확인
KEYS blacklist:*

# 특정 키의 TTL(남은 시간) 확인
TTL refresh_token:673262c8e4f5a1b2c3d4e5f6
```

### 2. RedisInsight (GUI 도구) 설치 및 사용

**설치:**
```bash
# macOS
brew install --cask redisinsight

# 또는 다운로드
# https://redis.com/redis-enterprise/redis-insight/
```

**연결 정보:**
- Host: `localhost`
- Port: `6379`
- Name: `Board Project`

**장점:**
- 시각적으로 모든 키 확인 가능
- TTL 실시간 모니터링
- 키/값 편집 가능
- 메모리 사용량 확인

### 3. Another Redis Desktop Manager (무료 대안)
```bash
# GitHub에서 다운로드
https://github.com/qishibo/AnotherRedisDesktopManager
```

## 📝 토큰 구조

### Access Token
- **저장 위치**: 브라우저 LocalStorage
- **유효기간**: 15분
- **용도**: API 요청 인증
- **자동 갱신**: 만료 시 Refresh Token으로 재발급

### Refresh Token
- **저장 위치**:
  - 브라우저 LocalStorage (클라이언트)
  - Redis (서버)
- **유효기간**: 7일
- **용도**: Access Token 갱신
- **Redis Key**: `refresh_token:{userId}`

### Token Blacklist
- **저장 위치**: Redis
- **용도**: 로그아웃된 토큰 관리
- **Redis Key**: `blacklist:{accessToken}`
- **TTL**: 15분 (Access Token 만료시간과 동일)

## 🔧 토큰 관리 코드 위치

### Frontend
- **토큰 저장/관리**: `frontend/src/contexts/AuthContext.tsx`
- **자동 갱신**: `frontend/src/services/axiosConfig.ts`

### Backend
- **Redis 서비스**: `backend/src/redis/redis.service.ts`
- **Auth 서비스**: `backend/src/auth/auth.service.ts`
- **JWT 전략**: `backend/src/auth/strategies/`

## 🛠️ 토큰 테스트 명령어

```bash
# 1. 회원가입
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}'

# 2. 로그인 (토큰 받기)
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 3. 인증이 필요한 API 호출
curl -X POST http://localhost:3001/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"title":"테스트 게시글","content":"내용","author":"testuser"}'

# 4. 토큰 갱신
curl -X POST http://localhost:3001/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}'

# 5. 로그아웃
curl -X POST http://localhost:3001/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🔐 보안 고려사항

1. **Access Token**: 짧은 유효기간 (15분)
2. **Refresh Token**: Redis에 저장하여 서버에서 검증
3. **Blacklist**: 로그아웃 시 토큰 무효화
4. **HTTPS**: 프로덕션에서는 반드시 HTTPS 사용
5. **HttpOnly Cookie**: 더 강력한 보안을 위해 고려 가능

## 📊 모니터링

### Redis 메모리 사용량 확인
```bash
docker exec -it redis redis-cli INFO memory
```

### 저장된 키 개수 확인
```bash
docker exec -it redis redis-cli DBSIZE
```

### 특정 패턴 키 검색
```bash
# Refresh Token만 검색
docker exec -it redis redis-cli KEYS "refresh_token:*"

# Blacklist만 검색
docker exec -it redis redis-cli KEYS "blacklist:*"
```
