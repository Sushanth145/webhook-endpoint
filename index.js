const express = require('express');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

const app = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let webhookBuffer = [];
const BATCH_SIZE = 10;         
const BATCH_INTERVAL = 5000;   
async function flushBuffer() {
  if (webhookBuffer.length === 0) return;

  const values = [];
  const placeholders = webhookBuffer.map(({ order_id, status, tracking_number, timestamp }, i) => {
    const idx = i * 4;
    values.push(order_id, status, tracking_number, timestamp);
    return `($${idx + 1}, $${idx + 2}, $${idx + 3}, $${idx + 4})`;
  }).join(',');

  const query = `
    INSERT INTO orders (order_id, status, tracking_number, updated_at)
    VALUES ${placeholders}
    ON CONFLICT (order_id) DO UPDATE
    SET status = EXCLUDED.status,
        tracking_number = EXCLUDED.tracking_number,
        updated_at = EXCLUDED.updated_at;
  `;

  try {
    await pool.query(query, values);
    console.log(`Batch inserted ${webhookBuffer.length} records`);
    webhookBuffer = [];
  } catch (err) {
    console.error('Error in batch insert:', err);
  }
}

setInterval(flushBuffer, BATCH_INTERVAL);

app.post('/webhook/shiprocket', (req, res) => {
  const { order_id, status, tracking_number, timestamp } = req.body;

  if (!order_id || !status) {
    return res.status(400).send("Invalid payload");
  }

  webhookBuffer.push({ order_id, status, tracking_number, timestamp });

  if (webhookBuffer.length >= BATCH_SIZE) {
    flushBuffer();
  }

  res.status(200).send('Webhook received');
});

app.get('/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY updated_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching orders');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
