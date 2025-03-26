# Развертывание ERP-системы на Heroku

## Шаг 1: Подготовка
1. Установите Heroku CLI (https://devcenter.heroku.com/articles/heroku-cli)
2. Войдите в Heroku:
```bash
heroku login
```

## Шаг 2: Создание приложения
1. Создайте новое приложение:
```bash
heroku create erp-app
```

## Шаг 3: Настройка базы данных
1. Добавьте SQLite:
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

## Шаг 4: Развертывание
1. Загрузите код:
```bash
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a erp-app
git push heroku main
```

## Шаг 5: Проверка
1. Откройте https://erp-app.herokuapp.com
2. Войдите с учетными данными:
   - Логин: admin
   - Пароль: admin123

## Если что-то пошло не так:
1. Проверьте логи:
```bash
heroku logs --tail
```

2. Перезапустите приложение:
```bash
heroku restart
```

## Важно:
- Сохраните URL вашего приложения
- Не удаляйте базу данных
- Регулярно делайте бэкапы 