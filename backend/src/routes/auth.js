const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'Eksik bilgi' });

  const hash = await bcrypt.hash(password, 10);
  try {
    const [result] = await pool.query(
      'INSERT INTO users (username,email,password_hash,status) VALUES (?,?,?,?)',
      [username, email, hash, 'online']
    );
    res.json({ id: result.insertId, username, email });
  } catch (e) {
    res.status(400).json({ error: 'Kullanıcı kayıt edilemedi', detail: e.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await pool.query('SELECT * FROM users WHERE email=? LIMIT 1', [email]);
  const user = rows[0];
  if (!user) return res.status(401).json({ error: 'Kullanıcı bulunamadı' });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Şifre hatalı' });

  await pool.query('UPDATE users SET status=? WHERE id=?', ['online', user.id]);

  const token = jwt.sign(
    { id: user.id, username: user.username, is_admin: !!user.is_admin },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: { id: user.id, username: user.username, coins: user.coins, vip_level: user.vip_level }
  });
});

module.exports = router;
