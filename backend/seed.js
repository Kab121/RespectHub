require("dotenv").config({ override: true });

const bcrypt = require("bcrypt");
const { sequelize, User, ActionType } = require("./models");

(async () => {
  try {
    console.log("DB_USER:", process.env.DB_USER);
    console.log("DB_PASSWORD exists?", !!process.env.DB_PASSWORD);
    console.log("DB_NAME:", process.env.DB_NAME);

    await sequelize.authenticate();
    console.log("✅ DB connected");

    await sequelize.sync({ alter: true });

    const adminEmail = "admin@respecthub.com";
    const adminExists = await User.findOne({ where: { email: adminEmail } });
    if (!adminExists) {
      await User.create({
        fullName: "RespectHub Admin",
        email: adminEmail,
        passwordHash: await bcrypt.hash("Admin123!", 10),
        role: "admin",
      });
    }

    const actions = [
      { title: "Volunteer at community event", pointsAwarded: 50, requiresProof: true },
      { title: "Park / street cleanup", pointsAwarded: 30, requiresProof: true },
      { title: "Attend community meeting", pointsAwarded: 20, requiresProof: false },
      { title: "Help elderly neighbour", pointsAwarded: 25, requiresProof: false },
    ];

    for (const a of actions) {
      const exists = await ActionType.findOne({ where: { title: a.title } });
      if (!exists) await ActionType.create(a);
    }

    console.log("✅ Seed done");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
})();
