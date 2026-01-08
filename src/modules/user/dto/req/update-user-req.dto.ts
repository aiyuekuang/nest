// src/modules/user/dto/req/update-user-req.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserReqDto {
  @ApiProperty({ required: true })
  id!: string;

  @ApiProperty({ required: false })
  username?: string;

  @ApiProperty({ required: false })
  password?: string;

  @ApiProperty({ required: false })
  email?: string;
}
