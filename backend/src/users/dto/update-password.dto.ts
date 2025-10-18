import { IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * 비밀번호 변경 DTO
 */
export class UpdatePasswordDto {
  @IsString({ message: '현재 비밀번호는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '현재 비밀번호는 필수입니다.' })
  currentPassword: string;

  @IsString({ message: '새 비밀번호는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '새 비밀번호는 필수입니다.' })
  @MinLength(6, { message: '새 비밀번호는 최소 6자 이상이어야 합니다.' })
  newPassword: string;
}
