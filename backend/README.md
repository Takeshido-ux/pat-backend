# Backend API

Бойлерплейт проект на NestJS с базовой аутентификацией, пользователями и Swagger документацией.

## 🚀 Возможности

- ✅ NestJS фреймворк
- ✅ TypeORM для работы с базой данных
- ✅ PostgreSQL база данных
- ✅ JWT аутентификация
- ✅ Telegram авторизация через коды
- ✅ Swagger документация
- ✅ Валидация данных
- ✅ Безопасность (Helmet, CORS)
- ✅ Структурированная архитектура

## 📋 Требования

- Node.js >= 18.0.0
- PostgreSQL >= 13.0
- npm или yarn

## 🛠️ Установка

1. **Клонируйте репозиторий:**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Установите зависимости:**
   ```bash
   npm install
   ```

3. **Настройте переменные окружения:**
   ```bash
   cp env.example .env
   ```
   
   Отредактируйте `.env` файл с вашими настройками:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=backend_db
   JWT_SECRET=your-super-secret-jwt-key
   ```

4. **Создайте базу данных PostgreSQL:**
   ```sql
   CREATE DATABASE backend_db;
   ```

5. **Запустите приложение:**
   ```bash
   # Разработка
   npm run start:dev
   
   # Продакшн
   npm run build
   npm run start:prod
   ```

## 📱 Настройка Telegram бота

Для работы авторизации через Telegram:

1. **Создайте бота:** Найдите [@BotFather](https://t.me/botfather) и создайте нового бота
2. **Получите токен:** Скопируйте токен бота из BotFather
3. **Получите Chat ID:** Напишите боту и получите ваш Chat ID через API
4. **Настройте переменные:** Добавьте в `.env`:
   ```env
   TELEGRAM_BOT_TOKEN=ваш_токен_бота
   ADMIN_TELEGRAM_CHAT_ID=ваш_chat_id
   ```

📖 **Подробная инструкция:** [TELEGRAM_SETUP.md](./TELEGRAM_SETUP.md)

> **Демо режим:** Если `TELEGRAM_BOT_TOKEN` не установлен, бот работает в демо режиме - коды выводятся в консоль.

## 💾 Хранение кодов верификации

### Варианты хранения:

1. **Redis (рекомендуется для продакшена):**
   - Установите Redis: `docker run -d -p 6379:6379 redis:alpine`
   - Добавьте `REDIS_URL=redis://localhost:6379` в `.env`
   - Коды сохраняются с TTL, автоматически удаляются

2. **В памяти (для разработки):**
   - Если `REDIS_URL` не установлен, коды хранятся в памяти
   - При перезапуске сервера коды теряются
   - Подходит только для разработки

### Преимущества Redis:
- ✅ Коды сохраняются при перезапуске сервера
- ✅ Работает с несколькими инстансами приложения
- ✅ Автоматическое удаление по TTL
- ✅ Нет утечек памяти

## 📚 API Документация

После запуска приложения документация Swagger будет доступна по адресу:
- **Swagger UI:** http://localhost:3000/api
- **JSON Schema:** http://localhost:3000/api-json

## 🔐 API Endpoints

### Аутентификация
- `POST /api/v1/auth/send-telegram-code` - Отправка кода в Telegram
- `POST /api/v1/auth/verify-telegram-code` - Проверка кода и авторизация
- `POST /api/v1/auth/profile` - Получение профиля (требует авторизации)

### Пользователи
- `GET /api/v1/users` - Получение всех пользователей (требует авторизации)
- `GET /api/v1/users/:id` - Получение пользователя по ID (требует авторизации)
- `POST /api/v1/users` - Создание пользователя (требует авторизации)
- `PATCH /api/v1/users/:id` - Обновление пользователя (требует авторизации)
- `DELETE /api/v1/users/:id` - Удаление пользователя (требует авторизации)

### Общие
- `GET /api/v1/` - Приветственное сообщение
- `GET /api/v1/health` - Проверка состояния приложения

## 🏗️ Структура проекта

```
src/
├── config/           # Конфигурационные файлы
├── controllers/      # Контроллеры (не используется в текущей структуре)
├── dto/             # Data Transfer Objects
├── entities/        # TypeORM сущности
├── filters/         # Exception filters
├── guards/          # Auth guards
├── interceptors/    # Interceptors
├── modules/         # NestJS модули
│   ├── auth/       # Модуль аутентификации
│   └── users/      # Модуль пользователей
├── pipes/          # Validation pipes
├── services/       # Сервисы (не используется в текущей структуре)
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```

## 🧪 Тестирование

```bash
# Unit тесты
npm run test

# E2E тесты
npm run test:e2e

# Тесты с покрытием
npm run test:cov
```

## 📝 Скрипты

- `npm run build` - Сборка проекта
- `npm run start` - Запуск в продакшн режиме
- `npm run start:dev` - Запуск в режиме разработки
- `npm run start:debug` - Запуск в режиме отладки
- `npm run lint` - Проверка кода линтером
- `npm run format` - Форматирование кода

## 🔒 Безопасность

- JWT токены для аутентификации
- Хеширование паролей с bcrypt
- Helmet для безопасности HTTP заголовков
- CORS настройки
- Валидация входящих данных

## 🌍 Переменные окружения

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `PORT` | Порт приложения | 3000 |
| `NODE_ENV` | Окружение | development |
| `DB_HOST` | Хост базы данных | localhost |
| `DB_PORT` | Порт базы данных | 5432 |
| `DB_USERNAME` | Имя пользователя БД | postgres |
| `DB_PASSWORD` | Пароль БД | password |
| `DB_NAME` | Имя базы данных | backend_db |
| `JWT_SECRET` | Секретный ключ JWT | - |
| `JWT_EXPIRES_IN` | Время жизни токена | 24h |
| `CORS_ORIGIN` | CORS origin | http://localhost:3000 |
| `TELEGRAM_BOT_TOKEN` | Токен Telegram бота | - |
| `ADMIN_TELEGRAM_CHAT_ID` | Chat ID администратора | - |
| `REDIS_URL` | URL Redis для хранения кодов | redis://localhost:6379 |

## 📄 Лицензия

MIT License
