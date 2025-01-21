// src/modules/user/dto/create-permission.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

/**
 * 创建权限的DTO
 */
export class CreatePermissionDto {
  /**
   * 权限名称
   */
  @ApiProperty({ example: 'READ_PRIVILEGES', description: '权限名称' })
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * 权限点标识
   */
  @ApiProperty({ example: 'read_privileges', description: '权限点标识' })
  @IsNotEmpty()
  @IsString()
  sign: string;

  /**
   * 父ID，非必填，允许为空
   */
  @ApiProperty({ example: '0', description: '父ID' })
  @IsString()
  parentId: string;

  /**
   * 排序字段
   */
  @ApiProperty({ example: "1", description: '排序字段' })
  @IsNotEmpty()
  sort: number;
}
