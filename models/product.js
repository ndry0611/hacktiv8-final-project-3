'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Category, { foreignKey: "CategoryId" });
      this.hasMany(models.TransactionHistory);
    }
  }
  Product.init({
    CategoryId: {
      type: DataTypes.INTEGER
    },
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    price: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
        isNumeric: true,
        min: {
          args: 0,
          msg: "Price cannot be below 0"
        },
        max: {
          args: 50000000,
          msg: "Max price is 50000000"
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
        isNumeric: true,
        min: {
          args: 5,
          msg: "Minimum stock has to be 5"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};