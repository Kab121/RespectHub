const router = require("express").Router();
const auth = require("../middleware/auth");
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function fallbackReply(message, userContext = {}) {
  const text = (message || "").toLowerCase().trim();
  const name = userContext.fullName || userContext.name || "there";

  if (text.includes("hello") || text.includes("hi")) {
    return `Hello ${name}! I’m here to help you with RespectHub.`;
  }

  if (text.includes("points")) {
    return "You earn points when your submitted community actions are approved by the admin.";
  }

  if (text.includes("rank")) {
    return "Your rank is based on your total approved points compared with other residents on the leaderboard.";
  }

  if (text.includes("badge")) {
    return "Badges are based on your total points. Bronze starts at 0, Silver at 100, Gold at 250, Platinum at 500, and Diamond at 1000.";
  }

  if (text.includes("leaderboard")) {
    return "The leaderboard shows residents ranked by their total approved points.";
  }

  if (text.includes("submit") || text.includes("action")) {
    return "To submit an action, go to Submit Action, choose an action type, write a description, and upload proof if required.";
  }

  if (text.includes("proof")) {
    return "Proof can be a photo, video, report, or proof link depending on the type of action you submit.";
  }

  if (text.includes("approve") || text.includes("approval")) {
    return "After you submit an action, the admin reviews it. If approved, points are added to your account. If rejected, a review note may be shown.";
  }

  if (text.includes("admin")) {
    return "Admins can review pending submissions, approve or reject actions, and monitor community activity.";
  }

  if (text.includes("help")) {
    return "You can ask me about points, badges, rank, leaderboard, submissions, proof, or admin approval.";
  }

  return "My AI service is temporarily unavailable, but I can still help with points, badges, rank, leaderboard, submissions, and approval.";
}

router.post("/ask", auth, async (req, res) => {
  try {
    const { message, userContext } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    console.log("✅ Chatbot route hit with message:", message);

    const response = await client.responses.create({
      model: "gpt-5.4",
      input: `You are the RespectHub AI assistant.
Help users with:
- points
- badges
- rank
- leaderboard
- action submissions
- proof
- admin approval

Be friendly, concise, and practical.
If something is unknown, say so politely.

User message: ${message}

User context:
${JSON.stringify(userContext || {}, null, 2)}`,
    });

    const reply = response.output_text || fallbackReply(message, userContext);

    return res.json({ reply });
  } catch (err) {
    console.error("❌ OPENAI ERROR START");
    console.error("message:", err.message);
    console.error("status:", err.status);
    console.error("code:", err.code);
    console.error("type:", err.type);
    console.error("full error:", err);
    console.error("❌ OPENAI ERROR END");

    const { message, userContext } = req.body;
    const reply = fallbackReply(message, userContext);

    return res.json({ reply });
  }
});

module.exports = router;