const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ActionSubmission = sequelize.define("ActionSubmission", {
  description: { type: DataTypes.STRING },
  proofUrl: { type: DataTypes.STRING },
  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected"),
    defaultValue: "pending",
  },
  reviewNote: { type: DataTypes.STRING },
  pointsGranted: { type: DataTypes.INTEGER },
});

module.exports = ActionSubmission;
