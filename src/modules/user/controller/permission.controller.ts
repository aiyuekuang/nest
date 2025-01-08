// src/modules/user/controller/permission.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { PermissionService } from '../services/permission.service';
import { Permission } from '../entities/permission.entity';
import { CreatePermissionDto } from "../dto/req/create-permission.dto";
import { UpdatePermissionDto } from "../dto/req/update-permission.dto";

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  /**
   * 创建权限
   * @param permission - 权限实体
   * @returns 创建的权限实体
   */
  @Post('create')
  async create(@Body() permission: CreatePermissionDto): Promise<Permission> {
    return this.permissionService.create(permission);
  }

  /**
   * 查找所有权限
   * @returns 所有权限实体数组
   */
  @Post('findAll')
  async findAll(): Promise<Permission[]> {
    return this.permissionService.findAll();
  }

  /**
   * 通过ID查找权限
   * @param id - 权限ID
   * @returns 查找到的权限实体
   */
  @Post('findOne')
  async findOne(@Body('id') id: string): Promise<Permission> {
    return this.permissionService.findOne(id);
  }

  /**
   * 更新权限
   * @param id - 权限ID
   * @param permission - 部分更新的权限实体
   */
  @Post('update')
  async update(@Body('id') id: string, @Body() permission: Partial<UpdatePermissionDto>): Promise<void> {
    return this.permissionService.update(id, permission);
  }

  /**
   * 删除权限
   * @param id - 权限ID
   */
  @Post('remove')
  async remove(@Body('id') id: string): Promise<void> {
    return this.permissionService.remove(id);
  }
}
