import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { knife4jSetup } from "nest-knife4j";
import { ValidationPipe } from "@nestjs/common";
import { ResponseInterceptor } from "./interceptor/response.interceptor";
import { TypeOrmModule } from "@nestjs/typeorm";
import config from "./config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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


  // Apply global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}

bootstrap();
