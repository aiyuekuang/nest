import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { knife4jSetup } from "nest-knife4j";
import { ValidationPipe } from "@nestjs/common";
import { AuthGuard } from "./guard/authGuard";
import { AllExceptionsFilter } from "./filter/any-exception.filter";
import { LoggerService } from "./logger/logger.service";
import config from "./config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(bodyParser.json({ limit: "50mb" }));

  // 全局新增URL前缀
  app.setGlobalPrefix(config().prefix);

  const options = new DocumentBuilder()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api", app, document);
  knife4jSetup(app, [
    {
      name: "2.X版本",
      url: `/api-json`,
      swaggerVersion: "2.0",
      location: `/api-json`
    }
  ]);

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useLogger(app.get(LoggerService));


  // 应用全局验证管道
  // 这行代码使用 NestJS 内置的 ValidationPipe 设置了一个全局验证管道。
  // ValidationPipe 会根据 DTO（数据传输对象）中定义的验证规则自动验证传入的请求。
  // 如果验证失败，它将抛出一个适当的错误响应。
  // 这有助于确保应用程序处理的数据是有效的，并且符合预期的格式和约束。
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(app.get(AuthGuard));
  await app.listen(3000);
}

bootstrap();
