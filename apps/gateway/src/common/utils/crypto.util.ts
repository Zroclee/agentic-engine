import * as crypto from 'crypto';
import { BadRequestException } from '@nestjs/common';

export class CryptoUtil {
  private static readonly algorithm = 'aes-256-gcm';
  // 在实际生产中，请确保将此密钥存储在环境变量中
  private static readonly secretKey =
    process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef';

  /**
   * 使用 AES-256-GCM 加密文本
   * @param text 需要加密的明文
   * @returns 加密后的密文 (iv:authTag:encrypted)
   */
  static encrypt(text: string): string {
    if (!text) return text;
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(
        this.algorithm,
        Buffer.from(this.secretKey, 'utf8'),
        iv,
      );
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      const authTag = cipher.getAuthTag().toString('hex');
      return `${iv.toString('hex')}:${authTag}:${encrypted}`;
    } catch (e) {
      console.error('Encryption failed', e);
      throw new BadRequestException('数据加密失败');
    }
  }

  /**
   * 使用 AES-256-GCM 解密文本
   * @param hash 加密后的密文 (iv:authTag:encrypted)
   * @returns 解密后的明文
   */
  static decrypt(hash: string): string {
    if (!hash) return hash;
    try {
      const parts = hash.split(':');
      if (parts.length !== 3) return hash;
      const iv = Buffer.from(parts[0], 'hex');
      const authTag = Buffer.from(parts[1], 'hex');
      const encryptedText = Buffer.from(parts[2], 'hex');
      const decipher = crypto.createDecipheriv(
        this.algorithm,
        Buffer.from(this.secretKey, 'utf8'),
        iv,
      );
      decipher.setAuthTag(authTag);
      let decrypted = decipher.update(encryptedText).toString('utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (e) {
      console.error('Decryption failed', e);
      throw new BadRequestException('数据解密失败');
    }
  }
}
