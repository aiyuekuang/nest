import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ValidationException } from '../../common/exceptions/custom.exception';

/**
 * 文件上传服务
 */
@Injectable()
export class UploadService {
  private readonly uploadDir: string;
  private readonly maxFileSize: number;
  private readonly allowedMimeTypes: string[];

  constructor() {
    this.uploadDir = './uploads';
    this.maxFileSize = 10 * 1024 * 1024; // 10MB
    this.allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    // 确保上传目录存在
    this.ensureUploadDir();
  }

  /**
   * 确保上传目录存在
   */
  private ensureUploadDir() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * 验证文件
   * @param file 文件对象
   */
  private validateFile(file: Express.Multer.File) {
    // 验证文件大小
    if (file.size > this.maxFileSize) {
      throw new ValidationException(
        `文件大小超过限制，最大允许${this.maxFileSize / 1024 / 1024}MB`,
      );
    }

    // 验证文件类型
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new ValidationException(
        `不支持的文件类型: ${file.mimetype}`,
      );
    }
  }

  /**
   * 上传单个文件
   * @param file 文件对象
   * @returns 文件信息
   */
  async uploadFile(file: Express.Multer.File): Promise<{
    filename: string;
    originalName: string;
    path: string;
    size: number;
    mimetype: string;
  }> {
    this.validateFile(file);

    // 生成唯一文件名
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    const filePath = path.join(this.uploadDir, filename);

    // 保存文件
    fs.writeFileSync(filePath, file.buffer);

    return {
      filename,
      originalName: file.originalname,
      path: filePath,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  /**
   * 上传多个文件
   * @param files 文件数组
   * @returns 文件信息数组
   */
  async uploadFiles(files: Express.Multer.File[]): Promise<any[]> {
    const results = [];

    for (const file of files) {
      const result = await this.uploadFile(file);
      results.push(result);
    }

    return results;
  }

  /**
   * 删除文件
   * @param filename 文件名
   */
  async deleteFile(filename: string): Promise<void> {
    const filePath = path.join(this.uploadDir, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  /**
   * 获取文件
   * @param filename 文件名
   * @returns 文件路径
   */
  getFilePath(filename: string): string {
    return path.join(this.uploadDir, filename);
  }
}
