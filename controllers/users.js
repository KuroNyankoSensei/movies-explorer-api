const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const UnauthorizedError = require('../errors/unauthorized-err');

const { JWT_CODE } = require('../config');
const {
  STATUS_OK, STATUS_CREATED, ERRMSG_NO_DATA, ERRMSG_BAD_DATA, ERRMSG_NO_USER, ERRMSG_EMAIL_EXISTS,
} = require('../utils/constants');

// ----------------------------------------------------------------------------
// Создание учетной записи нового пользователя

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    throw new BadRequestError(ERRMSG_NO_DATA);
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError(`${ERRMSG_EMAIL_EXISTS} ${email}`);
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ email, password: hash, name }))
    .then((user) => res
      .status(STATUS_CREATED)
      .send({ _id: user._id, email: user.email }))
    .catch((err) => {
      if (err.name.includes('ValidationError')) {
        const errMessage = Object.values(err.errors).map((errItem) => errItem.message).join(', ');
        next(new BadRequestError(errMessage.trim()));
      } else {
        next(err);
      }
    });
};

// ----------------------------------------------------------------------------
// Вход в систему

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_CODE, { expiresIn: '7d' }),
      });
    })
    .catch(() => {
      throw new UnauthorizedError(ERRMSG_BAD_DATA);
    })
    .catch(next);
};

// ----------------------------------------------------------------------------
// Возвращает информацию о пользователе (email и имя)

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id).select('+password')
    .then((user) => {
      if (!user) {
        throw new NotFoundError(ERRMSG_NO_USER);
      }
      const data = { _id: user._id, email: user.email, name: user.name };
      res.status(STATUS_OK).send(data);
    })
    .catch(next);
};

// ----------------------------------------------------------------------------
// Oбновляет информацию о пользователе (email и имя)

module.exports.updateProfile = async (req, res, next) => {
  const { name, email } = req.body;

  try {
    // Проверяем, не занят ли данный email
    const data = await User.find({ email });

    if (data.length === 1) {
      if (data[0]._id.toString() !== req.user._id) {
        throw new ConflictError(`${ERRMSG_EMAIL_EXISTS} ${email}`);
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true, upsert: true },
    );

    const updatedData = { _id: user._id, email: user.email, name: user.name };

    res.status(STATUS_OK).send(updatedData);
  } catch (err) {
    if (err.name.includes('ValidationError')) {
      const errMessage = Object.values(err.errors).map((errItem) => errItem.message).join(', ');
      next(new BadRequestError(errMessage.trim()));
    } else {
      next(err);
    }
  }
};
