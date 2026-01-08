import * as bcrypt from 'bcrypt';

/**
 * 密码加密工具类
 * 使用bcrypt进行单向哈希加密，不可逆
 */
export class PasswordUtil {
  // 加密轮数，数值越大越安全但性能越低
  private static readonly SALT_ROUNDS = 10;

  /**
   * 对密码进行哈希加密
   * @param password 明文密码
   * @returns 加密后的密码哈希值
   */
  static async hash(password: string): Promise<string> {
    if (!password) {
      throw new Error('密码不能为空');
    }
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * 验证密码是否匹配
   * @param password 明文密码
   * @param hashedPassword 加密后的密码哈希值
   * @returns 是否匹配
   */
  static async compare(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    if (!password || !hashedPassword) {
      return false;
    }
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * 生成随机密码
   * @param length 密码长度，默认12位
   * @returns 随机密码
   */
  static generateRandomPassword(length: number = 12): string {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }
}
