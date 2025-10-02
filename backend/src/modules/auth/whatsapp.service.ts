import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import axios from 'axios';
import { createClient, RedisClientType } from 'redis';
import { WHATSAPP_MESSAGES, WHATSAPP_CONFIG } from './constants/messages';

// Интерфейсы для WAHA API
interface WahaSessionResponse {
  status: 'STARTED' | 'STOPPED' | 'FAILED';
  sessionId: string;
}

interface WahaSendMessageResponse {
  sent: boolean;
  messageId?: string;
  error?: string;
}

@Injectable()
export class WhatsAppService implements OnModuleDestroy {
  private readonly logger = new Logger(WhatsAppService.name);
  private wahaClient: ReturnType<typeof axios.create>;
  private redisClient: RedisClientType;
  private sessionId = WHATSAPP_CONFIG.SESSION_ID;

  constructor() {
    this.initializeRedis();
    this.initializeWAHA();
  }

  private async initializeRedis() {
    const redisUrl = process.env.REDIS_URL || WHATSAPP_CONFIG.DEFAULT_REDIS_URL;
    
    try {
      this.redisClient = createClient({ url: redisUrl });
      await this.redisClient.connect();
      this.logger.log(WHATSAPP_MESSAGES.SUCCESS.REDIS_CONNECTED);
    } catch (error) {
      this.logger.error(WHATSAPP_MESSAGES.LOGS.REDIS_CONNECTION_ERROR, error);
      throw new Error(WHATSAPP_MESSAGES.ERRORS.REDIS_CONNECTION_FAILED);
    }
  }

