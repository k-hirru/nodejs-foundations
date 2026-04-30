// app.js

const express = require('express');
const app = express();
 
app.use(express.json());
 
app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});
 
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});
 
const PORT = 3005;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

