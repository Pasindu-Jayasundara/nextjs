const express = require('express');
const app = express();

// Parse JSON bodies
app.use(express.json());

// Mount auth routes
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express server' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
