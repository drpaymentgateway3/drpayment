const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Request Withdrawal
router.post('/request', authMiddleware, async (req, res) => {
  try {
    const { amount, bankName, accountNumber, accountName } = req.body;

    // Validate amount
    if (amount < 100000) {
      return res.status(400).json({ error: 'Minimum withdrawal amount is Rp 100,000' });
    }

    const merchantResult = await pool.query('SELECT id, balance FROM merchants WHERE user_id = $1', [req.user.id]);
    
    if (merchantResult.rows.length === 0) {
      return res.status(404).json({ error: 'Merchant not found' });
    }

    if (merchantResult.rows[0].balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const merchantId = merchantResult.rows[0].id;

    const result = await pool.query(
      'INSERT INTO withdrawals (id, merchant_id, amount, bank_name, account_number, account_name, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [uuidv4(), merchantId, amount, bankName, accountNumber, accountName, 'pending']
    );

    res.status(201).json({ message: 'Withdrawal request submitted', withdrawal: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Withdrawals
router.get('/', authMiddleware, async (req, res) => {
  try {
    const merchantResult = await pool.query('SELECT id FROM merchants WHERE user_id = $1', [req.user.id]);
    
    if (merchantResult.rows.length === 0) {
      return res.status(404).json({ error: 'Merchant not found' });
    }

    const result = await pool.query(
      'SELECT * FROM withdrawals WHERE merchant_id = $1 ORDER BY created_at DESC',
      [merchantResult.rows[0].id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
