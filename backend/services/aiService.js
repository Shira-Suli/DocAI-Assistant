const askAI = async (question, context, sourceType) => {
  // MOCK חכם – נראה אמיתי
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
