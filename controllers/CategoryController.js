const { Category, Product } = require('../models');

class CategoryController {
    static async getAllCategory(req, res) {
        try {
            let result = await Category.findAll({ include: Product });
            return res.status(200).json({ categories: result });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };

    static async createCategory(req, res) {
        const { type } = req.body;
        let inputData = {
            type,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        try {
            let result = await Category.create(inputData);
            let response = {
                id: result.id,
                type: result.type,
                createdAt: result.createdAt,
                updatedAt: result.updatedAt,
                sold_product_amount: result.sold_product_amount
            }
            return res.status(201).json({ category: response });
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

    static async updateCategory(req, res) {
        let id = +req.params.categoryId;
        const { type } = req.body;
        let inputData = {
            type,
            updatedAt: new Date()
        };
        try {
            let result = await Category.update(inputData, {
                where: { id },
                returning: true,
                individualHooks: true
            });
            let response = result[1][0].dataValues;
            let obj = {
                id: response.id,
                type: response.type,
                sold_product_amount: response.sold_product_amount,
                createdAt: response.createdAt,
                updatedAt: response.updatedAt
            }
            return res.status(200).json({ category: obj });
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

    static async deleteCategory(req, res) {
        let id = +req.params.categoryId;
        try {
            const result = await Category.destroy({ where: { id } });
            return res.status(200).json({ message: 'Category has been successfully deleted' });
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

module.exports = CategoryController;