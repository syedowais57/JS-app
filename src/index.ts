import express, { Request, Response } from 'express';
import { greet } from './utils';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from TypeScript Express app!');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
