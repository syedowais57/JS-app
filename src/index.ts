import express, { Request, Response } from 'express';
import { greet, calculateAge } from './utils';
import { getConfig } from './config';

const app = express();
const config = getConfig();
const PORT = config.port;

app.get('/', (req: Request, res: Response) => {
  const message = greet('World');
  res.json({
    message,
    timestamp: new Date().toISOString(),
    apiVersion: config.apiVersion,
  });
});

app.get('/greet/:name', (req: Request, res: Response) => {
  const { name } = req.params;
  const greeting = greet(name);
  res.json({ greeting });
});

app.get('/age/:birthYear', (req: Request, res: Response) => {
  const birthYear = parseInt(req.params.birthYear);
  if (isNaN(birthYear)) {
    return res.status(400).json({ error: 'Invalid birth year' });
  }
  const birthDate = new Date(birthYear, 0, 1);
  const age = calculateAge(birthDate);
  res.json({ birthYear, age });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Environment: ${config.environment}`);
});

app.get('/age/:birthYear', (req: Request, res: Response) => {
  const birthYear = parseInt(req.params.birthYear);
  if (isNaN(birthYear)) {
    return res.status(400).json({ error: 'Invalid birth year' });
  }
  const birthDate = new Date(birthYear, 0, 1);
  const age = calculateAge(birthDate);
  res.json({ birthYear, age });
});


