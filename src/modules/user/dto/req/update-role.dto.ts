// src/modules/user/dto/update-role.dto.ts
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import { IsString } from "class-validator";

/**
 * 更新角色的DTO
 */
export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  /**
   * 角色ID
   */
  @ApiProperty({ example: 'role1', description: '角色ID' })
  @IsString()
  id: string;
}