  private initializeWAHA() {
    const wahaUrl = process.env.WAHA_URL || WHATSAPP_CONFIG.DEFAULT_WAHA_URL;
    
    this.wahaClient = axios.create({
      baseURL: wahaUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.logger.log(WHATSAPP_MESSAGES.SUCCESS.WAHA_INITIALIZED);
    this.ensureSession();
  }

  private async ensureSession() {
    try {
      // Проверяем существование сессии
      const response = await this.wahaClient.get<WahaSessionResponse>(`/api/sessions/${this.sessionId}`);
      
      const data = response.data as WahaSessionResponse;
      if (data.status === 'STOPPED') {
        // Запускаем сессию если она остановлена
        await this.wahaClient.post(`/api/sessions/${this.sessionId}/start`);
        this.logger.log(WHATSAPP_MESSAGES.SUCCESS.WAHA_SESSION_STARTED);
      } else {
        this.logger.log(WHATSAPP_MESSAGES.SUCCESS.WAHA_SESSION_ACTIVE);
      }
    } catch (error: any) {
      this.logger.warn(WHATSAPP_MESSAGES.LOGS.WAHA_SESSION_ERROR, error.message);
      // В демо режиме продолжаем работу
    }
  }

  // Сохранение кода в Redis
  private async saveVerificationCode(phoneNumber: string, code: string, expiresAt: Date): Promise<void> {
    const codeData = JSON.stringify({ code, expiresAt: expiresAt.toISOString() });
    const ttlSeconds = Math.floor((expiresAt.getTime() - Date.now()) / 1000);

    try {
      await this.redisClient.setEx(`telegram_code:${phoneNumber}`, ttlSeconds, codeData);
    } catch (error) {
      this.logger.error(WHATSAPP_MESSAGES.LOGS.REDIS_SAVE_ERROR, error);
      throw new Error(WHATSAPP_MESSAGES.ERRORS.REDIS_SAVE_FAILED);
    }
  }

  // Получение кода из Redis
  private async getVerificationCode(phoneNumber: string): Promise<{ code: string; expiresAt: Date } | null> {
    try {
      const codeData = await this.redisClient.get(`telegram_code:${phoneNumber}`);
      if (!codeData) return null;
      
      const parsed = JSON.parse(codeData as string);
      return {
        code: parsed.code,
        expiresAt: new Date(parsed.expiresAt)
      };
    } catch (error) {
      this.logger.error(WHATSAPP_MESSAGES.LOGS.REDIS_GET_ERROR, error);
      throw new Error(WHATSAPP_MESSAGES.ERRORS.REDIS_GET_FAILED);
    }
  }

  // Удаление кода из Redis
  private async deleteVerificationCode(phoneNumber: string): Promise<void> {
    try {
      await this.redisClient.del(`telegram_code:${phoneNumber}`);
    } catch (error) {
      this.logger.error(WHATSAPP_MESSAGES.LOGS.REDIS_DELETE_ERROR, error);
      throw new Error(WHATSAPP_MESSAGES.ERRORS.REDIS_DELETE_FAILED);
    }
  }

  async sendVerificationCode(phoneNumber: string): Promise<{ success: boolean; message: string }> {
    try {
      // Генерируем 6-значный код
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Сохраняем код с временем истечения
      const expiresAt = new Date(Date.now() + WHATSAPP_CONFIG.CODE_EXPIRY_MINUTES * 60 * 1000);
      await this.saveVerificationCode(phoneNumber, code, expiresAt);

      // Отправляем сообщение пользователю через WhatsApp
      const message = `${WHATSAPP_MESSAGES.VERIFICATION_CODE.TITLE}\n\n` +
                     `${WHATSAPP_MESSAGES.VERIFICATION_CODE.CODE_LABEL} ${code}\n` +
                     `${WHATSAPP_MESSAGES.VERIFICATION_CODE.EXPIRES_LABEL} ${expiresAt.toLocaleString('ru-RU')}\n\n` +
                     `${WHATSAPP_MESSAGES.VERIFICATION_CODE.INSTRUCTION}`;

      try {
        await this.sendWhatsAppMessage(phoneNumber, message);
        this.logger.log(WHATSAPP_MESSAGES.LOGS.CODE_SENT_TO_USER(phoneNumber));
        
        return {
          success: true,
          message: WHATSAPP_MESSAGES.SUCCESS.CODE_SENT(phoneNumber)
        };
      } catch (whatsappError) {
        this.logger.error(WHATSAPP_MESSAGES.LOGS.WHATSAPP_SEND_ERROR, whatsappError);
        
        // Fallback: возвращаем код для ручной отправки
        return {
          success: true,
          message: WHATSAPP_MESSAGES.FALLBACK.MANUAL_CODE(phoneNumber, code)
        };
      }
    } catch (error) {
      this.logger.error(WHATSAPP_MESSAGES.LOGS.CODE_GENERATION_ERROR, error);
      return {
        success: false,
        message: WHATSAPP_MESSAGES.ERRORS.CODE_SEND_FAILED
      };
    }
  }

  private async sendWhatsAppMessage(phoneNumber: string, message: string): Promise<void> {
    try {
      // Форматируем номер телефона для WhatsApp (убираем + и добавляем @c.us)
      const formattedPhone = phoneNumber.replace('+', '') + '@c.us';
      
      const response = await this.wahaClient.post<WahaSendMessageResponse>(`/api/sendText`, {
        session: this.sessionId,
        chatId: formattedPhone,
        text: message,
        reply_to: null,
        linkPreview: true,
        linkPreviewHighQuality: false,
      });

      const data = response.data as any;
      // WAHA возвращает объект с данными сообщения, проверяем наличие ID сообщения
      if (data.id && data.fromMe === true) {
        this.logger.log(`WhatsApp сообщение отправлено на ${phoneNumber}`);
      } else {
        throw new Error(WHATSAPP_MESSAGES.ERRORS.WHATSAPP_SEND_FAILED);
      }
    } catch (error: any) {
      this.logger.error(WHATSAPP_MESSAGES.LOGS.WHATSAPP_MESSAGE_ERROR, error);
      throw error;
    }
  }

  async verifyCode(phoneNumber: string, code: string): Promise<{ valid: boolean; message: string }> {
    const stored = await this.getVerificationCode(phoneNumber);
    
    if (!stored) {
      return {
        valid: false,
        message: WHATSAPP_MESSAGES.ERRORS.CODE_NOT_FOUND
      };
    }

    if (new Date() > stored.expiresAt) {
      await this.deleteVerificationCode(phoneNumber);
      return {
        valid: false,
        message: WHATSAPP_MESSAGES.ERRORS.CODE_EXPIRED
      };
    }

    if (stored.code !== code) {
      return {
        valid: false,
        message: WHATSAPP_MESSAGES.ERRORS.INVALID_CODE
      };
    }

    // Удаляем использованный код
    await this.deleteVerificationCode(phoneNumber);
    
    return {
      valid: true,
      message: WHATSAPP_MESSAGES.SUCCESS.CODE_VERIFIED
    };
  }

  // Метод для получения кода администратором (для тестирования)
  async getCodeForAdmin(phoneNumber: string): Promise<string | null> {
    const stored = await this.getVerificationCode(phoneNumber);
    return stored ? stored.code : null;
  }

  // Закрытие соединения с Redis при завершении работы
  async onModuleDestroy() {
    try {
      await this.redisClient.quit();
      this.logger.log(WHATSAPP_MESSAGES.SUCCESS.REDIS_DISCONNECTED);
    } catch (error) {
      this.logger.error(WHATSAPP_MESSAGES.LOGS.REDIS_DISCONNECT_ERROR, error);
    }
  }
}
