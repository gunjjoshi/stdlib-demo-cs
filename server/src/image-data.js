class ImageData {
  constructor(data, width, height) {
    if (!Number.isFinite(width) || !Number.isFinite(height)) {
      throw new TypeError('ImageData width/height must be numbers');
    }
    this.width = width;
    this.height = height;

    if (data instanceof Uint8ClampedArray) {
      this.data = data;
    } else {
      this.data = new Uint8ClampedArray(data);
    }

    const expected = width * height * 4;
    if (this.data.length !== expected) {
      throw new RangeError(`ImageData data length (${this.data.length}) != width*height*4 (${expected})`);
    }
  }
}

export { ImageData };
