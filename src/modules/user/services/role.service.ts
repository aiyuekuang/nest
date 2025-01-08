// src/modules/user/services/role.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  /**
   * 创建角色
   * @param role - 角色实体
   * @returns 创建的角色实体
   */
  async create(role: Role): Promise<Role> {
    return this.roleRepository.save(role);
  }

  /**
   * 查找所有角色
   * @returns 所有角色实体数组
   */
  async findAll(): Promise<Role[]> {
    return this.roleRepository.find({ relations: ['users', 'permissions'] });
  }

  /**
   * 通过ID查找角色
   * @param id - 角色ID
   * @returns 查找到的角色实体
   */
  async findOne(id: string): Promise<Role> {
    return this.roleRepository.findOne({ where: { id }, relations: ['users', 'permissions'] });
  }

  /**
   * 更新角色
   * @param id - 角色ID
   * @param role - 部分更新的角色实体
   */
  async update(id: string, role: Partial<Role>): Promise<void> {
    await this.roleRepository.update(id, role);
  }

  /**
   * 删除角色
   * @param id - 角色ID
   */
  async remove(id: string): Promise<void> {
    await this.roleRepository.delete(id);
  }
}
