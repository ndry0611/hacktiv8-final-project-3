'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Product);
    }
  }
  Category.init({
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Category Type cannot be empty!'
        }
      }
    },
    sold_product_amount: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty:true,
        isNumeric: true
      }
    }
  }, {
    sequelize,
    modelName: 'Category',
    hooks: {
      beforeCreate: (category, opt) => {
        category.sold_product_amount = 0;
      }
    }
  });
  return Category;
};