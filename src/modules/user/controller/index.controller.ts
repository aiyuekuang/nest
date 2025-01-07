// src/modules/user/controller/index.controller.ts
import { Body, Controller, Post, Req } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserReqDto } from "../dto/req/create-user-req.dto";
import { UpdateUserReqDto } from "../dto/req/update-user-req.dto";
import { FindUserReqDto } from "../dto/req/find-user-req.dto";
import { FindByUsernameReqDto } from "../dto/req/find-by-username-req.dto";
import { UserResDto } from "../dto/res/user-res.dto";
import {reqUser} from "../../../utils/nameSpace"
@ApiTags("users")
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Post("create")
  @ApiOperation({ summary: "创建用户" })
  @ApiResponse({ status: 201, description: "用户已成功创建。", type: UserResDto })
  async create(@Body() createUserReqDto: CreateUserReqDto): Promise<UserResDto> {
    const user = await this.userService.create(createUserReqDto);
    return new UserResDto(user);
  }

  @Post("findAll")
  @ApiOperation({ summary: "查找所有用户" })
  @ApiResponse({ status: 201, description: "返回所有用户。", type: [UserResDto] })
  async findAll(@Body() filter: FindByUsernameReqDto, @Req() req: Request): Promise<UserResDto[]> {
    const users = await this.userService.findAll(filter);
    return users.map(user => new UserResDto(user));
  }

  @Post("findOne")
  @ApiOperation({ summary: "通过ID查找用户" })
  @ApiResponse({ status: 201, description: "返回具有给定ID的用户。", type: UserResDto })
  async findOne(@Body() findUserReqDto: FindUserReqDto): Promise<UserResDto> {
    const user = await this.userService.findOne(findUserReqDto.id);
    return new UserResDto(user);
  }

  @Post("findByUsername")
  @ApiOperation({ summary: "通过用户名查找用户" })
  @ApiResponse({ status: 201, description: "返回具有给定用户名的用户。", type: UserResDto })
  async findByUsername(@Body() findByUsernameReqDto: FindByUsernameReqDto): Promise<UserResDto> {
    const user = await this.userService.findByUsername(findByUsernameReqDto.username);
    return new UserResDto(user);
  }

  @Post("update")
  @ApiOperation({ summary: "通过ID更新用户" })
  @ApiResponse({ status: 201, description: "用户已成功更新。" })
  async update(@Req() req: Request, @Body() updateUserReqDto: UpdateUserReqDto): Promise<void> {
    // 通过用户名查找用户
    const user = await this.userService.findByUsername(updateUserReqDto.username);
    return this.userService.update(user.id, updateUserReqDto);
  }

  @Post("remove")
  @ApiOperation({ summary: "通过ID删除用户" })
  @ApiResponse({ status: 201, description: "用户已成功删除。" })
  async remove(@Body() findUserReqDto: FindUserReqDto): Promise<void> {
    return this.userService.remove(findUserReqDto.id);
  }
}
