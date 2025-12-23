require('dotenv').config();
const request = require('supertest');
const app = require('../app');

describe('/ask endpoint — Integration Test', () => {
  it('POST /ask returns answer with correct structure', async () => {
    const res = await request(app)
      .post('/ask')
      .send({
        question: "What is AI?",
        highlightedText: null,
        documentContext: `
Artificial Intelligence (AI) is a field of computer science.
It focuses on creating intelligent machines.
AI systems simulate human intelligence.
`,
        sourceType: "document"
      });

    console.log("Response body:", res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('answer');
    expect(typeof res.body.answer).toBe('string');
    expect(res.body).toHaveProperty('confidence');
    expect(res.body.confidence).toBeGreaterThanOrEqual(0.7);
    expect(res.body).toHaveProperty('metadata');
    expect(res.body.metadata.model).toBe("gemini-flash-latest");
  });
});
