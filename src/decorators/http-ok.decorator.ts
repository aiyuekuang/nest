// src/decorators/http-ok.decorator.ts
import { HttpCode, HttpStatus, applyDecorators, Post } from "@nestjs/common";

export function PostMarge(key: string): MethodDecorator {
  return applyDecorators(Post(key),HttpCode(HttpStatus.OK));
}
