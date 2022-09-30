const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000, DATABASE = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;
const app = express();
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { default: helmet } = require('helmet');
const cors = require('cors');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/rate-limiter');
const { allowedCors } = require('./utils/cors');

// Подключаем Helmet
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Подключаемся к БД
mongoose.connect(DATABASE, {
  useNewUrlParser: true,
});

// Подключаем rate limiter
app.use(limiter);

// Разрешаем кросс-доменные запросы
app.use(cors(allowedCors));

// Логгер запросов
app.use(requestLogger);

// Подключаем файл со всеми роутами
app.use(router);

// Логгер ошибок
app.use(errorLogger);

// Обработчик ошибок celebrate
app.use(errors());

// Централизованная обработка ошибок
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Ошибка сервера' : message,
  });
  next();
});

// Слушаем порт
app.listen(PORT, () => {
  console.log('all is right');
});
