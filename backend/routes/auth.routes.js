const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { User } = require("../models");
const auth = require("../middleware/auth");

router.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body;

  const exists = await User.findOne({ where: { email } });
  if (exists) return res.status(400).json({ message: "Email already used" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ fullName, email, passwordHash, role: "resident" });

  res.json({ message: "Registered", userId: user.id });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({
    token,
    user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role, pointsTotal: user.pointsTotal },
  });
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findByPk(req.user.id, { attributes: { exclude: ["passwordHash"] } });
  res.json(user);
});

module.exports = router;
