const askAI = async (question, context, sourceType) => {
  // MOCK חכם – נראה אמיתי
  return {
    answer: `You asked: "${question}". 
Based on the provided context, this section explains the main idea in simple terms.`,
    confidence: 0.85,
    metadata: {
      model: 'mock-ai',
      sourceType: sourceType || 'unknown'
    }
  };
};

module.exports = { askAI };
