import { OPERATIONS } from '../src/operations.js';

export default function handler(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ operations: Object.keys(OPERATIONS).sort() }));
}
