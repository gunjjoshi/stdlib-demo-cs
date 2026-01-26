import { grayscale } from './lib/grayscale.js';
import { invert } from './lib/invert.js';
import { sepia } from './lib/sepia.js';
import { brightness } from './lib/brightness.js';
import { contrast } from './lib/contrast.js';
import { saturation } from './lib/saturation.js';

import { flipHorizontal } from './lib/flip-horizontal.js';
import { flipVertical } from './lib/flip-vertical.js';
import { rotate180 } from './lib/rotate180.js';
import { crop } from './lib/crop.js';

import { boxBlur } from './lib/blur.js';
import { sharpen } from './lib/sharpen.js';
import { edgeDetect } from './lib/edge-detect.js';

import { threshold } from './lib/threshold.js';
import { posterize } from './lib/posterize.js';
import { gamma } from './lib/gamma.js';

const OPERATIONS = {
  grayscale: (img) => grayscale(img),
  invert: (img) => invert(img),
  sepia: (img) => sepia(img),
  brightness: (img, p) => brightness(img, numberOr(p.factor, 0)),
  contrast: (img, p) => contrast(img, numberOr(p.factor, 0)),
  saturation: (img, p) => saturation(img, numberOr(p.factor, 0)),

  flipHorizontal: (img) => flipHorizontal(img),
  flipVertical: (img) => flipVertical(img),
  rotate180: (img) => rotate180(img),
  crop: (img, p) => crop(img, numberOr(p.x, 0), numberOr(p.y, 0), numberOr(p.width, 100), numberOr(p.height, 100)),

  blur: (img, p) => boxBlur(img, numberOr(p.radius, 1)),
  sharpen: (img) => sharpen(img),
  edgeDetect: (img) => edgeDetect(img),

  threshold: (img, p) => threshold(img, numberOr(p.value, 128)),
  posterize: (img, p) => posterize(img, numberOr(p.levels, 4)),
  gamma: (img, p) => gamma(img, numberOr(p.value, 1))
};

function numberOr(x, fallback) {
  const n = Number(x);
  return Number.isFinite(n) ? n : fallback;
}

function applyOperation(imageData, operation, params = {}) {
  const fn = OPERATIONS[operation];
  if (!fn) {
    const allowed = Object.keys(OPERATIONS).sort().join(', ');
    throw new Error(`Unknown operation: ${operation}. Allowed: ${allowed}`);
  }
  const out = fn(imageData, params);
  return out || imageData;
}

export { applyOperation, OPERATIONS };

