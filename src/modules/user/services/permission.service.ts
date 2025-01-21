// src/modules/user/services/permission.service.ts
import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Permission } from "../entities/permission.entity";
import { CreatePermissionDto } from "../dto/req/create-permission.dto";
import { UpdatePermissionDto } from "../dto/req/update-permission.dto";

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectDataSource() private dataSource: DataSource
  ) {
  }

  async create(permission: CreatePermissionDto): Promise<Permission> {
    let parent = await this.permissionRepository.findOne({ where: { id: permission.parentId } });

    let entity = new Permission();
    entity.name = permission.name;
    entity.sign = permission.sign;
    entity.parent = parent;
    entity.sort = permission.sort;

    return this.dataSource.manager.save(entity);
    // return this.permissionRepository.save(permission);
  }

  // sort字段排序
  async findAll(): Promise<Permission[]> {
    // 获取所有权限
    return this.dataSource.manager.getTreeRepository(Permission).findTrees();
  }

  async findOne(id: string): Promise<Permission> {
    return this.permissionRepository.findOne({ where: { id } });
  }

  async update(id: string, permission: Partial<UpdatePermissionDto>): Promise<void> {
    await this.permissionRepository.update(id, permission);
  }

  async remove(id: string): Promise<void> {
    await this.permissionRepository.delete(id);
  }
}
