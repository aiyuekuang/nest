// src/modules/auth/dto/reset-password.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'password123' })
  oldPassword: string;

  @ApiProperty({ example: 'newPassword123' })
  newPassword: string;
}
