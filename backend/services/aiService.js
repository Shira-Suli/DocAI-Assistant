// const axios = require("axios");

// /* ---------- 1. Detect user intent ---------- */
// function detectIntent(question) {
//   const q = question.toLowerCase();

//   if (
//     q.includes("summary") ||
//     q.includes("summarize") ||
//     q.includes("what is this chapter about")
//   ) return "summary";

//   if (q.includes("compare") || q.includes("relate")) return "compare";

//   return "explain";
// }

// /* ---------- 2. Split document into chunks ---------- */
// function splitToChunks(text, maxLength = 600) {
//   if (!text) return [];

//   const paragraphs = text.split(/\n+/);
//   const chunks = [];
//   let current = "";

//   for (const p of paragraphs) {
//     if ((current + p).length > maxLength) {
//       chunks.push(current.trim());
//       current = p;
//     } else {
//       current += " " + p;
//     }
//   }

//   if (current) chunks.push(current.trim());
//   return chunks;
// }

// /* ---------- 3. Select relevant chunks ---------- */
// function selectRelevantChunks(chunks, question, limit) {
//   const keywords = question
//     .toLowerCase()
//     .split(" ")
//     .filter(w => w.length > 2);

//   return chunks
//     .map(chunk => ({
//       chunk,
//       score: keywords.reduce(
//         (acc, word) => acc + (chunk.toLowerCase().includes(word) ? 1 : 0),
//         0
//       )
//     }))
//     .filter(i => i.score > 0)
//     .sort((a, b) => b.score - a.score)
//     .slice(0, limit)
//     .map(i => i.chunk);
// }

// /* ---------- 4. Build document context ---------- */
// function buildContext(highlightedText, relevantChunks) {
//   if (highlightedText) {
//     return `
// FOCUS SECTION:
// ${highlightedText}

// BROADER DOCUMENT CONTEXT:
// ${relevantChunks.join("\n---\n")}
// `;
//   }
//   return relevantChunks.join("\n---\n");
// }

// /* ---------- 5. Format chat history ---------- */
// function formatChatHistory(chatHistory = []) {
//   if (!chatHistory.length) return "None";

//   return chatHistory
//     .map(m => `${m.role.toUpperCase()}: ${m.content}`)
//     .join("\n");
// }

// /* ---------- 6. Build prompt ---------- */
// function buildPrompt(question, chatHistory, context, intent) {
//   return `
// You are an AI assistant analyzing a document.

// Rules:
// - Use the document as the main source
// - Do NOT invent content
// - Be short and focused

// Conversation so far:
// ${formatChatHistory(chatHistory)}

// Document context:
// ${context}

// Question:
// ${question}
// `;
// }

// /* ---------- 7. Call Gemini ---------- */
// async function callGemini(prompt) {
//   const apiKey = process.env.GEMINI_API_KEY;
//   if (!apiKey) throw new Error("GEMINI_API_KEY missing");

//   const response = await axios.post(
//     "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
//     {
//       contents: [{ role: "user", parts: [{ text: prompt }] }],
//       generationConfig: { temperature: 0.4, topP: 0.8 }
//     },
//     {
//       headers: {
//         "Content-Type": "application/json",
//         "X-Goog-Api-Key": apiKey
//       }
//     }
//   );

//   const candidate = response.data?.candidates?.[0];
//   return candidate?.content?.parts?.map(p => p.text).join("\n").trim() || "";
// }

// /* ---------- 8. askAI (ONE TRUE VERSION) ---------- */
// const askAI = async ({
//   question,
//   chatHistory = [],
//   highlightedText,
//   documentContext,
//   sourceType
// }) => {
//   const intent = detectIntent(question);
//   const chunks = splitToChunks(documentContext);

//   const relevantChunks = selectRelevantChunks(
//     chunks,
//     question,
//     intent === "summary" ? 8 : 4
//   );

//   const context = buildContext(highlightedText, relevantChunks);
//   const prompt = buildPrompt(question, chatHistory, context, intent);
//   const answer = await callGemini(prompt);

