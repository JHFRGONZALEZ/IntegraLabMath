import { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { Ruler, Box, Gauge, DollarSign, Atom, Droplets } from 'lucide-react';

interface Application {
  id: string;
  name: string;
  icon: typeof Ruler;
  color: string;
  description: string;
  formula: string;
  example: {
    problem: string;
    solution: string[];
    result: string;
  };
  graphData: { x: number; y: number }[];
  graphLabel: string;
}

const applications: Application[] = [
  {
    id: 'area',
    name: 'Área entre Curvas',
    icon: Ruler,
    color: 'from-blue-500 to-cyan-500',
    description: 'El área entre dos curvas f(x) y g(x) desde a hasta b se calcula integrando la diferencia de las funciones.',
    formula: 'A = ∫ₐᵇ |f(x) - g(x)| dx',
    example: {
      problem: 'Hallar el área entre f(x) = x² y g(x) = x en [0,1]',
      solution: [
        'Puntos de intersección: x² = x → x=0, x=1',
        'En [0,1]: x ≥ x², así que f(x) - g(x) = x - x²',
        'A = ∫₀¹ (x - x²) dx',
        'A = [x²/2 - x³/3]₀¹',
        'A = 1/2 - 1/3 = 1/6'
      ],
      result: 'A = 1/6 ≈ 0.167 unidades²'
    },
    graphData: Array.from({ length: 50 }, (_, i) => {
      const x = i / 50;
      return { x: Math.round(x * 100) / 100, y: Math.round((x - x * x) * 1000) / 1000 };
    }),
    graphLabel: 'f(x) - g(x) = x - x²'
  },
  {
    id: 'volume',
    name: 'Volumen de Revolución',
    icon: Box,
    color: 'from-purple-500 to-pink-500',
    description: 'El volumen de un sólido de revolución generado al rotar f(x) alrededor del eje x.',
    formula: 'V = π ∫ₐᵇ [f(x)]² dx',
    example: {
      problem: 'Volumen al rotar f(x) = √x alrededor del eje x en [0,4]',
      solution: [
        'V = π ∫₀⁴ (√x)² dx',
        'V = π ∫₀⁴ x dx',
        'V = π [x²/2]₀⁴',
        'V = π (16/2 - 0)',
        'V = 8π'
      ],
      result: 'V = 8π ≈ 25.13 unidades³'
    },
    graphData: Array.from({ length: 50 }, (_, i) => {
      const x = (i / 50) * 4;
      return { x: Math.round(x * 100) / 100, y: Math.round(Math.PI * x * 1000) / 1000 };
    }),
    graphLabel: 'π·[f(x)]² = πx'
  },
  {
    id: 'arc-length',
    name: 'Longitud de Arco',
    icon: Gauge,
    color: 'from-emerald-500 to-teal-500',
    description: 'La longitud de la curva y = f(x) desde a hasta b.',
    formula: 'L = ∫ₐᵇ √(1 + [f\'(x)]²) dx',
    example: {
      problem: 'Longitud de arco de f(x) = x^(3/2) en [0,1]',
      solution: [
        'f\'(x) = (3/2)x^(1/2)',
        '[f\'(x)]² = (9/4)x',
        'L = ∫₀¹ √(1 + 9x/4) dx',
        'Sustitución: u = 1 + 9x/4, du = 9/4 dx',
        'L = (4/9) · (2/3) · [(13/4)^(3/2) - 1]',
        'L = (8/27)[(13/4)^(3/2) - 1]'
      ],
      result: 'L ≈ 1.44 unidades'
    },
    graphData: Array.from({ length: 50 }, (_, i) => {
      const x = i / 50;
      return { x: Math.round(x * 100) / 100, y: Math.round(Math.pow(x, 1.5) * 1000) / 1000 };
    }),
    graphLabel: 'f(x) = x^(3/2)'
  },
  {
    id: 'work',
    name: 'Trabajo (Física)',
    icon: Atom,
    color: 'from-amber-500 to-orange-500',
    description: 'El trabajo realizado por una fuerza variable F(x) al mover un objeto de a a b.',
    formula: 'W = ∫ₐᵇ F(x) dx',
    example: {
      problem: 'Trabajo para estirar un resorte (Ley de Hooke: F = kx, k=200 N/m) de 0 a 0.3m',
      solution: [
        'F(x) = kx = 200x',
        'W = ∫₀^0.3 200x dx',
        'W = 200[x²/2]₀^0.3',
        'W = 100(0.3)²',
        'W = 100(0.09) = 9'
      ],
      result: 'W = 9 Joules'
    },
    graphData: Array.from({ length: 50 }, (_, i) => {
      const x = (i / 50) * 0.3;
      return { x: Math.round(x * 1000) / 1000, y: Math.round(200 * x * 10) / 10 };
    }),
    graphLabel: 'F(x) = 200x (Newtons)'
  },
  {
    id: 'economics',
    name: 'Excedente del Consumidor',
    icon: DollarSign,
    color: 'from-rose-500 to-red-500',
    description: 'En economía, el excedente del consumidor mide el beneficio adicional que obtienen los compradores.',
    formula: 'EC = ∫₀Q [D(x) - P*] dx',
    example: {
      problem: 'Demanda: D(x) = 100 - x², precio de equilibrio P* = 75, Q = 5',
      solution: [
        'EC = ∫₀⁵ [(100-x²) - 75] dx',
        'EC = ∫₀⁵ (25 - x²) dx',
        'EC = [25x - x³/3]₀⁵',
        'EC = 125 - 125/3',
        'EC = 250/3'
      ],
      result: 'EC = 250/3 ≈ 83.33 unidades monetarias'
    },
    graphData: Array.from({ length: 50 }, (_, i) => {
      const x = (i / 50) * 5;
      return { x: Math.round(x * 100) / 100, y: Math.round(Math.max(0, 25 - x * x) * 100) / 100 };
    }),
    graphLabel: 'D(x) - P* = 25 - x²'
  },
  {
    id: 'fluid',
    name: 'Fuerza Hidrostática',
    icon: Droplets,
    color: 'from-indigo-500 to-violet-500',
    description: 'La fuerza ejercida por un fluido sobre una superficie sumergida.',
    formula: 'F = ∫ₐᵇ ρg·d(x)·w(x) dx',
    example: {
      problem: 'Fuerza sobre una placa rectangular vertical de 2m de ancho y 3m de alto, sumergida con su borde superior a 1m de la superficie',
      solution: [
        'ρ = 1000 kg/m³, g = 9.8 m/s²',
        'Profundidad: d(x) = 1 + x (x desde 0 hasta 3)',
        'Ancho: w(x) = 2m (constante)',
        'F = ∫₀³ 1000·9.8·(1+x)·2 dx',
        'F = 19600 ∫₀³ (1+x) dx',
        'F = 19600 [x + x²/2]₀³',
        'F = 19600 (3 + 4.5) = 19600(7.5)'
      ],
      result: 'F = 147,000 N = 147 kN'
    },
    graphData: Array.from({ length: 50 }, (_, i) => {
      const x = (i / 50) * 3;
      return { x: Math.round(x * 100) / 100, y: Math.round((1 + x) * 100) / 100 };
    }),
    graphLabel: 'Presión proporcional a profundidad'
  }
];

export default function Applications() {
  const [selectedApp, setSelectedApp] = useState<string>('area');
  const [showSolution, setShowSolution] = useState(false);

  const currentApp = applications.find(a => a.id === selectedApp)!;
  const Icon = currentApp.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600/10 to-violet-600/10 rounded-xl p-6 border border-indigo-500/20">
        <h2 className="text-2xl font-bold text-white mb-2">⚡ Aplicaciones de la Integración</h2>
        <p className="text-slate-300">
          La integral definida tiene aplicaciones poderosas en geometría, física, economía e ingeniería.
        </p>
      </div>

      {/* App Selector */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {applications.map(app => {
          const AppIcon = app.icon;
          return (
            <button
              key={app.id}
              onClick={() => { setSelectedApp(app.id); setShowSolution(false); }}
              className={`p-3 rounded-xl text-center transition-all border ${
                selectedApp === app.id
                  ? `bg-gradient-to-br ${app.color} border-transparent shadow-lg`
                  : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
              }`}
            >
              <AppIcon size={20} className={`mx-auto mb-1 ${selectedApp === app.id ? 'text-white' : 'text-slate-400'}`} />
              <p className={`text-xs font-medium ${selectedApp === app.id ? 'text-white' : 'text-slate-400'}`}>
                {app.name}
              </p>
            </button>
          );
        })}
      </div>

      {/* App Detail */}
      <motion.div
        key={selectedApp}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Info */}
        <div className="space-y-4">
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${currentApp.color} flex items-center justify-center`}>
                <Icon size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">{currentApp.name}</h3>
            </div>
            <p className="text-slate-300 mb-4">{currentApp.description}</p>
            
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30 mb-4">
              <p className="text-sm text-slate-400 mb-1">Fórmula General</p>
              <p className="text-lg font-mono text-purple-300 text-center">{currentApp.formula}</p>
            </div>
          </div>

          {/* Example */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <h4 className="text-lg font-semibold text-white mb-3">📝 Ejemplo Resuelto</h4>
            <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/20 mb-4">
              <p className="text-sm text-blue-300 font-medium">{currentApp.example.problem}</p>
            </div>
            
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="w-full bg-slate-700/50 hover:bg-slate-700 text-white font-medium py-2.5 rounded-lg transition-colors mb-3"
            >
              {showSolution ? 'Ocultar' : 'Ver'} Solución Paso a Paso
            </button>

            {showSolution && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2"
              >
                {currentApp.example.solution.map((step, i) => (
                  <div key={i} className="flex items-start gap-2 bg-slate-900/30 rounded-lg p-3">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-sm text-slate-300 font-mono">{step}</p>
                  </div>
                ))}
                <div className="bg-emerald-900/20 rounded-lg p-3 border border-emerald-500/20 mt-2">
                  <p className="text-sm text-emerald-400 font-semibold">✅ Resultado: {currentApp.example.result}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Graph */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <h4 className="text-lg font-semibold text-white mb-4">📈 Visualización</h4>
          <p className="text-sm text-slate-400 mb-4">{currentApp.graphLabel}</p>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={currentApp.graphData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="x" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area type="monotone" dataKey="y" fill="#6366f140" stroke="#6366f1" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
