// src/modules/user/dto/res/user-res.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../entities/user.entity';
import { ZtBaseResDto } from "../../../../utils/baseRes.dto";

/**
 * 用户响应数据传输对象 (DTO)
 * 用于定义返回给客户端的用户数据结构
 */
export class UserResDto extends ZtBaseResDto{
  /**
   * 用户ID
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  @ApiProperty({
    description: '用户ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  /**
   * 用户名
   * @example "john_doe"
   */
  @ApiProperty({
    description: '用户名',
    example: 'john_doe',
  })
  username: string;

  /**
   * 用户邮箱
   * @example "john.doe@example.com"
   */
  @ApiProperty({
    description: '用户邮箱',
    example: 'john.doe@example.com',
  })
  email: string;



  /**
   * 构造函数
   * @param user - 用户实体对象
   */
  constructor(user: any) {
    super(user);
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
  }
}
