'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Income extends Model {
    static associate(models) {
      Income.belongsTo(models.User, { localKey: "user_id", foreignKey: "id", onDelete: 'CASCADE' })
    }
  }
  Income.init({
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    amount: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.TEXT, allowNull: false }
  }, {
    sequelize,
    modelName: 'Income',
  });
  return Income;
};