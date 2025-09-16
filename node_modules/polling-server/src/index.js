import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { initSocket } from './socket.js';

dotenv.config();

const app = express();

// Normalize CORS origins
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : '*';

app.use(cors({ origin: allowedOrigins }));

app.get('/health', (_req, res) => res.json({ ok: true }));

const server = http.createServer(app);

// Pass normalized origins to socket
initSocket(server, allowedOrigins);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
