// src/modules/user/service/user.service.ts
import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseService } from '../../../common/base/base.service';
import { PaginationService } from '../../../common/services/pagination.service';
import { PermissionService } from '../../../common/services/permission.service';
import { ApiResponseDto } from '../../../common/dto/api-response.dto';
import {
  NotFoundException,
  ConflictException,
} from '../../../common/exceptions/custom.exception';
import { PasswordUtil } from '../../../utils/password.util';
import { LoginDto } from '../../auth/dto/req/login.dto';
import { CreateUserReqDto } from '../dto/req/create-user-req.dto';
import { UpdateUserReqDto } from '../dto/req/update-user-req.dto';
import { FindByUsernameReqDto } from '../dto/req/find-by-username-req.dto';
import { UserResDto } from '../dto/res/user-res.dto';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly paginationService: PaginationService,
    private readonly permissionService: PermissionService,
  ) {
    super(userRepository);
  }

  /**
   * 创建新用户
   * @param createUserReqDto - 包含用户创建详细信息的 DTO
   * @returns 创建的用户
   */
  async create(createUserReqDto: CreateUserReqDto): Promise<User> {
    const { rolesId, password, username } = createUserReqDto;

    if (!username) {
      throw new ConflictException('用户名不能为空');
    }

    if (!password) {
      throw new ConflictException('密码不能为空');
    }

    // 检查用户名是否已存在
    const existingUser = await this.findByUsername(username);
    if (existingUser) {
      throw new ConflictException('用户名已存在');
    }

    // 使用bcrypt加密密码
    const hashedPassword = await PasswordUtil.hash(password);

    // 保存用户到数据库
    const user = await this.userRepository.save({
      ...createUserReqDto,
      password: hashedPassword,
      roles: rolesId?.map((roleId) => ({ id: roleId })) || [],
    });

    return user;
  }

  /**
   * 查找所有用户，可选过滤条件
   * @param filter - 可选过滤条件
   * @returns 符合过滤条件的用户列表
   */
  async findAll(filter?: FindByUsernameReqDto): Promise<User[]> {
    return this.userRepository.find({ where: filter });
  }

  /**
   * 查找所有用户，可选过滤条件，分页模式
   * @param filter - 可选过滤条件
   * @returns 符合过滤条件的用户列表
   */
  async findCount(filter?: FindByUsernameReqDto): Promise<ApiResponseDto<any>> {
    const result = await this.paginationService.paginate(
      this.userRepository,
      filter,
      {
        pageIndex: filter?.pageIndex,
        pageSize: filter?.pageSize,
        sortBy: filter?.sort?.sortBy || 'createdAt',
        sortOrder: (filter?.sort?.sortOrder || 'descend') as 'ASC' | 'DESC' | 'ascend' | 'descend',
      },
      ['roles'],
    );

    // 获取用户权限
    for (const user of result.data) {
      if (user.roles && user.roles.length > 0) {
        (user as any).permissions = await this.permissionService.findPermissionsByRoles(
          user.roles,
        );
      }
    }

    return this.paginationService.createPaginatedResponse(result, UserResDto);
  }

  /**
   * 通过 ID 查找用户
   * @param id - 用户的 ID
   * @returns 具有指定 ID 的用户
   */
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 获取用户权限
    if (user.roles && user.roles.length > 0) {
      (user as any).permissions = await this.permissionService.findPermissionsByRoles(
        user.roles,
      );
    }

    return user;
  }

  /**
   * 通过用户名查找用户
   * @param username - 用户名
   * @returns 具有指定用户名的用户
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username },
      relations: ['roles'],
    });
  }

  /**
   * 通过用户名查找用户，然后将整个用户返回，其中包含密码
   * @param username - 用户名
   * @returns 具有指定用户名的用户
   */
  async findByUsernameWithPassword(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username },
      select: ['password'],
    });
  }

  /**
   * 更新用户信息
   * @param id - 用户的 ID
   * @param updateUserReqDto - 包含更新用户详细信息的 DTO
   */
  async update(id: string, updateUserReqDto: UpdateUserReqDto): Promise<void> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    await this.userRepository.update(id, updateUserReqDto);

    // 清除用户权限缓存
    await this.permissionService.clearUserPermissionCache(id);
  }

  /**
   * 更新用户信息，如果密码为空，则不更新密码，rolesId不为空，则更新角色
   * @param createUserReqDto
   */
  async updateUser(createUserReqDto: CreateUserReqDto): Promise<void> {
    const { id, rolesId } = createUserReqDto;

    if (!id) {
      throw new NotFoundException('用户ID不能为空');
    }

    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 更新用户到数据库，解决Cannot query across many-to-many for property roles
    await this.userRepository.save({
      ...createUserReqDto,
      roles: rolesId?.map((roleId) => ({ id: roleId })) || [],
    });

    // 清除用户权限缓存
    await this.permissionService.clearUserPermissionCache(id);
  }

  /**
   * 通过 ID 删除用户,或者接收一个ids数组，删除多个用户
   * @param idOrIds - 用户的 ID 或 IDs 数组
   */
  async remove(idOrIds: string | string[]): Promise<void> {
    if (Array.isArray(idOrIds)) {
      // 如果是数组，则使用 In 条件删除多个用户
      await this.userRepository.delete({ id: In(idOrIds) });

      // 清除所有相关用户的权限缓存
      for (const id of idOrIds) {
        await this.permissionService.clearUserPermissionCache(id);
      }
    } else {
      // 如果是单个 ID，则直接删除该用户
      await this.userRepository.delete(idOrIds);
      await this.permissionService.clearUserPermissionCache(idOrIds);
    }
  }

  /**
   * 通过用户名和密码查找用户
   * @returns 具有指定用户名和密码的用户
   * @param loginDto
   */
  async findByUsernameAndPassword(loginDto: LoginDto): Promise<User | null> {
    return this.userRepository.findOne({ where: loginDto });
  }

  /**
   * 通过邮箱查找用户
   * @param email 邮箱
   * @returns 用户
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  /**
   * 通过用户id查找用户所有的角色
   * @param userId 用户ID
   * @returns 用户及其角色
   */
  async findRolesByUserId(userId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
  }

  /**
   * 通过所有角色查找所有的权限，并去重
   * @param roles 角色数组
   * @returns 权限标识符数组
   */
  async findPermissionsByRoles(roles: Role[]): Promise<string[]> {
    return this.permissionService.findPermissionsByRoles(roles);
  }
}
