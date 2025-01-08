// src/modules/user/dto/create-role.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsNotEmpty } from "class-validator";
import { not } from "rxjs/internal/util/not";

/**
 * 创建角色的DTO
 */
export class CreateRoleDto {
  /**
   * 角色名称
   */
  @ApiProperty({ example: 'Admin', description: '角色名称' })
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * 用户ID数组
   */
  @ApiProperty({ example: ['user1', 'user2'], description: '用户ID数组' })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  userIds: string[];

  /**
   * 权限ID数组
   */
  @ApiProperty({ example: ['permission1', 'permission2'], description: '权限ID数组' })
  @IsArray()
  @IsString({ each: true })
  permissionIds: string[];
}
