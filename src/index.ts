import express from 'express';
import { greet } from './utils';

const app = express();
const PORT = 3000;
greet('Owais');
app.get('/', (req, res) => {
  res.send('Owais - Build Success!');
});
function greet3(name: string) {
  return `not, ${name}! 👋`;
}
function greet4(name: string) {
  return `not, ${name}! 👋`;
}
function greet5(name: string) {
  return `not, ${name}! 👋`;
}
function greet6(name: string) {
  return `not, ${name}! 👋`;
}
function greet7(name: string) {