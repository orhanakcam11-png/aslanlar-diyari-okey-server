const express = require('express');
const pool = require('../db/pool');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM gifts WHERE is_active=1 ORDER BY price ASC');
  res.json(rows);
});

router.post('/send', auth, async (req, res) => {
  const { receiver_id, room_id, gift_id, quantity = 1 } = req.body;

  const [[gift]] = await pool.query('SELECT * FROM gifts WHERE id=?', [gift_id]);
  if (!gift) return res.status(404).json({ error: 'Hediye bulunamadı' });

  const total = gift.price * quantity;
  const [[sender]] = await pool.query('SELECT coins FROM users WHERE id=?', [req.user.id]);
  if (!sender || sender.coins < total) return res.status(400).json({ error: 'Jeton yetersiz' });

  await pool.query('UPDATE users SET coins=coins-? WHERE id=?', [total, req.user.id]);
  await pool.query('UPDATE users SET coins=coins+? WHERE id=?', [total, receiver_id]);
  await pool.query(
    'INSERT INTO gift_transactions (sender_id,receiver_id,room_id,gift_id,quantity,total_price) VALUES (?,?,?,?,?,?)',
    [req.user.id, receiver_id, room_id || null, gift_id, quantity, total]
  );

  res.json({ ok: true, total });
});

module.exports = router;
