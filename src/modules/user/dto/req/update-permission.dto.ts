// src/modules/user/dto/update-permission.dto.ts
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePermissionDto } from './create-permission.dto';
import { IsString } from 'class-validator';

/**
 * 更新权限的DTO
 */
export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  /**
   * 权限ID
   */
  @ApiProperty({ example: 'permission1', description: '权限ID' })
  @IsString()
  id: string;
}
