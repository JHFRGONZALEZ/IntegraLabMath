import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { renderMath } from './Math';

// ============ TYPES ============
interface FuncDef {
  label: string;
  latex: string;
  fn: (x: number) => number;
  anti: (x: number) => number;
  antiLabel: string;
}

interface RiemannPoint {
  i: number;
  x: number;
  fx: number;
  area: number;
  xLeft: number;
  xRight: number;
  height: number;
}

interface RiemannResult {
  dx: number;
  sum: number;
  points: RiemannPoint[];
}

interface ConvRow {
  n: number;
  sLeft: number;
  sRight: number;
  sMid: number;
  errorMid: number;
}

type SumType = 'left' | 'right' | 'midpoint' | 'upper' | 'lower';

// ============ CONSTANTS ============
const FUNCTIONS: Record<string, FuncDef> = {
  'x2': {
    label: 'f(x) = x²',
    latex: 'f(x) = x^2',
    fn: (x) => x * x,
    anti: (x) => (x * x * x) / 3,
    antiLabel: 'F(x) = \\frac{x^3}{3}',
  },
  'x3-x': {
    label: 'f(x) = x³ - x',
    latex: 'f(x) = x^3 - x',
    fn: (x) => x * x * x - x,
    anti: (x) => (x * x * x * x) / 4 - (x * x) / 2,
    antiLabel: 'F(x) = \\frac{x^4}{4} - \\frac{x^2}{2}',
  },
  sin: {
    label: 'f(x) = sin(x)',
    latex: 'f(x) = \\sin(x)',
    fn: (x) => Math.sin(x),
    anti: (x) => -Math.cos(x),
    antiLabel: 'F(x) = -\\cos(x)',
  },
  exp: {
    label: 'f(x) = eˣ',
    latex: 'f(x) = e^x',
    fn: (x) => Math.exp(x),
    anti: (x) => Math.exp(x),
    antiLabel: 'F(x) = e^x',
  },
  sqrt: {
    label: 'f(x) = √x',
    latex: 'f(x) = \\sqrt{x}',
    fn: (x) => Math.sqrt(Math.max(0, x)),
    anti: (x) => (2 / 3) * Math.pow(Math.max(0, x), 1.5),
    antiLabel: 'F(x) = \\frac{2}{3}x^{3/2}',
  },
  '1/x': {
    label: 'f(x) = 1/x',
    latex: 'f(x) = \\frac{1}{x}',
    fn: (x) => (x !== 0 ? 1 / x : Infinity),
    anti: (x) => Math.log(Math.abs(x)),
    antiLabel: 'F(x) = \\ln|x|',
  },
};

const TYPE_LABELS: Record<SumType, string> = {
  left: 'Izquierda',
  right: 'Derecha',
  midpoint: 'Punto Medio',
  upper: 'Superior',
  lower: 'Inferior',
};

const TYPE_COLORS: Record<SumType, string> = {
  left: '#22c55e',
  right: '#f97316',
  midpoint: '#a855f7',
  upper: '#ef4444',
  lower: '#3b82f6',
};

// ============ MATH HELPERS ============
function computeRiemann(
  fn: (x: number) => number,
  a: number,
  b: number,
  n: number,
  type: SumType
): RiemannResult {
  const dx = (b - a) / n;
  const points: RiemannPoint[] = [];
  let sum = 0;

  for (let i = 0; i < n; i++) {
    const xL = a + i * dx;
    const xR = xL + dx;
    let xStar: number;
    let height: number;

    if (type === 'left') {
      xStar = xL;
      height = fn(xStar);
    } else if (type === 'right') {
      xStar = xR;
      height = fn(xStar);
    } else if (type === 'midpoint') {
      xStar = (xL + xR) / 2;
      height = fn(xStar);
    } else if (type === 'upper') {
      let max = -Infinity;
      for (let s = 0; s <= 50; s++) {
        const v = fn(xL + (s / 50) * dx);
        if (isFinite(v) && v > max) max = v;
      }
      height = max;
      xStar = (xL + xR) / 2;
    } else {
      let min = Infinity;
      for (let s = 0; s <= 50; s++) {
        const v = fn(xL + (s / 50) * dx);
        if (isFinite(v) && v < min) min = v;
      }
      height = min;
      xStar = (xL + xR) / 2;
    }

    const area = height * dx;
    sum += area;
    points.push({ i: i + 1, x: xStar, fx: height, area, xLeft: xL, xRight: xR, height });
  }

  return { dx, sum, points };
}

