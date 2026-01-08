import {
  Injectable,
  LoggerService as CommonLoggerService,
} from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class LoggerService implements CommonLoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const logLevel = process.env.LOG_LEVEL || 'info';
    const logFilePath = process.env.LOG_FILE_PATH || './logs/app.log';

    const transports: winston.transport[] = [
      new winston.transports.Console(), // 始终在控制台输出日志
    ];

    // 如果是生产环境，添加文件日志记录
    if (!isDevelopment) {
      const fileTransport = new winston.transports.File({
        filename: logFilePath,
        maxsize: 10 * 1024 * 1024, // 10MB
        maxFiles: 5, // 保留5个日志文件
      });
      transports.push(fileTransport);
    }

    this.logger = winston.createLogger({
      level: logLevel,
      format: winston.format.combine(
        winston.format.colorize(), // 添加颜色
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // 设置时间格式
        winston.format.printf(
          ({ timestamp, level, message, context, stack }) => {
            const contextStr = context ? `[${context}]` : '';
            const stackStr = stack ? `\n${stack}` : '';
            return `${timestamp} ${level} ${contextStr}: ${message}${stackStr}`;
          },
        ),
      ),
      transports: transports,
    });
  }

  /**
   * 记录普通日志
   * @param args 日志参数
   */
  log(...args: any[]) {
    this.logger.info(this.joinLog(args));
  }

  /**
   * 记录错误日志
   * @param args 日志参数
   */
  error(...args: any[]) {
    const message = this.joinLog(args);
    const stack = args.find((arg) => arg instanceof Error)?.stack;
    this.logger.error(message, { stack });
  }

  /**
   * 记录警告日志
   * @param args 日志参数
   */
  warn(...args: any[]) {
    this.logger.warn(this.joinLog(args));
  }

  /**
   * 记录信息日志
   * @param args 日志参数
   */
  info(...args: any[]) {
    this.logger.info(this.joinLog(args));
  }

  /**
   * 记录调试日志
   * @param args 日志参数
   */
  debug(...args: any[]) {
    this.logger.debug(this.joinLog(args));
  }

  /**
   * 使用 join() 将所有参数转换成字符串并用空格隔开
   * @param args 参数数组
   * @returns 拼接后的字符串
   */
  private joinLog(args: any[]): string {
    return args
      .map((arg) =>
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg),
      )
      .join(' ');
  }
}
