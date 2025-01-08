// src/modules/user/controller/role.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { Role } from '../entities/role.entity';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * 创建角色
   * @param role - 角色实体
   * @returns 创建的角色实体
   */
  @Post('create')
  async create(@Body() role: Role): Promise<Role> {
    return this.roleService.create(role);
  }

  /**
   * 查找所有角色
   * @returns 所有角色实体数组
   */
  @Post('findAll')
  async findAll(): Promise<Role[]> {
    return this.roleService.findAll();
  }

  /**
   * 通过ID查找角色
   * @param id - 角色ID
   * @returns 查找到的角色实体
   */
  @Post('findOne')
  async findOne(@Body('id') id: string): Promise<Role> {
    return this.roleService.findOne(id);
  }

  /**
   * 更新角色
   * @param id - 角色ID
   * @param role - 部分更新的角色实体
   */
  @Post('update')
  async update(@Body('id') id: string, @Body() role: Partial<Role>): Promise<void> {
    return this.roleService.update(id, role);
  }

  /**
   * 删除角色
   * @param id - 角色ID
   */
  @Post('remove')
  async remove(@Body('id') id: string): Promise<void> {
    return this.roleService.remove(id);
  }
}
