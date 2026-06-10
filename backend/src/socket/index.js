const pool = require('../db/pool');

function setupSocket(io) {
  io.on('connection', (socket) => {
    socket.on('room:join', ({ roomId, username }) => {
      socket.join('room_' + roomId);
      io.to('room_' + roomId).emit('system', username + ' masaya katıldı.');
    });

    socket.on('chat:send', async ({ roomId, userId, username, message }) => {
      if (!message) return;
      await pool.query(
        'INSERT INTO chat_messages (room_id,sender_id,message_text) VALUES (?,?,?)',
        [roomId, userId || null, message]
      );
      io.to('room_' + roomId).emit('chat:new', {
        username: username || 'Misafir',
        message,
        time: new Date().toLocaleTimeString('tr-TR')
      });
    });

    socket.on('gift:send', ({ roomId, sender, receiver, giftName }) => {
      io.to('room_' + roomId).emit('gift:new', { sender, receiver, giftName });
    });

    socket.on('disconnect', () => {});
  });
}

module.exports = setupSocket;
