/**
 * 安全配置文件
 * 包含 Helmet、CORS、限流等安全相关配置
 */

export const securityConfig = {
  // Helmet 安全头配置
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: false,
  },

  // CORS 配置
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:8000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },

  // API 限流配置
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL || '60', 10),
    limit: parseInt(process.env.THROTTLE_LIMIT || '10', 10),
  },

  // 压缩配置
  compression: {
    threshold: 1024, // 只压缩大于 1KB 的响应
    level: 6, // 压缩级别 0-9
  },
};
