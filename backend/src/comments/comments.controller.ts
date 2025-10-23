import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

/**
 * 댓글 컨트롤러
 * 댓글 관련 HTTP 요청 처리
 */
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /**
   * 댓글 생성 (인증 필요)
   * POST /comments/:postId
   */
  @Post(':postId')
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req: any,
  ) {
    const author = req.user.username;
    return this.commentsService.create(postId, createCommentDto, author);
  }

  /**
   * 특정 게시글의 댓글 목록 조회 (공개)
   * GET /comments/post/:postId
   */
  @Get('post/:postId')
  @Public()
  async findByPostId(@Param('postId') postId: string) {
    return this.commentsService.findByPostId(postId);
  }

  /**
   * 댓글 수정 (인증 필요, 본인만)
   * PATCH /comments/:id
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req: any,
  ) {
    const author = req.user.username;
    return this.commentsService.update(id, updateCommentDto, author);
  }

  /**
   * 댓글 삭제 (인증 필요, 본인만)
   * DELETE /comments/:id
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Request() req: any) {
    const author = req.user.username;
    await this.commentsService.remove(id, author);
    return { message: '댓글이 삭제되었습니다.' };
  }
}
