import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

/**
 * 게시판 컨트롤러
 * /posts 엔드포인트에 대한 HTTP 요청 처리
 * 기본적으로 JWT 인증 필요 (조회는 Public)
 */
@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * 새 게시글 작성 (인증 필요)
   * POST /posts
   */
  @Post()
  create(
    @Body(ValidationPipe) createPostDto: CreatePostDto,
    @CurrentUser() user: any,
  ) {
    return this.postsService.create(createPostDto);
  }

  /**
   * 모든 게시글 조회 (인증 불필요)
   * GET /posts
   * Query params: search (검색어), author (작성자 필터), category (카테고리 필터), page (페이지), limit (페이지당 개수)
   */
  @Public()
  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('author') author?: string,
    @Query('category') category?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.postsService.findAll(search, author, category, pageNum, limitNum);
  }

  /**
   * 특정 게시글 조회 (인증 불필요)
   * GET /posts/:id
   */
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  /**
   * 게시글 수정 (인증 필요)
   * PATCH /posts/:id
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updatePostDto: UpdatePostDto,
    @CurrentUser() user: any,
  ) {
    return this.postsService.update(id, updatePostDto);
  }

  /**
   * 게시글 삭제 (인증 필요)
   * DELETE /posts/:id
   */
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.postsService.remove(id);
  }
}
