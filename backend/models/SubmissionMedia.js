const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const SubmissionMedia = sequelize.define("SubmissionMedia", {
  fileUrl: { type: DataTypes.STRING, allowNull: false },   // /uploads/xxx.ext
  fileType: { type: DataTypes.ENUM("photo", "video", "report"), allowNull: false },
  mimeType: { type: DataTypes.STRING, allowNull: false },
  originalName: { type: DataTypes.STRING, allowNull: false },
  fileSize: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = SubmissionMedia;
