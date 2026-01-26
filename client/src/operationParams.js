const operationParams = {
  brightness: [{ name: 'factor', label: 'Brightness', type: 'range', min: -100, max: 100, default: 0, step: 1 }],
  contrast: [{ name: 'factor', label: 'Contrast', type: 'range', min: -100, max: 100, default: 0, step: 1 }],
  saturation: [{ name: 'factor', label: 'Saturation', type: 'range', min: -100, max: 100, default: 0, step: 1 }],
  blur: [{ name: 'radius', label: 'Blur Radius', type: 'range', min: 1, max: 5, default: 1, step: 1 }],
  threshold: [{ name: 'value', label: 'Threshold', type: 'range', min: 0, max: 255, default: 128, step: 1 }],
  posterize: [{ name: 'levels', label: 'Color Levels', type: 'range', min: 2, max: 16, default: 4, step: 1 }],
  gamma: [{ name: 'value', label: 'Gamma', type: 'range', min: 0.1, max: 3, default: 1, step: 0.1 }],
  crop: [
    { name: 'x', label: 'X Offset %', type: 'range', min: 0, max: 90, default: 0, step: 1 },
    { name: 'y', label: 'Y Offset %', type: 'range', min: 0, max: 90, default: 0, step: 1 },
    { name: 'width', label: 'Width %', type: 'range', min: 10, max: 100, default: 100, step: 1 },
    { name: 'height', label: 'Height %', type: 'range', min: 10, max: 100, default: 100, step: 1 }
  ]
};

export { operationParams };
