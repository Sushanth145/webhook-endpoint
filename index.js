const express = require('express');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// ✅ Use this to parse incoming JSON bodies
app.use(express.json());

// ✅ Serve static HTML from /public
app.use(express.static(path.join(__dirname, 'public')));

// 🌐 Webhook receiver
app.post('/webhook/shiprocket', async (req, res) => {
  const { order_id, status, tracking_number, timestamp } = req.body;

  if (!order_id || !status) {
    return res.status(400).send("Invalid payload");
  }

  try {
    await pool.query(`
      INSERT INTO orders (order_id, status, tracking_number, updated_at)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (order_id) DO UPDATE
      SET status = $2, tracking_number = $3, updated_at = $4
    `, [order_id, status, tracking_number, timestamp]);

    res.status(200).send('Webhook received');
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// 📊 Endpoint to get orders
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
