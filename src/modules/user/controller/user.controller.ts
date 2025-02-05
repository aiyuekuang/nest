// src/modules/user/controller/index.controller.ts
import { Body, Controller, Post, Req, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserReqDto } from "../dto/req/create-user-req.dto";
import { UpdateUserReqDto } from "../dto/req/update-user-req.dto";
import { FindUserReqDto } from "../dto/req/find-user-req.dto";
import { FindByUsernameReqDto } from "../dto/req/find-by-username-req.dto";
import { reqUser } from "../../../utils/nameSpace";
import { ZtBaseResDto } from "../../../utils/baseRes.dto";
import { UserResDto } from "../dto/res/user-res.dto";

@ApiTags("users")
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  /**
   * 创建用户
   * @param createUserReqDto - 创建用户请求数据传输对象
   * @returns 创建的用户响应数据传输对象
   */
  @Post("create")
  @ApiOperation({ summary: "创建用户" })
  @ApiResponse({ status: 201, description: "用户已成功创建。", type: UserResDto })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() createUserReqDto: CreateUserReqDto): Promise<void> {
    return await this.userService.create(createUserReqDto);
  }

  /**
   * 查找所有用户
   * @param filter - 查找用户的过滤条件
   * @param req - 请求对象
   * @returns 所有用户响应数据传输对象数组
   */
  @Post("findAll")
  @ApiOperation({ summary: "查找所有用户" })
  @ApiResponse({ status: 201, description: "返回所有用户。", type: [UserResDto] })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async findAll(@Body() filter: FindByUsernameReqDto, @Req() req: Request): Promise<UserResDto[]> {
    const users = await this.userService.findAll(filter);
    return users.map(user => new UserResDto(user));
  }

  /**
   * 查找所有用户数量，用于分页
   * @param filter - 查找用户的过滤条件
   * @param req - 请求对象
   * @returns 用户数量响应数据传输对象
   */
  @Post("findAllByPage")
  @ApiOperation({ summary: "查找所有用户数量" })
  @ApiResponse({ status: 201, description: "返回所有用户数量。", type: [ZtBaseResDto] })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async findAllByPage(@Body() filter: FindByUsernameReqDto, @Req() req: Request): Promise<ZtBaseResDto> {
    return await this.userService.findCount(filter);
  }

  /**
   * 通过ID查找用户
   * @param findUserReqDto - 查找用户请求数据传输对象
   * @returns 查找到的用户响应数据传输对象
   */
  @Post("findOne")
  @ApiOperation({ summary: "通过ID查找用户" })
  @ApiResponse({ status: 201, description: "返回具有给定ID的用户。", type: UserResDto })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async findOne(@Body() findUserReqDto: FindUserReqDto): Promise<UserResDto> {
    const user = await this.userService.findOne(findUserReqDto.id);
    return new UserResDto(user);
  }

  /**
   * 通过token获取用户信息
   * @param req - 请求对象
   * @returns 具有给定token的用户响应数据传输对象
   */
  @Post("findByToken")
  @ApiOperation({ summary: "通过token获取用户信息" })
  @ApiResponse({ status: 201, description: "返回具有给定token的用户。", type: UserResDto })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async findByToken(@Req() req: Request): Promise<UserResDto> {
    // 通过req的user获取用户信息
    const user = req[reqUser];
    // 通过用户id获取用户角色
    let userALL = await this.userService.findRolesByUserId(user.id);
    if (userALL.roles && userALL.roles.length > 0) {
      user.permissions = await this.userService.findPermissionsByRoles(userALL.roles);
    }
    return {
      ...user
    };
  }

  /**
   * 通过用户名查找用户
   * @param findByUsernameReqDto - 查找用户请求数据传输对象
   * @returns 查找到的用户响应数据传输对象
   */
  @Post("findByUsername")
  @ApiOperation({ summary: "通过用户名查找用户" })
  @ApiResponse({ status: 201, description: "返回具有给定用户名的用户。", type: UserResDto })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async findByUsername(@Body() findByUsernameReqDto: FindByUsernameReqDto): Promise<UserResDto> {
    const user = await this.userService.findByUsername(findByUsernameReqDto.username);
    return new UserResDto(user);
  }

  /**
   * 通过ID更新用户
   * @param updateUserReqDto - 更新用户请求数据传输对象
   */
  @Post("update")
  @ApiOperation({ summary: "通过ID更新用户" })
  @ApiResponse({ status: 201, description: "用户已成功更新。" })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(@Body() updateUserReqDto: CreateUserReqDto): Promise<void> {
    // 通过用户名查找用户
    return this.userService.updateUser(updateUserReqDto);
  }

  /**
   * 通过ID删除用户
   * @param findUserReqDto - 查找用户请求数据传输对象
   */
  @Post("remove")
  @ApiOperation({ summary: "通过ID删除用户" })
  @ApiResponse({ status: 201, description: "用户已成功删除。" })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async remove(@Body() findUserReqDto: FindUserReqDto): Promise<void> {
    return this.userService.remove(findUserReqDto.id || findUserReqDto.idList);
  }
}
