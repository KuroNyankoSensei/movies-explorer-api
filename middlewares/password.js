const BadRequestError = require('../errors/bad-request-err');
const {
  ERRMSG_NO_PASSWORD,
  ERRMSG_BAD_PASSWORD,
  ERRMSG_BAD_DATA,
} = require('../utils/constants');

module.exports = (req, res, next) => {
  const { password } = req.body;
  const { path } = req.route;

  try {
    if (!password) throw new BadRequestError(ERRMSG_NO_PASSWORD);

    const psw = password.trim();

    if (!psw || psw.length < 8) {
      if (path === '/signup') {
        throw new BadRequestError(ERRMSG_BAD_PASSWORD);
      } else {
        throw new BadRequestError(ERRMSG_BAD_DATA);
      }
    }

    next();
  } catch (err) {
    next(err);
  }
};
