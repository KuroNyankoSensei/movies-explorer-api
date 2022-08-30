const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');

const BadRequestError = require('../errors/bad-request-err');
const {
  ERRMSG_BAD_DATA, ERRMSG_EMPTY_FIELD, ERRMSG_BAD_FORMAT, ERRMSG_MAX_LENGTH, ERRMSG_MIN_LENGTH,
} = require('../utils/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, `${ERRMSG_EMPTY_FIELD} email`],
    validate: {
      validator: (v) => isEmail(v),
      message: `${ERRMSG_BAD_FORMAT} email`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: [true, `${ERRMSG_EMPTY_FIELD} name`],
    minlength: [2, `${ERRMSG_MIN_LENGTH} name: 2`],
    maxlength: [30, `${ERRMSG_MAX_LENGTH} name: 30`],
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new BadRequestError(ERRMSG_BAD_DATA));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new BadRequestError(ERRMSG_BAD_DATA));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
