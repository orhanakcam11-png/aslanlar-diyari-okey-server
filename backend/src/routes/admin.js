const express = require('express');
const pool = require('../db/pool');
const auth = require('../middleware/auth');
const router = express.Router();

function adminOnly(req, res, next) {
  if (!req.user.is_admin) return res.status(403).json({ error: 'Admin yetkisi gerekir' });
  next();
}

router.get('/stats', auth, adminOnly, async (req, res) => {
  const [[users]] = await pool.query('SELECT COUNT(*) total FROM users');
  const [[rooms]] = await pool.query('SELECT COUNT(*) total FROM rooms');
  const [[messages]] = await pool.query('SELECT COUNT(*) total FROM chat_messages');
  const [[gifts]] = await pool.query('SELECT COUNT(*) total FROM gift_transactions');
  res.json({ users: users.total, rooms: rooms.total, messages: messages.total, gift_transactions: gifts.total });
});

router.post('/coins', auth, adminOnly, async (req, res) => {
  const { user_id, amount } = req.body;
  await pool.query('UPDATE users SET coins=coins+? WHERE id=?', [amount, user_id]);
  res.json({ ok: true });
});

module.exports = router;
