# 项目优化文档

## 概述

本项目已经进行了全面的优化和重构，主要目标是提高代码的可维护性、可扩展性和可重用性。

## 优化内容

### 1. 基础服务抽象

#### BaseService
- 位置：`src/common/base/base.service.ts`
- 功能：提供通用的CRUD操作
- 特点：
  - 继承自BaseService的服务类自动获得基础的CRUD功能
  - 减少重复代码
  - 统一的数据操作接口

#### BaseController
- 位置：`src/common/base/base.controller.ts`
- 功能：提供通用的控制器操作
- 特点：
  - 标准化的API接口
  - 统一的响应格式
  - 自动的Swagger文档生成

### 2. 通用DTO类

#### BaseDto
- 位置：`src/common/dto/base.dto.ts`
- 功能：提供基础的DTO验证和转换逻辑
- 包含：
  - BaseDto：基础字段（id, createdAt, updatedAt等）
  - BaseCreateDto：创建操作DTO
  - BaseUpdateDto：更新操作DTO
  - BaseQueryDto：查询操作DTO

### 3. 统一响应格式

#### ApiResponseDto
- 位置：`src/common/dto/api-response.dto.ts`
- 功能：统一的API响应格式
- 特点：
  - 标准化的响应结构
  - 支持成功、错误、分页等多种响应类型
  - 自动时间戳生成

### 4. 分页服务

#### PaginationService
- 位置：`src/common/services/pagination.service.ts`
- 功能：通用的分页查询功能
- 特点：
  - 支持多种分页方式
  - 自动排序处理
  - 灵活的查询条件构建

### 5. 缓存服务

#### CacheService
- 位置：`src/common/services/cache.service.ts`
- 功能：统一的缓存操作接口
- 特点：
  - 支持多种缓存操作
  - 批量操作支持
  - 模式匹配删除
  - 缓存统计功能

### 6. 权限服务

#### PermissionService
- 位置：`src/common/services/permission.service.ts`
- 功能：权限验证和管理
- 特点：
  - 用户权限缓存
  - 角色权限验证
  - 权限树形结构支持
  - 灵活的权限检查

### 7. 自定义异常

#### CustomException
- 位置：`src/common/exceptions/custom.exception.ts`
- 功能：统一的异常处理
- 包含：
  - UnauthorizedException：未授权异常
  - ForbiddenException：权限不足异常
  - NotFoundException：资源不存在异常
  - ValidationException：数据验证异常
  - ConflictException：资源冲突异常
  - InternalServerException：服务器内部错误异常
  - BusinessException：业务异常

### 8. 权限装饰器和守卫

#### 权限装饰器
- 位置：`src/common/decorators/permissions.decorator.ts`
- 功能：声明式权限控制
- 包含：
  - RequirePermissions：需要指定权限
  - RequireRoles：需要指定角色
  - RequireAnyPermission：需要任意一个权限
  - RequireAllPermissions：需要所有权限

#### 权限守卫
- 位置：`src/common/guards/permission.guard.ts`
- 功能：权限验证守卫
- 特点：
  - 自动权限检查
  - 角色权限验证
  - 灵活的权限策略

### 9. 服务优化

#### UserService优化
- 继承BaseService，获得基础CRUD功能
- 使用PaginationService进行分页查询
- 使用PermissionService进行权限管理
- 使用CacheService进行缓存操作
- 统一的异常处理

#### AuthService优化
- 使用CacheService替代直接缓存操作
- 统一的响应格式
- 更好的错误处理
- 新增token刷新功能

### 10. 控制器优化

#### UserController优化
- 统一的响应格式
- 更好的错误处理
- 新增批量操作接口
- 自动的API文档生成

### 11. 拦截器优化

#### ResponseInterceptor优化
- 支持ApiResponseDto格式
- 更好的错误处理
- 统一的响应结构

### 12. 守卫优化

#### AuthGuard优化
- 使用CacheService进行token验证
- 更好的错误处理
- 简化的代码结构

## 使用示例

### 1. 创建新的服务类

```typescript
@Injectable()
export class ProductService extends BaseService<Product> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly paginationService: PaginationService,
  ) {
    super(productRepository);
  }

  async findWithPagination(filter: any): Promise<ApiResponseDto<any>> {
    const result = await this.paginationService.paginate(
      this.productRepository,
      filter
    );
    return this.paginationService.createPaginatedResponse(result, ProductResDto);
  }
}
```

### 2. 使用权限装饰器

```typescript
@Controller('products')
export class ProductController {
  @Post('create')
  @RequirePermissions('product:create')
  async create(@Body() createDto: CreateProductDto) {
    // 只有具有 product:create 权限的用户才能访问
  }

  @Post('delete')
  @RequireAnyPermission('product:delete', 'admin:all')
  async delete(@Body() deleteDto: DeleteProductDto) {
    // 具有任意一个权限的用户可以访问
  }
}
```

### 3. 使用缓存服务

```typescript
@Injectable()
export class CacheExampleService {
  constructor(private readonly cacheService: CacheService) {}

  async getOrSetData(key: string): Promise<any> {
    return await this.cacheService.getOrSet(
      key,
      async () => {
        // 从数据库获取数据的逻辑
        return await this.fetchFromDatabase();
      },
      { ttl: 1000 * 60 * 30 } // 30分钟缓存
    );
  }
}
```

## 模块结构

```
src/
├── common/                    # 通用功能模块
│   ├── base/                 # 基础类
│   │   ├── base.service.ts   # 基础服务类
│   │   └── base.controller.ts # 基础控制器类
│   ├── dto/                  # 通用DTO
│   │   ├── base.dto.ts       # 基础DTO类
│   │   └── api-response.dto.ts # API响应DTO
│   ├── services/             # 通用服务
│   │   ├── pagination.service.ts # 分页服务
│   │   ├── cache.service.ts  # 缓存服务
│   │   └── permission.service.ts # 权限服务
│   ├── exceptions/           # 异常处理
│   │   └── custom.exception.ts # 自定义异常
│   ├── decorators/           # 装饰器
│   │   └── permissions.decorator.ts # 权限装饰器
│   ├── guards/               # 守卫
│   │   └── permission.guard.ts # 权限守卫
│   └── common.module.ts      # 通用模块
├── modules/                  # 业务模块
│   ├── auth/                 # 认证模块
│   ├── user/                 # 用户模块
│   └── app.module.ts         # 主应用模块
└── utils/                    # 工具类
```

## 优势

1. **代码复用**：通过基础类和通用服务，大大减少了重复代码
2. **统一标准**：统一的响应格式、异常处理、权限控制
3. **易于维护**：清晰的模块结构和职责分离
4. **易于扩展**：新功能可以快速集成到现有架构中
5. **性能优化**：缓存机制和分页查询优化
6. **安全性**：完善的权限控制和异常处理

## 注意事项

1. 新功能开发时，优先使用现有的基础类和通用服务
2. 权限控制使用装饰器方式，避免硬编码
3. 异常处理使用自定义异常类，提供更好的错误信息
4. 缓存操作使用CacheService，避免直接操作缓存
5. 分页查询使用PaginationService，确保一致性