// entities/user.entity.ts
import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { Role } from './role.entity';
import { ZtBaseEntity } from "../../../utils/base.entity";
import { ApiProperty } from '@nestjs/swagger';

/**
 * 用户实体，表示系统中的一个用户。
 */
@Entity()
export class User extends ZtBaseEntity {
  /**
   * 用户名。
   */
  @ApiProperty({ example: 'john_doe', description: '用户名' })
  @Column()
  username: string;

  /**
   * 用户密码。
   */
  @ApiProperty({ example: 'password123', description: '用户密码' })
  @Column()
  password: string;

  /**
   * 与角色实体的多对多关系。
   * 一个用户可以有多个角色。
   */
  @ApiProperty({ type: () => [Role], description: '与角色实体的多对多关系' })
  @ManyToMany(() => Role, role => role.users)
  @JoinTable()
  roles: Role[];

  /**
   * 用户的电话号码（可选）。
   */
  @ApiProperty({ example: '123-456-7890', description: '用户的电话号码', required: false })
  @Column({ nullable: true })
  tel?: string;

  /**
   * 用户的电子邮件地址（可选）。
   */
  @ApiProperty({ example: 'john_doe@example.com', description: '用户的电子邮件地址', required: false })
  @Column({ nullable: true })
  email?: string;
}
