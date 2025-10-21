import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const API_BASE = '/api';

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));

// Simple in-memory store (ephemeral; restarts will reset)
let items = [];

app.get(`${API_BASE}/health`, (req, res) => {
  res.json({ ok: true, service: 'ChristmasOnCandleflower API', db: 'none' });
});

app.get(`${API_BASE}/items`, (req, res) => {
  const sorted = [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(sorted);
});

app.post(`${API_BASE}/items`, (req, res) => {
  try {
    const { name } = req.body || {};
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'name required' });
    }
    const doc = { _id: crypto.randomUUID(), name: name.trim(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    items.push(doc);
    res.status(201).json(doc);
  } catch (e) {
    console.error('Create error:', e);
    res.status(500).json({ error: 'server error' });
  }
});

app.listen(PORT, () => console.log(`[api] listening on :${PORT}`));
