/* eslint-disable no-console */
const path = require('path');

const cors = require('cors');
const express = require('express');
const { OpenAI } = require('openai');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const errorHandler = require('./middleware/errorHandler');
const { 
  validateBacktestRequest, 
  validateIndicatorRequest, 
  validateMarketDataRequest 
} = require('./middleware/validation');
const apiRoutes = require('./routes/api');

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Apply validation middleware to specific routes
app.post('/api/backtest/run', validateBacktestRequest);
app.post('/api/backtest/indicator', validateIndicatorRequest);
app.get('/api/data/market', validateMarketDataRequest);

// Routes
app.use('/api', apiRoutes);

// Legacy AI feedback endpoint (keeping for compatibility)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/ai-feedback', async (req, res) => {
  try {
    const { metrics } = req.body;
    
    if (!metrics) {
      return res.status(400).json({ 
        success: false, 
        error: 'Metrics are required' 
      });
    }
    
    const prompt = `Aşağıdaki finansal strateji metriklerini analiz et ve kullanıcıya Türkçe, kısa ve profesyonel bir özet ver:\n${JSON.stringify(metrics, null, 2)}`;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    });
    
    return res.json({ 
      success: true,
      feedback: completion.choices[0].message.content 
    });
  } catch (err) {
    console.error('AI feedback error:', err);
    return res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});