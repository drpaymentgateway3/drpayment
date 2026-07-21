const express = require('express');
const pool = require('../config/database');
const { adminMiddleware } = require('../middleware/auth');
const router = express.Router();

// Get All Users (Admin Only)
router.get('/users', adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email, full_name, role, kyc_status, status, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get New Registrations (Today) - Admin Only
router.get('/new-registrations', adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, username, email, full_name, role, created_at 
      FROM users 
      WHERE created_at::date = CURRENT_DATE
      ORDER BY created_at DESC
    `);
    res.json({
      count: result.rows.length,
      registrations: result.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Statistics - Admin Only
router.get('/statistics', adminMiddleware, async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM users WHERE role = 'merchant') as total_merchants,
        (SELECT COUNT(*) FROM users WHERE created_at::date = CURRENT_DATE) as new_users_today,
        (SELECT COUNT(*) FROM transactions) as total_transactions,
        (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE payment_status = 'success') as total_revenue,
        (SELECT COUNT(*) FROM withdrawals WHERE status = 'pending') as pending_withdrawals
    `);
    res.json(stats.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve/Reject Withdrawal - Admin Only
router.put('/withdrawal/:id', adminMiddleware, async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const result = await pool.query(
      'UPDATE withdrawals SET status = $1, rejection_reason = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [status, rejectionReason || null, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Withdrawals - Admin Only
router.get('/withdrawals', adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT w.*, u.username, m.business_name
      FROM withdrawals w
      JOIN merchants m ON w.merchant_id = m.id
      JOIN users u ON m.user_id = u.id
      ORDER BY w.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Transactions - Admin Only
router.get('/transactions', adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, u.username, m.business_name
      FROM transactions t
      JOIN merchants m ON t.merchant_id = m.id
      JOIN users u ON m.user_id = u.id
      ORDER BY t.created_at DESC
      LIMIT 100
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
