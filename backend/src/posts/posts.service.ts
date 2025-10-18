import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

/**
 * 게시판 서비스
 * 게시글 CRUD 비즈니스 로직 처리
 */
@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<Post>,
  ) {}

  /**
   * 새 게시글 생성
   * @param createPostDto 게시글 생성 데이터
   * @returns 생성된 게시글
   */
  async create(createPostDto: CreatePostDto): Promise<Post> {
    const post = new this.postModel(createPostDto);
    return await post.save();
  }

  /**
   * 모든 게시글 조회 (최신순)
   * @returns 게시글 목록
   */
  async findAll(): Promise<Post[]> {
    return await this.postModel.find().sort({ createdAt: -1 }).exec();
  }

  /**
   * ID로 특정 게시글 조회
   * @param id 게시글 ID
   * @returns 게시글 정보
   * @throws NotFoundException 게시글이 존재하지 않을 경우
   */
  async findOne(id: string): Promise<Post> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  /**
   * 게시글 수정
   * @param id 게시글 ID
   * @param updatePostDto 수정할 데이터
   * @returns 수정된 게시글
   */
  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.postModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .exec();
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  /**
   * 게시글 삭제
   * @param id 게시글 ID
   */
  async remove(id: string): Promise<void> {
    const result = await this.postModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
  }
}
