import express from 'express';
import { greet } from './utils';

const app = express();
const PORT = 3000;
greet('Owais');
app.get('/', (req, res) => {
  res.send('Owais - Build Success!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});