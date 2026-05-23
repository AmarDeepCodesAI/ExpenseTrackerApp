const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// GET — all expenses
app.get('/api/expenses', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM expenses ORDER BY date DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST — naya expense Add
app.post('/api/expenses', async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    const result = await pool.query(
      'INSERT INTO expenses (title, amount, category, date) VALUES ($1,$2,$3,$4) RETURNING *',
      [title, amount, category, date]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE — expense Delete
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM expenses WHERE id=$1', [req.params.id]);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT — expense update 

app.put('/api/expenses/:id', async (req, res) => {
    try {
      const { title, amount, category, date } = req.body;
      const result = await pool.query(
        'UPDATE expenses SET title=$1, amount=$2, category=$3, date=$4 WHERE id=$5 RETURNING *',
        [title, amount, category, date, req.params.id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Expense nahi mila" });
      }
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server Running on port ${PORT}`));