// const axios = require('axios');

// /* ---------- 1. Detect user intent ---------- */
// function detectIntent(question) {
//   const q = question.toLowerCase();
//   if (q.includes("summary") || q.includes("summarize") || q.includes("what is this chapter about")) {
//     return "summary";
//   }
//   if (q.includes("compare") || q.includes("relate")) {
//     return "compare";
//   }
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
//   const keywords = question.toLowerCase().split(" ").filter(w => w.length > 2);
//   return chunks
//     .map(chunk => {
//       const score = keywords.reduce(
//         (acc, word) => acc + (chunk.toLowerCase().includes(word) ? 1 : 0),
//         0
//       );
//       return { chunk, score };
//     })
//     .filter(item => item.score > 0)
//     .sort((a, b) => b.score - a.score)
//     .slice(0, limit)
//     .map(item => item.chunk);
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

// /* ---------- 5. Build smart prompt ---------- */
// function buildPrompt(question, context, intent) {
//   return `
// You are an AI assistant analyzing a document.

// Rules:
// Do NOT give generic answers
// Use clear, full explanations
// -when asked about the page answer about the content unless specified otherwise.
// -answer short and focused answers.

// Answer priority rules:
// 1. If the question can be fully and sufficiently answered using the provided document, answer using ONLY information from the document.
// 2. If the document provides only a partial, indirect, or minimal answer:
//    - You MAY add additional helpful information using general background knowledge,
//    - As long as it does NOT contradict the document.
// 3. Any information that is NOT derived from the document MUST be clearly labeled as:
//    "Not from the document:".
// 4. Do NOT invent document content or imply that external knowledge comes from the document.

// Context:
// ${context}

// Question:
// ${question}

// Return an accurate, well-structured answer.
// `;
// }

// /* ---------- 6. Call Gemini ---------- */
// async function callGemini(prompt) {
//   console.log("🔥 CALLING GEMINI (REST, flash-latest) 🔥");
//   const apiKey = process.env.GEMINI_API_KEY;
//   if (!apiKey) throw new Error("GEMINI_API_KEY is missing");

//   const response = await axios.post(
//     "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
//     {
//       contents: [{ role: "user", parts: [{ text: prompt }] }],
//       generationConfig: { temperature: 0.4, topP: 0.8 }
//     },
//     { headers: { "Content-Type": "application/json", "X-Goog-Api-Key": apiKey } }
//   );

//   const candidate = response.data?.candidates?.[0];
//   if (!candidate) return "";

//   if (candidate.content?.parts?.length) {
//     return candidate.content.parts.map(p => p.text).join("\n").trim();
//   }
//   if (candidate.content?.text) {
//     return candidate.content.text.trim();
//   }
//   return "";
// }

// /* ---------- 7. Final AI pipeline ---------- */
// const askAI = async (question, highlightedText, documentContext, sourceType) => {
//   const intent = detectIntent(question);
//   const chunks = splitToChunks(documentContext);
//   const chunkLimit = intent === "summary" ? 8 : 4;
//   const relevantChunks = selectRelevantChunks(chunks, question, chunkLimit);
//   const context = buildContext(highlightedText, relevantChunks);
//   const prompt = buildPrompt(question, context, intent);
//   const answer = await callGemini(prompt);

//   // Fixed confidence logic
//   let confidence = 0.5;
//   if (relevantChunks.length > 0) confidence = 0.9;
//   else if (answer && answer.length > 0) confidence = 0.7;

//   return {
//     answer,
//     confidence,
//     metadata: { model: "gemini-flash-latest", intent, chunksUsed: relevantChunks.length, sourceType }
//   };
// };

// module.exports = { askAI, detectIntent, splitToChunks, selectRelevantChunks, buildContext, buildPrompt, callGemini };

const axios = require("axios");

/* ---------- 1. Detect user intent ---------- */
function detectIntent(question) {
  const q = question.toLowerCase();

  if (
    q.includes("summary") ||
    q.includes("summarize") ||
    q.includes("what is this chapter about")
  ) return "summary";

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
  const keywords = question
    .toLowerCase()
    .split(" ")
    .filter(w => w.length > 2);

  return chunks
    .map(chunk => ({
      chunk,
      score: keywords.reduce(
        (acc, word) => acc + (chunk.toLowerCase().includes(word) ? 1 : 0),
        0
      )
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
- Use the document as the main source
- Do NOT invent content
- Be short and focused

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

/* ---------- 8. askAI (ONE TRUE VERSION) ---------- */
const askAI = async ({
  question,
  chatHistory = [],
  highlightedText,
  documentContext,
  sourceType
}) => {
  const intent = detectIntent(question);
  const chunks = splitToChunks(documentContext);

  const relevantChunks = selectRelevantChunks(
    chunks,
    question,
    intent === "summary" ? 8 : 4
  );

  const context = buildContext(highlightedText, relevantChunks);
  const prompt = buildPrompt(question, chatHistory, context, intent);
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
};

module.exports = { askAI };
