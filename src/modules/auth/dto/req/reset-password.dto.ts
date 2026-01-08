// src/modules/auth/dto/reset-password.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  // 6位验证码
  @ApiProperty({ example: '123456' })
  @IsNotEmpty({ message: '验证码不能为空' })
  verificationCode!: string;

  @ApiProperty({ example: 'newPassword123' })
  @IsNotEmpty({ message: '新密码不能为空' })
  newPassword!: string;
}
