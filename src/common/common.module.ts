import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../modules/user/entities/user.entity';
import { Role } from '../modules/user/entities/role.entity';
import { Permission } from '../modules/user/entities/permission.entity';
import { PaginationService } from './services/pagination.service';
import { CacheService } from './services/cache.service';
import { PermissionService } from './services/permission.service';
import { PermissionGuard } from './guards/permission.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission]),
  ],
  providers: [
    PaginationService,
    CacheService,
    PermissionService,
    PermissionGuard,
  ],
  exports: [
    PaginationService,
    CacheService,
    PermissionService,
    PermissionGuard,
  ],
})
export class CommonModule {}