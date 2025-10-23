const axios = require('axios');

const API_URL = 'http://localhost:3000';

// 다양한 게시글 제목과 내용 템플릿
const titles = [
  'TypeScript 개발 팁',
  'React 최신 기능',
  'NestJS 시작하기',
  'MongoDB 활용법',
  'Redis 캐싱 전략',
  'JWT 인증 구현',
  '프론트엔드 최적화',
  'Git 협업 가이드',
  'REST API 설계',
  'Docker 입문',
];

const contents = [
  '이번에 프로젝트를 진행하면서 배운 내용을 공유합니다. 많은 도움이 되었으면 좋겠습니다!',
  '개발하면서 겪었던 문제와 해결 방법을 정리해봤습니다. 같은 문제를 겪으시는 분들께 도움이 되길 바랍니다.',
  '최근에 공부한 내용을 정리해서 올립니다. 피드백 환영합니다!',
  '실무에서 자주 사용하는 패턴과 기법들을 소개합니다.',
];

// 테스트 계정 정보
const testUsers = [
  { email: 'admin@test.com', username: 'admin', password: 'admin123' },
  { email: 'developer@test.com', username: 'developer', password: 'dev123' },
  { email: 'coder@test.com', username: 'coder', password: 'code123' },
];

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generatePost(index, username) {
  const title = `${getRandomItem(titles)} #${index + 1}`;
  const content = `${getRandomItem(contents)}\n\n이 글은 ${index + 1}번째 게시글입니다.`;
  return { title, content, author: username };
}

async function registerOrLoginUser(user) {
  try {
    // 먼저 회원가입 시도
    await axios.post(`${API_URL}/auth/register`, user);
    console.log(`✅ 사용자 ${user.username} 회원가입 성공`);
  } catch (error) {
    // 이미 존재하는 사용자면 무시
    if (error.response?.status === 400 || error.response?.status === 409) {
      console.log(`ℹ️  사용자 ${user.username} 이미 존재함`);
    } else {
      console.log(`⚠️  사용자 ${user.username} 회원가입 실패:`, error.response?.data?.message || error.message);
    }
  }

  // 로그인하여 토큰 받기
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: user.email,
      password: user.password,
    });
    return response.data.accessToken;
  } catch (error) {
    throw new Error(`로그인 실패: ${error.response?.data?.message || error.message}`);
  }
}

async function seedPosts() {
  console.log('🌱 테스트 게시글 40개 생성 시작...\n');

  // 테스트 사용자들 준비
  console.log('👥 테스트 사용자 준비 중...\n');
  const tokens = [];
  for (const user of testUsers) {
    try {
      const token = await registerOrLoginUser(user);
      tokens.push({ username: user.username, token });
    } catch (error) {
      console.error(`❌ 사용자 ${user.username} 준비 실패:`, error.message);
      process.exit(1);
    }
  }
  console.log('\n✅ 모든 사용자 준비 완료!\n');

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < 40; i++) {
    try {
      const randomUser = getRandomItem(tokens);
      const post = generatePost(i, randomUser.username);

      await axios.post(`${API_URL}/posts`, post, {
        headers: {
          Authorization: `Bearer ${randomUser.token}`,
        },
      });
      successCount++;

      if ((i + 1) % 10 === 0) {
        console.log(`✅ ${i + 1}개 게시글 생성 완료...`);
      }
    } catch (error) {
      failCount++;
      console.log(`❌ 게시글 ${i + 1} 생성 실패:`, error.response?.data?.message || error.message);
    }

    // API 부하 방지를 위한 짧은 딜레이
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n✨ 완료!\n');
  console.log(`📊 결과 요약:`);
  console.log(`   성공: ${successCount}개`);
  console.log(`   실패: ${failCount}개`);
  console.log(`   총: 40개`);
  console.log('\n🎉 게시판을 확인해보세요!\n');
}

seedPosts().catch(error => {
  console.error('❌ 오류 발생:', error.message);
  process.exit(1);
});
