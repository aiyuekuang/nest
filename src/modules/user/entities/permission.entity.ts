// entities/permission.entity.ts
import { Entity, Column, ManyToMany, Tree, TreeParent, TreeChildren } from 'typeorm';

import { BaseEntity } from '../../../utils/base.entity';
import { Role } from './role.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Optional } from "@nestjs/common";
import { IsOptional } from "class-validator";

/**
 * 权限实体，表示系统中的一个权限。
 */
@Entity()
@Tree("closure-table")
export class Permission extends BaseEntity {
  /**
   * 权限名称。
   */
  @ApiProperty({ example: 'READ_PRIVILEGES', description: '权限名称' })
  @Column()
  name: string;

  /**
   * 权限点标识。
   */
  @ApiProperty({ example: 'read_privileges', description: '权限点标识' })
  @Column()
  sign: string;

  /**
   * 父ID，非必填
   */
  @ApiProperty({ example: '0', description: '父ID' })
  @Column({ nullable: true })
  parentId: string;

  @TreeParent()
  parent: Permission;

  @TreeChildren()
  children: Permission[];

  /**
   * 与角色实体的多对多关系。
   * 一个权限可以分配给多个角色。
   */
  @ApiProperty({ type: () => [Role], description: '与角色实体的多对多关系' })
  @ManyToMany(() => Role, role => role.permissions)
  roles: Role[];

  /**
   * 排序字段。
   */
  @ApiProperty({ example: 1, description: '排序字段' })
  @Column()
  sort: number;
}
