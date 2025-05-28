const express = require('express');
const { OpenAI } = require('openai');
const cors = require('cors');
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

const PORT = 5001;
app.listen(PORT, () => console.log(`AI feedback server running on port ${PORT}`));

