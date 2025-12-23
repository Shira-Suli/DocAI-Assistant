require('dotenv').config();
const { askAI } = require('../services/aiService');
const axios = require('axios');

jest.mock('axios'); // Mock axios

describe('AI Service', () => {
  beforeAll(() => {
    axios.post.mockResolvedValue({
      data: {
        candidates: [
          { content: { parts: [{ text: "AI is a field of computer science creating intelligent machines." }] } }
        ]
      }
    });
  });

  it('askAI returns answer from Gemini', async () => {
    const res = await askAI({
      question: "What is AI?",
      chatHistory: [],
      documentContext: "Artificial Intelligence (AI) is a field of computer science.",
      highlightedText: null,
      sourceType: "document"
    });

    console.log("AI answer:", res.answer);

    expect(res.answer.length).toBeGreaterThan(0);
    expect(res.confidence).toBeGreaterThanOrEqual(0.6);
    expect(res.metadata.model).toBe("gemini-flash-latest");
    expect(res.metadata.intent).toBe("explain");
    expect(res.metadata.sourceType).toBe("document");
  });
});