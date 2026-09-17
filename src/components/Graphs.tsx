import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';

type GraphType = 'area' | 'riemann' | 'derivative' | 'fundamental';

interface FuncOption {
  name: string;
  latex: string;
  fn: (x: number) => number;
  color: string;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  integralA: number;
  integralB: number;
  integralExact: string;
}

const funcOptions: FuncOption[] = [
  {
    name: 'f(x) = x²',
    latex: 'x^2',
    fn: (x) => x * x,
    color: '#3b82f6',
    xMin: -0.5, xMax: 3, yMin: -0.5, yMax: 5,
    integralA: 0, integralB: 2, integralExact: '8/3'
  },
  {
    name: 'f(x) = sen(x)',
    latex: '\\sin(x)',
    fn: (x) => Math.sin(x),
    color: '#8b5cf6',
    xMin: -1, xMax: 7, yMin: -1.5, yMax: 1.5,
    integralA: 0, integralB: Math.PI, integralExact: '2'
  },
  {
    name: 'f(x) = e⁻ˣ²',
    latex: 'e^{-x^2}',
    fn: (x) => Math.exp(-x * x),
    color: '#10b981',
    xMin: -3, xMax: 3, yMin: -0.2, yMax: 1.2,
    integralA: -1.5, integralB: 1.5, integralExact: '≈ 1.692'
  },
  {
    name: 'f(x) = x·cos(x)',
    latex: 'x\\cos(x)',
    fn: (x) => x * Math.cos(x),
    color: '#f59e0b',
    xMin: -1, xMax: 7, yMin: -4, yMax: 4,
    integralA: 0, integralB: Math.PI / 2, integralExact: 'π/2 - 1'
  },
];

