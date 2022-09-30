const router = require('express').Router();
const { getUserInfo, updateUserInfo } = require('../controllers/users');
const { updateUserInfoValidator } = require('../middlewares/validators');

router.get('/me', getUserInfo);
router.patch('/me', updateUserInfoValidator, updateUserInfo);

module.exports = router;
