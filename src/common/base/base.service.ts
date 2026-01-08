import { Repository, In, ObjectLiteral } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class BaseService<T extends ObjectLiteral> {
  constructor(protected readonly repository: Repository<T>) {}

  /**
   * 创建实体
   * @param createDto 创建数据传输对象
   * @returns 创建的实体
   */
  async create(createDto: any): Promise<T> {
    return this.repository.save(createDto);
  }

  /**
   * 查找所有实体
   * @param filter 过滤条件
   * @returns 实体列表
   */
  async findAll(filter?: any): Promise<T[]> {
    return this.repository.find({ where: filter });
  }

  /**
   * 根据ID查找实体
   * @param id 实体ID
   * @returns 实体
   */
  async findOne(id: string): Promise<T | null> {
    return this.repository.findOne({ where: { id } as any });
  }

  /**
   * 更新实体
   * @param id 实体ID
   * @param updateDto 更新数据传输对象
   */
  async update(id: string, updateDto: any): Promise<void> {
    await this.repository.update(id, updateDto);
  }

  /**
   * 删除实体
   * @param idOrIds 实体ID或ID数组
   */
  async remove(idOrIds: string | string[]): Promise<void> {
    if (Array.isArray(idOrIds)) {
      await this.repository.delete({ id: In(idOrIds) } as any);
    } else {
      await this.repository.delete(idOrIds);
    }
  }

  /**
   * 检查实体是否存在
   * @param id 实体ID
   * @returns 是否存在
   */
  async exists(id: string): Promise<boolean> {
    const count = await this.repository.count({ where: { id } as any });
    return count > 0;
  }
}
