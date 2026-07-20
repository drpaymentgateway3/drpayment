const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/merchants', require('./routes/merchants'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/kyc', require('./routes/kyc'));
app.use('/api/withdrawals', require('./routes/withdrawals'));
app.use('/api/commission', require('./routes/commission'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/documentation', require('./routes/documentation'));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'DrPayment Gateway is running' });
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 DrPayment Gateway running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});
