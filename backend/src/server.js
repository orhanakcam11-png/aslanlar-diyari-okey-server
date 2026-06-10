const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const chatRoutes = require('./routes/chat');
const giftRoutes = require('./routes/gifts');
const adminRoutes = require('./routes/admin');
const setupSocket = require('./socket');

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: process.env.CLIENT_URL || '*'}));
app.use(express.json());

app.get('/', (req, res) => res.json({ app: 'Feke Okey API', status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/gifts', giftRoutes);
app.use('/api/admin', adminRoutes);

const io = new Server(server, { cors: { origin: process.env.CLIENT_URL || '*' } });
setupSocket(io);

const port = process.env.PORT || 5000;
server.listen(port, () => console.log('Feke Okey API çalışıyor: http://localhost:' + port));
