import {
  Injectable,
  BadRequestException,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { promisify } from 'util';

const generateKeyPairAsync = promisify(crypto.generateKeyPair);

interface KeyPair {
  publicKey: string;
  privateKey: string;
  createdAt: number;
}

@Injectable()
export class RsaService implements OnModuleInit {
  private currentKeyPair!: KeyPair;
  private previousKeyPair: KeyPair | null = null;
  // 一周的毫秒数
  private readonly ROTATION_INTERVAL = 7 * 24 * 60 * 60 * 1000;
  private isRotating = false;
  private readonly logger = new Logger(RsaService.name);

  async onModuleInit() {
    await this.generateKeys();
  }

  private async generateKeys() {
    try {
      const { publicKey, privateKey } = await generateKeyPairAsync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
        },
      });

      if (this.currentKeyPair) {
        this.previousKeyPair = this.currentKeyPair;
      }

      this.currentKeyPair = {
        publicKey,
        privateKey,
        createdAt: Date.now(),
      };
      this.logger.log('RSA key pair generated successfully.');
    } catch (error) {
      this.logger.error('Failed to generate RSA key pair', error);
    }
  }

  private checkAndRotateKeys() {
    if (!this.currentKeyPair) return;
    if (
      Date.now() - this.currentKeyPair.createdAt > this.ROTATION_INTERVAL &&
      !this.isRotating
    ) {
      this.isRotating = true;
      void this.generateKeys().finally(() => {
        this.isRotating = false;
      });
    }
  }

  getPublicKey(): string {
    this.checkAndRotateKeys();
    return this.currentKeyPair?.publicKey || '';
  }

  decrypt(encryptedData: string): string {
    if (!encryptedData) return encryptedData;

    try {
      return this.decryptWithKey(encryptedData, this.currentKeyPair.privateKey);
    } catch {
      if (this.previousKeyPair) {
        try {
          return this.decryptWithKey(
            encryptedData,
            this.previousKeyPair.privateKey,
          );
        } catch {
          throw new BadRequestException('加密数据解密失败');
        }
      }
      throw new BadRequestException('加密数据解密失败');
    }
  }

  private decryptWithKey(encryptedData: string, privateKey: string): string {
    const buffer = Buffer.from(encryptedData, 'base64');
    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      buffer,
    );
    return decrypted.toString('utf8');
  }
}
