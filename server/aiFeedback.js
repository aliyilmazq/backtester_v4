/* eslint-disable no-console */
const axios = require('axios');
const cors = require('cors');
const express = require('express');
const { OpenAI } = require('openai');

require('dotenv').config({ path: '../.env' });

const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/ai-feedback', async (req, res) => {
  const { metrics } = req.body;
  const prompt = `Aşağıdaki finansal strateji metriklerini analiz et ve kullanıcıya Türkçe, kısa ve profesyonel bir özet ver:\n${JSON.stringify(metrics, null, 2)}`;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    });
    res.json({ feedback: completion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Polygon.io'dan OHLCV verisi çeken izole endpoint
app.post('/api/polygon-ohlcv', async (req, res) => {
  const { ticker, startDate, endDate } = req.body;
  const apiKey = process.env.POLYGON_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Polygon API anahtarı eksik.' });
  }
  try {
    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${startDate}/${endDate}`;
    const params = {
      adjusted: 'true',
      sort: 'asc',
      limit: 5000,
      apiKey,
    };
    const response = await axios.get(url, { params });
    return res.json(response.data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`AI feedback server running on port ${PORT}`));

