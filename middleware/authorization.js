const {
  User,
  Product,
  Category,
  Transactionhistory,
} = require('../models');

class Authorization {

  static async isAdmin(req, res, next) {
    const authenticatedUser = res.locals.user;
    if (authenticatedUser.role !== 0) {
      return res.status(403).json({
        name: 'Authorization Error',
        message: `User With id ${authenticatedUser.id} does not have permission`,
      });
    } else {
      return next();
    }
  }

  static async User(req, res, next) {
    const userId = +req.params.userId;

    const authenticatedUser = res.locals.user;
    try {
      const user = await User.findOne({
        where: {
          id: userId,
        },
      });
      if (!user) {
        return res.status(404).json({
          name: 'Data Not Found',
          message: `User With id ${userId} not found`,
        });
      }

      if (user.id === authenticatedUser.id) {
        return next();
      } else {
        return res.status(403).json({
          name: 'Authorization Error',
          message: `User with id ${authenticatedUser.id} does not have permission to access User with id ${userId}`,
        });
      }
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }

  static async Categories(req, res, next) {
    const categoryId = +req.params.categoryId;
    const authenticatedUser = res.locals.user;

    if (authenticatedUser.role !== 0) {
      return res.status(403).json({
        name: 'Authorization Error',
        message: `User With id ${authenticatedUser.id} does not have permission`,
      });
    } 

    try {
      const category = await Category.findOne({
        where: {
          id: categoryId,
        },
      });
      if (!category) {
        return res.status(404).json({
          name: 'Data Not Found',
          message: `Category With id ${categoryId} not found`,
        });
      } else {
        return next();
      }
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }

  static async Product(req, res, next) {
    const productId = +req.params.productId;
    const authenticatedUser = res.locals.user;

    if (authenticatedUser.role !== 0) {
      return res.status(403).json({
        name: 'Authorization Error',
        message: `User With id ${authenticatedUser.id} does not have permission`,
      });
    }

    try {
      const product = await Product.findOne({
        where: {
          id: productId,
        },
      });
      if (!product) {
        return res.status(404).json({
          name: 'Data Not Found',
          message: `Product With id ${productId} not found`,
        });
      } else {
        return next();
      }
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }

  static async Transactions(req, res, next) {
    const transactionId = +req.params.transactionId;
    const authenticatedUser = res.locals.user;

    try {
      const transaction = await Transactionhistory.findOne({
        where: {
          id: transactionId,
        },
      });

      if (authenticatedUser.id !== transaction.UserId && authenticatedUser.role !== 0) {
        return res.status(403).json({
          name: 'Authorization Error',
          message: `User With id ${authenticatedUser.id} does not have permission`,
        });
      }

      if (!transaction) {
        return res.status(404).json({
          name: 'Data Not Found',
          message: `Transaction With id ${transactionId} not found`,
        });
      } else {
        return next();
      }
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }
}

module.exports = Authorization;
