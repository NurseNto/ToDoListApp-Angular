const express = require('express');
const app = express();
const pg = require('pg');

// PostgreSQL configuration
const pool = new pg.Pool({
  user: 'your_username',
  password: 'your_password',
  host: 'localhost',
  port: 5432,
  database: 'todo_app'
});

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.get('/api/tasks', (req, res) => {
  pool.query('SELECT * FROM tasks', (err, result) => {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(result.rows);
    }
  });
});

app.post('/api/tasks', (req, res) => {
  const { title, description } = req.body;
  pool.query('INSERT INTO tasks (title, description) VALUES ($1, $2)', [title, description], (err) => {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.sendStatus(201);
    }
  });
});

app.put('/api/tasks/:id', (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;
  pool.query('UPDATE tasks SET title = $1, description = $2 WHERE id = $3', [title, description, id], (err) => {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.sendStatus(200);
    }
  });
});

app.delete('/api/tasks/:id', (req, res) => {
  const id = req.params.id;
  pool.query('DELETE FROM tasks WHERE id = $1', [id], (err) => {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.sendStatus(200);
    }
  });
});

app.put('/api/tasks/:id/like', (req, res) => {
  const id = req.params.id;
  pool.query('UPDATE tasks SET likes = likes + 1 WHERE id = $1', [id], (err) => {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.sendStatus(200);
    }
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
