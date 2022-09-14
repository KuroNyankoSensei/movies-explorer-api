const jwt = require('jsonwebtoken');

const { JWT_CODE } = require('../config');
const { ERRMSG_UNAUTHORIZED } = require('../utils/constants');

const UnauthorizedError = require('../errors/unauthorized-err');

const extractBearerToken = (header) => header.replace('Bearer ', '');

// Авторизация

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedError(ERRMSG_UNAUTHORIZED);
    }

    const token = extractBearerToken(authorization);
    const payload = jwt.verify(token, JWT_CODE);

    req.user = payload;
    next();
  } catch (err) {
    next(new UnauthorizedError(ERRMSG_UNAUTHORIZED));
  }
};
