const express = require('express');
const pool = require('../db/pool');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM rooms ORDER BY id DESC');
  res.json(rows);
});

router.post('/', auth, async (req, res) => {
  const { room_name, min_bet = 1000 } = req.body;
  const [result] = await pool.query(
    'INSERT INTO rooms (room_name,min_bet,created_by) VALUES (?,?,?)',
    [room_name || 'Feke Okey Masası', min_bet, req.user.id]
  );
  res.json({ id: result.insertId, room_name, min_bet });
});

router.post('/:id/join', auth, async (req, res) => {
  const roomId = req.params.id;
  const [players] = await pool.query('SELECT COUNT(*) c FROM room_players WHERE room_id=?', [roomId]);
  const seatNo = players[0].c + 1;
  if (seatNo > 4) return res.status(400).json({ error: 'Masa dolu' });

  await pool.query('INSERT IGNORE INTO room_players (room_id,user_id,seat_no) VALUES (?,?,?)', [roomId, req.user.id, seatNo]);
  await pool.query('UPDATE rooms SET status=?, current_players = current_players + 1 WHERE id=?', ['waiting', roomId]).catch(()=>{});
  res.json({ ok: true, room_id: roomId, seat_no: seatNo });
});

module.exports = router;
