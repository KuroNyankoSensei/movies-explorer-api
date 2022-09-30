require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user');
const NotFoundError = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict');

// Создание пользователя
module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({ name, email, password: hash })
        .then((user) => {
          res.send({ name, email, _id: user._id });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return next(new BadRequest('Переданы некорректные данные при создании пользователя.'));
          }
          if (err.code === 11000) {
            return next(new Conflict('Данный email уже зарегистрирован.'));
          }
          return next(err);
        });
    }).catch(next);
};

// Логин пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'secretnyiy-secret',
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch(next);
};

// Получение данных о пользователе
module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send({ name: user.name, email: user.email, _id: user._id });
    })
    .catch(next);
};

// Обновляем данные пользователя (имя, почта)
module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    { id: req.user._id },
    { name, email },
    { new: true, runValidators: true, upsert: false },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Данного пользователя не существует');
      }
      res.send({ name: user.name, email: user.email, _id: user._id });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные при обновлении профиля.'));
      }
      if (err.code === 11000) {
        return next(new Conflict('Данный email уже зарегистрирован.'));
      }
      return next(err);
    });
};
