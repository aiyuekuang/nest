// src/modules/user/services/permission.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { User } from "../entities/user.entity";
import { CreatePermissionDto } from "../dto/req/create-permission.dto";
import { UpdatePermissionDto } from "../dto/req/update-permission.dto";
import { buildTree } from "../../../utils/common";

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async create(permission: CreatePermissionDto): Promise<Permission> {
    return this.permissionRepository.save(permission);
  }

  async findAll(): Promise<Permission[]> {
    // 获取所有权限
    let permissions = await this.permissionRepository.find({});
    console.log(permissions);
    if(permissions.length !== 0){
      console.log('buildTree(permissions)', buildTree(permissions));

      return buildTree(permissions);
    }else {
      return []
    }
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