// ============ COMPONENT ============
export default function Graphs() {
  // State
  const [fnKey, setFnKey] = useState('x2');
  const [useCustom, setUseCustom] = useState(false);
  const [customFn, setCustomFn] = useState('');
  const [customError, setCustomError] = useState('');
  const [a, setA] = useState(0);
  const [b, setB] = useState(2);
  const [n, setN] = useState(4);
  const [type, setType] = useState<SumType>('left');
  const [showCompare, setShowCompare] = useState(false);
  const [showExact, setShowExact] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [animating, setAnimating] = useState(false);

  const [result, setResult] = useState<RiemannResult | null>(null);
  const [exactValue, setExactValue] = useState<number | null>(null);
  const [convData, setConvData] = useState<ConvRow[]>([]);
  const [limitError, setLimitError] = useState(false);

  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const convCanvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);

  // Get active function
  const getActiveFn = useCallback((): ((x: number) => number) | null => {
    if (useCustom) {
      try {
        const s = customFn
          .trim()
          .toLowerCase()
          .replace(/\^/g, '**')
          .replace(/\b(sin|cos|sqrt|log|exp|abs|tan)\b/g, 'Math.$1')
          .replace(/\bpi\b/g, 'Math.PI');
        if (!s) throw new Error('Vacía');
        const fn = new Function('x', 'return ' + s) as (x: number) => number;
        const test = fn(a);
        if (typeof test !== 'number' || Number.isNaN(test)) throw new Error('No numérica');
        setCustomError('');
        return fn;
      } catch {
        setCustomError('⚠️ Función no válida. Usa x, números y funciones como sin, cos, sqrt, log o exp.');
        return null;
      }
    }
    return FUNCTIONS[fnKey].fn;
  }, [useCustom, customFn, fnKey, a]);

  // Recalculate
  const recalculate = useCallback(() => {
    if (a >= b) {
      setLimitError(true);
      return;
    }
    setLimitError(false);

    const fn = getActiveFn();
    if (!fn) {
      setResult(null);
      setExactValue(null);
      setConvData([]);
      return;
    }

    const res = computeRiemann(fn, a, b, n, type);
    setResult(res);

    const fnDef = FUNCTIONS[fnKey];
    const exact = useCustom ? null : fnDef.anti(b) - fnDef.anti(a);
    setExactValue(exact);

    // Convergence data
    const nVals = [1, 2, 4, 8, 10, 16, 20, 32, 50, 64, 100, 128, 200];
    const cData: ConvRow[] = nVals.map((nv) => {
      const sL = computeRiemann(fn, a, b, nv, 'left').sum;
      const sR = computeRiemann(fn, a, b, nv, 'right').sum;
      const sM = computeRiemann(fn, a, b, nv, 'midpoint').sum;
      return {
        n: nv,
        sLeft: sL,
        sRight: sR,
        sMid: sM,
        errorMid: exact !== null ? Math.abs(sM - exact) : 0,
      };
    });
    setConvData(cData);
  }, [a, b, n, type, fnKey, useCustom, getActiveFn]);

  // Draw main canvas
  const drawMainCanvas = useCallback(() => {
    const canvas = mainCanvasRef.current;
    if (!canvas || !result) return;

    const container = canvas.parentElement;
    if (!container) return;

    canvas.width = container.clientWidth;
    canvas.height = Math.floor(container.clientWidth * 9 / 16);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const pad = { top: 40, right: 40, bottom: 50, left: 60 };
    const pW = W - pad.left - pad.right;
    const pH = H - pad.top - pad.bottom;

    // Background
    ctx.fillStyle = '#0f0f23';
    ctx.fillRect(0, 0, W, H);

    const fn = getActiveFn();
    if (!fn) return;

    // Compute Y range
    let yMin = 0, yMax = 0;
    for (let i = 0; i <= 200; i++) {
      const x = a + (i / 200) * (b - a);
      const y = fn(x);
      if (isFinite(y)) {
        yMin = Math.min(yMin, y);
        yMax = Math.max(yMax, y);
      }
    }
    if (result) {
      for (const p of result.points) {
        yMin = Math.min(yMin, p.height);
        yMax = Math.max(yMax, p.height);
      }
    }
    const yr = yMax - yMin || 1;
    yMin -= yr * 0.1;
    yMax += yr * 0.1;

    const toX = (x: number) => pad.left + ((x - a) / (b - a)) * pW;
    const toY = (y: number) => pad.top + pH - ((y - yMin) / (yMax - yMin)) * pH;

    // Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 8; i++) {
      const x = pad.left + (i / 8) * pW;
      ctx.beginPath();
      ctx.moveTo(x, pad.top);
      ctx.lineTo(x, pad.top + pH);
      ctx.stroke();
    }
    for (let i = 0; i <= 6; i++) {
      const y = pad.top + (i / 6) * pH;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + pW, y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    const axY = toY(0);
    if (axY >= pad.top && axY <= pad.top + pH) {
      ctx.beginPath();
      ctx.moveTo(pad.left, axY);
      ctx.lineTo(pad.left + pW, axY);
      ctx.stroke();
    }
    const axX = toX(0);
    if (axX >= pad.left && axX <= pad.left + pW) {
      ctx.beginPath();
      ctx.moveTo(axX, pad.top);
      ctx.lineTo(axX, pad.top + pH);
      ctx.stroke();
    }

    // Axis labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    for (let i = 0; i <= 5; i++) {
      const v = a + (i / 5) * (b - a);
      ctx.fillText(v.toFixed(2), toX(v), pad.top + pH + 20);
    }
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const v = yMin + (i / 5) * (yMax - yMin);
      ctx.fillText(v.toFixed(2), pad.left - 8, toY(v) + 4);
    }

    // Rectangles
    if (result) {
      const types: SumType[] = showCompare
        ? ['left', 'right', 'midpoint', 'upper', 'lower']
        : [type];

      for (const t of types) {
        const r = computeRiemann(fn, a, b, n, t);
        const c = TYPE_COLORS[t];

        for (const p of r.points) {
          const sx = toX(p.xLeft);
          const sw = toX(p.xRight) - sx;
          const sy = toY(p.height);
          const zeroY = toY(0);

          ctx.fillStyle = c + '30';
          ctx.strokeStyle = c + '80';
          ctx.lineWidth = 1;

          if (p.height >= 0) {
            ctx.fillRect(sx, sy, sw, zeroY - sy);
            ctx.strokeRect(sx, sy, sw, zeroY - sy);
          } else {
            ctx.fillRect(sx, zeroY, sw, sy - zeroY);
            ctx.strokeRect(sx, zeroY, sw, sy - zeroY);
          }
        }
      }
    }

    // Curve
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let started = false;
    for (let i = 0; i <= 500; i++) {
      const x = a + (i / 500) * (b - a);
      const y = fn(x);
      if (!isFinite(y)) {
        started = false;
        continue;
      }
      const sx = toX(x);
      const sy = toY(y);
      if (!started) {
        ctx.moveTo(sx, sy);
        started = true;
      } else {
        ctx.lineTo(sx, sy);
      }
    }
    ctx.stroke();

    // Exact value line
    if (showExact && exactValue !== null) {
      const ey = toY(exactValue / (b - a));
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 4]);
      ctx.beginPath();
      ctx.moveTo(pad.left, ey);
      ctx.lineTo(pad.left + pW, ey);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('∫f(x)dx = ' + exactValue.toFixed(4), pad.left + 10, ey - 8);
    }

    // Info overlay
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'left';
    const fnLabel = useCustom ? `f(x) = ${customFn || '?'}` : FUNCTIONS[fnKey].label;
    ctx.fillText(
      `n = ${n} | Δx = ${result.dx.toFixed(4)} | Sₙ = ${result.sum.toFixed(4)}`,
      pad.left + 10,
      pad.top - 12
    );
    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(fnLabel, pad.left + pW - 10, pad.top - 12);
  }, [result, a, b, n, type, showCompare, showExact, exactValue, fnKey, useCustom, customFn, getActiveFn]);

  // Draw convergence canvas
  const drawConvCanvas = useCallback(() => {
    const canvas = convCanvasRef.current;
    if (!canvas || convData.length === 0) return;

    canvas.width = canvas.parentElement?.clientWidth || 800;
    canvas.height = Math.floor(canvas.width * 5 / 16);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const pad = { top: 30, right: 20, bottom: 40, left: 60 };
    const pW = W - pad.left - pad.right;
    const pH = H - pad.top - pad.bottom;

    ctx.fillStyle = '#0f0f23';
    ctx.fillRect(0, 0, W, H);

    let yMin = Infinity, yMax = -Infinity;
    for (const r of convData) {
      for (const v of [r.sLeft, r.sRight, r.sMid]) {
        if (isFinite(v)) {
          yMin = Math.min(yMin, v);
          yMax = Math.max(yMax, v);
        }
      }
    }
    if (exactValue !== null) {
      yMin = Math.min(yMin, exactValue);
      yMax = Math.max(yMax, exactValue);
    }
    const rng = yMax - yMin || 1;
    yMin -= rng * 0.1;
    yMax += rng * 0.1;

    const toX = (nv: number) => pad.left + (Math.log(nv + 1) / Math.log(201)) * pW;
    const toY = (v: number) => pad.top + pH - ((v - yMin) / (yMax - yMin)) * pH;

    // Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 5; i++) {
      const y = pad.top + (i / 5) * pH;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + pW, y);
      ctx.stroke();
    }

    // Exact line
    if (exactValue !== null) {
      const ey = toY(exactValue);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 3]);
      ctx.beginPath();
      ctx.moveTo(pad.left, ey);
      ctx.lineTo(pad.left + pW, ey);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#fbbf24';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('Exacto = ' + exactValue.toFixed(4), pad.left + pW - 5, ey - 5);
    }

    // Lines
    const types = [
      { key: 'sLeft' as const, color: '#22c55e' },
      { key: 'sRight' as const, color: '#f97316' },
      { key: 'sMid' as const, color: '#a855f7' },
    ];

    for (const t of types) {
      ctx.strokeStyle = t.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      let s = false;
      for (const r of convData) {
        const v = r[t.key];
        if (!isFinite(v)) continue;
        const sx = toX(r.n);
        const sy = toY(v);
        if (!s) {
          ctx.moveTo(sx, sy);
          s = true;
        } else {
          ctx.lineTo(sx, sy);
        }
      }
      ctx.stroke();

      // Points
      for (const r of convData) {
        const v = r[t.key];
        if (!isFinite(v)) continue;
        ctx.fillStyle = t.color;
        ctx.beginPath();
        ctx.arc(toX(r.n), toY(v), 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // X labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    for (const r of convData) {
      if ([1, 4, 10, 32, 64, 200].includes(r.n)) {
        ctx.fillText('n=' + r.n, toX(r.n), H - 10);
      }
    }

    // Y labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const v = yMin + (i / 4) * (yMax - yMin);
      ctx.fillText(v.toFixed(2), pad.left - 5, toY(v) + 4);
    }

    // Title
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Convergencia de Sₙ → ∫f(x)dx', pad.left, 15);

    // Legend
    const lg = [
      { c: '#22c55e', l: 'Izq' },
      { c: '#f97316', l: 'Der' },
      { c: '#a855f7', l: 'Medio' },
      { c: '#fbbf24', l: 'Exacto' },
    ];
    let lx = pad.left + pW - 170;
    ctx.font = '9px sans-serif';
    for (const item of lg) {
      ctx.fillStyle = item.c;
      ctx.fillRect(lx, 8, 10, 10);
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'left';
      ctx.fillText(item.l, lx + 14, 17);
      lx += 42;
    }
  }, [convData, exactValue]);

  // Update display
  useEffect(() => {
    recalculate();
  }, [recalculate]);

  useEffect(() => {
    drawMainCanvas();
    drawConvCanvas();
  }, [drawMainCanvas, drawConvCanvas]);

  // Animation
  useEffect(() => {
    if (!animating) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    let currentN = 1;
    let last = 0;

    const step = (ts: number) => {
      if (!animating) return;
      if (ts - last >= 50) {
        last = ts;
        currentN++;
        if (currentN > 200) {
          setAnimating(false);
          return;
        }
        setN(currentN);
      }
      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [animating]);

  // Load example
  const loadExample = (num: number) => {
    if (animating) setAnimating(false);
    if (num === 1) {
      setFnKey('x2');
      setA(0);
      setB(2);
    } else if (num === 2) {
      setFnKey('sin');
      setA(0);
      setB(Math.PI);
    } else {
      setFnKey('exp');
      setA(0);
      setB(1);
    }
    setN(4);
    setUseCustom(false);
  };

  // Step by step content
  const renderStepByStep = () => {
    if (!result) return <p className="text-slate-400 text-sm">Calcula para ver el desarrollo paso a paso.</p>;

    const fnDef = FUNCTIONS[fnKey];
    const dx = result.dx;
    const error = exactValue !== null ? Math.abs(result.sum - exactValue) : null;
    const errorRel =
      exactValue && exactValue !== 0 && error !== null ? (error / Math.abs(exactValue)) * 100 : null;

    const fnLabel = useCustom ? `f(x) = ${customFn || '?'}` : fnDef.latex;

    let pointFormula = '';
    if (type === 'left') pointFormula = `x_i = a + (i-1)\\cdot\\Delta x = ${a} + (i-1)\\cdot${dx.toFixed(4)}`;
    else if (type === 'right') pointFormula = `x_i = a + i\\cdot\\Delta x = ${a} + i\\cdot${dx.toFixed(4)}`;
    else if (type === 'midpoint') pointFormula = `x_i = a + (i-0.5)\\cdot\\Delta x`;
    else if (type === 'upper') pointFormula = `x_i^* = \\arg\\max_{x\\in[x_{i-1},x_i]} f(x)`;
    else pointFormula = `x_i^* = \\arg\\min_{x\\in[x_{i-1},x_i]} f(x)`;

    return (
      <div className="space-y-3">
        {/* Step 1 */}
        <div className="step-card">
          <h4>PASO 1: IDENTIFICACIÓN</h4>
          <p className="text-sm text-slate-300 mb-1">Función: <span dangerouslySetInnerHTML={{ __html: renderMath(fnLabel, false) }} /></p>
          <p className="text-sm text-slate-300 mb-1">Intervalo: <span dangerouslySetInnerHTML={{ __html: renderMath(`[${a},\\,${b}]`, false) }} /></p>
          <p className="text-sm text-slate-300 mb-1">Subintervalos: <span dangerouslySetInnerHTML={{ __html: renderMath(`n = ${n}`, false) }} /></p>
          <p className="text-sm text-slate-300">Tipo: <span className="text-purple-300">{TYPE_LABELS[type]}</span></p>
        </div>

        {/* Step 2 */}
        <div className="step-card">
          <h4>PASO 2: CÁLCULO DE Δx</h4>
          <div dangerouslySetInnerHTML={{ __html: renderMath('\\Delta x = \\frac{b - a}{n}', true) }} />
          <div dangerouslySetInnerHTML={{ __html: renderMath(`\\Delta x = \\frac{${b} - ${a}}{${n}} = ${dx.toFixed(6)}`, true) }} />
        </div>

        {/* Step 3 */}
        <div className="step-card">
          <h4>PASO 3: PUNTOS DE EVALUACIÓN</h4>
          <div dangerouslySetInnerHTML={{ __html: renderMath(pointFormula, true) }} />
          <p className="text-xs text-slate-400 font-mono mt-2">
            Primeros: {result.points.slice(0, Math.min(5, n)).map(p => p.x.toFixed(3)).join(', ')}
            {n > 5 ? ' ... ' + result.points.slice(-2).map(p => p.x.toFixed(3)).join(', ') : ''}
          </p>
        </div>

        {/* Step 4 */}
        <div className="step-card">
          <h4>PASO 4: TABLA DE VALORES</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="text-slate-400 border-b border-[#0f3460]">
                  <th className="text-left p-1">i</th>
                  <th className="text-right p-1"><span dangerouslySetInnerHTML={{ __html: renderMath('x_i^*', false) }} /></th>
                  <th className="text-right p-1"><span dangerouslySetInnerHTML={{ __html: renderMath('f(x_i^*)', false) }} /></th>
                  <th className="text-right p-1"><span dangerouslySetInnerHTML={{ __html: renderMath('f(x_i^*)\\cdot\\Delta x', false) }} /></th>
                </tr>
              </thead>
              <tbody>
                {result.points.slice(0, Math.min(10, n)).map(p => (
                  <tr key={p.i} className="border-b border-[#0f3460]/30">
                    <td className="p-1">{p.i}</td>
                    <td className="p-1 text-right">{p.x.toFixed(4)}</td>
                    <td className="p-1 text-right">{p.fx.toFixed(4)}</td>
                    <td className="p-1 text-right text-green-300">{p.area.toFixed(4)}</td>
                  </tr>
                ))}
                {n > 10 && (
                  <>
                    <tr><td colSpan={4} className="text-slate-500 p-1">... ({n - 10} filas más)</td></tr>
                    {result.points.slice(-2).map(p => (
                      <tr key={p.i} className="border-b border-[#0f3460]/30">
                        <td className="p-1">{p.i}</td>
                        <td className="p-1 text-right">{p.x.toFixed(4)}</td>
                        <td className="p-1 text-right">{p.fx.toFixed(4)}</td>
                        <td className="p-1 text-right text-green-300">{p.area.toFixed(4)}</td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Step 5 */}
        <div className="step-card">
          <h4>PASO 5: SUMA</h4>
          <div dangerouslySetInnerHTML={{ __html: renderMath('S_n = \\sum_{i=1}^{n} f(x_i^*) \\cdot \\Delta x', true) }} />
          <p className="text-xs text-slate-400 font-mono break-all mt-1">
            Sₙ = {result.points.slice(0, Math.min(4, n)).map(p => p.area.toFixed(4)).join(' + ')}
            {n > 4 ? ' + ...' : ''}
          </p>
          <div dangerouslySetInnerHTML={{ __html: renderMath(`\\boxed{S_{${n}} = ${result.sum.toFixed(6)}}`, true) }} />
        </div>

        {/* Step 6 */}
        {showExact && exactValue !== null && (
          <div className="step-card highlight">
            <h4 style={{ color: '#fbbf24' }}>PASO 6: LÍMITE (INTEGRAL EXACTA)</h4>
            <div dangerouslySetInnerHTML={{ __html: renderMath('\\int_a^b f(x)\\,dx = \\lim_{n\\to\\infty} S_n', true) }} />
            <p className="text-sm text-slate-300 mt-2">Antiderivada: <span dangerouslySetInnerHTML={{ __html: renderMath(fnDef.antiLabel, false) }} /></p>
            <div dangerouslySetInnerHTML={{ __html: renderMath(`F(${b}) - F(${a}) = ${fnDef.anti(b).toFixed(4)} - ${fnDef.anti(a).toFixed(4)}`, true) }} />
            <div dangerouslySetInnerHTML={{ __html: renderMath(`\\boxed{\\int_{${a}}^{${b}} f(x)\\,dx = ${exactValue.toFixed(6)}}`, true) }} />
          </div>
        )}

        {/* Step 7 */}
        {showExact && error !== null && (
          <div className="step-card error">
            <h4 style={{ color: '#f87171' }}>PASO 7: ERROR</h4>
            <div dangerouslySetInnerHTML={{ __html: renderMath(`\\text{Error} = |S_n - \\text{Exacto}| = |${result.sum.toFixed(6)} - ${exactValue?.toFixed(6)}|`, true) }} />
            <div dangerouslySetInnerHTML={{ __html: renderMath(`\\boxed{\\text{Error} = ${error.toFixed(6)}}`, true) }} />
            {errorRel !== null && (
              <div dangerouslySetInnerHTML={{ __html: renderMath(`\\text{Error relativo} = ${errorRel.toFixed(4)}\\%`, true) }} />
            )}
          </div>
        )}

        {/* Formula */}
        <div className="step-card formula">
          <h4 style={{ color: '#e94560' }}>🎯 FÓRMULA GENERAL</h4>
          <div dangerouslySetInnerHTML={{ __html: renderMath('\\int_a^b f(x)\\,dx = \\lim_{n\\to\\infty} \\sum_{i=1}^{n} f(x_i^*) \\cdot \\Delta x', true) }} />
          <div dangerouslySetInnerHTML={{ __html: renderMath('\\text{donde } \\Delta x = \\frac{b-a}{n}', true) }} />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#e94560]/10 to-red-600/10 rounded-xl p-5 border border-[#e94560]/20">
        <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
          <span className="text-3xl">∫</span> Sumas de Riemann — Visualizador Interactivo
        </h2>
        <p className="text-slate-300 text-sm">
          Explora visualmente cómo las sumas de Riemann convergen a la integral definida.
        </p>
      </div>

      {/* Examples bar */}
      <div className="bg-[#16213e]/50 rounded-lg p-3 border border-[#0f3460]/50 flex items-center gap-3 flex-wrap">
        <span className="text-sm text-slate-400">Ejemplos:</span>
        <button onClick={() => loadExample(1)} className="px-3 py-1 text-xs bg-[#0f3460] text-slate-200 rounded hover:bg-[#e94560] transition-colors">
          x² en [0,2]
        </button>
        <button onClick={() => loadExample(2)} className="px-3 py-1 text-xs bg-[#0f3460] text-slate-200 rounded hover:bg-[#e94560] transition-colors">
          sin(x) en [0,π]
        </button>
        <button onClick={() => loadExample(3)} className="px-3 py-1 text-xs bg-[#0f3460] text-slate-200 rounded hover:bg-[#e94560] transition-colors">
          eˣ en [0,1]
        </button>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_400px] gap-4">
        {/* Left panel - Controls */}
        <div className="bg-[#16213e]/70 rounded-xl p-4 border border-[#0f3460]/50 space-y-4">
          {/* Function */}
          <div>
            <h3 className="text-xs font-bold text-[#e94560] mb-2 flex items-center gap-1">📐 Función</h3>
            <select
              value={fnKey}
              onChange={(e) => { setFnKey(e.target.value); setUseCustom(false); }}
              className="w-full bg-[#0f3460] border border-[#1a4080] text-slate-200 rounded-md px-3 py-2 text-sm"
            >
              {Object.entries(FUNCTIONS).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
            <label className="flex items-center gap-2 mt-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={useCustom}
                onChange={(e) => setUseCustom(e.target.checked)}
                className="accent-[#e94560]"
              />
              Función personalizada
            </label>
            {useCustom && (
              <input
                type="text"
                value={customFn}
                onChange={(e) => setCustomFn(e.target.value)}
                placeholder="Ej: x^2 + sin(x)"
                className="w-full mt-2 bg-[#0f3460] border border-[#1a4080] text-slate-200 rounded-md px-3 py-2 text-sm"
              />
            )}
            {customError && (
              <p className="text-xs text-red-300 mt-2 bg-red-900/20 p-2 rounded border border-red-500/30">{customError}</p>
            )}
            <div className="mt-2 p-2 bg-[#0f3460]/50 rounded text-center">
              <span dangerouslySetInnerHTML={{ __html: renderMath(useCustom ? `f(x) = ${customFn || '?'}` : FUNCTIONS[fnKey].latex, false) }} />
            </div>
          </div>

          {/* Limits */}
          <div>
            <h3 className="text-xs font-bold text-[#e94560] mb-2 flex items-center gap-1">📏 Límites de Integración</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-400">a (inferior)</label>
                <input
                  type="number"
                  value={a}
                  step={0.1}
                  onChange={(e) => setA(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#0f3460] border border-[#1a4080] text-slate-200 rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400">b (superior)</label>
                <input
                  type="number"
                  value={b}
                  step={0.1}
                  onChange={(e) => setB(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#0f3460] border border-[#1a4080] text-slate-200 rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>
            {limitError && (
              <p className="text-xs text-red-300 mt-2 bg-red-900/20 p-2 rounded border border-red-500/30">
                ⚠️ a debe ser menor que b
              </p>
            )}
          </div>

          {/* N */}
          <div>
            <h3 className="text-xs font-bold text-[#e94560] mb-2 flex items-center gap-1">🔢 Subintervalos (n)</h3>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={1}
                max={200}
                value={n}
                onChange={(e) => setN(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-lg font-bold text-[#e94560] w-10 text-center">{n}</span>
            </div>
            <div className="flex gap-1 flex-wrap mt-2">
              {[4, 10, 50, 100, 200].map(val => (
                <button
                  key={val}
                  onClick={() => setN(val)}
                  className={`px-2 py-1 text-xs rounded ${n === val ? 'bg-[#e94560] text-white' : 'bg-[#0f3460] text-slate-300'}`}
                >
                  n={val}
                </button>
              ))}
            </div>
          </div>

          {/* Type */}
          <div>
            <h3 className="text-xs font-bold text-[#e94560] mb-2 flex items-center gap-1">📊 Tipo de Suma</h3>
            <div className="space-y-1.5">
              {(Object.keys(TYPE_LABELS) as SumType[]).map(t => (
                <label key={t} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-white">
                  <input
                    type="radio"
                    name="sumType"
                    value={t}
                    checked={type === t}
                    onChange={() => setType(t)}
                    className="accent-[#e94560]"
                  />
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: TYPE_COLORS[t] }}></span>
                  {TYPE_LABELS[t]}
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div>
            <h3 className="text-xs font-bold text-[#e94560] mb-2 flex items-center gap-1">⚡ Acciones</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowCompare(!showCompare)}
                className={`px-3 py-2 text-xs font-semibold rounded ${showCompare ? 'bg-purple-500 text-white' : 'bg-[#0f3460] text-slate-200'}`}
              >
                📊 Comparar
              </button>
              <button
                onClick={() => setShowExact(!showExact)}
                className={`px-3 py-2 text-xs font-semibold rounded ${showExact ? 'bg-amber-400 text-black' : 'bg-[#0f3460] text-slate-200'}`}
              >
                📐 Exacto
              </button>
              <button
                onClick={() => setAnimating(!animating)}
                className={`px-3 py-2 text-xs font-semibold rounded ${animating ? 'bg-red-500 text-white' : 'bg-[#0f3460] text-slate-200'}`}
              >
                {animating ? '⏸ Pausar' : '🎬 Animar'}
              </button>
              <button
                onClick={() => setShowTable(!showTable)}
                className={`px-3 py-2 text-xs font-semibold rounded ${showTable ? 'bg-blue-500 text-white' : 'bg-[#0f3460] text-slate-200'}`}
              >
                📈 Tabla
              </button>
            </div>
          </div>
        </div>

        {/* Center - Canvas */}
        <div className="space-y-4">
          <div className="bg-[#0f0f23] rounded-xl border border-[#0f3460] overflow-hidden">
            <canvas ref={mainCanvasRef} className="w-full block" />
          </div>
          <div className="bg-[#0f0f23] rounded-xl border border-[#0f3460] overflow-hidden">
            <canvas ref={convCanvasRef} className="w-full block" />
          </div>

          {/* Convergence table */}
          {showTable && convData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0f0f23] rounded-xl border border-[#0f3460] p-4 overflow-x-auto"
            >
              <h3 className="text-xs font-bold text-[#e94560] mb-3">📈 Tabla de Convergencia</h3>
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="text-slate-400 border-b border-[#0f3460]">
                    <th className="text-left p-2">n</th>
                    <th className="text-right p-2 text-green-400">S_izq</th>
                    <th className="text-right p-2 text-orange-400">S_der</th>
                    <th className="text-right p-2 text-purple-400">S_med</th>
                    <th className="text-right p-2 text-amber-400">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {convData.map(r => (
                    <tr key={r.n} className="border-b border-[#0f3460]/30 hover:bg-[#0f3460]/20">
                      <td className="p-2">{r.n}</td>
                      <td className="p-2 text-right text-green-300">{r.sLeft.toFixed(4)}</td>
                      <td className="p-2 text-right text-orange-300">{r.sRight.toFixed(4)}</td>
                      <td className="p-2 text-right text-purple-300">{r.sMid.toFixed(4)}</td>
                      <td className="p-2 text-right text-amber-300">{r.errorMid.toFixed(6)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </div>

        {/* Right panel - Step by step */}
        <div className="bg-[#16213e]/70 rounded-xl p-4 border border-[#0f3460]/50 max-h-[calc(100vh-200px)] overflow-y-auto">
          <h2 className="text-sm font-bold text-[#e94560] border-b border-[#0f3460] pb-2 mb-4">
            📝 Desarrollo Paso a Paso
          </h2>
          {renderStepByStep()}
        </div>
      </div>
    </div>
  );
}
