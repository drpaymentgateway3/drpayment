const express = require('express');
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Get Commission Summary
router.get('/summary', authMiddleware, async (req, res) => {
  try {
    const merchantResult = await pool.query('SELECT id FROM merchants WHERE user_id = $1', [req.user.id]);
    
    if (merchantResult.rows.length === 0) {
      return res.status(404).json({ error: 'Merchant not found' });
    }

    const merchantId = merchantResult.rows[0].id;

    const result = await pool.query(`
      SELECT 
        SUM(commission_amount) as total_commission,
        COUNT(*) as total_transactions,
        AVG(commission_amount) as avg_commission
      FROM commissions 
      WHERE merchant_id = $1 AND status = 'completed'
    `, [merchantId]);

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Commission History
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const merchantResult = await pool.query('SELECT id FROM merchants WHERE user_id = $1', [req.user.id]);
    
    if (merchantResult.rows.length === 0) {
      return res.status(404).json({ error: 'Merchant not found' });
    }

    const result = await pool.query(
      'SELECT * FROM commissions WHERE merchant_id = $1 ORDER BY created_at DESC LIMIT 100',
      [merchantResult.rows[0].id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
