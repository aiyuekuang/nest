import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { PERMISSIONS_KEY, ROLES_KEY } from '../decorators/permissions.decorator';
import { PermissionService } from '../services/permission.service';
import { ForbiddenException } from '../exceptions/custom.exception';
import { reqUser } from '../../utils/nameSpace';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[] | any>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 如果没有权限和角色要求，直接通过
    if (!requiredPermissions && !requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request[reqUser];

    if (!user) {
      throw new ForbiddenException('用户未登录');
    }

    // 检查角色权限
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRole = await this.permissionService.hasRole(user.id, requiredRoles[0]);
      if (!hasRole) {
        throw new ForbiddenException('角色权限不足');
      }
    }

    // 检查权限
    if (requiredPermissions && requiredPermissions.length > 0) {
      // 如果是对象格式（任意权限或所有权限）
      if (typeof requiredPermissions === 'object' && requiredPermissions.type) {
        const { type, permissions } = requiredPermissions;
        
        if (type === 'any') {
          const hasAnyPermission = await this.permissionService.hasAnyPermission(
            user.id,
            permissions
          );
          if (!hasAnyPermission) {
            throw new ForbiddenException('权限不足');
          }
        } else if (type === 'all') {
          const hasAllPermissions = await this.permissionService.hasAllPermissions(
            user.id,
            permissions
          );
          if (!hasAllPermissions) {
            throw new ForbiddenException('权限不足');
          }
        }
      } else {
        // 默认检查任意一个权限
        const hasAnyPermission = await this.permissionService.hasAnyPermission(
          user.id,
          requiredPermissions
        );
        if (!hasAnyPermission) {
          throw new ForbiddenException('权限不足');
        }
      }
    }

    return true;
  }
}