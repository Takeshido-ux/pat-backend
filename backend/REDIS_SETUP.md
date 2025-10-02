# Настройка Redis и WAHA

## Обзор
Приложение теперь использует Redis для хранения кодов верификации и WAHA для отправки кодов через WhatsApp. Локальное хранение кодов в памяти полностью удалено.

WAHA (WhatsApp HTTP API) используется для отправки кодов верификации через WhatsApp вместо Telegram.

## Запуск с Docker Compose

1. Убедитесь, что Docker и Docker Compose установлены
2. Запустите все сервисы:
```bash
docker-compose up -d
```

Это запустит:
- PostgreSQL (порт 5432)
- PgAdmin (порт 5050)
- Redis (порт 6379)
- WAHA WhatsApp API (порт 3001)

## Настройка переменных окружения

Скопируйте `env.example` в `.env` и настройте:

```bash
cp env.example .env
```

Обязательные настройки:
- `REDIS_URL=redis://localhost:6379` - URL подключения к Redis
- `WAHA_URL=http://localhost:3001` - URL WAHA API
- `ADMIN_WHATSAPP_PHONE` - номер телефона администратора для получения кодов (формат: +1234567890)

## Проверка работы сервисов

### Redis
После запуска Docker Compose, Redis будет доступен на `localhost:6379`.

Для проверки подключения:
```bash
# Подключение к Redis CLI
docker exec -it backend_redis redis-cli

# Проверка статуса
ping
# Должен вернуть PONG
```

### WAHA WhatsApp API
WAHA будет доступен на `localhost:3001`.

Для проверки работы:
```bash
# Проверка статуса API
curl http://localhost:3001/api/health

# Просмотр документации API
# Откройте в браузере: http://localhost:3001
```

WAHA позволяет:
- Подключать WhatsApp аккаунты через QR-код
- Отправлять и получать сообщения
- Управлять сессиями WhatsApp
- Отправлять коды верификации администратору

## Настройка WhatsApp

1. Откройте веб-интерфейс WAHA: http://localhost:3001
2. Создайте новую сессию с именем `default`
3. Отсканируйте QR-код вашим WhatsApp
4. Убедитесь, что сессия активна (статус: STARTED)

## Особенности

- Все коды верификации хранятся только в Redis
- Коды автоматически удаляются по истечении TTL (5 минут)
- При отсутствии Redis приложение не запустится (нет fallback на память)
- Redis настроен с персистентностью данных (AOF)
- Коды отправляются через WhatsApp вместо Telegram
- WAHA автоматически управляет WhatsApp сессиями

## Устранение проблем

Если приложение не запускается:
1. Убедитесь, что Redis запущен: `docker-compose ps`
2. Проверьте логи Redis: `docker-compose logs redis`
3. Убедитесь, что порт 6379 свободен
4. Проверьте настройки в `.env` файле

Если WhatsApp не работает:
1. Убедитесь, что WAHA запущен: `docker-compose logs waha`
2. Проверьте статус сессии: `curl http://localhost:3001/api/sessions/verification-session`
3. Убедитесь, что WhatsApp аккаунт подключен через QR-код
4. Проверьте правильность номера администратора в `ADMIN_WHATSAPP_PHONE`