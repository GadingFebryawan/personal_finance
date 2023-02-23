'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    static associate(models) {
      Expense.belongsTo(models.User, { localKey: "user_id", foreignKey: "id", onDelete: 'CASCADE' });
    }
  }
  Expense.init({
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    amount: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.TEXT, allowNull: false }
  }, {
    sequelize,
    modelName: 'Expense',
  });
  return Expense;
};