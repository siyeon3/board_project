import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

/**
 * 사용자 서비스
 * 사용자 관리 비즈니스 로직
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  /**
   * 새 사용자 생성 (회원가입)
   * @param createUserDto 사용자 생성 데이터
   * @returns 생성된 사용자
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // 이메일 중복 확인
    const existingUserByEmail = await this.userModel
      .findOne({ email: createUserDto.email })
      .exec();
    if (existingUserByEmail) {
      throw new ConflictException('이미 사용 중인 이메일입니다.');
    }

    // 사용자명 중복 확인
    const existingUserByUsername = await this.userModel
      .findOne({ username: createUserDto.username })
      .exec();
    if (existingUserByUsername) {
      throw new ConflictException('이미 사용 중인 사용자 이름입니다.');
    }

    // 비밀번호 해시화 (bcrypt, salt rounds: 10)
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // 사용자 생성
    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return await user.save();
  }

  /**
   * 이메일로 사용자 조회
   * @param email 이메일
   * @returns 사용자 정보
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  /**
   * ID로 사용자 조회
   * @param id 사용자 ID
   * @returns 사용자 정보
   */
  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return user;
  }

  /**
   * 비밀번호 검증
   * @param plainTextPassword 평문 비밀번호
   * @param hashedPassword 해시화된 비밀번호
   * @returns 일치 여부
   */
  async validatePassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }

  /**
   * 마지막 로그인 시간 업데이트
   * @param userId 사용자 ID
   */
  async updateLastLogin(userId: string): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, { lastLoginAt: new Date() })
      .exec();
  }

  /**
   * 비밀번호 변경
   * @param userId 사용자 ID
   * @param updatePasswordDto 비밀번호 변경 데이터
   */
  async updatePassword(
    userId: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<void> {
    const user = await this.findById(userId);

    if (!user.password) {
      throw new UnauthorizedException('비밀번호 정보가 없습니다.');
    }

    // 현재 비밀번호 확인
    const isPasswordValid = await this.validatePassword(
      updatePasswordDto.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('현재 비밀번호가 일치하지 않습니다.');
    }

    // 새 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(updatePasswordDto.newPassword, 10);

    // 비밀번호 업데이트
    await this.userModel
      .findByIdAndUpdate(userId, { password: hashedPassword })
      .exec();
  }
}
