// src/modules/user/dto/req/find-user-req.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class FindUserReqDto {
  @ApiProperty({ required: true, description: '用户id', example: '1' })
  id: string;
}
