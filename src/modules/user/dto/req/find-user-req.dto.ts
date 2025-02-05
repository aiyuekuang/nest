// src/modules/user/dto/req/find-user-req.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from "class-validator";

export class FindUserReqDto {
  @ApiProperty({ required: false, description: '用户id', example: '1' })
  @IsString()
  @IsOptional()
  id: string;

  @ApiProperty({ required: false, description: '用户id数组', example: ['1', '2'] })
  @IsArray()
  @IsOptional()
  idList: string[];
}
