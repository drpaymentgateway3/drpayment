const express = require('express');
const pool = require('../config/database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const router = express.Router();

// Get All Users (Admin)
router.get('/users', adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, username, email, full_name, role, kyc_status, status, created_at 
      FROM users 
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User Activity (Admin)
router.get('/user-activity', adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.username,
        u.email,
        u.created_at as registration_date,
        (SELECT COUNT(*) FROM transactions WHERE merchant_id = (SELECT id FROM merchants WHERE user_id = u.id)) as transaction_count,
        (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE merchant_id = (SELECT id FROM merchants WHERE user_id = u.id)) as total_volume
      FROM users u
      ORDER BY u.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get New Users Today (Admin)
router.get('/new-users-today', adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, username, email, full_name, created_at 
      FROM users 
      WHERE created_at::date = CURRENT_DATE
      ORDER BY created_at DESC
    `);
    res.json({
      count: result.rows.length,
      users: result.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Monitor Daily (Admin)
router.get('/daily-report', adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        CURRENT_DATE as report_date,
        (SELECT COUNT(*) FROM users WHERE created_at::date = CURRENT_DATE) as new_users,
        (SELECT COUNT(*) FROM transactions WHERE created_at::date = CURRENT_DATE) as transactions_today,
        (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE created_at::date = CURRENT_DATE AND payment_status = 'success') as revenue_today,
        (SELECT COUNT(*) FROM withdrawals WHERE created_at::date = CURRENT_DATE) as withdrawal_requests_today
    `);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Notifications (Admin) - Real-time updates
router.get('/notifications', adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        'new_user' as type,
        u.username as message,
        u.created_at as timestamp
      FROM users u
      WHERE u.created_at > NOW() - INTERVAL '1 hour'
      
      UNION ALL
      
      SELECT 
        'withdrawal_request' as type,
        CONCAT('Withdrawal request: Rp ', w.amount) as message,
        w.created_at as timestamp
      FROM withdrawals w
      WHERE w.status = 'pending'
      
      ORDER BY timestamp DESC
      LIMIT 20
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