// SVG Graph Component
function SVGGraph({
  width, height, func, xMin, xMax, yMin, yMax, curveColor,
  showArea, areaA, areaB, areaColor,
  showRectangles, numRects, rectType,
  showDerivative, derivColor,
  showIntegral, integralColor,
}: {
  width: number; height: number;
  func: (x: number) => number;
  xMin: number; xMax: number; yMin: number; yMax: number;
  curveColor?: string;
  showArea?: boolean; areaA?: number; areaB?: number; areaColor?: string;
  showRectangles?: boolean; numRects?: number; rectType?: 'left' | 'right' | 'mid';
  showDerivative?: boolean; derivColor?: string;
  showIntegral?: boolean; integralColor?: string;
}) {
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  const toSVGX = (x: number) => padding.left + ((x - xMin) / (xMax - xMin)) * plotW;
  const toSVGY = (y: number) => padding.top + ((yMax - y) / (yMax - yMin)) * plotH;

  // Generate curve path
  const curvePath = useMemo(() => {
    const points: string[] = [];
    const steps = 300;
    for (let i = 0; i <= steps; i++) {
      const x = xMin + (i / steps) * (xMax - xMin);
      const y = func(x);
      if (y >= yMin && y <= yMax) {
        const sx = toSVGX(x);
        const sy = toSVGY(y);
        points.push(`${points.length === 0 ? 'M' : 'L'}${sx},${sy}`);
      }
    }
    return points.join(' ');
  }, [func, xMin, xMax, yMin, yMax, width, height]);

  // Area fill path
  const areaPath = useMemo(() => {
    if (!showArea || areaA === undefined || areaB === undefined) return '';
    const points: string[] = [];
    const steps = 200;
    const a = Math.max(areaA, xMin);
    const b = Math.min(areaB, xMax);
    
    // Start at bottom-left
    points.push(`M${toSVGX(a)},${toSVGY(0)}`);
    
    for (let i = 0; i <= steps; i++) {
      const x = a + (i / steps) * (b - a);
      const y = Math.max(yMin, Math.min(yMax, func(x)));
      points.push(`L${toSVGX(x)},${toSVGY(y)}`);
    }
    
    // Close at bottom-right
    points.push(`L${toSVGX(b)},${toSVGY(0)}Z`);
    return points.join(' ');
  }, [func, showArea, areaA, areaB, xMin, xMax, yMin, yMax, width, height]);

  // Riemann rectangles
  const rectangles = useMemo(() => {
    if (!showRectangles || !numRects || !areaA || !areaB) return [];
    const a = Math.max(areaA, xMin);
    const b = Math.min(areaB, xMax);
    const dx = (b - a) / numRects;
    const rects: { x: number; y: number; w: number; h: number; height: number }[] = [];

    for (let i = 0; i < numRects; i++) {
      const xLeft = a + i * dx;
      let sampleX: number;
      if (rectType === 'left') sampleX = xLeft;
      else if (rectType === 'right') sampleX = xLeft + dx;
      else sampleX = xLeft + dx / 2;

      const h = func(sampleX);
      const clampedH = Math.max(yMin, Math.min(yMax, h));
      
      const svgX = toSVGX(xLeft);
      const svgW = toSVGX(xLeft + dx) - svgX;
      const svgY = toSVGY(Math.max(0, clampedH));
      const svgH = Math.abs(toSVGY(0) - toSVGY(clampedH));

      rects.push({
        x: svgX,
        y: clampedH >= 0 ? svgY : toSVGY(0),
        w: svgW,
        h: svgH,
        height: h
      });
    }
    return rects;
  }, [func, showRectangles, numRects, rectType, areaA, areaB, xMin, xMax, yMin, yMax, width, height]);

  // Riemann sum value
  const riemannSum = useMemo(() => {
    if (!showRectangles || !numRects || !areaA || !areaB) return 0;
    const a = Math.max(areaA, xMin);
    const b = Math.min(areaB, xMax);
    const dx = (b - a) / numRects;
    let sum = 0;
    for (let i = 0; i < numRects; i++) {
      const xLeft = a + i * dx;
      let sampleX: number;
      if (rectType === 'left') sampleX = xLeft;
      else if (rectType === 'right') sampleX = xLeft + dx;
      else sampleX = xLeft + dx / 2;
      sum += func(sampleX) * dx;
    }
    return sum;
  }, [func, showRectangles, numRects, rectType, areaA, areaB, xMin, xMax]);

  // Derivative curve
  const derivPath = useMemo(() => {
    if (!showDerivative) return '';
    const points: string[] = [];
    const steps = 300;
    const h = 0.001;
    for (let i = 0; i <= steps; i++) {
      const x = xMin + (i / steps) * (xMax - xMin);
      const dy = (func(x + h) - func(x - h)) / (2 * h);
      if (dy >= yMin && dy <= yMax) {
        const sx = toSVGX(x);
        const sy = toSVGY(dy);
        points.push(`${points.length === 0 ? 'M' : 'L'}${sx},${sy}`);
      }
    }
    return points.join(' ');
  }, [func, showDerivative, xMin, xMax, yMin, yMax, width, height]);

  // Integral curve F(x) = ∫₀ˣ f(t)dt
  const integralPath = useMemo(() => {
    if (!showIntegral) return '';
    const points: string[] = [];
    const steps = 300;
    const dx = (xMax - xMin) / steps;
    let cumulative = 0;
    
    // First compute from 0 to xMin if needed
    if (xMin < 0) {
      const subSteps = 100;
      const subDx = (0 - xMin) / subSteps;
      for (let i = 0; i < subSteps; i++) {
        const t = xMin + i * subDx;
        cumulative += func(t) * subDx;
      }
    }

    for (let i = 0; i <= steps; i++) {
      const x = xMin + i * dx;
      if (i > 0) {
        cumulative += func(x) * dx;
      }
      if (cumulative >= yMin && cumulative <= yMax) {
        const sx = toSVGX(x);
        const sy = toSVGY(cumulative);
        points.push(`${points.length === 0 ? 'M' : 'L'}${sx},${sy}`);
      }
    }
    return points.join(' ');
  }, [func, showIntegral, xMin, xMax, yMin, yMax, width, height]);

  // Grid lines
  const gridLines = useMemo(() => {
    const lines: JSX.Element[] = [];
    const xStep = Math.ceil((xMax - xMin) / 8);
    const yStep = Math.ceil((yMax - yMin) / 6);

    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x += xStep || 1) {
      lines.push(
        <line key={`gx${x}`} x1={toSVGX(x)} y1={padding.top} x2={toSVGX(x)} y2={padding.top + plotH}
          stroke="#334155" strokeWidth="0.5" strokeDasharray="4,4" />
      );
      lines.push(
        <text key={`lx${x}`} x={toSVGX(x)} y={height - 10} fill="#64748b" fontSize="11" textAnchor="middle">
          {x}
        </text>
      );
    }
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y += yStep || 1) {
      lines.push(
        <line key={`gy${y}`} x1={padding.left} y1={toSVGY(y)} x2={padding.left + plotW} y2={toSVGY(y)}
          stroke="#334155" strokeWidth="0.5" strokeDasharray="4,4" />
      );
      lines.push(
        <text key={`ly${y}`} x={padding.left - 8} y={toSVGY(y) + 4} fill="#64748b" fontSize="11" textAnchor="end">
          {y}
        </text>
      );
    }
    return lines;
  }, [xMin, xMax, yMin, yMax, width, height]);

  // Axis lines
  const xAxisY = toSVGY(0);
  const yAxisX = toSVGX(0);

  return (
    <svg width={width} height={height} className="overflow-visible">
      {/* Background */}
      <rect x={padding.left} y={padding.top} width={plotW} height={plotH} fill="#0f172a" rx="4" />
      
      {/* Grid */}
      {gridLines}
      
      {/* Axes */}
      {xAxisY >= padding.top && xAxisY <= padding.top + plotH && (
        <line x1={padding.left} y1={xAxisY} x2={padding.left + plotW} y2={xAxisY} stroke="#475569" strokeWidth="1.5" />
      )}
      {yAxisX >= padding.left && yAxisX <= padding.left + plotW && (
        <line x1={yAxisX} y1={padding.top} x2={yAxisX} y2={padding.top + plotH} stroke="#475569" strokeWidth="1.5" />
      )}

      {/* Area fill */}
      {showArea && areaPath && (
        <path d={areaPath} fill={areaColor || '#3b82f640'} stroke="none" />
      )}

      {/* Riemann rectangles */}
      {showRectangles && rectangles.map((rect, i) => (
        <rect
          key={i}
          x={rect.x}
          y={rect.y}
          width={Math.max(0, rect.w - 1)}
          height={rect.h}
          fill={rect.height >= 0 ? '#3b82f650' : '#ef444450'}
          stroke={rect.height >= 0 ? '#3b82f6' : '#ef4444'}
          strokeWidth="1"
          rx="1"
        />
      ))}

      {/* Derivative curve */}
      {showDerivative && derivPath && (
        <path d={derivPath} fill="none" stroke={derivColor || '#ef4444'} strokeWidth="2" strokeDasharray="6,3" />
      )}

      {/* Integral curve */}
      {showIntegral && integralPath && (
        <path d={integralPath} fill="none" stroke={integralColor || '#a78bfa'} strokeWidth="2.5" />
      )}

      {/* Main curve */}
      <path d={curvePath} fill="none" stroke={curveColor || '#60a5fa'} strokeWidth="2.5" strokeLinecap="round" />

      {/* Integration limits markers */}
      {showArea && areaA !== undefined && areaB !== undefined && (
        <>
          <line x1={toSVGX(areaA)} y1={padding.top} x2={toSVGX(areaA)} y2={padding.top + plotH}
            stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,2" />
          <line x1={toSVGX(areaB)} y1={padding.top} x2={toSVGX(areaB)} y2={padding.top + plotH}
            stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,2" />
          <text x={toSVGX(areaA)} y={padding.top - 5} fill="#f59e0b" fontSize="12" textAnchor="middle" fontWeight="bold">
            a={areaA.toFixed(1)}
          </text>
          <text x={toSVGX(areaB)} y={padding.top - 5} fill="#f59e0b" fontSize="12" textAnchor="middle" fontWeight="bold">
            b={areaB.toFixed(1)}
          </text>
        </>
      )}

      {/* Riemann sum display */}
      {showRectangles && (
        <text x={width / 2} y={height - 2} fill="#94a3b8" fontSize="12" textAnchor="middle">
          Sₙ = {riemannSum.toFixed(6)}
        </text>
      )}
    </svg>
  );
}

