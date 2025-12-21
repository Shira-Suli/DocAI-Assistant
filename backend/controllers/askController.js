const { askAI } = require('../services/aiService');

const handleAsk = async (req, res) => {
  const { question, highlightedText, documentContext, sourceType } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Missing question field' });
  }

  const usedContext = highlightedText ? 'highlightedText' : 'documentContext';
  const context = highlightedText || documentContext || '';

  try {
    const aiResult = await askAI(question, context, sourceType);

    res.json({
      answer: aiResult.answer,
      confidence: aiResult.confidence,
      usedContext,
      metadata: aiResult.metadata
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI service unavailable' });
  }
};

module.exports = { handleAsk };
