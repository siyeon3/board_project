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
   */
  @Public()
  @Get()
  findAll() {
    return this.postsService.findAll();
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
