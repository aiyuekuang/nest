import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

/**
 * 全局验证管道
 * 用于验证请求数据的合法性
 */
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  /**
   * 转换和验证数据
   * @param value - 原始值
   * @param metadata - 参数元数据
   * @returns 验证后的值
   */
  async transform(value: any, { metatype }: ArgumentMetadata): Promise<any> {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const messages = errors.map((error) => {
        return Object.values(error.constraints || {}).join(', ');
      });
      throw new BadRequestException({
        message: '数据验证失败',
        errors: messages,
      });
    }

    return object;
  }

  /**
   * 判断是否需要验证
   * @param metatype - 元类型
   * @returns 是否需要验证
   */
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
