// src/modules/user/dto/update-role.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

/**
 * 更新角色的DTO
 */
export class UpdateRoleDto {
  /**
   * 角色ID
   */
  @ApiProperty({ example: "role1", description: "角色ID" })
  @IsString()
  @IsOptional()
  id: string;

  /**
   * 角色名称
   */
  @ApiProperty({ example: "管理员", description: "角色名称" })
  @IsString()
  @IsOptional()
  name: string;

  /**
   * 角色描述
   */
  @ApiProperty({ example: "管理员", description: "角色描述" })
  @IsString()
  @IsOptional()
  remark: string;

  /**
   * 角色对应的权限数组，类型是权限id的字符串数组，设置一个默认值
   */
  @ApiProperty({ example: ["11"], description: "权限ID数组" })
  @IsNotEmpty()
  @IsOptional()
  permissions: string[] = [];
}
