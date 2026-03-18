const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  fullName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM("resident", "admin"), defaultValue: "resident" },
  pointsTotal: { type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = User;
