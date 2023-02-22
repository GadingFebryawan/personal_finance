'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Income extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Income.belongsTo(models.User, { localKey: "user_id", foreignKey: "id" })
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