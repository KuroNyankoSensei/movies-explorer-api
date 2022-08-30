const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const { ERRMSG_BAD_FORMAT } = require('../utils/constants');

const MovieSchema = new mongoose.Schema({
  movieId: {
    type: Number,
    unique: true,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /\d{4}/gi.test(v);
      },
      message: `${ERRMSG_BAD_FORMAT} год`,
    },
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v),
      message: `${ERRMSG_BAD_FORMAT} URL`,
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v),
      message: `${ERRMSG_BAD_FORMAT} URL`,
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v),
      message: `${ERRMSG_BAD_FORMAT} URL`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', MovieSchema);
