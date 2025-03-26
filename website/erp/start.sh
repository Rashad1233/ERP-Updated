#!/bin/bash

# Установка Node.js если не установлен
if ! command -v node &> /dev/null; then
    curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Установка PM2 если не установлен
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

# Установка зависимостей
npm install --production

# Запуск приложения через PM2
pm2 start ecosystem.config.js
pm2 save

# Настройка автозапуска
pm2 startup 