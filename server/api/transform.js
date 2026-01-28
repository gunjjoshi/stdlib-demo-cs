import multer from 'multer';
import sharp from 'sharp';
import { performance } from 'node:perf_hooks';

import { ImageData } from '../src/image-data.js';
import { applyOperation, OPERATIONS } from '../src/operations.js';

export const config = {
  api: {
    bodyParser: false
  }
};

globalThis.ImageData = ImageData;

const upload = multer({ storage: multer.memoryStorage() });

function setCorsHeaders(req, res) {
  let origin = String(process.env.CORS_ORIGIN || '*').trim();
  if (origin !== '*') {
    origin = origin.replace(/\/+$/, '');
  }
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', String(req.headers['access-control-request-headers'] || 'Content-Type'));
  res.setHeader(
    'Access-Control-Expose-Headers',
    'X-Stdlib-Transform-Ms, X-Stdlib-Decode-Ms, X-Stdlib-Encode-Ms, X-Stdlib-Output-Size'
  );
}

function runMulter(req, res) {
  return new Promise((resolve, reject) => {
    upload.single('image')(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export default async function handler(req, res) {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  try {
    await runMulter(req, res);

    if (!req.file || !req.file.buffer) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Missing image file field "image"' }));
      return;
    }

    const operation = String(req.body?.operation || '');
    if (!operation) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Missing operation' }));
      return;
    }
    if (!Object.hasOwn(OPERATIONS, operation)) {
      const allowed = Object.keys(OPERATIONS).sort();
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: `Unknown operation: ${operation}`, allowed }));
      return;
    }

    const params = req.body?.params ? JSON.parse(String(req.body.params)) : {};

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

    res.statusCode = 200;
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('X-Stdlib-Transform-Ms', (transformEnd - transformStart).toFixed(2));
    res.setHeader('X-Stdlib-Decode-Ms', (decodeEnd - decodeStart).toFixed(2));
    res.setHeader('X-Stdlib-Encode-Ms', (encodeEnd - encodeStart).toFixed(2));
    res.setHeader('X-Stdlib-Output-Size', `${out.width}x${out.height}`);

    res.end(png);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: String(err?.message || err) }));
  }
}
