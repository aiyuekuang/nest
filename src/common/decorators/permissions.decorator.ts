import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export const ROLES_KEY = 'roles';

/**
 * 权限装饰器
 * @param permissions 权限标识符数组
 * @returns 装饰器
 */
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

/**
 * 角色装饰器
 * @param roles 角色名称数组
 * @returns 装饰器
 */
export const RequireRoles = (...roles: string[]) =>
  SetMetadata(ROLES_KEY, roles);

/**
 * 任意权限装饰器
 * @param permissions 权限标识符数组
 * @returns 装饰器
 */
export const RequireAnyPermission = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, { type: 'any', permissions });

/**
 * 所有权限装饰器
 * @param permissions 权限标识符数组
 * @returns 装饰器
 */
export const RequireAllPermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, { type: 'all', permissions });
