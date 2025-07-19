# Nest 后端项目上下文文档

## 项目概述

### 业务目的
Nest 项目是一个基于 NestJS 框架的企业级后端管理系统，主要提供用户权限管理、角色管理和认证授权等核心功能。该系统采用现代化的微服务架构设计，为前端应用提供稳定可靠的 API 服务。

### 核心功能
- **用户管理系统**：完整的用户生命周期管理，包括注册、登录、信息维护等
- **角色权限系统**：基于 RBAC 模型的细粒度权限控制
- **认证授权**：基于 JWT 的无状态认证机制
- **缓存管理**：Redis 缓存提升系统性能
- **邮件服务**：支持密码重置、通知等邮件功能
- **API 文档**：集成 Swagger 和 Knife4j 提供完整的 API 文档

## 技术架构

### 技术栈
- **框架**：NestJS 10.x (基于 Node.js 和 TypeScript)
- **数据库**：MySQL 8.x + TypeORM
- **缓存**：Redis 6.x
- **认证**：JWT + Passport
- **文档**：Swagger + Knife4j
- **邮件**：Nodemailer
- **日志**：Winston
- **容器化**：Docker

### 架构模式
- **模块化架构**：采用 NestJS 的模块化设计，每个功能模块独立管理
- **依赖注入**：使用 IoC 容器管理组件依赖关系
- **分层架构**：Controller -> Service -> Repository 的经典三层架构
- **装饰器模式**：大量使用装饰器简化代码和配置

## 核心模块详解

### 1. 应用模块 (AppModule)
**位置**：`src/modules/app.module.ts`

**功能**：
- 应用程序的根模块，负责整合所有子模块
- 配置全局服务：数据库连接、Redis 缓存、邮件服务
- 注册全局拦截器和守卫

**关键配置**：
- TypeORM 数据库连接配置
- Redis 缓存配置 (TTL: 1小时)
- 邮件服务配置 (SMTP)
- 全局响应拦截器

### 2. 认证模块 (AuthModule)
**位置**：`src/modules/auth/`

**核心组件**：
- `AuthController`：处理登录、登出、密码重置等认证相关请求
- `AuthService`：实现认证业务逻辑
- `AuthGuard`：全局认证守卫，验证 JWT token

**主要功能**：
- 用户登录验证 (密码加密对比)
- JWT token 生成和验证
- Token 缓存管理 (Redis)
- 密码重置流程 (邮件验证码)
- 用户登出 (token 失效)

**API 端点**：
- `POST /auth/login` - 用户登录
- `POST /auth/logout` - 用户登出
- `POST /auth/forgotPassword` - 忘记密码
- `POST /auth/resetPassword` - 重置密码
- `POST /auth/changePassword` - 修改密码

### 3. 用户模块 (UserModule)
**位置**：`src/modules/user/`

**核心组件**：
- `UserController`：用户管理相关 API
- `RoleController`：角色管理相关 API
- `PermissionController`：权限管理相关 API
- `UserService`：用户业务逻辑
- `RoleService`：角色业务逻辑

**数据模型**：
- `User`：用户实体 (用户名、密码、昵称、头像、状态)
- `Role`：角色实体 (角色名、描述、状态)
- `Permission`：权限实体 (权限名、标识、父级权限)

**关系设计**：
- 用户-角色：多对多关系 (`@ManyToMany`)
- 角色-权限：多对多关系 (`@ManyToMany`)
- 权限层级：树形结构 (`@Tree("closure-table")`)

## 数据库设计

### 核心实体

#### 基础实体 (ZtBaseEntity)
**位置**：`src/utils/base.entity.ts`

**字段**：
- `id`：UUID 主键
- `createdAt`：创建时间 (自动生成)
- `createdBy`：创建人 (默认 "system")
- `updatedAt`：更新时间 (自动更新)
- `updatedBy`：更新人

#### 用户实体 (User)
**表名**：`user`

**字段**：
- 继承 `ZtBaseEntity` 的基础字段
- `nickname`：昵称
- `username`：用户名 (唯一)
- `password`：密码 (加密存储)
- `avatar`：头像 URL
- `status`：状态 ("0"禁用, "1"启用)

#### 角色实体 (Role)
**表名**：`role`

**字段**：
- 继承 `ZtBaseEntity` 的基础字段
- `name`：角色名称
- `remark`：角色描述
- `status`：状态 ("0"禁用, "1"启用)

#### 权限实体 (Permission)
**表名**：`permission`

**字段**：
- 继承 `ZtBaseEntity` 的基础字段
- `name`：权限名称
- `sign`：权限标识 (用于前端权限判断)
- `parentId`：父权限 ID (支持树形结构)

### 关联表
- `user_roles_role`：用户角色关联表
- `role_permissions_permission`：角色权限关联表
- `permission_closure`：权限树形结构闭包表

## API 设计

### 全局配置
- **URL 前缀**：`/nest`
- **端口**：3010
- **文档地址**：
  - Swagger UI: `http://localhost:3010/api`
  - Knife4j: `http://localhost:3010/doc.html`

### 认证相关 API
```
POST /nest/auth/login          # 用户登录
POST /nest/auth/logout         # 用户登出
POST /nest/auth/forgotPassword # 忘记密码
POST /nest/auth/resetPassword  # 重置密码
POST /nest/auth/changePassword # 修改密码
```

