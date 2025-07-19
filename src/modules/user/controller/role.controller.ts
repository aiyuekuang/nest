// src/modules/user/controller/role.controller.ts
import { Body, Controller, Inject, Post, Req, UsePipes, ValidationPipe } from "@nestjs/common";
import { RoleService } from "../services/role.service";
import { Role } from "../entities/role.entity";
import { BaseResponseDto } from "../../../utils/baseRes.dto";
import { FindByUsernameReqDto } from "../dto/req/find-by-username-req.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UpdateRoleDto } from "../dto/req/create-update-role.dto";
import { FindPermissionDto } from "../dto/req/find-permission.dto";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { AuthService } from "../../auth/services/auth.service";

@ApiTags("roles")
@Controller("roles")
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache
  ) {
  }

  @Post("create")
  @ApiOperation({ summary: "创建角色" })
  @ApiResponse({ status: 201, description: "角色已成功创建。", type: Role })
  async create(@Body() role: UpdateRoleDto): Promise<Role> {
    return this.roleService.create(role);
  }

  @Post("findAll")
  @ApiOperation({ summary: "查找所有角色" })
  @ApiResponse({ status: 200, description: "返回所有角色。", type: [Role] })
  async findAll(): Promise<Role[]> {
    return this.roleService.findAll();
  }

  @Post("findAllByPage")
  @ApiOperation({ summary: "查找所有角色，用于分页" })
  @ApiResponse({ status: 200, description: "返回所有角色数量。", type: BaseResponseDto })
  async findAllByPage(@Body() filter: FindByUsernameReqDto, @Req() req: Request): Promise<BaseResponseDto> {
    return await this.roleService.findCount(filter);
  }

  @Post("findOne")
  @ApiOperation({ summary: "通过ID查找角色" })
  @ApiResponse({ status: 200, description: "返回具有给定ID的角色。", type: Role })
  async findOne(@Body("id") id: string): Promise<Role> {
    return this.roleService.findOne(id);
  }

  @Post("findPermissions")
  @ApiOperation({ summary: "通过ID查找角色的权限" })
  @ApiResponse({ status: 200, description: "返回具有给定ID的角色的权限。", type: [String] })
  async findPermissions(@Body() findPermissionDto: FindPermissionDto): Promise<string[]> {
    return this.roleService.findPermissions(findPermissionDto);
  }

  @Post("update")
  @ApiOperation({ summary: "更新角色" })
  @ApiResponse({ status: 200, description: "角色已成功更新。" })
  async update(@Body() role: UpdateRoleDto,@Req() req): Promise<void> {
    await this.roleService.update(role,req);
  }

  @Post("remove")
  @ApiOperation({ summary: "删除角色" })
  @ApiResponse({ status: 200, description: "角色已成功删除。" })
  async remove(@Body("id") id: string): Promise<void> {
    return this.roleService.remove(id);
  }
}
