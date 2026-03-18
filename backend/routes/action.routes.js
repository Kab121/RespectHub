// routes/action.routes.js
const router = require("express").Router();
const auth = require("../middleware/auth");
const { ActionType, ActionSubmission, SubmissionMedia } = require("../models");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

/* ---------------------------
   Uploads folder
---------------------------- */
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ---------------------------
   Multer storage
---------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, unique);
  },
});

/* ---------------------------
   File filter: images + videos + pdf
---------------------------- */
const allowed = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "application/pdf",
];

const fileFilter = (req, file, cb) => {
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Only images, videos, or PDF reports allowed"), false);
  }
  cb(null, true);
};

/* ---------------------------
   Multer instance
---------------------------- */
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB per file (videos need bigger than 8MB)
});

/* ---------------------------
   Routes
---------------------------- */

// list action types
router.get("/action-types", auth, async (req, res) => {
  try {
    const types = await ActionType.findAll({ where: { active: true } });
    res.json(types);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load action types" });
  }
});

// ✅ submit action with MULTIPLE files: photos/videos/pdfs
// Frontend must send:
// - actionTypeId (or action_type_id)
// - description
// - files[] (multiple)
router.post("/actions", auth, upload.array("files", 8), async (req, res) => {
  try {
    const { actionTypeId, action_type_id, description } = req.body;
    const finalActionTypeId = actionTypeId || action_type_id;

    if (!finalActionTypeId) {
      return res.status(400).json({ message: "actionTypeId is required" });
    }

    // create submission
    const submission = await ActionSubmission.create({
      userId: req.user.id,
      actionTypeId: finalActionTypeId,
      description: description || null,
      status: "pending",
    });

    // create media rows for each uploaded file
    if (req.files && req.files.length > 0) {
      const mediaRows = req.files.map((f) => {
        let fileType = "report";
        if (f.mimetype.startsWith("image/")) fileType = "photo";
        else if (f.mimetype.startsWith("video/")) fileType = "video";
        else if (f.mimetype === "application/pdf") fileType = "report";

        return {
          submissionId: submission.id,
          fileUrl: `/uploads/${f.filename}`,
          fileType,
          mimeType: f.mimetype,
          originalName: f.originalname,
          fileSize: f.size,
        };
      });

      await SubmissionMedia.bulkCreate(mediaRows);
    }

    // return submission with media included
    const full = await ActionSubmission.findByPk(submission.id, {
      include: [{ model: SubmissionMedia, as: "media" }],
    });

    res.json(full);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to submit action" });
  }
});

// view my actions (include media)
router.get("/actions/mine", auth, async (req, res) => {
  try {
    const actions = await ActionSubmission.findAll({
      where: { userId: req.user.id },
      include: [{ model: SubmissionMedia, as: "media" }],
      order: [["createdAt", "DESC"]],
    });
    res.json(actions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load actions" });
  }
});

module.exports = router;
