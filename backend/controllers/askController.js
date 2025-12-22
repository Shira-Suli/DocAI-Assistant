const { askAI } = require('../services/aiService');

// const handleAsk = async (req, res) => {
//   const { question, highlightedText, documentContext, sourceType } = req.body;

//   if (!question || !documentContext) {
//     return res.status(400).json({ error: 'Missing required fields' });
//   }

//   try {
//     const result = await askAI(
//       question,
//       highlightedText,
//       documentContext,
//       sourceType
//     );

//     res.json(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'AI service unavailable' });
//   }
// };
const handleAsk = async (req, res) => {
  console.log("📥 REQUEST BODY:", req.body);

  const { question, highlightedText, documentContext, sourceType } = req.body;

  if (!question || !documentContext) {
    console.log("❌ Missing fields");
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    console.log("➡️ Calling askAI...");
    const result = await askAI(
      question,
      highlightedText,
      documentContext,
      sourceType
    );

    console.log("✅ AI RESULT:", result);
    return res.json(result);
  } catch (err) {
    console.error("🔥 ERROR IN askAI:", err);
    return res.status(500).json({ error: "AI service unavailable" });
  }
};


module.exports = { handleAsk };
