# 使用官方 Node.js 运行时作为构建镜像
FROM node:16-alpine AS build

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json（如果有的话）
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制应用源代码
COPY . .

# 构建生产环境的 NestJS 应用
RUN npm run build

# 使用轻量级的 Node.js 运行时来运行应用
FROM node:16-alpine

WORKDIR /usr/src/app

# 复制从构建阶段生成的输出
COPY --from=build /usr/src/app/dist ./dist
COPY package*.json ./

# 只安装生产环境所需的依赖
RUN npm ci --only=production

# 暴露应用运行的端口
EXPOSE 3000

# 启动应用
CMD ["npm","run", "start:prod"]