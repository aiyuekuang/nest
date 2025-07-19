# Nest 后端项目编码规范

## 概述

本文档定义了 Nest 后端项目的编码标准和最佳实践，旨在确保代码的一致性、可读性和可维护性。所有团队成员都应遵循这些规范。

## TypeScript 编码约定

### 1. 基本语法规范

#### 变量和函数命名
```typescript
// ✅ 推荐：使用 camelCase
const userName = 'john_doe';
const getUserInfo = () => {};

// ❌ 避免：使用 snake_case 或 PascalCase
const user_name = 'john_doe';
const GetUserInfo = () => {};
```

#### 类和接口命名
```typescript
// ✅ 推荐：类使用 PascalCase
export class UserService {}
export class AuthGuard {}

// ✅ 推荐：接口使用 PascalCase，可选择 I 前缀
export interface IUserConfig {}
export interface UserResponse {}

// ✅ 推荐：枚举使用 PascalCase
export enum UserStatus {
  ACTIVE = '1',
  INACTIVE = '0'
}
```

#### 常量命名
```typescript
// ✅ 推荐：使用 UPPER_SNAKE_CASE
export const MAX_RETRY_COUNT = 3;
export const DEFAULT_PAGE_SIZE = 10;
export const JWT_SECRET_KEY = 'your-secret';
```

### 2. 类型定义

#### 严格类型检查
```typescript
// ✅ 推荐：明确定义类型
interface CreateUserRequest {
  username: string;
  password: string;
  nickname?: string;
}

// ✅ 推荐：使用泛型
class ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

// ❌ 避免：使用 any 类型
const userData: any = {};
```

#### DTO 类型定义
```typescript
// ✅ 推荐：使用 class-validator 装饰器
export class CreateUserReqDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  nickname?: string;
}
```

## 文件和目录命名规范

### 1. 目录结构
```
src/
├── modules/           # 业务模块
│   ├── auth/         # 认证模块
│   ├── user/         # 用户模块
│   └── app.module.ts # 应用根模块
├── config/           # 配置文件
├── utils/            # 工具函数
├── guard/            # 守卫
├── filter/           # 过滤器
├── interceptor/      # 拦截器
├── decorators/       # 装饰器
└── logger/           # 日志模块
```

### 2. 文件命名约定
```
# 控制器文件
user.controller.ts
auth.controller.ts

# 服务文件
user.service.ts
auth.service.ts

# 实体文件
user.entity.ts
role.entity.ts

# DTO 文件
create-user-req.dto.ts
user-res.dto.ts

# 模块文件
user.module.ts
auth.module.ts

# 测试文件
user.service.spec.ts
auth.controller.spec.ts
```

## 代码组织和模块化

### 1. 模块结构
```typescript
// ✅ 推荐：标准模块结构
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    JwtModule.register({
      secret: config().jwt.secret,
      signOptions: { expiresIn: config().jwt.expiresIn }
    })
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
```

### 2. 控制器组织
```typescript
// ✅ 推荐：控制器最佳实践
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @ApiOperation({ summary: '创建用户' })
  @ApiResponse({ status: 201, description: '用户创建成功', type: UserResDto })
  async create(@Body() createUserDto: CreateUserReqDto): Promise<UserResDto> {
    return await this.userService.create(createUserDto);
  }
}
```

### 3. 服务层组织
```typescript
// ✅ 推荐：服务层最佳实践
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly logger: LoggerService
  ) {}

  async create(createUserDto: CreateUserReqDto): Promise<User> {
    try {
      const user = this.userRepository.create(createUserDto);
      const savedUser = await this.userRepository.save(user);
      this.logger.log(`User created: ${savedUser.id}`);
      return savedUser;
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`);
      throw new BadRequestException('用户创建失败');
    }
  }
}
```

## 注释和文档规范

### 1. 类和方法注释
```typescript
/**
 * 用户服务类
 * 负责处理用户相关的业务逻辑
 */
