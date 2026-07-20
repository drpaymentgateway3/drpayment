const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Submit KYC
router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const { idType, idNumber, idDocumentUrl, selfieUrl, addressProofUrl } = req.body;

    const result = await pool.query(
      'INSERT INTO kyc_documents (id, user_id, id_type, id_number, id_document_url, selfie_url, address_proof_url, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [uuidv4(), req.user.id, idType, idNumber, idDocumentUrl, selfieUrl, addressProofUrl, 'pending']
    );

    res.status(201).json({ message: 'KYC submitted for verification', kyc: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get KYC Status
router.get('/status', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM kyc_documents WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'KYC not submitted yet' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
