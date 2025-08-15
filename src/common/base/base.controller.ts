import { Body, Controller, Post, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseService } from './base.service';
import { BaseRequestDto } from '../../utils/baseReq.dto';
import { BaseResponseDto } from '../../utils/baseRes.dto';

@ApiTags('base')
export abstract class BaseController<T, CreateDto, UpdateDto, ResponseDto> {
  constructor(
    protected readonly baseService: BaseService<T>,
    protected readonly responseDtoClass: new (data: any) => ResponseDto
  ) {}

  /**
   * 创建实体
   * @param createDto 创建数据传输对象
   */
  @Post('create')
  @ApiOperation({ summary: '创建实体' })
  @ApiResponse({ status: 201, description: '实体已成功创建。' })
  async create(@Body() createDto: CreateDto): Promise<void> {
    return await this.baseService.create(createDto);
  }

  /**
   * 查找所有实体
   * @param filter 过滤条件
   * @returns 实体列表
   */
  @Post('findAll')
  @ApiOperation({ summary: '查找所有实体' })
  @ApiResponse({ status: 200, description: '返回所有实体。' })
  async findAll(@Body() filter: BaseRequestDto): Promise<ResponseDto[]> {
    const entities = await this.baseService.findAll(filter);
    return entities.map(entity => new this.responseDtoClass(entity));
  }

  /**
   * 根据ID查找实体
   * @param id 实体ID
   * @returns 实体
   */
  @Post('findOne/:id')
  @ApiOperation({ summary: '根据ID查找实体' })
  @ApiResponse({ status: 200, description: '返回指定实体。' })
  async findOne(@Param('id') id: string): Promise<ResponseDto> {
    const entity = await this.baseService.findOne(id);
    return new this.responseDtoClass(entity);
  }

  /**
   * 更新实体
   * @param id 实体ID
   * @param updateDto 更新数据传输对象
   */
  @Post('update/:id')
  @ApiOperation({ summary: '更新实体' })
  @ApiResponse({ status: 200, description: '实体已成功更新。' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateDto): Promise<void> {
    return await this.baseService.update(id, updateDto);
  }

  /**
   * 删除实体
   * @param id 实体ID
   */
  @Delete('remove/:id')
  @ApiOperation({ summary: '删除实体' })
  @ApiResponse({ status: 200, description: '实体已成功删除。' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.baseService.remove(id);
  }
}