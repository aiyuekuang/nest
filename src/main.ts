import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { knife4jSetup } from 'nest-knife4j';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from './guard/authGuard';
import { AllExceptionsFilter } from './filter/any-exception.filter';
import { LoggerService } from './logger/logger.service';
import config from './config';
import * as helmet from 'helmet';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(LoggerService);

  // 安全头配置
  app.use(helmet.default());

  // 启用压缩
  app.use(compression());

  // CORS配置
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:8000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // 请求体大小限制
  app.use((req: any, res: any, next: any) => {
    req.on('data', (_chunk: any) => {
      if (
        req.headers['content-length'] &&
        parseInt(req.headers['content-length']) > 50 * 1024 * 1024
      ) {
        res.status(413).json({
          code: 413,
          msg: '请求体过大',
        });
        return;
      }
    });
    next();
  });

  // 请求日志中间件
  app.use((req: any, res: any, next: any) => {
    const startTime = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      logger.info(
        `[${req.method}] ${req.url}`,
        `状态码: ${res.statusCode}`,
        `耗时: ${duration}ms`,
        `IP: ${req.ip}`,
      );
    });
    next();
  });

  // 应用全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // 启用序列化拦截器
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // 全局新增URL前缀
  app.setGlobalPrefix(config().prefix || 'api');

  // Swagger文档配置
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Nest API文档')
    .setDescription('Nest后端API接口文档')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: '输入JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api', app, document);
  knife4jSetup(app, [
    {
      name: '2.X版本',
      url: '/api-json',
      swaggerVersion: '2.0',
      location: '/api-json',
    },
  ]);

  // 全局异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  // 设置日志服务
  app.useLogger(logger);

  // 全局认证守卫
  app.useGlobalGuards(app.get(AuthGuard));

  const port = process.env.PORT || 3010;
  await app.listen(port);

  logger.info(`应用启动成功，端口: ${port}`);
  logger.info(`环境: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`API文档: http://localhost:${port}/api`);
}

bootstrap();
