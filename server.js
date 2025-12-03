// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root → Redirect to Swagger UI (clean & professional)
app.get('/', (req, res) => {
  res.redirect('/docs');
});

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'VIP Tickets API is running',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Swagger UI Setup
const setupSwagger = require('./swagger');
setupSwagger(app, {
  uiPath: '/docs',
  jsonPath: '/api-docs',
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vip-tickets')
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// API Routes
app.use('/api/vip', require('./routes/vip'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/applicant', require('./routes/applicant'));

// Catch-all 404 for any undefined API routes (CORRECT WAY)
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({
      message: 'API route not found',
      path: req.originalUrl,
    });
  }
  next();
});

// Global Error Handler (optional but recommended)
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger UI      → http://localhost:${PORT}/docs`);
  console.log(`OpenAPI JSON    → http://localhost:${PORT}/api-docs`);
  console.log(`Public Search   → http://localhost:${PORT}/api/vip/search?query=John`);
  console.log(`Health Check    → http://localhost:${PORT}/health`);
});