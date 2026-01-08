import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { UploadService } from './upload.service';
import { ApiResponseDto } from '../../common/dto/api-response.dto';

/**
 * 文件上传控制器
 */
@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * 上传单个文件
   * @param file 文件
   * @returns 文件信息
   */
  @Post('single')
  @ApiOperation({ summary: '上传单个文件' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingle(@UploadedFile() file: Express.Multer.File) {
    const result = await this.uploadService.uploadFile(file);
    return ApiResponseDto.success(result, '文件上传成功');
  }

  /**
   * 上传多个文件
   * @param files 文件数组
   * @returns 文件信息数组
   */
  @Post('multiple')
  @ApiOperation({ summary: '上传多个文件' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    const results = await this.uploadService.uploadFiles(files);
    return ApiResponseDto.success(results, '文件上传成功');
  }

  /**
   * 下载文件
   * @param filename 文件名
   * @param res 响应对象
   */
  @Get(':filename')
  @ApiOperation({ summary: '下载文件' })
  async downloadFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = this.uploadService.getFilePath(filename);
    res.download(filePath);
  }
}
