const router = require('express').Router();

const { validateSignup, validateLogin } = require('../middlewares/validation');
const { createUser, login } = require('../controllers/users');
const checkPassword = require('../middlewares/password');
const auth = require('../middlewares/auth');

const usersRouter = require('./users');
const moviesRouter = require('./movies');
const notFoundRouter = require('./not-found');

router.post('/signup', validateSignup, checkPassword, createUser);
router.post('/signin', validateLogin, checkPassword, login);

router.use(auth);

router.use(
  usersRouter,
  moviesRouter,
  notFoundRouter,
);

module.exports = router;
