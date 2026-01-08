// src/modules/user/services/permission.service.ts
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { CreatePermissionDto } from '../dto/req/create-permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  /**
   * 创建权限
   * @param permission - 权限创建 DTO
   * @returns 创建的权限实体
   */
  async create(permission: CreatePermissionDto): Promise<Permission> {
    let entity = new Permission();

    if (permission.parentId) {
      const parent = await this.permissionRepository.findOne({
        where: { id: permission.parentId },
      });
      if (parent) {
        entity.parent = parent;
      }
    }

    entity.name = permission.name;
    entity.sign = permission.sign;
    entity.sort = permission.sort;

    return this.dataSource.manager.save(entity);
  }

  /**
   * 查找所有权限（树形结构）
   * @returns 权限树
   */
  async findAll(): Promise<Permission[]> {
    // 获取所有权限（树形结构）
    const trees = await this.dataSource.manager
      .getTreeRepository(Permission)
      .findTrees();

    // 递归排序树节点
    const sortTree = (nodes: Permission[]): Permission[] => {
      return nodes
        .sort((a, b) => a.sort - b.sort)
        .map((node) => {
          if (node.children && node.children.length > 0) {
            node.children = sortTree(node.children);
          }
          return node;
        });
    };

    return sortTree(trees);
  }

  /**
   * 通过ID查找权限
   * @param id - 权限ID
   * @returns 权限实体或null
   */
  async findOne(id: string): Promise<Permission | null> {
    return this.permissionRepository.findOne({ where: { id } });
  }

  /**
   * 更新权限
   * @param id - 权限ID
   * @param permission - 权限更新 DTO
   */
  async update(id: string, permission: CreatePermissionDto): Promise<void> {
    // 先查找现有的权限实体
    const entity = await this.permissionRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('权限不存在');
    }

    // 更新基本字段
    entity.name = permission.name;
    entity.sign = permission.sign;
    entity.sort = permission.sort;

    // 处理父级关系
    if (permission.parentId) {
      const parent = await this.permissionRepository.findOne({
        where: { id: permission.parentId },
      });
      if (parent) {
        entity.parent = parent;
      }
    } else {
      // 如果 parentId 为 null，清除父级关系
      entity.parent = null as any;
    }

    // 使用 save 方法保存，这样会正确处理树形关系
    await this.dataSource.manager.save(Permission, entity);
  }

  async remove(id: string): Promise<void> {
    await this.permissionRepository.delete(id);
  }
}
