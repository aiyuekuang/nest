// src/modules/auth/dto/login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: 'zt1' })
  @IsNotEmpty({ message: '账号不能为空' })
  username: string;

  @ApiProperty({ example: 'U2FsdGVkX1/Ml9c438kJQDaIjdngJJa0lnmZRUv4yAE=' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}
