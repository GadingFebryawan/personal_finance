'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Income, { localKey: "id", foreignKey: "user_id" });
      User.hasMany(models.Expense, { localKey: "id", foreignKey: "user_id" });
    }
  }

  User.init({
    name: { type: DataTypes.STRING, allowNull: false },
    birth: { type: DataTypes.TEXT, allowNull: false },
    balance: { type: DataTypes.INTEGER, allowNull: false },
    default_balance: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};