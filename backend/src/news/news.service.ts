import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

/**
 * 뉴스 서비스
 * NewsAPI.org를 사용하여 최신 뉴스 가져오기
 */
@Injectable()
export class NewsService {
  private readonly newsApiKey: string;
  private readonly newsApiUrl = 'https://newsapi.org/v2/top-headlines';

  constructor(private configService: ConfigService) {
    this.newsApiKey = this.configService.get<string>('NEWS_API_KEY') || '';
  }

  /**
   * 상위 뉴스 가져오기
   * @param country 국가 코드 (kr, us 등)
   * @param category 카테고리 (technology, business 등)
   * @param pageSize 가져올 뉴스 개수
   */
  async getTopHeadlines(
    country: string = 'kr',
    category?: string,
    pageSize: number = 4,
  ) {
    try {
      // API 키가 없거나 'undefined' 문자열인 경우 더미 데이터 반환
      if (!this.newsApiKey || this.newsApiKey === 'undefined') {
        return this.getDummyNews(pageSize);
      }

      const params: any = {
        country,
        pageSize,
        apiKey: this.newsApiKey,
      };

      if (category) {
        params.category = category;
      }

      const response = await axios.get(this.newsApiUrl, { params });

      return {
        status: 'ok',
        totalResults: response.data.totalResults,
        articles: response.data.articles.map((article: any) => ({
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.urlToImage,
          publishedAt: article.publishedAt,
          source: article.source.name,
        })),
      };
    } catch (error) {
      console.error('News API Error:', error.message);
      // 에러 발생 시 더미 데이터 반환
      return this.getDummyNews(pageSize);
    }
  }

  /**
   * 더미 뉴스 데이터 (API 키가 없을 때)
   */
  private getDummyNews(pageSize: number) {
    const dummyArticles = [
      {
        title: '최신 기술 트렌드: AI와 머신러닝의 발전',
        description: '인공지능과 머신러닝 기술이 다양한 산업에 혁신을 가져오고 있습니다.',
        url: '#',
        urlToImage: 'https://via.placeholder.com/400x200?text=AI+News',
        publishedAt: new Date().toISOString(),
        source: 'Tech News',
      },
      {
        title: '클라우드 컴퓨팅 시장 급성장',
        description: '글로벌 클라우드 컴퓨팅 시장이 연평균 20% 이상 성장하고 있습니다.',
        url: '#',
        urlToImage: 'https://via.placeholder.com/400x200?text=Cloud+News',
        publishedAt: new Date().toISOString(),
        source: 'Business Today',
      },
      {
        title: '웹 개발의 새로운 패러다임',
        description: 'React, Vue, Angular 등 프론트엔드 프레임워크의 발전이 계속되고 있습니다.',
        url: '#',
        urlToImage: 'https://via.placeholder.com/400x200?text=Web+Dev',
        publishedAt: new Date().toISOString(),
        source: 'Dev Weekly',
      },
      {
        title: '사이버 보안의 중요성 증대',
        description: '디지털 전환이 가속화되면서 사이버 보안의 중요성이 더욱 커지고 있습니다.',
        url: '#',
        urlToImage: 'https://via.placeholder.com/400x200?text=Security',
        publishedAt: new Date().toISOString(),
        source: 'Security Daily',
      },
    ];

    return {
      status: 'ok',
      totalResults: dummyArticles.length,
      articles: dummyArticles.slice(0, pageSize),
    };
  }
}
