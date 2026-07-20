const express = require('express');
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Get Dashboard Stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const merchantResult = await pool.query('SELECT id FROM merchants WHERE user_id = $1', [req.user.id]);
    
    if (merchantResult.rows.length === 0) {
      return res.status(404).json({ error: 'Merchant not found' });
    }

    const merchantId = merchantResult.rows[0].id;

    const stats = await pool.query(`
      SELECT 
        (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE merchant_id = $1 AND payment_status = 'success') as total_transactions,
        (SELECT COUNT(*) FROM transactions WHERE merchant_id = $1 AND payment_status = 'success') as transaction_count,
        (SELECT COALESCE(SUM(commission_amount), 0) FROM commissions WHERE merchant_id = $1) as total_commission,
        (SELECT balance FROM merchants WHERE id = $1) as current_balance
    `, [merchantId]);

    res.json(stats.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