export default function Graphs() {
  const [graphType, setGraphType] = useState<GraphType>('area');
  const [funcIndex, setFuncIndex] = useState(0);
  const [numRects, setNumRects] = useState(10);
  const [rectType, setRectType] = useState<'left' | 'right' | 'mid'>('mid');

  const currentFunc = funcOptions[funcIndex];

  const graphTypes = [
    { id: 'area' as GraphType, name: 'Área bajo la curva', desc: 'Visualización de ∫f(x)dx' },
    { id: 'riemann' as GraphType, name: 'Sumas de Riemann', desc: 'Aproximación con rectángulos' },
    { id: 'derivative' as GraphType, name: 'f(x) y f\'(x)', desc: 'Función y su derivada' },
    { id: 'fundamental' as GraphType, name: 'Teorema Fundamental', desc: 'F(x) = ∫₀ˣ f(t)dt' },
  ];

  const getRiemannSum = useCallback(() => {
    const a = currentFunc.integralA;
    const b = currentFunc.integralB;
    const dx = (b - a) / numRects;
    let sum = 0;
    for (let i = 0; i < numRects; i++) {
      const xLeft = a + i * dx;
      let sampleX: number;
      if (rectType === 'left') sampleX = xLeft;
      else if (rectType === 'right') sampleX = xLeft + dx;
      else sampleX = xLeft + dx / 2;
      sum += currentFunc.fn(sampleX) * dx;
    }
    return sum;
  }, [currentFunc, numRects, rectType]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-600/10 to-red-600/10 rounded-xl p-6 border border-rose-500/20">
        <h2 className="text-2xl font-bold text-white mb-2">📊 Visualización Gráfica Interactiva</h2>
        <p className="text-slate-300">
          Explora visualmente los conceptos del cálculo integral con gráficas SVG de alta precisión.
        </p>
      </div>

      {/* Graph Type Selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {graphTypes.map(opt => (
          <button
            key={opt.id}
            onClick={() => setGraphType(opt.id)}
            className={`p-4 rounded-xl text-left transition-all border ${
              graphType === opt.id
                ? 'bg-gradient-to-br from-rose-600/20 to-red-600/20 border-rose-500/30'
                : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
            }`}
          >
            <p className={`text-sm font-semibold ${graphType === opt.id ? 'text-rose-300' : 'text-white'}`}>{opt.name}</p>
            <p className="text-xs text-slate-400 mt-1">{opt.desc}</p>
          </button>
        ))}
      </div>

      {/* Function Selector */}
      <div className="flex flex-wrap gap-2">
        {funcOptions.map((fn, i) => (
          <button
            key={i}
            onClick={() => setFuncIndex(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
              funcIndex === i
                ? 'text-white shadow-lg border-transparent'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
            style={funcIndex === i ? { backgroundColor: fn.color + '33', borderColor: fn.color } : {}}
          >
            {fn.name}
          </button>
        ))}
      </div>

      {/* Controls for Riemann */}
      {graphType === 'riemann' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-slate-400 mb-2 block">
                Número de rectángulos (n): <span className="text-white font-bold">{numRects}</span>
              </label>
              <input
                type="range"
                min="3"
                max="100"
                value={numRects}
                onChange={(e) => setNumRects(Number(e.target.value))}
                className="w-full accent-blue-500 h-2"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>3</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Tipo de suma:</label>
              <div className="flex gap-2">
                {(['left', 'mid', 'right'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setRectType(type)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      rectType === type
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {type === 'left' ? 'Izquierda' : type === 'mid' ? 'Centro' : 'Derecha'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Graph */}
      <motion.div
        key={graphType + funcIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            {graphTypes.find(g => g.id === graphType)?.name}
          </h3>
          <span className="text-sm text-slate-400">{currentFunc.name}</span>
        </div>

        <div className="overflow-x-auto">
          <SVGGraph
            width={800}
            height={420}
            func={currentFunc.fn}
            xMin={currentFunc.xMin}
            xMax={currentFunc.xMax}
            yMin={currentFunc.yMin}
            yMax={currentFunc.yMax}
            curveColor={currentFunc.color}
            showArea={graphType === 'area' || graphType === 'riemann'}
            areaA={currentFunc.integralA}
            areaB={currentFunc.integralB}
            areaColor={currentFunc.color + '30'}
            showRectangles={graphType === 'riemann'}
            numRects={numRects}
            rectType={rectType}
            showDerivative={graphType === 'derivative'}
            derivColor="#ef4444"
            showIntegral={graphType === 'fundamental'}
            integralColor="#a78bfa"
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-700/30">
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 rounded" style={{ backgroundColor: currentFunc.color }}></div>
            <span className="text-xs text-slate-400">f(x)</span>
          </div>
          {graphType === 'area' && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: currentFunc.color + '30' }}></div>
              <span className="text-xs text-slate-400">Área = ∫f(x)dx</span>
            </div>
          )}
          {graphType === 'riemann' && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-500/30 border border-blue-500"></div>
                <span className="text-xs text-slate-400">Rectángulos (n={numRects})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-amber-400"></div>
                <span className="text-xs text-slate-400">Límites de integración</span>
              </div>
            </>
          )}
          {graphType === 'derivative' && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 rounded bg-red-500" style={{ borderStyle: 'dashed' }}></div>
              <span className="text-xs text-slate-400">f'(x) derivada</span>
            </div>
          )}
          {graphType === 'fundamental' && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 rounded bg-purple-400"></div>
              <span className="text-xs text-slate-400">F(x) = ∫₀ˣ f(t)dt</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {graphType === 'riemann' && (
          <>
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
              <p className="text-sm text-slate-400 mb-1">Suma de Riemann (n={numRects})</p>
              <p className="text-2xl font-mono font-bold text-blue-300">{getRiemannSum().toFixed(6)}</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
              <p className="text-sm text-slate-400 mb-1">Valor exacto</p>
              <p className="text-2xl font-mono font-bold text-emerald-300">{currentFunc.integralExact}</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
              <p className="text-sm text-slate-400 mb-1">Error absoluto</p>
              <p className="text-2xl font-mono font-bold text-amber-300">
                {Math.abs(getRiemannSum() - parseFloat(currentFunc.integralExact.replace('≈ ', ''))).toFixed(6)}
              </p>
            </div>
          </>
        )}
        {graphType === 'area' && (
          <>
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
              <p className="text-sm text-slate-400 mb-1">Integral definida</p>
              <p className="text-xl font-mono font-bold text-blue-300">
                ∫[{currentFunc.integralA},{currentFunc.integralB.toFixed(1)}] f(x)dx
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
              <p className="text-sm text-slate-400 mb-1">Valor exacto</p>
              <p className="text-2xl font-mono font-bold text-emerald-300">{currentFunc.integralExact}</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
              <p className="text-sm text-slate-400 mb-1">Significado geométrico</p>
              <p className="text-sm text-slate-300">Área neta entre f(x) y el eje x</p>
            </div>
          </>
        )}
        {graphType === 'derivative' && (
          <>
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
              <p className="text-sm text-slate-400 mb-1">Función original</p>
              <p className="text-lg font-mono font-bold" style={{ color: currentFunc.color }}>{currentFunc.name}</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
              <p className="text-sm text-slate-400 mb-1">Relación clave</p>
              <p className="text-sm text-slate-300">f'(x) indica la pendiente de f(x) en cada punto</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
              <p className="text-sm text-slate-400 mb-1">Teorema Fundamental</p>
              <p className="text-sm text-slate-300">∫f'(x)dx = f(x) + C</p>
            </div>
          </>
        )}
        {graphType === 'fundamental' && (
          <>
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
              <p className="text-sm text-slate-400 mb-1">F(x) = ∫₀ˣ f(t)dt</p>
              <p className="text-sm text-slate-300">La integral acumulada desde 0 hasta x</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
              <p className="text-sm text-slate-400 mb-1">Propiedad fundamental</p>
              <p className="text-sm text-slate-300">F'(x) = f(x) — derivar e integrar son inversas</p>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
              <p className="text-sm text-slate-400 mb-1">Interpretación</p>
              <p className="text-sm text-slate-300">F(x) acumula el área bajo f(t) desde 0 hasta x</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
