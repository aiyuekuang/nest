// src/modules/user/service/user.service.ts
import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";

import { User } from "../entities/user.entity";
import { CreateUserReqDto } from "../dto/req/create-user-req.dto";
import { UpdateUserReqDto } from "../dto/req/update-user-req.dto";
import { DataSource, In, Repository } from "typeorm";
import { LoggerService } from "../../../logger/logger.service";
import { FindByUsernameReqDto } from "../dto/req/find-by-username-req.dto";
import { LoginDto } from "../../auth/dto/req/login.dto";
import { Role } from "../entities/role.entity";
import { ZtBaseResDto } from "../../../utils/baseRes.dto";
import { filterData } from "../../../utils/common";
import { FindUserReqDto } from "../dto/req/find-user-req.dto";
import { UserResDto } from "../dto/res/user-res.dto";
import { Permission } from "../entities/permission.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
    private readonly logger: LoggerService,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectDataSource() private dataSource: DataSource
  ) {
    this.permissionRepository = this.dataSource.getTreeRepository(Permission);
  }

  /**
   * 创建新用户
   * @param createUserReqDto - 包含用户创建详细信息的 DTO
   * @returns 创建的用户
   */
  async create(createUserReqDto: CreateUserReqDto): Promise<void> {
    const { rolesId } = createUserReqDto;
    // 保存用户到数据库
    await this.user.save({
      ...createUserReqDto,
      roles: rolesId.map(roleId => ({ id: roleId }))
    });
  }

  /**
   * 查找所有用户，可选过滤条件
   * @param filter - 可选过滤条件
   * @returns 符合过滤条件的用户列表
   */
  async findAll(filter?: FindByUsernameReqDto): Promise<User[]> {
    return this.user.find({ where: filter });
  }

  /**
   * 查找所有用户，可选过滤条件，分页模式
   * @param filter - 可选过滤条件
   * @returns 符合过滤条件的用户列表
   */
  async findCount(filter?: FindByUsernameReqDto): Promise<ZtBaseResDto> {
    const { pageIndex = 1, pageSize = 10 } = filter;

    const res = await this.user.findAndCount({
      where: { ...filterData(filter, FindUserReqDto) },
      skip: (pageIndex - 1) * pageSize,
      take: pageSize
    });

    // 获取用户之后，将用户的角色查出来
    const users = res[0];
    for (const user of users) {
      const roles = await this.findRolesByUserId(user.id);
      user.roles = roles.roles;
    }

    console.log(users);
    return new ZtBaseResDto(filter, res, UserResDto);
  }


  /**
   * 通过 ID 查找用户
   * @param id - 用户的 ID
   * @returns 具有指定 ID 的用户
   */
  async findOne(id: string): Promise<User> {
    return this.user.findOne({ where: { id } });
  }

  /**
   * 通过用户名查找用户
   * @param username - 用户名
   * @returns 具有指定用户名的用户
   */
  async findByUsername(username: string): Promise<User> {
    return this.user.findOne({ where: { username } });
  }

  /**
   * 通过用户名查找用户，然后将整个用户返回，其中包含密码
   * @param username - 用户名
   * @returns 具有指定用户名的用户
   */
  async findByUsernameWithPassword(username: string): Promise<User> {
    return this.user.findOne({ where: { username }, select: ["password"] });
  }

  /**
   * 更新用户信息
   * @param id - 用户的 ID
   * @param updateUserReqDto - 包含更新用户详细信息的 DTO
   */
  async update(id: string, updateUserReqDto: UpdateUserReqDto): Promise<void> {
    await this.user.update(id, updateUserReqDto);
  }

  /**
   * 更新用户信息，如果密码为空，则不更新密码，rolesId不为空，则更新角色
   * @param createUserReqDto
   */
  async updateUser(createUserReqDto: CreateUserReqDto): Promise<void> {
    const { id, rolesId } = createUserReqDto;


    // 更新用户到数据库，解决Cannot query across many-to-many for property roles
    await this.user.save({
      ...createUserReqDto,
      roles: rolesId.map(roleId => ({ id: roleId }))
    });

  }


  /**
   * 通过 ID 删除用户,或者接收一个ids数组，删除多个用户
   * @param idOrIds - 用户的 ID 或 IDs 数组
   */
  async remove(idOrIds: string | string[]): Promise<void> {
    if (Array.isArray(idOrIds)) {
      await this.user.delete({ id: In(idOrIds) });
    } else {
      await this.user.delete(idOrIds);
    }
  }

  /**
   * 通过用户名和密码查找用户
   * @returns 具有指定用户名和密码的用户
   * @param loginDto
   */
  async findByUsernameAndPassword(loginDto: LoginDto): Promise<User> {
    return this.user.findOne({ where: loginDto });
  }

  async findByEmail(email: string): Promise<User> {
    return this.user.findOne({ where: { email } });
  }

  // 通过用户id查找用户所有的角色
  async findRolesByUserId(userId: string): Promise<User> {
    return this.user.findOne({ where: { id: userId }, relations: ["roles"] });
  }



  //   通过所有角色查找所有的权限，并去重
  async findPermissionsByRoles(roles: Role[]): Promise<string[]> {
    // 获取所有角色的ID数组
    const roleIds = roles.map(role => role.id);

    // 获取所有角色及其关联的权限
    const rolePermissions = await this.roleRepository
      .createQueryBuilder("role")
      .leftJoinAndSelect("role.permissions", "permission")
      .where("role.id IN (:...roleIds)", { roleIds })
      .getMany();

    // 提取所有权限的ID数组
    const permissionIds = rolePermissions
      .flatMap(role => role.permissions)
      .map(permission => permission.id);

    // 如果没有权限ID，返回空数组
    if (permissionIds.length === 0) {
      return [];
    }

    // 使用递归CTE查询所有权限及其子权限
    const query = `
        WITH RECURSIVE permission_tree AS (
          SELECT * FROM permission WHERE id IN (${permissionIds.map(id => `'${id}'`).join(",")})
          UNION ALL
          SELECT p.* FROM permission p
          INNER JOIN permission_tree pt ON pt.id = p.parentId
        )
        SELECT DISTINCT id, name, sign FROM permission_tree
        `;

    // 执行查询，获取所有权限
    // 返回权限的标识符数组
    return await this.dataSource.query(query);
  }
}
