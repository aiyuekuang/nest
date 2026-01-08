// entities/user.entity.ts
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { BaseEntity } from '../../../utils/base.entity';
import { Role } from './role.entity';

/**
 * 用户实体，表示系统中的一个用户。
 */
@Entity()
export class User extends BaseEntity {
  // 昵称
  @Column()
  nickname!: string;

  /**
   * 启用状态，字符串0或者1，默认值为1。
   */
  @Column({ default: '1' })
  status!: string;

  /**
   * 头像。
   */
  @Column({ nullable: true })
  avatar?: string;

  /**
   * 用户名。
   */
  @Column()
  username!: string;

  /**
   * 用户密码。
   */
  @Column()
  password!: string;

  /**
   * 当用户被插入数据库之前，对密码进行加密。
   * 对密码进行加密。
   * update会不触发，密码前端传过来的是加密后的密码，因为有这个问题，所以先注释掉
   */
  // @BeforeUpdate()
  // @BeforeInsert()
  // encryptPassword() {
  //   console.log(this.password);
  //   if (this.password) {
  //     this.password = encrypt(this.password, config().password.secret);
  //   }
  // }

  /**
   * 与角色实体的多对多关系。
   * 一个用户可以有多个角色。
   */
  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  roles!: Role[];

  /**
   * 用户的电话号码（可选）。
   */
  @Column({ nullable: true })
  tel?: string;

  /**
   * 用户的电子邮件地址（可选）。
   */
  @Column({ nullable: true })
  email?: string;
}
