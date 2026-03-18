// models/index.js
const sequelize = require("../config/db");

const User = require("./User");
const ActionType = require("./ActionType");
const ActionSubmission = require("./ActionSubmission");
const SubmissionMedia = require("./SubmissionMedia");

/* ---------------------------
   Associations
---------------------------- */

// User -> ActionSubmission
User.hasMany(ActionSubmission, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  hooks: true,
  constraints: true,
});
ActionSubmission.belongsTo(User, {
  foreignKey: "userId",
  constraints: true,
});

// ActionType -> ActionSubmission
ActionType.hasMany(ActionSubmission, {
  foreignKey: "actionTypeId",
  onDelete: "RESTRICT",
  constraints: true,
});
ActionSubmission.belongsTo(ActionType, {
  foreignKey: "actionTypeId",
  constraints: true,
});

// ActionSubmission -> SubmissionMedia
ActionSubmission.hasMany(SubmissionMedia, {
  foreignKey: "submissionId",
  as: "media",
  onDelete: "CASCADE",
  hooks: true,
  constraints: true,
});
SubmissionMedia.belongsTo(ActionSubmission, {
  foreignKey: "submissionId",
  constraints: true,
});

/* ---------------------------
   Export
---------------------------- */
module.exports = {
  sequelize,
  User,
  ActionType,
  ActionSubmission,
  SubmissionMedia,
};
