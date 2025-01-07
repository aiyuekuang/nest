import * as CryptoJS from 'crypto-js';

/**
 * 使用密钥加密给定的明文。
 * @param plaintext - 要加密的文本。
 * @param secretKey - 用于加密的密钥。
 * @returns 加密后的文本。
 */
export function encrypt(plaintext: string, secretKey: string): string {
  if(!plaintext){
    return "";
  }
  return CryptoJS.AES.encrypt(plaintext, secretKey).toString();
}

/**
 * 使用密钥解密给定的密文。
 * @param ciphertext - 要解密的文本。
 * @param secretKey - 用于解密的密钥。
 * @returns 解密后的文本。
 */
export function decrypt(ciphertext: string, secretKey: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}
