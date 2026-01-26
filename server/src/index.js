import express from 'express';
import cors from 'cors';
import multer from 'multer';
import sharp from 'sharp';
import dotenv from 'dotenv';
import { performance } from 'node:perf_hooks';

import { ImageData } from './image-data.js';
import { applyOperation, OPERATIONS } from './operations.js';

dotenv.config();

globalThis.ImageData = ImageData;

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const PORT = Number(process.env.PORT || 8080);
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

const corsOptions = {
  origin: CORS_ORIGIN,
  exposedHeaders: [
    'X-Stdlib-Transform-Ms',
    'X-Stdlib-Decode-Ms',
    'X-Stdlib-Encode-Ms',
    'X-Stdlib-Output-Size'
  ]
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.get('/api/operations', (req, res) => {
  res.json({ operations: Object.keys(OPERATIONS).sort() });
});

app.post('/api/transform', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'Missing image file field "image"' });
      return;
    }
    const operation = String(req.body.operation || '');
    if (!operation) {
      res.status(400).json({ error: 'Missing operation' });
      return;
    }

    const params = req.body.params ? JSON.parse(String(req.body.params)) : {};

    const decodeStart = performance.now();
    const decoded = await sharp(req.file.buffer)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const decodeEnd = performance.now();

    const rgba = new Uint8ClampedArray(decoded.data.buffer, decoded.data.byteOffset, decoded.data.byteLength);
    const imageData = new ImageData(rgba, decoded.info.width, decoded.info.height);

    const transformStart = performance.now();
    const out = applyOperation(imageData, operation, params);
    const transformEnd = performance.now();

    const encodeStart = performance.now();
    const png = await sharp(Buffer.from(out.data), {
      raw: { width: out.width, height: out.height, channels: 4 }
    }).png().toBuffer();
    const encodeEnd = performance.now();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('X-Stdlib-Transform-Ms', (transformEnd - transformStart).toFixed(2));
    res.setHeader('X-Stdlib-Decode-Ms', (decodeEnd - decodeStart).toFixed(2));
    res.setHeader('X-Stdlib-Encode-Ms', (encodeEnd - encodeStart).toFixed(2));
    res.setHeader('X-Stdlib-Output-Size', `${out.width}x${out.height}`);

    res.send(png);
  } catch (err) {
    res.status(500).json({ error: String(err?.message || err) });
  }
});

app.listen(PORT, () => {
  console.log(`stdlib-demo-cs server listening on http://localhost:${PORT}`);
});

