const express = require('express');
const pool = require('../db/pool');
const router = express.Router();

router.get('/:roomId', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT c.*, u.username FROM chat_messages c
     LEFT JOIN users u ON u.id=c.sender_id
     WHERE c.room_id=? ORDER BY c.id DESC LIMIT 50`,
    [req.params.roomId]
  );
  res.json(rows.reverse());
});

module.exports = router;
