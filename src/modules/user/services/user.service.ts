// src/modules/user/service/user.service.ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { User } from "../entities/user.entity";
import { CreateUserReqDto } from "../dto/req/create-user-req.dto";
import { UpdateUserReqDto } from "../dto/req/update-user-req.dto";
import { Repository } from "typeorm";
import { LoggerService } from "../../../logger/logger.service";
import { FindByUsernameReqDto } from "../dto/req/find-by-username-req.dto";
import { LoginDto } from "../../auth/dto/req/login.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
    private readonly logger: LoggerService
  ) {
  }

  /**
   * 创建新用户
   * @param createUserReqDto - 包含用户创建详细信息的 DTO
   * @returns 创建的用户
   */
  async create(createUserReqDto: CreateUserReqDto): Promise<User> {
    const user = this.user.create(createUserReqDto);
    return this.user.save(user);
  }

  /**
   * 查找所有用户，可选过滤条件
   * @param filter - 可选过滤条件
   * @returns 符合过滤条件的用户列表
   */
  async findAll(filter?: FindByUsernameReqDto): Promise<User[]> {
    this.logger.log("开始查询数据", filter);

    return this.user.find({ where: filter });
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
   * 更新用户信息
   * @param id - 用户的 ID
   * @param updateUserReqDto - 包含更新用户详细信息的 DTO
   */
  async update(id: string, updateUserReqDto: UpdateUserReqDto): Promise<void> {
    await this.user.update(id, updateUserReqDto);
  }

  /**
   * 通过 ID 删除用户
   * @param id - 用户的 ID
   */
  async remove(id: string): Promise<void> {
    await this.user.delete(id);
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
}
