const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const router = express.Router();

// Create Merchant Account (After Registration)
router.post('/setup-merchant', authMiddleware, async (req, res) => {
  try {
    const { businessName, businessType, website, businessRegistration } = req.body;
    
    // Check if merchant already exists
    const existingMerchant = await pool.query(
      'SELECT id FROM merchants WHERE user_id = $1',
      [req.user.id]
    );

    if (existingMerchant.rows.length > 0) {
      return res.status(400).json({ error: 'Merchant account already exists' });
    }

    const merchantId = uuidv4();
    const apiKey = `pk_live_${uuidv4().replace(/-/g, '')}`;
    const apiSecret = `sk_live_${uuidv4().replace(/-/g, '')}`;

    // Create merchant
    await pool.query(
      'INSERT INTO merchants (id, user_id, business_name, business_type, website, business_registration, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [merchantId, req.user.id, businessName, businessType, website, businessRegistration, 'active']
    );

    // Create API key
    await pool.query(
      'INSERT INTO api_keys (id, merchant_id, key_name, api_key, api_secret, status) VALUES ($1, $2, $3, $4, $5, $6)',
      [uuidv4(), merchantId, 'Default Key', apiKey, apiSecret, 'active']
    );

    res.status(201).json({
      message: 'Merchant account created successfully',
      merchantId,
      apiKey,
      apiSecret
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Merchant Details
router.get('/merchant-info', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM merchants WHERE user_id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Merchant not found. Please setup merchant account first.' });
    }

    // Get API keys
    const apiKeys = await pool.query(
      'SELECT key_name, status, created_at FROM api_keys WHERE merchant_id = $1',
      [result.rows[0].id]
    );

    res.json({
      merchant: result.rows[0],
      apiKeys: apiKeys.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Merchant Settings
router.get('/settings', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM merchants WHERE user_id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Merchant not found' });
    }

    res.json({
      webhook_url: 'https://your-site.com/webhook',
      webhook_secret: 'whsec_xxxxx',
      commission_rate: 2.5,
      settlement_frequency: 'daily',
      auto_settlement: true
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