### 用户管理 API
```
POST /nest/users/create        # 创建用户
POST /nest/users/update        # 更新用户
POST /nest/users/findAll       # 查询用户列表
POST /nest/users/findByUsername # 根据用户名查询
POST /nest/users/findByToken   # 根据 token 获取用户信息
```

### 角色管理 API
```
POST /nest/roles/create        # 创建角色
POST /nest/roles/update        # 更新角色
POST /nest/roles/findAll       # 查询角色列表
POST /nest/roles/delete        # 删除角色
```

### 权限管理 API
```
POST /nest/permissions/create  # 创建权限
POST /nest/permissions/update  # 更新权限
POST /nest/permissions/findAll # 查询权限列表
POST /nest/permissions/tree    # 获取权限树
```

## 安全架构

### 认证机制
1. **JWT Token**：使用 JSON Web Token 进行无状态认证
2. **Token 缓存**：将有效 token 存储在 Redis 中，支持快速验证和登出
3. **密码加密**：使用 AES 加密算法保护用户密码
4. **请求验证**：全局 AuthGuard 验证所有请求的 token 有效性

### 授权机制
1. **RBAC 模型**：基于角色的访问控制
2. **权限标识**：每个权限点都有唯一标识符
3. **层级权限**：支持权限的树形结构，便于管理
4. **动态权限**：前端根据用户权限动态显示菜单和功能

### 安全特性
- **跳过认证装饰器**：`@SkipAuth()` 用于公开接口
- **全局异常过滤器**：统一处理和格式化错误响应
- **请求验证管道**：自动验证请求参数格式和类型
- **响应拦截器**：统一格式化成功响应

## 配置管理

### 环境配置
**开发环境** (`src/config/development.config.ts`)：
- 数据库：localhost:3306/nest
- Redis：192.168.31.78:6379
- 自动同步数据库结构

**生产环境** (`src/config/production.config.ts`)：
- 生产数据库配置
- 禁用自动同步
- 优化性能参数

### 基础配置 (`src/config/base.config.ts`)
- JWT 密钥和过期时间
- 密码加密密钥
- 邮件服务配置
- URL 前缀设置

## 依赖项清单

### 核心依赖
- `@nestjs/core` - NestJS 核心框架
- `@nestjs/common` - 通用装饰器和工具
- `@nestjs/typeorm` - TypeORM 集成
- `@nestjs/jwt` - JWT 认证
- `@nestjs/passport` - Passport 认证策略
- `@nestjs/config` - 配置管理
- `@nestjs/cache-manager` - 缓存管理
- `@nestjs-modules/mailer` - 邮件服务

### 数据库相关
- `typeorm` - ORM 框架
- `mysql2` - MySQL 驱动
- `typeorm-naming-strategies` - 命名策略

### 缓存和工具
- `redis` - Redis 客户端
- `cache-manager-redis-yet` - Redis 缓存适配器
- `class-validator` - 参数验证
- `class-transformer` - 数据转换
- `crypto-js` - 加密工具
- `lodash` - 工具函数库
- `moment` - 时间处理
- `winston` - 日志记录

### 文档和开发工具
- `@nestjs/swagger` - Swagger 文档
- `nest-knife4j` - Knife4j 文档增强
- `swagger-ui-express` - Swagger UI

## 环境变量说明

### 数据库配置
- `DB_HOST` - 数据库主机地址
- `DB_PORT` - 数据库端口
- `DB_USERNAME` - 数据库用户名
- `DB_PASSWORD` - 数据库密码
- `DB_DATABASE` - 数据库名称

### Redis 配置
- `REDIS_HOST` - Redis 主机地址
- `REDIS_PORT` - Redis 端口
- `REDIS_PASSWORD` - Redis 密码

### 应用配置
- `NODE_ENV` - 运行环境 (development/production)
- `JWT_SECRET` - JWT 密钥
- `PASSWORD_SECRET` - 密码加密密钥

### 邮件配置
- `MAIL_HOST` - SMTP 服务器地址
- `MAIL_PORT` - SMTP 端口
- `MAIL_USER` - 邮箱用户名
- `MAIL_PASS` - 邮箱授权码

## 项目启动和部署

### 开发环境启动
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run start:dev

# 构建项目
npm run build

# 生产环境启动
npm run start:prod
```

### Docker 部署
```bash
# 构建镜像
docker build -t nest-app .

# 运行容器
docker run -p 3010:3010 nest-app
```

### 数据库初始化
1. 创建 MySQL 数据库
2. 配置数据库连接参数
3. 启动应用自动同步表结构 (开发环境)
4. 导入初始数据 (如管理员账户)

## 日志和监控

### 日志配置
- **日志框架**：Winston
- **日志级别**：error, warn, info, debug
- **日志格式**：JSON 格式，便于日志分析
- **日志输出**：控制台 + 文件

### 监控指标
- API 响应时间
- 数据库连接状态
- Redis 连接状态
- 内存使用情况
- 错误率统计

## 测试策略

### 测试框架
- **单元测试**：Jest
- **集成测试**：Supertest
- **E2E 测试**：Jest + Supertest

### 测试覆盖
- 控制器层测试
- 服务层测试
- 数据库操作测试
- 认证授权测试

### 测试命令
```bash
# 运行所有测试
npm test

# 运行测试并生成覆盖率报告
npm run test:cov

# 运行 E2E 测试
npm run test:e2e
```
