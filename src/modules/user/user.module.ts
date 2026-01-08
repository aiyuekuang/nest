import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controller/user.controller';
import { RoleController } from './controller/role.controller';
import { PermissionController } from './controller/permission.controller';
import { UserService } from './services/user.service';
import { RoleService } from './services/role.service';
import { PermissionService } from './services/permission.service';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission]), CommonModule],
  controllers: [UserController, RoleController, PermissionController],
  providers: [UserService, RoleService, PermissionService],
  exports: [UserService, RoleService, PermissionService],
})
export class UserModule {}
