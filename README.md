# ERP System Demo

A web-based ERP (Enterprise Resource Planning) system built with HTML, CSS, JavaScript, Node.js, Express, and SQLite.

## Features

- **Dashboard**: Overview of key metrics and recent activities
- **Inventory Management**: Track stock levels and manage inventory transactions
- **Product Management**: Add, edit, and delete products
- **Supplier Management**: Manage supplier information
- **Order Management**: Create and track customer orders
- **User Authentication**: Secure login system

## System Requirements

- Node.js (v14 or higher)
- NPM (v6 or higher)

## Installation

1. Clone the repository or download the source code
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

## Running the Application

Start the server:

```bash
npm start
```

The application will be available at http://localhost:3000

## Default Login Credentials

- **Username**: admin
- **Password**: admin

## Project Structure

- `server.js`: Main server file with Express configuration and API routes
- `public/`: Frontend files
  - `index.html`: Login page
  - `dashboard.html`: Main dashboard
  - `products.html`: Product management
  - `suppliers.html`: Supplier management
  - `inventory.html`: Inventory management
  - `purchase-orders.html`: Order management
  - `css/`: Stylesheet files
  - `js/`: JavaScript files for frontend functionality
- `database.db`: SQLite database file (created automatically on first run)

## API Endpoints

- `/api/login`: User authentication
- `/api/logout`: User logout
- `/api/user`: Get current user information
- `/api/products`: Product CRUD operations
- `/api/suppliers`: Supplier CRUD operations
- `/api/orders`: Order CRUD operations
- `/api/transactions`: Inventory transaction operations
- `/api/dashboard`: Dashboard data

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: SQLite
- **Authentication**: Express Session

## Mobile Responsiveness

The application is designed to be responsive and work on various screen sizes, including mobile devices.

## Security Features

- Session-based authentication
- Password protection
- Role-based access control

# Руководство по деплою ERP-системы на Render

Это руководство поможет вам развернуть вашу ERP-систему на платформе Render.

## Предварительные требования

1. Учетная запись на [Render](https://render.com/)
2. Репозиторий GitHub (или GitLab), содержащий ваш проект
3. Базовые знания Git

## Шаг 1: Регистрация на Render

1. Перейдите на [Render](https://render.com/)
2. Нажмите "Get Started" и зарегистрируйтесь с помощью GitHub, GitLab или электронной почты
3. Подтвердите вашу учетную запись по электронной почте

## Шаг 2: Подготовка проекта для деплоя

Ваш проект уже имеет необходимые файлы для деплоя:
- `package.json` с зависимостями
- `server.js` как основной файл сервера
- Скрипты запуска в package.json

### Важно: Подготовка базы данных для Render

Перед деплоем рекомендуется выполнить подготовку проекта для работы с постоянным хранилищем Render. Для этого выполните следующие шаги:

1. В корне проекта создан файл `render-setup.js`, который автоматически настраивает пути к базе данных для работы с Render Disk
2. Запустите скрипт подготовки:
   ```
   node render-setup.js
   ```
3. Добавьте обновленный файл server.js в ваш репозиторий:
   ```
   git add server.js
   git commit -m "Подготовка к деплою на Render"
   git push
   ```

Также можно обновить файл `package.json`, добавив скрипт для запуска этой подготовки:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js",
  "prepare-render": "node render-setup.js"
}
```

## Шаг 3: Создание сервиса на Render

1. Войдите в свою учётную запись Render
2. На дашборде нажмите кнопку "New +"
3. Выберите "Web Service"
4. Подключите свой GitHub/GitLab репозиторий
   - Если вы еще не подключили свою учетную запись GitHub/GitLab, Render предложит сделать это
   - Найдите и выберите нужный репозиторий

## Шаг 4: Настройка веб-сервиса

Заполните следующие поля:
- **Name**: выберите имя для вашего сервиса (например, "erp-system")
- **Region**: выберите ближайший к вашим пользователям регион
- **Branch**: укажите ветку (обычно "main" или "master")
- **Runtime**: выберите "Node"
- **Build Command**: `npm install`
- **Start Command**: `npm start`

## Шаг 5: Настройка переменных окружения (при необходимости)

Если ваше приложение использует переменные окружения:
1. Прокрутите вниз до раздела "Environment Variables"
2. Добавьте необходимые переменные, например:
   - `PORT` (Render автоматически назначит порт, но вы можете указать переменную `PORT` в вашем коде)
   - `NODE_ENV` со значением "production"
   - Любые другие переменные, которые требуются для работы вашего приложения

## Шаг 6: Создание постоянного хранилища для базы данных

База данных SQLite требует постоянного хранилища для сохранения данных:

1. После создания веб-сервиса, перейдите на страницу сервиса
2. В левом меню выберите "Disks"
3. Нажмите "Create Disk"
4. Заполните форму:
   - **Name**: имя диска (например, "erp-data")
   - **Size**: размер диска (например, 1 GB)
   - **Mount Path**: путь монтирования - укажите `/data`
5. Нажмите "Create"

После создания диска Render автоматически перезапустит ваш сервис. База данных будет сохраняться в этой директории и не будет удалена при перезапуске или обновлении сервиса.

## Шаг 7: Запуск деплоя

1. Нажмите "Create Web Service"
2. Render начнет процесс деплоя, который включает:
   - Клонирование репозитория
   - Установку зависимостей
   - Сборку проекта
   - Запуск сервера

## Шаг 8: Проверка работоспособности

1. После завершения деплоя вы получите URL вашего приложения
2. Перейдите по этому URL, чтобы убедиться, что ваше приложение работает корректно
3. Проверьте все основные функции в браузере

## Дополнительные настройки

### Автоматический деплой

По умолчанию Render будет автоматически реагировать на новые коммиты в указанной ветке и переразвертывать приложение. Если вы хотите отключить эту функцию:
1. На странице вашего сервиса перейдите в "Settings"
2. Найдите "Auto-Deploy" и выберите настройку, которая вам подходит

### База данных PostgreSQL (альтернативный вариант)

Для более надежного решения, вместо SQLite можно использовать PostgreSQL:
1. На Render перейдите в раздел "New +"
2. Выберите "PostgreSQL"
3. Настройте базу данных и подключите её к вашему веб-сервису через переменные окружения

## Устранение неполадок

Если ваше приложение не работает после деплоя:
1. Проверьте логи в разделе "Logs" на Render
2. Убедитесь, что все переменные окружения настроены правильно
3. Проверьте, что порт прослушивается динамически (приложение должно слушать порт, указанный в переменной окружения PORT, а не жестко заданный порт)
4. Если возникли проблемы с базой данных, проверьте:
   - Установлен ли диск (Disk) и правильно ли он примонтирован
   - Наличие необходимых прав доступа для записи в директорию с базой данных

## Дополнительные ресурсы

- [Официальная документация Render](https://render.com/docs)
- [Руководство по Node.js на Render](https://render.com/docs/deploy-node-express-app)
