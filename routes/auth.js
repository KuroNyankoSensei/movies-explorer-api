const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const { createUserValaidator, loginUserValidator } = require('../middlewares/validators');

router.post('/signup', createUserValaidator, createUser);
router.post('/signin', loginUserValidator, login);

module.exports = router;
