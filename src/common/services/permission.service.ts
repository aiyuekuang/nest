import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../modules/user/entities/user.entity';
import { Role } from '../../modules/user/entities/role.entity';
import { CacheService } from './cache.service';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly cacheService: CacheService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * 获取用户的所有权限
   * @param userId 用户ID
   * @returns 权限标识符数组
   */
  async getUserPermissions(userId: string): Promise<string[]> {
    const cacheKey = `user_permissions:${userId}`;

    return await this.cacheService.getOrSet(
      cacheKey,
      async () => {
        const user = await this.userRepository.findOne({
          where: { id: userId },
          relations: ['roles'],
        });

        if (!user || !user.roles || user.roles.length === 0) {
          return [];
        }

        return await this.findPermissionsByRoles(user.roles);
      },
      { ttl: 1000 * 60 * 30 },
    ); // 缓存30分钟
  }

  /**
   * 检查用户是否有指定权限
   * @param userId 用户ID
   * @param permission 权限标识符
   * @returns 是否有权限
   */
  async hasPermission(userId: string, permission: string): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);
    return permissions.includes(permission);
  }

  /**
   * 检查用户是否有任意一个权限
   * @param userId 用户ID
   * @param permissions 权限标识符数组
   * @returns 是否有权限
   */
  async hasAnyPermission(
    userId: string,
    permissions: string[],
  ): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(userId);
    return permissions.some((permission) =>
      userPermissions.includes(permission),
    );
  }

  /**
   * 检查用户是否有所有权限
   * @param userId 用户ID
   * @param permissions 权限标识符数组
   * @returns 是否有权限
   */
  async hasAllPermissions(
    userId: string,
    permissions: string[],
  ): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(userId);
    return permissions.every((permission) =>
      userPermissions.includes(permission),
    );
  }

  /**
   * 获取用户的所有角色
   * @param userId 用户ID
   * @returns 角色数组
   */
  async getUserRoles(userId: string): Promise<Role[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    return user?.roles || [];
  }

  /**
   * 检查用户是否有指定角色
   * @param userId 用户ID
   * @param roleName 角色名称
   * @returns 是否有角色
   */
  async hasRole(userId: string, roleName: string): Promise<boolean> {
    const roles = await this.getUserRoles(userId);
    return roles.some((role) => role.name === roleName);
  }

  /**
   * 根据角色获取权限
   * @param roles 角色数组
   * @returns 权限标识符数组
   */
  async findPermissionsByRoles(roles: Role[]): Promise<string[]> {
    if (!roles || roles.length === 0) {
      return [];
    }

    const roleIds = roles.map((role) => role.id);

    // 获取所有角色及其关联的权限
    const rolePermissions = await this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.permissions', 'permission')
      .where('role.id IN (:...roleIds)', { roleIds })
      .getMany();

    // 提取所有权限的ID数组
    const permissionIds = rolePermissions
      .flatMap((role) => role.permissions)
      .map((permission) => permission.id);

    if (permissionIds.length === 0) {
      return [];
    }

    // 使用递归CTE查询所有权限及其子权限
    const query = `
      WITH RECURSIVE permission_tree AS (
        SELECT * FROM permission WHERE id IN (${permissionIds.map((id) => `'${id}'`).join(',')})
        UNION ALL
        SELECT p.* FROM permission p
        INNER JOIN permission_tree pt ON pt.id = p.parentId
      )
      SELECT DISTINCT id, name, sign FROM permission_tree
    `;

    const permissions = await this.dataSource.query(query);
    return permissions.map((p: any) => p.sign).filter(Boolean);
  }

  /**
   * 清除用户权限缓存
   * @param userId 用户ID
   */
  async clearUserPermissionCache(userId: string): Promise<void> {
    const cacheKey = `user_permissions:${userId}`;
    await this.cacheService.del(cacheKey);
  }

  /**
   * 清除所有用户权限缓存
   */
  async clearAllUserPermissionCache(): Promise<void> {
    await this.cacheService.delByPattern('user_permissions:*');
  }
}
