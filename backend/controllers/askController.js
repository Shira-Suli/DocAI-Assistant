// const { askAI } = require('../services/aiService');

// // // const handleAsk = async (req, res) => {
// // //   const { question, highlightedText, documentContext, sourceType } = req.body;

// // //   if (!question || !documentContext) {
// // //     return res.status(400).json({ error: 'Missing required fields' });
// // //   }

// // //   try {
// // //     const result = await askAI(
// // //       question,
// // //       highlightedText,
// // //       documentContext,
// // //       sourceType
// // //     );

// // //     res.json(result);
// // //   } catch (err) {
// // //     console.error(err);
// // //     res.status(500).json({ error: 'AI service unavailable' });
// // //   }
// // // };
// // const handleAsk = async (req, res) => {
// //   console.log("📥 REQUEST BODY:", req.body);

// //   const { question, highlightedText, documentContext, sourceType } = req.body;

// //   if (!question || !documentContext) {
// //     console.log("❌ Missing fields");
// //     return res.status(400).json({ error: "Missing required fields" });
// //   }

// //   try {
// //     console.log("➡️ Calling askAI...");
// //     const result = await askAI(
// //       question,
// //       highlightedText,
// //       documentContext,
// //       sourceType
// //     );

// //     console.log("✅ AI RESULT:", result);
// //     return res.json(result);
// //   } catch (err) {
// //     console.error("🔥 ERROR IN askAI:", err);
// //     return res.status(500).json({ error: "AI service unavailable" });
// //   }
// // };


// // module.exports = { handleAsk };
// const handleAsk = async (req, res) => {
//   const {
//     question,
//     chatHistory = [],
//     highlightedText,
//     documentContext,
//     sourceType
//   } = req.body;

//   if (!question || !documentContext) {
//     return res.status(400).json({ error: "Missing required fields" });
//   }

//   try {
//     const result = await askAI({
//       question,
//       chatHistory,
//       highlightedText,
//       documentContext,
//       sourceType
//     });

//     return res.json(result);
//   } catch (err) {
//     console.error("AI error:", err);
//     return res.status(500).json({ error: "AI service unavailable" });
//   }
// };

// module.exports = { handleAsk };
const { askAI } = require('../services/aiService');

const handleAsk = async (req, res) => {
  const {
    question,
    chatHistory = [],
    highlightedText,
    documentContext,
    sourceType
  } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Missing question field' });
  }

  if (!highlightedText && !documentContext) {
    return res.status(400).json({ error: 'Missing context (highlightedText or documentContext)' });
  }

  const usedContext = highlightedText ? 'highlightedText' : 'documentContext';
  const context = highlightedText || documentContext;

  try {
    const aiResult = await askAI({
      question,
      chatHistory,
      highlightedText,
      documentContext: context,
      sourceType
    });

    return res.json({
      answer: aiResult.answer,
      confidence: aiResult.confidence,
      usedContext,
      metadata: aiResult.metadata
    });

  } catch (err) {
    console.error('AI error:', err);
    return res.status(500).json({ error: 'AI service unavailable' });
  }
};

module.exports = { handleAsk };
