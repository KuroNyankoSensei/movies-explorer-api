const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const Unauthorized = require('../errors/Unauthorized');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

// Собственный метод для проверки почты и пароля
// eslint-disable-next-line func-names
userSchema.statics.findByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Unauthorized('Неверные данные входа'));
      }
      return bcrypt.compare(password, user.password)
        .then((mathed) => {
          if (!mathed) {
            return Promise.reject(new Unauthorized('Неверные данные входа'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
