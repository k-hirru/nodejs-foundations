// src/server.ts
import express from 'express';
import tasksApp from './app';
import usersRouter from './users';

const app = express();
app.use(express.json());

app.use(tasksApp);
app.use('/users', usersRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
