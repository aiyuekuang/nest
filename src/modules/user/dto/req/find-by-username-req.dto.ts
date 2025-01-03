// src/modules/user/dto/req/find-by-username-req.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class FindByUsernameReqDto {
  @ApiProperty({ required: false, description: '用户名', example: 'admin' })
  username: string;
}
