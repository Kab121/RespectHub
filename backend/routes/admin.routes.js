const router = require("express").Router();
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const { ActionSubmission, ActionType, User, SubmissionMedia } = require("../models");

// stats
router.get("/stats", auth, role("admin"), async (req, res) => {
  try {
    const totalResidents = await User.count({ where: { role: "resident" } });
    const pendingActions = await ActionSubmission.count({ where: { status: "pending" } });
    const approvedActions = await ActionSubmission.count({ where: { status: "approved" } });
    const rejectedActions = await ActionSubmission.count({ where: { status: "rejected" } });

    res.json({
      total_residents: totalResidents,
      pending_actions: pendingActions,
      approved_actions: approvedActions,
      rejected_actions: rejectedActions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load admin stats" });
  }
});

// pending list (or approved/rejected via ?status=)
router.get("/actions", auth, role("admin"), async (req, res) => {
  try {
    const status = req.query.status || "pending";

    const list = await ActionSubmission.findAll({
      where: { status },
      include: [
        { model: User },
        { model: ActionType },
        { model: SubmissionMedia, as: "media" },
      ],
      order: [["createdAt", "ASC"]],
    });

    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load admin queue" });
  }
});

// approve
router.patch("/actions/:id/approve", auth, role("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await ActionSubmission.findByPk(id, {
      include: [
        { model: ActionType },
        { model: User },
        { model: SubmissionMedia, as: "media" },
      ],
    });

    if (!submission) {
      return res.status(404).json({ message: "Not found" });
    }

    const points = submission.ActionType.pointsAwarded;

    submission.status = "approved";
    submission.pointsGranted = points;
    submission.reviewNote = req.body.reviewNote || null;
    await submission.save();

    submission.User.pointsTotal += points;
    await submission.User.save();

    res.json({
      message: "Approved",
      pointsGranted: points,
      submissionId: submission.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to approve submission" });
  }
});

// reject
router.patch("/actions/:id/reject", auth, role("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await ActionSubmission.findByPk(id, {
      include: [
        { model: User },
        { model: ActionType },
        { model: SubmissionMedia, as: "media" },
      ],
    });

    if (!submission) {
      return res.status(404).json({ message: "Not found" });
    }

    submission.status = "rejected";
    submission.reviewNote = req.body.reviewNote || "Rejected";
    await submission.save();

    res.json({ message: "Rejected", submissionId: submission.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to reject submission" });
  }
});

module.exports = router;