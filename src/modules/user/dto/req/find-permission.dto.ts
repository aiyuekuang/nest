// src/modules/user/dto/update-role.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * 更新角色的DTO
 */
export class FindPermissionDto {
  /**
   * 角色ID
   */
  @ApiProperty({ example: 'role1', description: '角色ID' })
  @IsString()
  id!: string;
}
