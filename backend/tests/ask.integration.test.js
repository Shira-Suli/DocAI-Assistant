const request = require('supertest');
const app = require('../app'); // ההנחה שה־Express app שלך מיוצא ב-app.js
const axios = require('axios');

jest.mock('axios'); // Mock axios כדי לא לקרוא ל-Gemini אמיתי

describe('/ask endpoint — Integration Test', () => {
  beforeAll(() => {
    // Mock תגובה של Gemini
    axios.post.mockResolvedValue({
      data: {
        candidates: [
          { content: { parts: [{ text: "AI is a field of computer science creating intelligent machines." }] } }
        ]
      }
    });
  });

  it('POST /ask returns answer with correct structure', async () => {
    const res = await request(app)
      .post('/ask')
      .send({
        question: "What is AI?",
        chatHistory: [],
        highlightedText: null,
        documentContext: "Artificial Intelligence (AI) is a field of computer science.",
        sourceType: "document"
      });

    console.log("Response body:", res.body);

    expect(typeof res.body.answer).toBe('string');
    expect(res.body.answer.length).toBeGreaterThan(0);
    expect(res.body.confidence).toBeGreaterThanOrEqual(0.6);
    expect(res.body.metadata).toBeDefined();
    expect(res.body.metadata.model).toBe("gemini-flash-latest");
    expect(res.body.metadata.intent).toBe("explain");
    expect(res.body.metadata.sourceType).toBe("document");
  });
});