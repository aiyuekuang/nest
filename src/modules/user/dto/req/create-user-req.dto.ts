// src/modules/user/dto/req/create-user-req.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserReqDto {
  @ApiProperty({ required: false, example: "张三" })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({ required: true, example: "username" })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ required: false, example: "password" })
  @IsString()
  @IsOptional()
  password?: string = "123456";

  @ApiProperty({ required: false, example: "1111@qq.com" })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false, example: "13888888888" })
  @IsString()
  @IsOptional()
  tel?: string;

  @ApiProperty({ required: false, example: "1" })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ required: false, example: "1" })
  @IsArray()
  @IsOptional()
  rolesId?: string[];

  @ApiProperty({ required: false, example: "张三" })
  @IsString()
  nickname: string;

}
