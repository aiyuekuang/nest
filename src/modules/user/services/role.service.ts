// src/modules/user/services/role.service.ts
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Role } from "../entities/role.entity";
import { FindByUsernameReqDto } from "../dto/req/find-by-username-req.dto";
import { ZtBaseResDto } from "../../../utils/baseRes.dto";
import { filterData, getAuthToken, getUserToken } from "../../../utils/common";
import { FindUserReqDto } from "../dto/req/find-user-req.dto";
import { RoleResDto } from "../dto/res/role-res.dto";
import { UpdateRoleDto } from "../dto/req/create-update-role.dto";
import { Permission } from "../entities/permission.entity";
import { FindPermissionDto } from "../dto/req/find-permission.dto";
import { reqUser } from "../../../utils/nameSpace";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { User } from "../entities/user.entity";

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache
  ) {
  }

  /**
   * 创建角色
   * @param role - 角色实体
   * @returns 创建的角色实体
   */
  async create(role: UpdateRoleDto): Promise<Role> {
    console.log(2222,role);
    let roleEntity = new Role();
    roleEntity = {
      ...role,
      ...roleEntity
    };
    return this.roleRepository.save(roleEntity);
  }

  /**
   * 查找所有角色
   * @returns 所有角色实体数组
   */
  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  /**
   * 查找所有权限，可选过滤条件，分页模式
   * @param filter - 可选过滤条件
   * @returns 符合过滤条件的用户列表
   */
  async findCount(filter?: FindByUsernameReqDto): Promise<ZtBaseResDto> {
    const { pageIndex = 1, pageSize = 10, status } = filter;

    const res = await this.roleRepository.findAndCount({
      where: { ...filterData(filter, FindUserReqDto) },
      skip: (pageIndex - 1) * pageSize,
      take: pageSize
    });

    return new ZtBaseResDto(filter, res, RoleResDto);
  }

  /**
   * 通过ID查找角色
   * @param id - 角色ID
   * @returns 查找到的角色实体
   */
  async findOne(id: string): Promise<Role> {
    return this.roleRepository.findOne({ where: { id }, relations: ["users", "permissions"] });
  }

  /**
   * 通过ID查找角色的权限，返回当前角色的权限ID数组
   * @returns 查找到的角色实体
   */
  async findPermissions(findPermissionDto: FindPermissionDto): Promise<string[]> {
    const { id } = findPermissionDto;
    const role: Role = await this.roleRepository.findOne({ where: { id }, relations: ["permissions"] });
    return role.permissions.map((permission: any) => permission.id);
  }

  /**
   * 通过角色ID查找所有用户
   * @param roleId - 角色ID
   * @returns 具有指定角色ID的用户列表
   */
  async findUsersByRoleId(roleId: string): Promise<User[]> {
    return this.userRepository.find({
      where: {
        roles: {
          id: roleId
        }
      },
      relations: ["roles"]
    });
  }

  /**
   * 更新角色
   * @param role - 部分更新的角色实体,如果有权限字段，则更新权限，更新时，根据id将原有的删除，再添加新的
   * @param req
   */
  async update(role: UpdateRoleDto, req): Promise<void> {
    const { id, permissions } = role;
    let roleEntity = new Role();
    roleEntity = {
      ...role,
      ...roleEntity
    };
    if (permissions && permissions.length > 0) {
      // 先用permissions的id数组，批量查询出permission实体
      roleEntity.permissions = await this.permissionRepository.find({ where: { id: In(permissions) } });
      // 然后将原有的权限删除
      await this.roleRepository.save(roleEntity);



      // 通过角色id寻找所有的用户
      let user = await this.findUsersByRoleId(roleEntity.id);
      // 然后将用户的所有token都删除
      await this.logoutAll(user);
    } else {
      // 如果没有权限字段，则直接更新
      delete roleEntity.permissions;
      await this.roleRepository.update(id, roleEntity);
    }
  }

  /**
   * 删除角色
   * @param id - 角色ID
   */
  async remove(id: string): Promise<void> {
    await this.roleRepository.delete(id);
  }

  async logoutAll(user=[]) {
    let res = await getUserToken(this.cache, user);
    if (res && res.length) {
      // 删除缓存,res是一个数组
      await this.cache.store.mdel(...res);
    }
    // 处理用户登出逻辑
    // 这里可以实现 token 的黑名单机制
    return { message: "所有用户已登出" };
  }
}
