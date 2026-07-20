const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Create Transaction
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { orderId, amount, paymentMethod, customerName, customerEmail, description } = req.body;
    const merchantResult = await pool.query('SELECT id FROM merchants WHERE user_id = $1', [req.user.id]);
    
    if (merchantResult.rows.length === 0) {
      return res.status(404).json({ error: 'Merchant not found' });
    }

    const merchantId = merchantResult.rows[0].id;
    const transactionId = `TRX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const commission = (amount * 2.5) / 100; // 2.5% commission
    const netAmount = amount - commission;

    const result = await pool.query(
      'INSERT INTO transactions (id, merchant_id, order_id, amount, commission, net_amount, payment_method, transaction_id, customer_name, customer_email, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [uuidv4(), merchantId, orderId, amount, commission, netAmount, paymentMethod, transactionId, customerName, customerEmail, description]
    );

    res.status(201).json({ message: 'Transaction created', transaction: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Transactions
router.get('/', authMiddleware, async (req, res) => {
  try {
    const merchantResult = await pool.query('SELECT id FROM merchants WHERE user_id = $1', [req.user.id]);
    
    if (merchantResult.rows.length === 0) {
      return res.status(404).json({ error: 'Merchant not found' });
    }

    const result = await pool.query(
      'SELECT * FROM transactions WHERE merchant_id = $1 ORDER BY created_at DESC LIMIT 50',
      [merchantResult.rows[0].id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Transaction by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transactions WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
