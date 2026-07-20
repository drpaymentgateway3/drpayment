const express = require('express');
const router = express.Router();

// API Documentation
router.get('/', (req, res) => {
  const documentation = {
    title: 'DrPayment Gateway API Documentation',
    version: '1.0.0',
    baseUrl: process.env.API_BASE_URL || 'http://localhost:5000',
    endpoints: [
      {
        method: 'POST',
        path: '/api/auth/register',
        description: 'Register a new merchant',
        body: { username: 'string', email: 'string', password: 'string', fullName: 'string' }
      },
      {
        method: 'POST',
        path: '/api/auth/login',
        description: 'Login to account',
        body: { username: 'string', password: 'string' }
      },
      {
        method: 'GET',
        path: '/api/auth/me',
        description: 'Get current user info',
        headers: { Authorization: 'Bearer token' }
      },
      {
        method: 'POST',
        path: '/api/transactions/create',
        description: 'Create new transaction',
        headers: { Authorization: 'Bearer token' },
        body: { orderId: 'string', amount: 'number', paymentMethod: 'string', customerName: 'string', customerEmail: 'string' }
      },
      {
        method: 'GET',
        path: '/api/transactions',
        description: 'Get all transactions',
        headers: { Authorization: 'Bearer token' }
      },
      {
        method: 'POST',
        path: '/api/merchants/create',
        description: 'Create merchant account',
        headers: { Authorization: 'Bearer token' },
        body: { businessName: 'string', businessType: 'string', website: 'string' }
      },
      {
        method: 'GET',
        path: '/api/merchants/profile',
        description: 'Get merchant profile',
        headers: { Authorization: 'Bearer token' }
      },
      {
        method: 'POST',
        path: '/api/withdrawals/request',
        description: 'Request withdrawal',
        headers: { Authorization: 'Bearer token' },
        body: { amount: 'number', bankName: 'string', accountNumber: 'string', accountName: 'string' }
      }
    ]
  };
  res.json(documentation);
});

router.get('/swagger', (req, res) => {
  res.json({
    openapi: '3.0.0',
    info: { title: 'DrPayment Gateway API', version: '1.0.0' },
    servers: [{ url: process.env.API_BASE_URL || 'http://localhost:5000' }],
    paths: {
      '/api/auth/login': {
        post: { summary: 'User login', tags: ['Auth'] }
      },
      '/api/transactions/create': {
        post: { summary: 'Create transaction', tags: ['Transactions'] }
      }
    }
  });
});

module.exports = router;
