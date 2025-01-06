import {
  Injectable,
  LoggerService as CommonLoggerService,
} from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class LoggerService implements CommonLoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    const isDevelopment = process.env.NODE_ENV === 'development'; // 检查当前环境是否为生产环境

    const transports = [
      new winston.transports.Console(), // 始终在控制台输出日志
    ];

    // 如果是生产环境，添加文件日志记录
    if (!isDevelopment) {
      const fileTransport = new winston.transports.File({
        filename: '/logs/node-logs/node-app.log', // 日志文件路径
      });
      // @ts-ignore
      transports.push(fileTransport);
    }

    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.colorize(), // 添加颜色
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // 设置时间格式
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]: ${message}`;
        }),
      ),
      transports: transports,
    });
  }

  log(...args: any[]) {
    this.logger.info(this.joinLog(args));
  }

  error(...args: any[]) {
    this.logger.error(args);
  }

  warn(...args: any[]) {
    this.logger.info(this.joinLog(args));
  }

  info(...args: any[]) {
    this.logger.info(this.joinLog(args));
  }

  /**
   * 使用 join() 将所有参数转换成字符串并用空格隔开
   * @param args
   * @returns
   */
  joinLog(args) {
    return args
      .map((arg) =>
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg),
      )
      .join(' ');
  }
}
