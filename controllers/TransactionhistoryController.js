const { Transactionhistory, Product, User, Category } = require('../models');

class TransactionhistoryController {
    static async createTransactionhistory(req, res) {
        const { productId, quantity } = req.body;
        try {
            let product = await Product.findOne({ where: { id: productId }, include: Category });
            let user = await User.findOne({ where: { id: res.locals.user.id } });

            if (!product) {
                return res.status(404).json({ message: `Product with id: ${productId} not found!` });
            }
            if (product.stock < quantity) {
                return res.status(422).json({ message: `Insufficient product quantity ! Stock: ${product.stock} ; Requested Quantity : ${quantity}` });
            }
            let totalPrice = product.price * parseInt(quantity);
            if (user.balance < totalPrice) {
                return res.status(422).json({ message: `Insufficient balance! User Balance: ${user.balance} ; Total Price: ${totalPrice}` });
            }

            let category = await Category.findOne({ where: { id: product.CategoryId } });

            product.stock -= parseInt(quantity);
            product.updatedAt = new Date();

            category.sold_category_amount += parseInt(quantity);
            category.updatedAt = new Date();

            user.balance -= totalPrice;
            user.updatedAt = new Date();

            await product.save();
            await category.save();
            await user.save();

            const inputData = {
                ProductId: productId,
                quantity: quantity,
                UserId: res.locals.user.id,
                total_price: totalPrice
            };

            let result = await Transactionhistory.create(inputData);
            let response = {
                total_price: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(result.total_price),
                quantity: parseInt(quantity),
                product_name: product.title
            };
            return res.status(201).json({ message: 'You have successfully purchased the product', transactionBill: response });
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const errValidation = {};
                error.errors.map((er) => {
                    errValidation[er.path] = er.message;
                });
                return res.status(400).json(errValidation);
            }
            return res.status(500).json({ message: error.message });
        }
    }

    static async getUserTransaction(req, res) {
        try {
            let result = await Transactionhistory.findAll({ where: { UserId: res.locals.user.id }, include: Product });
            return res.status(200).json({ transactionHistories: result });
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const errValidation = {};
                error.errors.map((er) => {
                    errValidation[er.path] = er.message;
                });
                return res.status(400).json(errValidation);
            }
            return res.status(500).json({ message: error.message });
        }
    }

    static async getAdminTransaction(req, res) {
        try {
            let result = await Transactionhistory.findAll({ include: [Product, User] });
            return res.status(200).json({ transactionHistories: result });
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const errValidation = {};
                error.errors.map((er) => {
                    errValidation[er.path] = er.message;
                });
                return res.status(400).json(errValidation);
            }
            return res.status(500).json({ message: error.message });
        }
    }

    static async getTransactionById(req, res) {
        const id = +req.params.transactionId;
        try {
            let result = await Transactionhistory.findOne({ where: { id }, include: Product });
            return res.status(200).json({ result });
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                const errValidation = {};
                error.errors.map((er) => {
                    errValidation[er.path] = er.message;
                });
                return res.status(400).json(errValidation);
            }
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = TransactionhistoryController;