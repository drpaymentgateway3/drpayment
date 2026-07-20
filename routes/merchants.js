const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Create Merchant
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { businessName, businessType, website, businessRegistration } = req.body;
    const merchantId = uuidv4();
    const apiKey = `pk_live_${uuidv4().replace(/-/g, '')}`;
    const apiSecret = `sk_live_${uuidv4().replace(/-/g, '')}`;

    const result = await pool.query(
      'INSERT INTO merchants (id, user_id, business_name, business_type, website, business_registration, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [merchantId, req.user.id, businessName, businessType, website, businessRegistration, 'active']
    );

    // Update user with API key
    await pool.query(
      'UPDATE users SET api_key = $1, api_secret = $2 WHERE id = $3',
      [apiKey, apiSecret, req.user.id]
    );

    res.status(201).json({
      message: 'Merchant created successfully',
      merchant: result.rows[0],
      apiKey,
      apiSecret
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Merchant Profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM merchants WHERE user_id = $1', [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Merchant not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Merchant Profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { businessName, businessType, website, businessRegistration, description } = req.body;
    const result = await pool.query(
      'UPDATE merchants SET business_name = $1, business_type = $2, website = $3, business_registration = $4, description = $5, updated_at = CURRENT_TIMESTAMP WHERE user_id = $6 RETURNING *',
      [businessName, businessType, website, businessRegistration, description, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
