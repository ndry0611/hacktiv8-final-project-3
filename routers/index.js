const router = require('express').Router();
const UserController = require('../controllers/UserController');
const authentication = require('../middleware/authentication');

router.post('/users/register', UserController.createUser);
router.post('/users/login', UserController.login);

router.use(authentication);
router.put('/users/:userId', UserController.editUser);
router.patch('/users/topup', UserController.topupUser);
router.delete('/users/:userId', UserController.deleteUser);


module.exports = router;