const { Product, Category } = require('../models');

class ProductController {
    static async getAllProduct(req, res) {
        try {
            let result = await Product.findAll();
            return res.status(200).json({ products: result });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };

    static async createProduct(req, res) {
        const { title, price, stock, CategoryId } = req.body;
        let insertData = {
            title: title,
            price: price,
            stock: stock,
            CategoryId: CategoryId,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        try {
            let result = await Product.create(insertData);
            let response = {
                id: result.id,
                title: result.title,
                price: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(result.price),
                stock: result.stock,
                CategoryId: result.CategoryId,
                updatedAt: result.updatedAt,
                createdAt: result.createdAt
            };
            return res.status(201).json({ product: response });
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
    };

    static async updateProduct(req, res) {
        let id = +req.params.productId;

        const { price, stock, title } = req.body;
        let insertData = {
            price: price,
            stock: stock,
            title: title,
            updatedAt: new Date()
        };
        try {
            let result = await Product.update(insertData, {
                where: { id },
                returning: true,
                individualHooks: true
            });
            let response = result[1][0].dataValues;
            let obj = {
                id: response.id,
                title: response.title,
                price: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(response.price),
                stock: response.stock,
                CategoryId: response.CategoryId,
                updatedAt: response.updatedAt,
                createdAt: response.createdAt
            };
            return res.status(200).json({ product: obj });
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

    static async changeCategory(req, res) {
        let id = +req.params.productId;
        const { CategoryId } = req.body;
        try {
            const product = await Product.findOne({ where: { id } });
            product.CategoryId = parseInt(CategoryId);
            product.updatedAt = new Date();
            await product.save();
            let obj = {
                id: product.id,
                title: product.title,
                price: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price),
                stock: product.stock,
                CategoryId: product.CategoryId,
                updatedAt: product.updatedAt,
                createdAt: product.createdAt
            };
            return res.status(200).json({ product: obj });
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

    static async deleteProduct(req, res) {
        let id = +req.params.productId;
        try {
            const result = await Product.destroy({ where: { id } });
            res.status(200).json({message: 'Product has been successfully deleted'});
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

module.exports = ProductController;