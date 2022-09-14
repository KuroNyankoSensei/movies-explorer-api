const router = require('express').Router();
const NotFoundError = require('../errors/not-found-err');
const { ERRMSG_NOT_FOUND } = require('../utils/constants');

router.all('*', () => {
  throw new NotFoundError(ERRMSG_NOT_FOUND);
});

module.exports = router;
