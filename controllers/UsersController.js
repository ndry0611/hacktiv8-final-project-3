const { Users } = require('../models');
const { comparePassword } = require('../helpers/bcrypt');
const { generateToken } = require('../helpers/jwt');

class UsersController {
    static async createUser(req, res) {
        const { full_name, password, gender, email } = req.body;
        const inputData = {
            full_name,
            password,
            gender,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        try {
            let result = await Users.create(inputData);
            let response = {
                id: result.id,
                full_name: result.full_name,
                email: result.email,
                gender: result.gender,
                balance: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(result.balance),
                createdAt: result.createdAt
            }
            res.status(201).json({ user: response });
        } catch (error) {
            res.status(500).json(error.message);
        }
    }

    static async login(req, res) {
        const { email, password } = req.body;
        try {
            const user = await Users.findOne({ where: { email } });
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
                email: user.email
            };
            const token = generateToken(payload);
            return res.status(201).json({ token });
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async editUser(req, res) {
        let id = +req.params.userId;
        const { full_name, email } = req.body;
        const data = {
            full_name,
            email,
            updatedAt: new Date()
        };
        try {
            const result = await Users.update(data, {
                where: { id },
                returning: true,
                individualHooks: true
            });
            let response = result[1].dataValues;
            let obj = {
                id: response.id,
                full_name: response.full_name,
                email: response.email,
                createdAt: response.createdAt,
                updatedAt: response.updatedAt
            }
            return res.status(200).json({ user: obj });
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async deleteUser(req, res) {
        let id = +req.params.userId;
        try {

            const result = await Users.destroy({ where: { id } });
            return res.status(200).json({ message: 'Your account has successfully deleted' });

        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
}

module.exports = UsersController;