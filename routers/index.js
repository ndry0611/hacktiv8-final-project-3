const router = require('express').Router();
const UserController = require('../controllers/UserController');
const CategoryController = require('../controllers/CategoryController');
const ProductController = require('../controllers/ProductController');
const TransactionhistoryController = require('../controllers/TransactionhistoryController');

const authentication = require('../middleware/authentication');
const Authorization = require('../middleware/authorization');

router.post('/users/register', UserController.createUser);
router.post('/users/login', UserController.login);

router.use(authentication);
// Only need authentication and specific authorization
router.patch('/users/topup', UserController.topupUser);
router.put('/users/:userId', Authorization.user, UserController.editUser);
router.delete('/users/:userId', Authorization.user, UserController.deleteUser);

router.get('/products', ProductController.getAllProduct);

router.get('/transactions/user', TransactionhistoryController.getUserTransaction);
router.post('/transactions', TransactionhistoryController.createTransactionhistory);
router.get('/transactions/:transactionId', Authorization.transactions, TransactionhistoryController.getTransactionById);

// Need admin authorization
router.use(Authorization.isAdmin);
router.get('/categories', CategoryController.getAllCategory);
router.post('/categories', CategoryController.createCategory);

router.use('/categories/:categoryId', Authorization.categories);
router.patch('/categories/:categoryId', CategoryController.updateCategory);
router.delete('/categories/:categoryId', CategoryController.deleteCategory);

router.post('/products', ProductController.createProduct);
router.use('/products/:productId', Authorization.product);

router.put('/products/:productId', ProductController.updateProduct);
router.patch('/products/:productId', ProductController.changeCategory);
router.delete('/products/:productId', ProductController.deleteProduct);

router.get('/transactions/admin', TransactionhistoryController.getAdminTransaction);

router.use((req, res, next) => {
    res.status(404).json({
        status: 404,
        message: 'Not Found',
    });
});

module.exports = router;
