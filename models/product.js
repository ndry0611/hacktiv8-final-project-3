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
      this.hasMany(models.Transactionhistory);
    }
  }
  Product.init({
    CategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Category Id cannot be null"
        }
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Title cannot be empty!'
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Price cannot be empty!'
        },
        isNumeric: {
          args: true,
          msg: 'Price must be a number'
        },
        min: {
          args: [0],
          msg: "Price cannot be below 0"
        },
        max: {
          args: [50000000],
          msg: "Max price is 50000000"
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Stocks cannot be empty!'
        },
        isNumeric: {
          args: true,
          msg: 'Stocks must be a number'
        },
        min: {
          args: [5],
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