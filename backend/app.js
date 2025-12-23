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

// Routes
app.use('/ask', askRoutes);

module.exports = app;
