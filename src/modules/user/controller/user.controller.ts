// src/modules/user/controller/index.controller.ts
import { Body, Controller, Post, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserService } from '../services/user.service';
import { CreateUserReqDto } from '../dto/req/create-user-req.dto';
import { UpdateUserReqDto } from '../dto/req/update-user-req.dto';
import { FindUserReqDto } from '../dto/req/find-user-req.dto';
import { FindByUsernameReqDto } from '../dto/req/find-by-username-req.dto';
import { reqUser } from '../../../utils/nameSpace';
import { ApiResponseDto } from '../../../common/dto/api-response.dto';
import { UserResDto } from '../dto/res/user-res.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 创建用户
   * @param createUserReqDto - 创建用户请求数据传输对象
   * @returns 创建的用户响应数据传输对象
   */
  @Post('create')
  @ApiOperation({ summary: '创建用户' })
  @ApiResponse({ status: 201, description: '用户已成功创建。', type: UserResDto })
  async create(@Body() createUserReqDto: CreateUserReqDto): Promise<ApiResponseDto<void>> {
    await this.userService.create(createUserReqDto);
    return ApiResponseDto.success(null, '用户创建成功');
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
  async findAll(@Body() filter: FindByUsernameReqDto, @Req() req: Request): Promise<ApiResponseDto<UserResDto[]>> {
    const users = await this.userService.findAll(filter);
    const userDtos = users.map(user => new UserResDto(user));
    return ApiResponseDto.success(userDtos, '查询成功');
  }

  /**
   * 查找所有用户数量，用于分页
   * @param filter - 查找用户的过滤条件
   * @param req - 请求对象
   * @returns 用户数量响应数据传输对象
   */
  @Post("findAllByPage")
  @ApiOperation({ summary: "查找所有用户数量" })
  @ApiResponse({ status: 201, description: "返回所有用户数量。", type: ApiResponseDto })
  async findAllByPage(@Body() filter: FindByUsernameReqDto, @Req() req: Request): Promise<ApiResponseDto<any>> {
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
  async findOne(@Body() findUserReqDto: FindUserReqDto): Promise<ApiResponseDto<UserResDto>> {
    const user = await this.userService.findOne(findUserReqDto.id);
    return ApiResponseDto.success(new UserResDto(user), '查询成功');
  }

  /**
   * 通过token获取用户信息
   * @param req - 请求对象
   * @returns 具有给定token的用户响应数据传输对象
   */
  @Post("findByToken")
  @ApiOperation({ summary: "通过token获取用户信息" })
  @ApiResponse({ status: 201, description: "返回具有给定token的用户。", type: UserResDto })
  async findByToken(@Req() req: Request): Promise<ApiResponseDto<any>> {
    // 通过req的user获取用户信息
    const user = req[reqUser];
    // 通过用户id获取用户角色
    let userALL = await this.userService.findRolesByUserId(user.id);
    if (userALL.roles && userALL.roles.length > 0) {
      user.permissions = await this.userService.findPermissionsByRoles(userALL.roles);
    }
    return ApiResponseDto.success({
      ...user
    }, '查询成功');
  }

  /**
   * 通过用户名查找用户
   * @param findByUsernameReqDto - 查找用户请求数据传输对象
   * @returns 查找到的用户响应数据传输对象
   */
  @Post("findByUsername")
  @ApiOperation({ summary: "通过用户名查找用户" })
  @ApiResponse({ status: 201, description: "返回具有给定用户名的用户。", type: UserResDto })
  async findByUsername(@Body() findByUsernameReqDto: FindByUsernameReqDto): Promise<ApiResponseDto<UserResDto>> {
    const user = await this.userService.findByUsername(findByUsernameReqDto.username);
    return ApiResponseDto.success(new UserResDto(user), '查询成功');
  }

  /**
   * 更新用户信息
   * @param updateUserReqDto - 更新用户请求数据传输对象
   * @returns 更新后的用户响应数据传输对象
   */
  @Post("update")
  @ApiOperation({ summary: "更新用户信息" })
  @ApiResponse({ status: 201, description: "用户信息已成功更新。", type: UserResDto })
  async update(@Body() updateUserReqDto: UpdateUserReqDto): Promise<ApiResponseDto<void>> {
    await this.userService.update(updateUserReqDto.id, updateUserReqDto);
    return ApiResponseDto.success(null, '用户更新成功');
  }

  /**
   * 更新用户信息，如果密码为空，则不更新密码，rolesId不为空，则更新角色
   * @param createUserReqDto - 创建用户请求数据传输对象
   * @returns 更新后的用户响应数据传输对象
   */
  @Post("updateUser")
  @ApiOperation({ summary: "更新用户信息" })
  @ApiResponse({ status: 201, description: "用户信息已成功更新。", type: UserResDto })
  async updateUser(@Body() createUserReqDto: CreateUserReqDto): Promise<ApiResponseDto<void>> {
    await this.userService.updateUser(createUserReqDto);
    return ApiResponseDto.success(null, '用户更新成功');
  }

  /**
   * 删除用户
   * @param findUserReqDto - 查找用户请求数据传输对象
   * @returns 删除用户响应数据传输对象
   */
  @Post("remove")
  @ApiOperation({ summary: "删除用户" })
  @ApiResponse({ status: 201, description: "用户已成功删除。", type: UserResDto })
  async remove(@Body() findUserReqDto: FindUserReqDto): Promise<ApiResponseDto<void>> {
    await this.userService.remove(findUserReqDto.id);
    return ApiResponseDto.success(null, '用户删除成功');
  }

  /**
   * 批量删除用户
   * @param ids - 用户ID数组
   * @returns 删除用户响应数据传输对象
   */
  @Post("removeMultiple")
  @ApiOperation({ summary: "批量删除用户" })
  @ApiResponse({ status: 201, description: "用户已成功删除。", type: UserResDto })
  async removeMultiple(@Body() ids: string[]): Promise<ApiResponseDto<void>> {
    await this.userService.remove(ids);
    return ApiResponseDto.success(null, '用户批量删除成功');
  }
}
