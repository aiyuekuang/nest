import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T = any> {
  @ApiProperty({ description: '响应状态码', example: 200 })
  code: number;

  @ApiProperty({ description: '响应数据' })
  data: T;

  @ApiProperty({ description: '响应消息', example: '成功' })
  message: string;

  @ApiProperty({ description: '响应时间戳' })
  timestamp: string;

  constructor(code: number, data: T, message: string) {
    this.code = code;
    this.data = data;
    this.message = message;
    this.timestamp = new Date().toISOString();
  }

  /**
   * 成功响应
   * @param data 响应数据
   * @param message 响应消息
   * @returns ApiResponseDto
   */
  static success<T>(data: T, message = '成功'): ApiResponseDto<T> {
    return new ApiResponseDto(200, data, message);
  }

  /**
   * 错误响应
   * @param message 错误消息
   * @param code 错误码
   * @returns ApiResponseDto
   */
  static error(message: string, code = -1): ApiResponseDto<null> {
    return new ApiResponseDto(code, null, message);
  }

  /**
   * 分页响应
   * @param data 数据列表
   * @param total 总数
   * @param pageIndex 当前页
   * @param pageSize 每页数量
   * @param message 响应消息
   * @returns ApiResponseDto
   */
  static paginate<T>(
    data: T[],
    total: number,
    pageIndex: number,
    pageSize: number,
    message = '成功'
  ): ApiResponseDto<{
    data: T[];
    total: number;
    pageIndex: number;
    pageSize: number;
  }> {
    return new ApiResponseDto(200, {
      data,
      total,
      pageIndex,
      pageSize,
    }, message);
  }
}