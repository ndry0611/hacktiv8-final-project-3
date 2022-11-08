const router = require('express').Router();
const UserController = require('../controllers/UserController');
const CategoryController = require('../controllers/CategoryController');
const ProductController = require('../controllers/ProductController');
const TransactionhistoryController = require('../controllers/TransactionhistoryController');

const authentication = require('../middleware/authentication');
const authorization = require('../middleware/authorization');

router.post('/users/register', UserController.createUser);
router.post('/users/login', UserController.login);

router.use(authentication);
router.patch('/users/topup', UserController.topupUser);
router.put('/users/:userId', authorization.User, UserController.editUser);
router.delete('/users/:userId', authorization.User, UserController.deleteUser);

router.get('/categories', authorization.isAdmin, CategoryController.getAllCategory);
router.post('/categories', authorization.isAdmin, CategoryController.createCategory);
router.patch('/categories/:categoryId', authorization.Categories, CategoryController.updateCategory);
router.delete('/categories/:categoryId', authorization.Categories, CategoryController.deleteCategory);

router.get('/products', ProductController.getAllProduct);
router.post('/products', authorization.isAdmin, ProductController.createProduct);
router.put('/products/:productId', authorization.Product, ProductController.updateProduct);
router.patch('/products/:productId', authorization.Product, ProductController.changeCategory);
router.delete('/products/:productId', authorization.Product, ProductController.deleteProduct);

router.get('/transactions/user', TransactionhistoryController.getUserTransaction);
router.post('/transactions', TransactionhistoryController.createTransactionhistory);
router.get('/transactions/admin', authorization.isAdmin, TransactionhistoryController.getAdminTransaction);
router.get('/transactions/:transactionId', authorization.Transactions, TransactionhistoryController.getTransactionById);

module.exports = router;
