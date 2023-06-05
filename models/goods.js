'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Goods extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Goods.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    size: DataTypes.STRING,
    image: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    category: DataTypes.STRING,
    subcategory: DataTypes.STRING,
    bestseller: DataTypes.BOOLEAN,
    new: DataTypes.BOOLEAN,
  }, 
  {
    sequelize,
    modelName: 'Goods',
  });
  return Goods;
};