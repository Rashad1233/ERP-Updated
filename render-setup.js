const fs = require('fs');
const path = require('path');

// Путь к файлу server.js
const serverJsPath = path.join(__dirname, 'server.js');

// Прочитать содержимое файла
let serverJs = fs.readFileSync(serverJsPath, 'utf8');

// Модифицировать путь к базе данных для работы с Render Disk
const oldDbPath = `const db = new sqlite3.Database('./erp.db', (err) => {`;
const newDbPath = `
// Используем путь в постоянном хранилище для Render
const dbPath = process.env.NODE_ENV === 'production' ? 
  path.join(process.env.RENDER_VOLUME_MOUNT_PATH || '/data', 'erp.db') : 
  path.join(__dirname, 'erp.db');

const db = new sqlite3.Database(dbPath, (err) => {`;

// Заменить строку с настройками базы данных
serverJs = serverJs.replace(oldDbPath, newDbPath);

// Сохранить изменения в файл
fs.writeFileSync(serverJsPath, serverJs);

console.log('Файл server.js успешно обновлен для деплоя на Render'); 