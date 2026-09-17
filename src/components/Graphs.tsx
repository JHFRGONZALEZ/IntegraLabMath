import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ReferenceLine, BarChart, Bar } from 'recharts';

type GraphType = 'area' | 'riemann' | 'derivative' | 'fundamental';

interface GraphOption {
  id: GraphType;
  name: string;
  description: string;
}

const graphOptions: GraphOption[] = [
  { id: 'area', name: 'Área bajo la curva', description: 'Visualización del área definida por una integral' },
  { id: 'riemann', name: 'Sumas de Riemann', description: 'Aproximación del área con rectángulos' },
  { id: 'derivative', name: 'Integral vs Derivada', description: 'Relación entre una función y su integral' },
  { id: 'fundamental', name: 'Teorema Fundamental', description: 'F(x) = ∫₀ˣ f(t)dt' },
];

function generateFunctionData(fn: (x: number) => number, xMin: number, xMax: number, steps: number) {
  const data = [];
  const dx = (xMax - xMin) / steps;
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx;
    data.push({ x: Math.round(x * 100) / 100, y: Math.round(fn(x) * 1000) / 1000 });
  }
  return data;
}

export default function Graphs() {
  const [graphType, setGraphType] = useState<GraphType>('area');
  const [numRectangles, setNumRectangles] = useState(10);
  const [funcIndex, setFuncIndex] = useState(0);

  const functions = [
    { name: 'f(x) = x²', fn: (x: number) => x * x, color: '#3b82f6' },
    { name: 'f(x) = sen(x)', fn: (x: number) => Math.sin(x), color: '#8b5cf6' },
    { name: 'f(x) = e^(-x²)', fn: (x: number) => Math.exp(-x * x), color: '#10b981' },
    { name: 'f(x) = √x', fn: (x: number) => x >= 0 ? Math.sqrt(x) : 0, color: '#f59e0b' },
  ];

  const currentFn = functions[funcIndex];
  const xMin = -3;
  const xMax = 3;

  const functionData = useMemo(() => generateFunctionData(currentFn.fn, xMin, xMax, 200), [funcIndex]);

  const areaData = useMemo(() => {
    return functionData.map(d => ({
      ...d,
      area: d.x >= 0 && d.x <= 2 ? d.y : 0
    }));
  }, [functionData]);

  const riemannData = useMemo(() => {
    const a = 0, b = 2;
    const dx = (b - a) / numRectangles;
    const rects = [];
    for (let i = 0; i < numRectangles; i++) {
      const x = a + i * dx;
      const height = currentFn.fn(x + dx / 2);
      rects.push({
        x: Math.round((x + dx / 2) * 100) / 100,
        y: Math.round(height * 1000) / 1000,
        xStart: Math.round(x * 100) / 100,
        xEnd: Math.round((x + dx) * 100) / 100,
      });
    }
    return rects;
  }, [numRectangles, funcIndex]);

  const riemannSum = useMemo(() => {
    const a = 0, b = 2;
    const dx = (b - a) / numRectangles;
    let sum = 0;
    for (let i = 0; i < numRectangles; i++) {
      const x = a + i * dx;
      sum += currentFn.fn(x + dx / 2) * dx;
    }
    return Math.round(sum * 1000) / 1000;
  }, [numRectangles, funcIndex]);

  const derivativeData = useMemo(() => {
    return functionData.map(d => {
      const h = 0.01;
      const deriv = (currentFn.fn(d.x + h) - currentFn.fn(d.x - h)) / (2 * h);
      // Numerical integral from 0 to x
      let integral = 0;
      const steps = 50;
      const dxInt = d.x / steps;
      for (let i = 0; i < steps; i++) {
        const xi = i * dxInt;
        integral += currentFn.fn(xi) * dxInt;
      }
      return {
        x: d.x,
        original: d.y,
        derivative: Math.round(deriv * 1000) / 1000,
        integral: Math.round(integral * 1000) / 1000
      };
    });
  }, [functionData, funcIndex]);

  const fundamentalData = useMemo(() => {
    const data = [];
    const steps = 100;
    const dx = 4 / steps;
    for (let i = 0; i <= steps; i++) {
      const x = -2 + i * dx;
      // Compute F(x) = ∫₀ˣ f(t)dt numerically
      let integral = 0;
      const subSteps = 50;
      const dt = x / subSteps;
      for (let j = 0; j < subSteps; j++) {
        const t = j * dt;
        integral += currentFn.fn(t) * dt;
      }
      data.push({
        x: Math.round(x * 100) / 100,
        f: Math.round(currentFn.fn(x) * 1000) / 1000,
        F: Math.round(integral * 1000) / 1000
      });
    }
    return data;
  }, [funcIndex]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-600/10 to-red-600/10 rounded-xl p-6 border border-rose-500/20">
        <h2 className="text-2xl font-bold text-white mb-2">📊 Visualización Gráfica</h2>
        <p className="text-slate-300">
          Explora visualmente los conceptos del cálculo integral con gráficas interactivas.
        </p>
      </div>

      {/* Graph Type Selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {graphOptions.map(opt => (
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
            <p className="text-xs text-slate-400 mt-1">{opt.description}</p>
          </button>
        ))}
      </div>

      {/* Function Selector */}
      <div className="flex flex-wrap gap-2">
        {functions.map((fn, i) => (
          <button
            key={i}
            onClick={() => setFuncIndex(i)}
            className={`px-4 py-2 rounded-lg text-sm font-mono transition-all ${
              funcIndex === i
                ? 'text-white shadow-lg'
                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
            }`}
            style={funcIndex === i ? { backgroundColor: fn.color + '33', borderColor: fn.color } : {}}
          >
            {fn.name}
          </button>
        ))}
      </div>

      {/* Graph Display */}
      <motion.div
        key={graphType + funcIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50"
      >
        {/* Area under curve */}
        {graphType === 'area' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Área bajo la curva: ∫₀² f(x)dx</h3>
            <p className="text-sm text-slate-400 mb-4">La región sombreada representa el valor de la integral definida</p>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={areaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="x" stroke="#64748b" domain={[xMin, xMax]} />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Area type="monotone" dataKey="area" fill={currentFn.color + '40'} stroke={currentFn.color} strokeWidth={2} />
                <ReferenceLine x={0} stroke="#475569" />
                <ReferenceLine y={0} stroke="#475569" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Riemann Sums */}
        {graphType === 'riemann' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Sumas de Riemann</h3>
            <p className="text-sm text-slate-400 mb-4">Aproximación del área con {numRectangles} rectángulos</p>
            
            <div className="flex items-center gap-4 mb-4">
              <label className="text-sm text-slate-400">Rectángulos:</label>
              <input
                type="range"
                min="4"
                max="50"
                value={numRectangles}
                onChange={(e) => setNumRectangles(Number(e.target.value))}
                className="flex-1 accent-blue-500"
              />
              <span className="text-white font-mono w-8">{numRectangles}</span>
            </div>

            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={functionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="x" stroke="#64748b" domain={[xMin, xMax]} />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="y" fill={currentFn.color + '20'} stroke={currentFn.color} strokeWidth={2} />
                <ReferenceLine x={0} stroke="#475569" />
                <ReferenceLine y={0} stroke="#475569" />
              </AreaChart>
            </ResponsiveContainer>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
                <p className="text-sm text-slate-400">Suma de Riemann (n={numRectangles})</p>
                <p className="text-xl font-mono text-blue-300">{riemannSum}</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
                <p className="text-sm text-slate-400">Error estimado</p>
                <p className="text-xl font-mono text-amber-300">
                  {Math.abs(riemannSum - 2.667).toFixed(4)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Derivative vs Integral */}
        {graphType === 'derivative' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Función, su Derivada y su Integral</h3>
            <p className="text-sm text-slate-400 mb-4">Relación fundamental entre derivación e integración</p>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={derivativeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="x" stroke="#64748b" domain={[xMin, xMax]} />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="original" stroke={currentFn.color} strokeWidth={2} name="f(x)" dot={false} />
                <Line type="monotone" dataKey="derivative" stroke="#ef4444" strokeWidth={2} name="f'(x)" dot={false} />
                <Line type="monotone" dataKey="integral" stroke="#10b981" strokeWidth={2} name="∫f(x)dx" dot={false} />
                <ReferenceLine y={0} stroke="#475569" />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{backgroundColor: currentFn.color}}></div><span className="text-sm text-slate-400">f(x) original</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-sm text-slate-400">f'(x) derivada</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div><span className="text-sm text-slate-400">∫f(x)dx integral</span></div>
            </div>
          </div>
        )}

        {/* Fundamental Theorem */}
        {graphType === 'fundamental' && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Teorema Fundamental: F(x) = ∫₀ˣ f(t)dt</h3>
            <p className="text-sm text-slate-400 mb-4">La integral acumulada F(x) y la función original f(x)</p>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={fundamentalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="x" stroke="#64748b" domain={[-2, 2]} />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="f" stroke={currentFn.color} strokeWidth={2} name="f(x)" dot={false} />
                <Line type="monotone" dataKey="F" stroke="#a78bfa" strokeWidth={2} name="F(x) = ∫₀ˣ f(t)dt" dot={false} />
                <ReferenceLine y={0} stroke="#475569" />
                <ReferenceLine x={0} stroke="#475569" />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{backgroundColor: currentFn.color}}></div><span className="text-sm text-slate-400">f(x)</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-400"></div><span className="text-sm text-slate-400">F(x) = ∫₀ˣ f(t)dt (la integral acumulada)</span></div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
