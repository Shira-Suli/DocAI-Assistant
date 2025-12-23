require('dotenv').config();
const { askAI } = require('../services/aiService');

describe('AI Service', () => {
  const doc = `
Artificial Intelligence (AI) is a field of computer science.
It focuses on creating intelligent machines.
AI systems simulate human intelligence.
`;

  it('askAI returns answer from Gemini', async () => {
    const question = "What is AI?";

    const res = await askAI(question, null, doc, "document");

    console.log("AI answer:", res.answer);

    expect(res.answer.length).toBeGreaterThan(0);
    expect(res.confidence).toBeGreaterThanOrEqual(0.7);
    expect(res.metadata.model).toBe("gemini-flash-latest");
    expect(res.metadata.intent).toBe("explain");
    expect(res.metadata.sourceType).toBe("document");
  });
});
