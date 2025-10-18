import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * 회원가입 DTO
 */
export class CreateUserDto {
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  @IsNotEmpty({ message: '이메일은 필수입니다.' })
  email: string;

  @IsString({ message: '사용자 이름은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '사용자 이름은 필수입니다.' })
  @MinLength(2, { message: '사용자 이름은 최소 2자 이상이어야 합니다.' })
  username: string;

  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '비밀번호는 필수입니다.' })
  @MinLength(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' })
  password: string;
}
