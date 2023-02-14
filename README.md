# sminex-test
![CI](https://github.com/artie-owlet/sminex-test/actions/workflows/ci.yaml/badge.svg)
![Coverage](https://github.com/artie-owlet/sminex-test/actions/workflows/coverage.yaml/badge.svg)
![Lint](https://github.com/artie-owlet/sminex-test/actions/workflows/lint.yaml/badge.svg)

Тестовое задание Sminex test app

---

## Install

```bash
git clone git@github.com:artie-owlet/sminex-test.git
cd ./sminex-test/
sudo docker compose up
```

Сервис будет доступен по адресу `http://localhost:8080/`

## API

[В сервисе](http://localhost:8080/)

[SwaggerHub](https://app.swaggerhub.com/apis-docs/artie-owlet/sminex-test/1.0.0)

## Quick usage examples

```bash
# Логин администратора
curl --cookie ./cookie.txt --cookie-jar ./cookie.txt http://localhost:8080/login -H 'Content-Type: application/json' -d '{"login":"admin","password":"password"}'

# Загрузить данные из файла
curl --cookie ./cookie.txt --cookie-jar ./cookie.txt http://localhost:8080/admin/v1/upload -H 'Content-Type: text/csv' --data-binary @/path/to/file.csv

# Создать аккаунт обычного пользователя
curl --cookie ./cookie.txt --cookie-jar ./cookie.txt http://localhost:8080/admin/v1/user -H 'Content-Type: application/json' -d '{"login":"test", "password":"testpwd","admin":false,"active":true}'

# Логин пользователя
curl --cookie ./cookie.txt --cookie-jar ./cookie.txt http://localhost:8080/login -H 'Content-Type: application/json' -d '{"login":"test","password":"testpwd"}'

# Получить классификаторы по коду
curl --cookie ./cookie.txt --cookie-jar ./cookie.txt http://localhost:8080/client/v1/classifiers/B10

# Получить все классификаторы
curl --cookie ./cookie.txt --cookie-jar ./cookie.txt http://localhost:8080/client/v1/classifiers
```
