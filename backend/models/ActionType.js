const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ActionType = sequelize.define("ActionType", {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
  pointsAwarded: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 10 },
  requiresProof: { type: DataTypes.BOOLEAN, defaultValue: false },
  active: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = ActionType;