@Injectable()
export class UserService {
  /**
   * 创建新用户
   * @param createUserDto 创建用户的数据传输对象
   * @returns 创建的用户实体
   * @throws BadRequestException 当用户名已存在时
   */
  async create(createUserDto: CreateUserReqDto): Promise<User> {
    // 实现逻辑
  }
}
```

### 2. 复杂逻辑注释
```typescript
// ✅ 推荐：解释复杂业务逻辑
async login(loginDto: LoginDto) {
  // 1. 解密前端传来的密码
  const decryptedPassword = decrypt(loginDto.password, config().password.secret);
  
  // 2. 查询用户并验证密码
  const user = await this.findByUsernameWithPassword(loginDto.username);
  const dbPassword = decrypt(user.password, config().password.secret);
  
  // 3. 密码验证失败抛出异常
  if (decryptedPassword !== dbPassword) {
    throw new UnauthorizedException('用户名或密码错误');
  }
  
  // 4. 生成 JWT token 并缓存
  const token = await this.generateToken(user);
  await this.cacheToken(token, user);
  
  return { access_token: token };
}
```

### 3. API 文档注释
```typescript
// ✅ 推荐：完整的 Swagger 文档
@Post('login')
@SkipAuth()
@ApiOperation({ 
  summary: '用户登录',
  description: '用户通过用户名和密码进行登录认证'
})
@ApiResponse({ 
  status: 201, 
  description: '登录成功，返回访问令牌',
  schema: {
    example: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    }
  }
})
@ApiResponse({ 
  status: 401, 
  description: '用户名或密码错误'
})
async login(@Body() loginDto: LoginDto) {
  return this.authService.login(loginDto);
}
```

## 错误处理和异常管理

### 1. 异常处理模式
```typescript
// ✅ 推荐：统一异常处理
@Injectable()
export class UserService {
  async findById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`用户 ID ${id} 不存在`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`查询用户失败: ${error.message}`);
      throw new InternalServerErrorException('查询用户失败');
    }
  }
}
```

### 2. 自定义异常
```typescript
// ✅ 推荐：创建业务异常类
export class UserAlreadyExistsException extends BadRequestException {
  constructor(username: string) {
    super(`用户名 ${username} 已存在`);
  }
}

export class InvalidPasswordException extends BadRequestException {
  constructor() {
    super('密码格式不正确');
  }
}
```

### 3. 全局异常过滤器
```typescript
// ✅ 推荐：统一错误响应格式
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    let errorCode = -1;
    let errorMsg = '服务器内部错误';
    
    if (exception instanceof HttpException) {
      errorCode = exception.getStatus();
      errorMsg = exception.message;
    }
    
    response.status(200).json({
      code: errorCode,
      msg: errorMsg,
      timestamp: new Date().toISOString()
    });
  }
}
```

## 数据库操作规范

### 1. 实体定义
```typescript
// ✅ 推荐：完整的实体定义
@Entity()
export class User extends ZtBaseEntity {
  @Column({ unique: true, comment: '用户名' })
  username: string;

  @Column({ comment: '密码' })
  password: string;

  @Column({ comment: '昵称' })
  nickname: string;

  @Column({ nullable: true, comment: '头像URL' })
  avatar?: string;

  @Column({ default: '1', comment: '状态：0-禁用，1-启用' })
  status: string;

