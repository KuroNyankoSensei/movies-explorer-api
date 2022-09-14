const router = require('express').Router();

const { validateUser } = require('../middlewares/validation');

const { getCurrentUser, updateProfile } = require('../controllers/users');

router.get('/users/me', getCurrentUser);
router.patch('/users/me', validateUser, updateProfile);

module.exports = router;
