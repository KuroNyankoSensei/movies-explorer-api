const router = require('express').Router();
const usersRoutes = require('./users');
const moviesRoutes = require('./movies');
const authRoutes = require('./auth');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFound');

router.use('/users', auth, usersRoutes);
router.use('/movies', auth, moviesRoutes);
router.use(authRoutes);
router.use(auth, (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
