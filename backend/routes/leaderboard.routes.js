const router = require("express").Router();
const { User } = require("../models");

router.get("/leaderboard", async (req, res) => {
  const top = await User.findAll({
    where: { role: "resident" },
    order: [["pointsTotal", "DESC"]],
    limit: 10,
    attributes: ["id", "fullName", "pointsTotal"],
  });
  res.json(top);
});

module.exports = router;
