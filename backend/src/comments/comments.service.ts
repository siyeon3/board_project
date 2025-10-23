import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

/**
 * 댓글 서비스
 * 댓글 CRUD 비즈니스 로직 처리
 */
@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<Comment>,
  ) {}

  /**
   * 새 댓글 생성
   * @param postId 게시글 ID
   * @param createCommentDto 댓글 생성 데이터
   * @param author 작성자 닉네임(username)
   * @returns 생성된 댓글
   */
  async create(
    postId: string,
    createCommentDto: CreateCommentDto,
    author: string,
  ): Promise<Comment> {
    const comment = new this.commentModel({
      postId,
      content: createCommentDto.content,
      author,
    });
    return await comment.save();
  }

  /**
   * 특정 게시글의 모든 댓글 조회
   * @param postId 게시글 ID
   * @returns 댓글 목록 (최신순)
   */
  async findByPostId(postId: string): Promise<Comment[]> {
    return await this.commentModel
      .find({ postId })
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * ID로 특정 댓글 조회
   * @param id 댓글 ID
   * @returns 댓글 정보
   */
  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentModel.findById(id).exec();
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return comment;
  }

  /**
   * 댓글 수정 (본인만 가능)
   * @param id 댓글 ID
   * @param updateCommentDto 수정할 데이터
   * @param author 요청한 사용자 닉네임(username)
   * @returns 수정된 댓글
   */
  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
    author: string,
  ): Promise<Comment> {
    const comment = await this.findOne(id);

    // 작성자 본인 확인
    if (comment.author !== author) {
      throw new ForbiddenException('본인이 작성한 댓글만 수정할 수 있습니다.');
    }

    const updated = await this.commentModel
      .findByIdAndUpdate(id, updateCommentDto, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return updated;
  }

  /**
   * 댓글 삭제 (본인만 가능)
   * @param id 댓글 ID
   * @param author 요청한 사용자 닉네임(username)
   */
  async remove(id: string, author: string): Promise<void> {
    const comment = await this.findOne(id);

    // 작성자 본인 확인
    if (comment.author !== author) {
      throw new ForbiddenException('본인이 작성한 댓글만 삭제할 수 있습니다.');
    }

    await this.commentModel.findByIdAndDelete(id).exec();
  }

  /**
   * 게시글 삭제 시 해당 게시글의 모든 댓글 삭제
   * @param postId 게시글 ID
   */
  async removeByPostId(postId: string): Promise<void> {
    await this.commentModel.deleteMany({ postId }).exec();
  }
}