  @ManyToMany(() => Role, role => role.users)
  @JoinTable()
  roles: Role[];
}
```

### 2. Repository 使用
```typescript
// ✅ 推荐：Repository 最佳实践
@Injectable()
export class UserService {
  async findWithRoles(id: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.permissions'],
      select: {
        id: true,
        username: true,
        nickname: true,
        avatar: true,
        status: true,
        roles: {
          id: true,
          name: true,
          permissions: {
            id: true,
            name: true,
            sign: true
          }
        }
      }
    });
  }
}
```

### 3. 事务处理
```typescript
// ✅ 推荐：事务操作
@Injectable()
export class UserService {
  async createUserWithRole(
    createUserDto: CreateUserReqDto,
    roleIds: string[]
  ): Promise<User> {
    return await this.dataSource.transaction(async manager => {
      // 创建用户
      const user = manager.create(User, createUserDto);
      const savedUser = await manager.save(user);
      
      // 分配角色
      const roles = await manager.findByIds(Role, roleIds);
      savedUser.roles = roles;
      
      return await manager.save(savedUser);
    });
  }
}
```

## 单元测试规范

### 1. 测试文件组织
```typescript
// user.service.spec.ts
describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      // Arrange
      const createUserDto = {
        username: 'testuser',
        password: 'password123',
        nickname: 'Test User'
      };
      const expectedUser = { id: '1', ...createUserDto };

      jest.spyOn(repository, 'create').mockReturnValue(expectedUser as User);
      jest.spyOn(repository, 'save').mockResolvedValue(expectedUser as User);

      // Act
      const result = await service.create(createUserDto);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(repository.save).toHaveBeenCalledWith(expectedUser);
    });
  });
});
```

### 2. 测试覆盖率要求
- 服务层测试覆盖率 ≥ 80%
- 控制器层测试覆盖率 ≥ 70%
- 工具函数测试覆盖率 ≥ 90%

## 性能优化规范

### 1. 数据库查询优化
```typescript
// ✅ 推荐：使用索引和分页
async findUsers(page: number, limit: number): Promise<[User[], number]> {
  return await this.userRepository.findAndCount({
    skip: (page - 1) * limit,
    take: limit,
    order: { createdAt: 'DESC' },
    relations: ['roles']
  });
}

// ✅ 推荐：避免 N+1 查询
async findUsersWithRoles(): Promise<User[]> {
  return await this.userRepository.find({
    relations: ['roles', 'roles.permissions']
  });
}
```

### 2. 缓存策略
```typescript
// ✅ 推荐：合理使用缓存
@Injectable()
export class UserService {
  async getUserPermissions(userId: string): Promise<Permission[]> {
    const cacheKey = `user:${userId}:permissions`;
    
    // 先从缓存获取
    let permissions = await this.cache.get<Permission[]>(cacheKey);
    
    if (!permissions) {
      // 缓存未命中，从数据库查询
      permissions = await this.findUserPermissions(userId);
      // 缓存 30 分钟
      await this.cache.set(cacheKey, permissions, 1800);
    }
    
    return permissions;
  }
}
```

## 安全编码规范

### 1. 输入验证
```typescript
// ✅ 推荐：严格的输入验证
export class CreateUserReqDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  @Matches(/^[a-zA-Z0-9_]+$/, { message: '用户名只能包含字母、数字和下划线' })
  username: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { 
    message: '密码必须包含大小写字母和数字' 
  })
  password: string;
}
```

### 2. 敏感信息处理
```typescript
// ✅ 推荐：排除敏感字段
@Entity()
export class User extends ZtBaseEntity {
  @Column()
  username: string;

  @Column({ select: false }) // 默认查询时排除密码
  password: string;

  @Exclude() // 序列化时排除
  @Column()
  secretKey: string;
}
```

## Git 提交规范

### 1. 提交信息格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

### 2. 提交类型
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 3. 提交示例
```
feat(auth): 添加JWT认证功能

- 实现用户登录接口
- 添加JWT token生成和验证
- 集成Redis缓存token

Closes #123
```

## 代码审查清单

### 1. 功能性检查
- [ ] 代码实现符合需求
- [ ] 边界条件处理正确
- [ ] 错误处理完善
- [ ] 性能考虑合理

### 2. 代码质量检查
- [ ] 命名规范一致
- [ ] 代码结构清晰
- [ ] 注释充分且准确
- [ ] 无重复代码

### 3. 安全性检查
- [ ] 输入验证完整
- [ ] 敏感信息保护
- [ ] 权限控制正确
- [ ] SQL 注入防护

### 4. 测试检查
- [ ] 单元测试覆盖
- [ ] 测试用例充分
- [ ] 测试数据合理
- [ ] 集成测试通过
