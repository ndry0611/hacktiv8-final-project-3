const { User } = require('../models');
const { comparePassword } = require('../helpers/bcrypt');
const { generateToken } = require('../helpers/jwt');

class UserController {
    static async createUser(req, res) {
        const { full_name, password, gender, email } = req.body;
        const inputData = {
            full_name,
            email,
            password,
            gender,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        try {
            let result = await User.create(inputData);
            let response = {
                id: result.id,
                full_name: result.full_name,
                email: result.email,
                gender: result.gender,
                balance: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(result.balance),
                createdAt: result.createdAt
            }
            return res.status(201).json({ user: response });
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

    static async login(req, res) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(422).json({
                message: 'Email and Password cannot be empty!'
            });
        }
        try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({
                    name: 'User login error',
                    message: `User with email ${email} not found`
                });
            }
            let isCorrect = comparePassword(password, user.password);
            if (!isCorrect) {
                return res.status(400).json({
                    name: 'User login error',
                    message: `Wrong password!`
                });
            }
            let payload = {
                id: user.id,
                email: user.email,
                role: user.role
            };
            const token = generateToken(payload);
            return res.status(201).json({ token });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async editUser(req, res) {
        let id = +req.params.userId;
        const { full_name, email } = req.body;
        const data = {
            full_name: full_name,
            email: email,
            updatedAt: new Date()
        };
        try {
            const result = await User.update(data, {
                where: { id },
                returning: true,
                individualHooks: true
            });
            let response = result[1][0].dataValues;
            let obj = {
                id: response.id,
                full_name: response.full_name,
                email: response.email,
                createdAt: response.createdAt,
                updatedAt: response.updatedAt
            }
            return res.status(200).json({ user: obj });
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

    static async topupUser(req, res) {
        const { balance } = req.body;
        try {
            const user = await User.findOne({where: {id: res.locals.user.id}})
            user.balance += parseInt(balance);
            user.updatedAt = new Date();
            await user.save();
            return res.status(200).json({ message: `Your balance has been successfully updated to ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(user.balance)}` });
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

    static async deleteUser(req, res) {
        let id = +req.params.userId;
        try {
            const result = await User.destroy({ where: { id } });
            return res.status(200).json({ message: 'Your account has successfully deleted' });

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

module.exports = UserController;