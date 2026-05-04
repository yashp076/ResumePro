import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { fileURLToPath } from 'node:url';
import { router } from './routes.js';

dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)) });

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Origin is not allowed by CORS'));
  }
}));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'ai-resume-builder-api' });
});

app.use('/api', router);

app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: status === 500 ? 'Unexpected server error' : err.message
  });
});

app.listen(port, () => {
  console.log(`Resume Builder API listening on http://localhost:${port}`);
});
