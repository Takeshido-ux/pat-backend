export const WHATSAPP_MESSAGES = {
  // Сообщения для отправки кодов
  VERIFICATION_CODE: {
    TITLE: '🔐 Код подтверждения',
    CODE_LABEL: 'Ваш код:',
    EXPIRES_LABEL: 'Действителен до:',
    INSTRUCTION: 'Введите этот код для завершения авторизации.',
  },

  // Сообщения об успехе
  SUCCESS: {
    CODE_SENT: (phoneNumber: string) => `Код отправлен в WhatsApp на номер ${phoneNumber}`,
    CODE_VERIFIED: 'Код подтвержден',
    REDIS_CONNECTED: 'Redis подключен успешно',
    WAHA_INITIALIZED: 'WAHA клиент инициализирован',
    WAHA_SESSION_STARTED: 'WAHA сессия запущена',
    WAHA_SESSION_ACTIVE: 'WAHA сессия уже активна',
    REDIS_DISCONNECTED: 'Redis соединение закрыто',
  },

  // Сообщения об ошибках
  ERRORS: {
    REDIS_CONNECTION_FAILED: 'Не удалось подключиться к Redis. Убедитесь, что Redis запущен.',
    REDIS_SAVE_FAILED: 'Не удалось сохранить код в Redis',
    REDIS_GET_FAILED: 'Не удалось получить код из Redis',
    REDIS_DELETE_FAILED: 'Не удалось удалить код из Redis',
    CODE_SEND_FAILED: 'Ошибка отправки кода',
    WHATSAPP_SEND_FAILED: 'Сообщение не было отправлено',
    CODE_NOT_FOUND: 'Код не найден или истек',
    CODE_EXPIRED: 'Код истек',
    INVALID_CODE: 'Неверный код',
    REDIS_DISCONNECT_FAILED: 'Ошибка закрытия Redis соединения',
  },

  // Логи
  LOGS: {
    CODE_SENT_TO_USER: (phoneNumber: string) => `Код отправлен пользователю ${phoneNumber} через WhatsApp`,
    REDIS_CONNECTION_ERROR: 'Ошибка подключения к Redis:',
    WAHA_SESSION_ERROR: 'Ошибка проверки WAHA сессии:',
    REDIS_SAVE_ERROR: 'Ошибка сохранения в Redis:',
    REDIS_GET_ERROR: 'Ошибка получения из Redis:',
    REDIS_DELETE_ERROR: 'Ошибка удаления из Redis:',
    WHATSAPP_SEND_ERROR: 'Ошибка отправки в WhatsApp:',
    CODE_GENERATION_ERROR: 'Ошибка генерации кода:',
    WHATSAPP_MESSAGE_ERROR: 'Ошибка отправки WhatsApp сообщения:',
    REDIS_DISCONNECT_ERROR: 'Ошибка закрытия Redis соединения:',
  },

  // Fallback сообщения
  FALLBACK: {
    MANUAL_CODE: (phoneNumber: string, code: string) => `Код для ${phoneNumber}: ${code} (отправьте вручную)`,
  },
} as const;

export const WHATSAPP_CONFIG = {
  SESSION_ID: 'default',
  DEFAULT_REDIS_URL: 'redis://localhost:6379',
  DEFAULT_WAHA_URL: 'http://localhost:3001',
  CODE_EXPIRY_MINUTES: 5,
} as const;

export const API_MESSAGES = {
  // Описания API операций
  OPERATIONS: {
    SEND_CODE: 'Send verification code',
    VERIFY_CODE: 'Verify code and login',
    GET_PROFILE: 'Get user profile',
  },

  // Описания API ответов
  RESPONSES: {
    CODE_SENT: 'Code sent successfully',
    LOGIN_SUCCESS: 'Login successful',
    USER_PROFILE: 'User profile',
    BAD_REQUEST: 'Bad request',
    INVALID_CODE: 'Invalid code',
  },
} as const;
