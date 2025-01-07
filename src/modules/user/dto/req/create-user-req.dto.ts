// src/modules/user/dto/req/create-user-req.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserReqDto {
  @ApiProperty({ required: true, example: 'username' })
  username: string;

  @ApiProperty({ required: true, example: 'password' })
  password: string;

  @ApiProperty({ required: false, example: '1111@qq.com' })
  email: string;
}
