// src/modules/auth/dto/reset-password.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class OldPasswordDto {
  // 6位验证码
  @ApiProperty({ example: '123456' })
  @IsNotEmpty({ message: '旧密码不能为空' })
  oldPassword!: string;

  @ApiProperty({ example: 'newPassword123' })
  @IsNotEmpty({ message: '新密码不能为空' })
  newPassword!: string;
}
