# 🚀 Деплой на Render

## 📋 Предварительные требования

1. **Аккаунт на Render.com** (бесплатно, без карты)
2. **GitHub репозиторий** с вашим кодом
3. **Подключенный GitHub** к Render

## 🚀 Автоматический деплой (рекомендуется)

### 1. Загрузите код в GitHub:
```bash
git add .
git commit -m "Add Render deployment config"
git push origin main
```

### 2. В Render Dashboard:
1. Нажмите **"New +"**
2. Выберите **"Blueprint"**
3. Подключите ваш GitHub репозиторий
4. Выберите файл `render.yaml`
5. Нажмите **"Apply"**

Render автоматически создаст веб-сервисы!

### 3. Создайте базы данных вручную:
После создания веб-сервисов создайте базы данных:
1. **PostgreSQL:** New + → PostgreSQL → Free
2. **Redis:** New + → Redis → Free
3. **Обновите переменные окружения** в Backend сервисе

## 🔧 Ручной деплой

### 1. Backend Service:
1. **New +** → **Web Service**
2. Подключите GitHub репозиторий
3. **Root Directory:** `backend`
4. **Dockerfile Path:** `Dockerfile`
5. **Plan:** Free

### 2. WAHA Service:
1. **New +** → **Web Service**
2. Подключите GitHub репозиторий
3. **Root Directory:** `/` (корень)
4. **Dockerfile Path:** `Dockerfile.waha`
5. **Plan:** Free

### 3. PostgreSQL Database:
1. **New +** → **PostgreSQL**
2. **Name:** `pat-postgres`
3. **Plan:** Free
4. **Region:** Oregon

### 4. Redis Database:
1. **New +** → **Redis**
2. **Name:** `pat-redis`
3. **Plan:** Free
4. **Region:** Oregon

## ⚙️ Настройка переменных окружения

### Backend Service:
```
NODE_ENV=production
PORT=3000
DB_HOST=<из PostgreSQL>
DB_PORT=<из PostgreSQL>
DB_USERNAME=<из PostgreSQL>
DB_PASSWORD=<из PostgreSQL>
DB_NAME=<из PostgreSQL>
JWT_SECRET=<сгенерировать>
REDIS_URL=<из Redis>
WAHA_URL=https://pat-waha.onrender.com
```

### WAHA Service:
```
WAHA_API_URL=https://pat-waha.onrender.com
```

## 🌐 URL приложений

После деплоя получите:
- **Backend API:** `https://pat-backend.onrender.com`
- **WAHA Dashboard:** `https://pat-waha.onrender.com`
- **Swagger UI:** `https://pat-backend.onrender.com/api`

## 📊 Мониторинг

- **Логи:** Render Dashboard → Service → Logs
- **Метрики:** Render Dashboard → Service → Metrics
- **Статус:** Render Dashboard → Service → Status

## 🔄 Обновление

1. Загрузите изменения в GitHub
2. Render автоматически пересоберет и перезапустит сервисы

## ⚠️ Особенности бесплатного плана

- **Sleep Mode:** сервисы засыпают при неактивности (15 минут)
- **Cold Start:** первый запрос после сна может быть медленным
- **Ограничения:** 750 часов в месяц

## 🆘 Устранение проблем

1. **Проверьте логи** в Render Dashboard
2. **Убедитесь в правильности переменных окружения**
3. **Проверьте подключение к базам данных**

## 🎯 Тестирование

После деплоя протестируйте:
```bash
# Проверка Backend
curl https://pat-backend.onrender.com/api

# Проверка WAHA
curl https://pat-waha.onrender.com/api/sessions/default
```
