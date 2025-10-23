import { Controller, Get, Query } from '@nestjs/common';
import { NewsService } from './news.service';
import { Public } from '../auth/decorators/public.decorator';

/**
 * 뉴스 컨트롤러
 * /news 엔드포인트에 대한 HTTP 요청 처리
 */
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  /**
   * 최신 뉴스 가져오기 (인증 불필요)
   * GET /news/top-headlines
   */
  @Public()
  @Get('top-headlines')
  async getTopHeadlines(
    @Query('country') country?: string,
    @Query('category') category?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const size = pageSize ? parseInt(pageSize, 10) : 4;
    return this.newsService.getTopHeadlines(country, category, size);
  }
}
