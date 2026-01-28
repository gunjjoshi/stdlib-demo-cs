import { useEffect, useMemo, useRef, useState } from 'react';
import { operationParams } from './operationParams.js';

const ITERATIONS = 10;

function computeStats(values) {
  const sum = values.reduce((a, b) => a + b, 0);
  return {
    avg: sum / values.length,
    min: values.reduce((a, b) => (b < a ? b : a), values[0]),
    max: values.reduce((a, b) => (b > a ? b : a), values[0])
  };
}

function App() {
  const apiBaseUrl = String(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080')
    .trim()
    .replace(/\/+$/, '');
  const originalCanvasRef = useRef(null);
  const transformedCanvasRef = useRef(null);

  const [file, setFile] = useState(null);
  const [operation, setOperation] = useState('grayscale');
  const [params, setParams] = useState({});
  const [originalInfo, setOriginalInfo] = useState('');
  const [transformedInfo, setTransformedInfo] = useState('');
  const [benchmarkHtml, setBenchmarkHtml] = useState('<div class="benchmark-placeholder">Click "Run Benchmark" to measure performance</div>');

  const opConfig = useMemo(() => operationParams[operation] || [], [operation]);

  useEffect(() => {
    ensureSample().catch(() => {});
  }, []);

  useEffect(() => {
    const next = {};
    for (const p of opConfig) next[p.name] = p.default;
    setParams(next);
  }, [opConfig]);

  async function drawBlobToCanvas(blob, canvas) {
    const url = URL.createObjectURL(blob);
    try {
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      return { width: canvas.width, height: canvas.height };
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  async function ensureSample() {
    const c = document.createElement('canvas');
    c.width = 400;
    c.height = 300;
    const ctx = c.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, c.width, c.height);
    g.addColorStop(0, '#ff6b6b');
    g.addColorStop(0.25, '#feca57');
    g.addColorStop(0.5, '#48dbfb');
    g.addColorStop(0.75, '#ff9ff3');
    g.addColorStop(1, '#54a0ff');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(100, 100, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(250, 50, 100, 100);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.lineTo(250, 280);
    ctx.lineTo(150, 280);
    ctx.closePath();
    ctx.fill();

    const blob = await new Promise((resolve) => c.toBlob(resolve, 'image/png'));
    if (!blob) {
      return;
    }
    setFile(new File([blob], 'sample.png', { type: 'image/png' }));
  }

  function xhrTransform(iterOperation) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const tStart = performance.now();
      let tUploadEnd = null;
      let tHeaders = null;

      xhr.open('POST', `${apiBaseUrl}/api/transform`);
      xhr.responseType = 'blob';

      xhr.upload.addEventListener('loadend', () => {
        if (tUploadEnd === null) tUploadEnd = performance.now();
      });
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 2 && tHeaders === null) tHeaders = performance.now();
      };
      xhr.onerror = () => reject(new Error('Network error'));

      xhr.onload = () => {
        const tDone = performance.now();
        if (xhr.status < 200 || xhr.status >= 300) {
          reject(new Error(`Server returned ${xhr.status}`));
          return;
        }
        const serverTransformMsRaw = Number(xhr.getResponseHeader('X-Stdlib-Transform-Ms'));
        const serverDecodeMsRaw = Number(xhr.getResponseHeader('X-Stdlib-Decode-Ms'));
        const serverEncodeMsRaw = Number(xhr.getResponseHeader('X-Stdlib-Encode-Ms'));
        const serverTransformMs = Number.isFinite(serverTransformMsRaw) ? serverTransformMsRaw : 0;
        const serverDecodeMs = Number.isFinite(serverDecodeMsRaw) ? serverDecodeMsRaw : 0;
        const serverEncodeMs = Number.isFinite(serverEncodeMsRaw) ? serverEncodeMsRaw : 0;
        const uploadMs = (tUploadEnd ?? tDone) - tStart;
        const downloadMs = tHeaders ? (tDone - tHeaders) : 0;
        const totalMs = tDone - tStart;
        resolve({ blob: xhr.response, uploadMs, downloadMs, totalMs, serverTransformMs, serverDecodeMs, serverEncodeMs });
      };

      const fd = new FormData();
      fd.append('image', file);
      fd.append('operation', iterOperation);
      fd.append('params', JSON.stringify(params || {}));
      xhr.send(fd);
    });
  }

  async function applyServerOperation() {
    if (!file) return;
    const out = await xhrTransform(operation);
    const origDims = await drawBlobToCanvas(file, originalCanvasRef.current);
    setOriginalInfo(`${origDims.width} × ${origDims.height} pixels`);
    const outDims = await drawBlobToCanvas(out.blob, transformedCanvasRef.current);
    setTransformedInfo(`${outDims.width} × ${outDims.height} pixels`);
  }

  useEffect(() => {
    if (!file) return;
    applyServerOperation().catch(() => {});
  }, [file, operation, JSON.stringify(params)]);

  async function onRunBenchmark() {
    if (!file) {
      setBenchmarkHtml('<div class="benchmark-placeholder">Please load an image first</div>');
      return;
    }
    setBenchmarkHtml('<div class="benchmark-loading">Running benchmark...</div>');

    const uploadTimes = [];
    const decodeTimes = [];
    const serverTimes = [];
    const encodeTimes = [];
    const downloadTimes = [];
    const totalTimes = [];

    let lastBlob = null;
    for (let i = 0; i < ITERATIONS; i++) {
      const r = await xhrTransform('invert');
      lastBlob = r.blob;
      uploadTimes.push(r.uploadMs);
      decodeTimes.push(r.serverDecodeMs);
      serverTimes.push(r.serverTransformMs);
      encodeTimes.push(r.serverEncodeMs);
      downloadTimes.push(r.downloadMs);
      totalTimes.push(r.totalMs);
    }

    if (lastBlob) {
      const outDims = await drawBlobToCanvas(lastBlob, transformedCanvasRef.current);
      setTransformedInfo(`${outDims.width} × ${outDims.height} pixels`);
    }

    const u = computeStats(uploadTimes);
    const dec = computeStats(decodeTimes);
    const s = computeStats(serverTimes);
    const enc = computeStats(encodeTimes);
    const d = computeStats(downloadTimes);
    const t = computeStats(totalTimes);

    let html = '<div class="benchmark-operation">Invert Colors (client-server)</div>';
    html += `<div class="benchmark-stat"><span class="label">Iterations:</span><span class="value">${ITERATIONS}</span></div>`;
    html += `<div class="benchmark-stat"><span class="label">Upload (avg):</span><span class="value">${u.avg.toFixed(2)} ms</span></div>`;
    html += `<div class="benchmark-stat"><span class="label">Server decode (avg):</span><span class="value">${dec.avg.toFixed(2)} ms</span></div>`;
    html += `<div class="benchmark-stat"><span class="label">Server transform (avg):</span><span class="value">${s.avg.toFixed(2)} ms</span></div>`;
    html += `<div class="benchmark-stat"><span class="label">Server encode (avg):</span><span class="value">${enc.avg.toFixed(2)} ms</span></div>`;
    html += `<div class="benchmark-stat"><span class="label">Download (avg):</span><span class="value">${d.avg.toFixed(2)} ms</span></div>`;
    html += `<div class="benchmark-stat"><span class="label">Total (avg):</span><span class="value highlight">${t.avg.toFixed(2)} ms</span></div>`;
    html += `<div class="benchmark-stat"><span class="label">Min:</span><span class="value">${t.min.toFixed(2)} ms</span></div>`;
    html += `<div class="benchmark-stat"><span class="label">Max:</span><span class="value">${t.max.toFixed(2)} ms</span></div>`;

    setBenchmarkHtml(html);
  }

  return (
    <>
      <header>
        <img src="/stdlib-logo.png" alt="stdlib - a standard library for javascript and node.js" className="logo" />
        <h1>Image Processing</h1>
        <p>Client-server image transformations using stdlib</p>
      </header>

      <main>
        <section className="controls-panel">
          <div className="control-group">
            <h3>Image Source</h3>
            <input
              type="file"
              accept="image/png,image/jpeg,image/gif"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <button onClick={ensureSample}>Load Sample Image</button>
          </div>

          <div className="control-group">
            <h3>Operation</h3>
            <select value={operation} onChange={(e) => setOperation(e.target.value)}>
              <optgroup label="Color Operations">
                <option value="grayscale">Grayscale</option>
                <option value="invert">Invert Colors</option>
                <option value="sepia">Sepia Tone</option>
                <option value="brightness">Brightness</option>
                <option value="contrast">Contrast</option>
                <option value="saturation">Saturation</option>
              </optgroup>
              <optgroup label="Geometric Transforms">
                <option value="flipHorizontal">Flip Horizontal</option>
                <option value="flipVertical">Flip Vertical</option>
                <option value="rotate180">Rotate 180°</option>
                <option value="crop">Crop</option>
              </optgroup>
              <optgroup label="Filters">
                <option value="blur">Box Blur</option>
                <option value="sharpen">Sharpen</option>
                <option value="edgeDetect">Edge Detection</option>
              </optgroup>
              <optgroup label="Mathematical Operations">
                <option value="threshold">Threshold</option>
                <option value="posterize">Posterize</option>
                <option value="gamma">Gamma Correction</option>
              </optgroup>
            </select>
          </div>

          <div className="control-group" id="parameterControls">
            {opConfig.map((p) => (
              <div className="param-control" key={p.name}>
                <label>{p.label}</label>
                <input
                  type="range"
                  min={p.min}
                  max={p.max}
                  step={p.step}
                  value={params[p.name] ?? p.default}
                  onChange={(e) => setParams((prev) => ({ ...prev, [p.name]: Number(e.target.value) }))}
                />
                <div className="value-display">{params[p.name] ?? p.default}</div>
              </div>
            ))}
          </div>

          <div className="control-group">
            <button
              onClick={() => {
                if (!file) return;
                drawBlobToCanvas(file, transformedCanvasRef.current).then((d) => setTransformedInfo(`${d.width} × ${d.height} pixels`));
              }}
            >
              Reset to Original
            </button>
            <button
              onClick={() => {
                const a = document.createElement('a');
                a.download = 'transformed-image.png';
                a.href = transformedCanvasRef.current.toDataURL('image/png');
                a.click();
              }}
            >
              Download Result
            </button>
          </div>

          <div className="control-group benchmark-controls">
            <h3>Performance Benchmark</h3>
            <button id="runBenchmark" onClick={onRunBenchmark}>Run Benchmark ({ITERATIONS} iterations)</button>
            <div id="benchmarkResults" className="benchmark-results" dangerouslySetInnerHTML={{ __html: benchmarkHtml }} />
          </div>
        </section>

        <section className="image-panel">
          <div className="image-container">
            <h3>Original</h3>
            <canvas ref={originalCanvasRef} />
            <div className="image-info">{originalInfo}</div>
          </div>
          <div className="image-container">
            <h3>Transformed</h3>
            <canvas ref={transformedCanvasRef} />
            <div className="image-info">{transformedInfo}</div>
          </div>
        </section>
      </main>

      <footer>
        <p>
          Powered by <a href="https://stdlib.io" target="_blank" rel="noreferrer">stdlib</a> - A standard library for numerical and scientific
          computing in JavaScript
        </p>
      </footer>
    </>
  );
}

export default App;

