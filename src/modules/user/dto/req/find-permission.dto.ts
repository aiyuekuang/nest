// src/modules/user/dto/update-role.dto.ts
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from "class-validator";
import { Permission } from "../../entities/permission.entity";

/**
 * 更新角色的DTO
 */
export class FindPermissionDto {
  /**
   * 角色ID
   */
  @ApiProperty({ example: 'role1', description: '角色ID' })
  @IsString()
  id: string;

}
