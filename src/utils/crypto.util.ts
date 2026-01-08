import * as CryptoJS from 'crypto-js';
import baseConfig from '../config/base.config';

/**
 * 加密解密工具类
 * 使用 AES 对称加密算法
 */
export class CryptoUtil {
  /**
   * AES 解密
   * @param ciphertext - 加密后的密文
   * @param secretKey - 解密密钥，默认使用配置文件中的密钥
   * @returns 解密后的明文
   */
  static decrypt(ciphertext: string, secretKey?: string): string {
    if (!ciphertext) {
      return '';
    }

    try {
      const key = secretKey || baseConfig.password?.secret || 'zt_secret';
      const bytes = CryptoJS.AES.decrypt(ciphertext, key);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);

      if (!decrypted) {
        throw new Error('解密失败：无法解析密文');
      }

      return decrypted;
    } catch (err: any) {
      throw new Error(`解密失败: ${err.message}`);
    }
  }

  /**
   * AES 加密
   * @param plaintext - 明文
   * @param secretKey - 加密密钥，默认使用配置文件中的密钥
   * @returns 加密后的密文
   */
  static encrypt(plaintext: string, secretKey?: string): string {
    if (!plaintext) {
      return '';
    }

    try {
      const key = secretKey || baseConfig.password?.secret || 'zt_secret';
      return CryptoJS.AES.encrypt(plaintext, key).toString();
    } catch (err: any) {
      throw new Error(`加密失败: ${err.message}`);
    }
  }
}
