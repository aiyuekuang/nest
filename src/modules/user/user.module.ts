import { Module } from "@nestjs/common";
import { UserService } from "./services/user.service";
import { User } from "./entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "./controller/user.controller";
import { PermissionController } from "./controller/permission.controller";
import { RoleController } from "./controller/role.controller";
import { PermissionService } from "./services/permission.service";
import { RoleService } from "./services/role.service";
import { Permission } from "./entities/permission.entity";
import { Role } from "./entities/role.entity";
import { AuthService } from "../auth/services/auth.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Permission]),
    TypeOrmModule.forFeature([Role])],
  controllers: [UserController, PermissionController, RoleController],
  providers: [UserService, PermissionService, RoleService],
  exports: [UserService]
})
export class UserModule {
}
