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
      type: DataTypes.INTEGER
    },
    UserId: {
      type: DataTypes.INTEGER
    },
    quantity: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
        isNumeric: true
      }
    },
    total_price: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
        isNumeric: true
      }
    }
  }, {
    sequelize,
    modelName: 'Transactionhistory',
  });
  return Transactionhistory;
};