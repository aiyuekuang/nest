// src/modules/user/dto/req/find-by-username-req.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { ZtBaseReqDto } from "../../../../utils/baseReq.dto";

export class FindByUsernameReqDto extends ZtBaseReqDto {
  @ApiProperty({ required: false, description: '用户名', example: 'admin' })
  username: string;

  @ApiProperty({ required: false, description: '状态', example: '1' })
  status: string;
}
