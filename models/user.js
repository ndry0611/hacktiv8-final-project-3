'use strict';

const { hashPassword } = require('../helper/bcrypt');

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    full_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
        notEmpty: true
      },
      unique: {
        args: true,
        msg: 'Email already in use!'
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        len: {
          msg: "Password length 6 - 10 character",
          args: [6, 10]
        }
      }
    },
    gender: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        isIn: {
          args: [['male', 'female']],
          msg: "Gender has to be 'male' or 'female'"
        }
      }
    },
    role: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
        isIn: {
          args: [0, 1],
          msg: "Role has to be '0 = admin' or '1 = customer'"
        }
      }
    },
    balance: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: true,
        notEmpty: true,
        min: {
          args: 0,
          msg: "Balance cannot be below 0"
        },
        max: {
          args: 100000000,
          msg: "Max balance is 100000000"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: (user, opt) => {
        const hashedPassword = hashPassword(user.password);
        user.password = hashedPassword;
        user.role = 1;
        user.balance = 0;
      }
    }
  });
  return User;
};