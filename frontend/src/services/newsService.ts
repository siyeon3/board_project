import axiosInstance from './axiosConfig';

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: string;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

/**
 * 뉴스 API 서비스
 * 백엔드를 통해 뉴스 데이터 가져오기
 */
const newsService = {
  /**
   * 최신 뉴스 가져오기
   * @param country 국가 코드 (kr, us 등)
   * @param category 카테고리 (technology, business 등)
   * @param pageSize 가져올 뉴스 개수
   */
  async getTopHeadlines(
    country: string = 'kr',
    category?: string,
    pageSize: number = 4,
  ): Promise<NewsResponse> {
    const params = new URLSearchParams();
    params.append('country', country);
    if (category) params.append('category', category);
    params.append('pageSize', pageSize.toString());

    const queryString = params.toString();
    const url = `/news/top-headlines?${queryString}`;

    const response = await axiosInstance.get<NewsResponse>(url);
    return response.data;
  },
};

export default newsService;
