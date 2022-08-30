const { celebrate, Joi } = require('celebrate');
const isURL = require('validator/lib/isURL');

const { ERRMSG_BAD_URL } = require('../utils/constants');

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateSignup = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
});

const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const checkUrl = (value, helpers) => {
  if (isURL(value)) {
    return value;
  }
  return helpers.message(`${ERRMSG_BAD_URL}`);
};

const validateMovie = celebrate({
  body: Joi.object().keys({
    movieId: Joi.number().integer().positive().required(),
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().integer().positive().required(),
    year: Joi.string().required().pattern(/\d{4}/),
    description: Joi.string().required(),
    image: Joi.string().required().custom(checkUrl),
    trailer: Joi.string().required().custom(checkUrl),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().custom(checkUrl),
  }),
});

const validateMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  validateLogin, validateSignup, validateUser, validateMovie, validateMovieId,
};