//   return {
//     answer,
//     confidence: relevantChunks.length ? 0.9 : 0.6,
//     metadata: {
//       model: "gemini-flash-latest",
//       intent,
//       chunksUsed: relevantChunks.length,
//       sourceType
//     }
//   };
// };

// module.exports = { askAI };
require('dotenv').config();
const axios = require('axios');

/* ---------- 1. Detect user intent ---------- */
function detectIntent(question) {
  const q = question.toLowerCase();
  if (q.includes("summary") || q.includes("summarize") || q.includes("what is this chapter about")) return "summary";
  if (q.includes("compare") || q.includes("relate")) return "compare";
  return "explain";
}

/* ---------- 2. Split document into chunks ---------- */
function splitToChunks(text, maxLength = 600) {
  if (!text) return [];
  const paragraphs = text.split(/\n+/);
  const chunks = [];
  let current = "";

  for (const p of paragraphs) {
    if ((current + p).length > maxLength) {
      chunks.push(current.trim());
      current = p;
    } else {
      current += " " + p;
    }
  }
  if (current) chunks.push(current.trim());
  return chunks;
}

/* ---------- 3. Select relevant chunks ---------- */
function selectRelevantChunks(chunks, question, limit) {
  const keywords = question.toLowerCase().split(" ").filter(w => w.length > 2);
  return chunks
    .map(chunk => ({
      chunk,
      score: keywords.reduce((acc, word) => acc + (chunk.toLowerCase().includes(word) ? 1 : 0), 0)
    }))
    .filter(i => i.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(i => i.chunk);
}

/* ---------- 4. Build document context ---------- */
function buildContext(highlightedText, relevantChunks) {
  if (highlightedText) {
    return `
FOCUS SECTION:
${highlightedText}

BROADER DOCUMENT CONTEXT:
${relevantChunks.join("\n---\n")}
`;
  }
  return relevantChunks.join("\n---\n");
}

/* ---------- 5. Format chat history ---------- */
function formatChatHistory(chatHistory = []) {
  if (!chatHistory.length) return "None";
  return chatHistory
    .map(m => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n");
}

/* ---------- 6. Build prompt ---------- */
function buildPrompt(question, chatHistory, context, intent) {
  return `
You are an AI assistant analyzing a document.


Rules:
- Do NOT give generic answers
- Use clear, full explanations
- Answer about the document unless explicitly stated otherwise
- Keep answers short and focused

Answer priority rules:

1. If the question can be fully answered using the provided document, answer using ONLY information from the document.
2. If the document provides only a partial answer:
   - You MAY add background knowledge
   - Any such info MUST be labeled: "Not from the document:"
3. Do NOT invent document content.

Conversation so far:
${formatChatHistory(chatHistory)}

Document context:
${context}

Question:
${question}
`;
}

/* ---------- 7. Call Gemini ---------- */
async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY missing");

  const response = await axios.post(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
    {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, topP: 0.8 }
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey
      }
    }
  );

  const candidate = response.data?.candidates?.[0];
  return candidate?.content?.parts?.map(p => p.text).join("\n").trim() || "";
}

/* ---------- 8. askAI ---------- */
async function askAI({ question, chatHistory = [], highlightedText, documentContext, sourceType }) {
  const intent = detectIntent(question);
  const chunks = splitToChunks(documentContext);

  const relevantChunks = selectRelevantChunks(chunks, question, intent === "summary" ? 8 : 4);
  const context = buildContext(highlightedText, relevantChunks);
  const prompt = buildPrompt(question, chatHistory, context, intent);

  try {
    const answer = await callGemini(prompt);
    return {
      answer,
      confidence: relevantChunks.length ? 0.9 : 0.6,
      metadata: {
        model: "gemini-flash-latest",
        intent,
        chunksUsed: relevantChunks.length,
        sourceType
      }
    };
  } catch (err) {
    console.error("AI error:", err.message || err);
    return {
      answer: "",
      confidence: 0,
      metadata: { model: "gemini-flash-latest", intent, chunksUsed: 0, sourceType },
      error: "AI service unavailable"
    };
  }
}

module.exports = { askAI };