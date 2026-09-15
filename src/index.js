import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import api from './routes.js';

dotenv.config();
const app = express();
app.use(helmet());
app.use(cors({ origin: (process.env.CLIENT_URL || '').split(',').filter(Boolean).concat(['http://localhost:5177']) }));
app.use(express.json({ limit: '200kb' }));
app.use('/api', rateLimit({ windowMs: 60_000, max: 120 }));
app.use('/api', api);

app.get('/health', (req, res) => res.json({ ok: true, app: 'whatnot-lite', db: false }));
app.get('/', (req, res) => res.send('whatnot-lite API. Use /health and /api/shows. See docs/CONTRACT.md'));

const port = process.env.PORT || 3005;
connectDB(process.env.MONGO_URI).finally(() => {
  app.listen(port, () => console.log(`whatnot-lite on ${port}`));
});
