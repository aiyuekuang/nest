import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { knife4jSetup } from "nest-knife4j";
import { ValidationPipe } from "@nestjs/common";
import { ResponseInterceptor } from "./interceptor/response.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle("Cats example")
    .setDescription("The cats API description")
    .setVersion("1.0")
    .addTag("cats")
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

  // Apply global response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(3000);
}

bootstrap();
