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
   * 모든 게시글 조회 (최신순, 페이지네이션)
   * @param search 검색어 (제목 또는 내용에서 검색)
   * @param author 작성자 필터
   * @param category 카테고리 필터
   * @param page 페이지 번호 (기본값: 1)
   * @param limit 페이지당 게시글 수 (기본값: 10)
   * @returns 게시글 목록과 페이지 정보
   */
  async findAll(
    search?: string,
    author?: string,
    category?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ posts: Post[]; total: number; page: number; totalPages: number }> {
    const query: any = {};

    // 검색어가 있으면 제목 또는 내용에서 검색 (대소문자 구분 없음)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    // 작성자 필터가 있으면 추가
    if (author) {
      query.author = { $regex: author, $options: 'i' };
    }

    // 카테고리 필터가 있으면 추가
    if (category) {
      query.category = category;
    }

    // 전체 게시글 수 조회
    const total = await this.postModel.countDocuments(query).exec();

    // 페이지네이션 적용
    const skip = (page - 1) * limit;
    const posts = await this.postModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
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
