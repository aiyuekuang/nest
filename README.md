# NestJS 项目介绍

## 项目概述

本项目是一个基于 [NestJS](https://nestjs.com/) 框架的 TypeScript 启动模板，旨在帮助开发者快速构建高效且可扩展的服务器端应用程序。NestJS 是一个渐进式 Node.js 框架，利用 TypeScript 提供了强大的架构支持，使得应用程序更加健壮和易于维护。

## 主要功能

- **模块化架构**：通过模块化设计，项目结构清晰，便于管理和扩展。
- **依赖注入**：NestJS 的依赖注入机制简化了组件之间的依赖关系，提高了代码的可测试性和可维护性。
- **中间件支持**：支持自定义中间件，方便处理请求和响应。
- **插件机制**：丰富的插件生态系统，满足各种业务需求。
- **CLI 工具**：NestJS 提供了强大的命令行工具，简化了项目的初始化和开发流程。

## 项目特点

- **用户管理**：支持用户注册、登录、权限管理等功能。
- **角色管理**：支持创建、编辑和删除角色，以及角色与权限的关联。
- **权限管理**：支持细粒度的权限控制，确保系统的安全性。
- **用户角色关联**：支持用户与角色的关联，方便管理用户权限。

## 技术栈

- **NestJS**：用于构建服务器端应用程序。
- **TypeScript**：提供静态类型检查，提高代码质量。
- **MySQL**：作为数据库存储解决方案。
- **JWT**：用于身份验证和授权。
- **Docker**：用于容器化部署，简化部署流程。

## 项目结构

```plaintext
src/
├── app.module.ts
├── main.ts
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── entities/
│       └── user.entity.ts
├── roles/
│   ├── roles.module.ts
│   ├── roles.controller.ts
│   ├── roles.service.ts
│   └── entities/
│       └── role.entity.ts
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── strategies/
│       └── jwt.strategy.ts
└── shared/
    ├── database/
    │   └── database.module.ts
    └── utils/
        └── validation.pipe.ts
```


## 使用方法

### 环境准备

1. 确保已安装 Node.js 和 npm。
2. 克隆本工程到本地。
3. 在工程根目录下运行 `npm install` 安装所有依赖。

### 启动应用

1. 配置环境变量，包括数据库连接字符串等。
2. 运行 `npm start` 启动应用。
3. 应用启动后，默认监听在 `http://localhost:3000`。

### 开发与测试

- **开发**：运行 `npm run dev` 启动开发服务器，支持热重载。
- **测试**：运行 `npm test` 执行单元测试和集成测试。

### 部署

1. 构建项目：运行 `npm run build`。
2. 使用 Docker 部署：运行 `docker-compose up --build`。

## 贡献

欢迎提交 Pull Request 或 Issue，共同改进本项目。

## 许可证

本项目遵循 [MIT License](LICENSE)。