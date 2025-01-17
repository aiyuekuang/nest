// entities/role.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { User } from './user.entity';
import { Permission } from './permission.entity';
import { ZtBaseEntity } from "../../../utils/base.entity";
import { ApiProperty } from '@nestjs/swagger';

/**
 * 角色实体，表示系统中的一个角色。
 */
@Entity()
export class Role extends ZtBaseEntity {
  /**
   * 角色名称。
   */
  @ApiProperty({ example: 'Admin', description: '角色名称' })
  @Column()
  name: string;

  /**
   * 角色描述。
   */
  @ApiProperty({ example: '管理员', description: '备注' })
  @Column({ nullable: true })
  remark:string

  /**
   * 与用户实体的多对多关系。
   * 一个角色可以分配给多个用户。
   */
  @ApiProperty({ type: () => [User], description: '与用户实体的多对多关系' })
  @ManyToMany(() => User, user => user.roles)
  users: User[];

  /**
   * 是否启用
   * @description 0 -> 停用
   * @description 1 -> 启用
   */
  @ApiProperty({ example: '1', description: '是否启用' })
  @Column({default: "1"})
  status: string;

  /**
   * 与权限实体的多对多关系。
   * 一个角色可以有多个权限，类型是字符串数组。
   */
  @ApiProperty({ type: () => [Permission], description: '与权限实体的多对多关系' })
  @ManyToMany(() => Permission, permission => permission.roles)
  @JoinTable()
  permissions: string[];

}
