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

/**
 * 从请求中提取token字符串。
 * @param req - 请求对象。
 * @param cache - 缓存对象。
 * @param isAll - 是否获取所有token，是就是数组，否就是字符串
 * @returns token字符串。
 */
export async function getAuthToken(req:any,cache:any,isAll = false): Promise<string | undefined> {
  const [type, tokenStr] = req.headers.authorization?.split(" ") ?? []; // 从请求头中提取token类型和token字符串


  if (!type || !tokenStr) {
    return undefined; // 如果没有token类型或token字符串，返回undefined
  }
  if (type === "Bearer") {
    // 从缓存中获取token
    const userKeys = await cache.store.keys(`${tokenStr}-*`);
    if (userKeys && userKeys.length) {
      if(isAll){
        return userKeys
      }else {
        return userKeys[0]; // 返回用户信息
      }
    }
  }
  return undefined
}
