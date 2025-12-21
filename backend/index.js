const express = require('express');
const cors = require('cors');

const askRoutes = require('./routes/askRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Ask AI
app.use('/ask', askRoutes); 

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`DOCAI-ASSISTANT backend running on port ${PORT}`);
});
