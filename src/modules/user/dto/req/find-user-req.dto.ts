// src/modules/user/dto/req/find-user-req.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class FindUserReqDto {
  @ApiProperty({ required: false, description: '用户id', example: '1' })
  id: string;

  @ApiProperty({ required: false, description: '用户id数组', example: ['1', '2'] })
  idList: string[];
}
