'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transactionhistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Product, { foreignKey: 'ProductId' });
      this.belongsTo(models.User, { foreignKey: 'UserId' });
    }
  }
  Transactionhistory.init({
    ProductId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Product Id cannot be empty"
        }
      }
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "User Id cannot be empty"
        }
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Quantity cannot be empty!'
        },
        isNumeric: {
          args: true,
          msg: 'Quantity must be a number'
        },
      }
    },
    total_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Total cannot be empty!'
        },
        isNumeric: {
          args: true,
          msg: 'Total must be a number'
        },
      }
    }
  }, {
    sequelize,
    modelName: 'Transactionhistory',
  });
  return Transactionhistory;
};