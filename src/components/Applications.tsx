import { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Ruler, Box, Gauge, DollarSign, Atom, Droplets } from 'lucide-react';
import MathTex from './Math';

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
    formula: 'A = \\int_a^b |f(x) - g(x)|\\,dx',
    example: {
      problem: '\\text{Hallar el área entre } f(x) = x^2 \\text{ y } g(x) = x \\text{ en } [0,1]',
      solution: [
        '\\text{Puntos de intersección: } x^2 = x \\Rightarrow x=0,\\; x=1',
        '\\text{En } [0,1]:\\; x \\geq x^2, \\text{ así que } f(x) - g(x) = x - x^2',
        'A = \\int_0^1 (x - x^2)\\,dx',
        'A = \\left[\\frac{x^2}{2} - \\frac{x^3}{3}\\right]_0^1',
        'A = \\frac{1}{2} - \\frac{1}{3} = \\frac{1}{6}'
      ],
      result: 'A = \\frac{1}{6} \\approx 0.167 \\text{ unidades}^2'
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
    formula: 'V = \\pi \\int_a^b [f(x)]^2\\,dx',
    example: {
      problem: '\\text{Volumen al rotar } f(x) = \\sqrt{x} \\text{ alrededor del eje x en } [0,4]',
      solution: [
        'V = \\pi \\int_0^4 (\\sqrt{x})^2\\,dx',
        'V = \\pi \\int_0^4 x\\,dx',
        'V = \\pi \\left[\\frac{x^2}{2}\\right]_0^4',
        'V = \\pi \\left(\\frac{16}{2} - 0\\right)',
        'V = 8\\pi'
      ],
      result: 'V = 8\\pi \\approx 25.13 \\text{ unidades}^3'
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
    formula: 'L = \\int_a^b \\sqrt{1 + [f\'(x)]^2}\\,dx',
    example: {
      problem: '\\text{Longitud de arco de } f(x) = x^{3/2} \\text{ en } [0,1]',
      solution: [
        'f\'(x) = \\frac{3}{2}x^{1/2}',
        '[f\'(x)]^2 = \\frac{9}{4}x',
        'L = \\int_0^1 \\sqrt{1 + \\frac{9x}{4}}\\,dx',
        '\\text{Sustitución: } u = 1 + \\frac{9x}{4},\\; du = \\frac{9}{4}\\,dx',
        'L = \\frac{4}{9} \\cdot \\frac{2}{3} \\cdot \\left[\\left(\\frac{13}{4}\\right)^{3/2} - 1\\right]'
      ],
      result: 'L \\approx 1.44 \\text{ unidades}'
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
    formula: 'W = \\int_a^b F(x)\\,dx',
    example: {
      problem: '\\text{Trabajo para estirar un resorte (Ley de Hooke: } F = kx,\\; k=200 \\text{ N/m) de 0 a 0.3m}',
      solution: [
        'F(x) = kx = 200x',
        'W = \\int_0^{0.3} 200x\\,dx',
        'W = 200\\left[\\frac{x^2}{2}\\right]_0^{0.3}',
        'W = 100(0.3)^2',
        'W = 100(0.09) = 9'
      ],
      result: 'W = 9 \\text{ Joules}'
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
    formula: 'EC = \\int_0^Q [D(x) - P^*]\\,dx',
    example: {
      problem: '\\text{Demanda: } D(x) = 100 - x^2,\\; \\text{precio de equilibrio } P^* = 75,\\; Q = 5',
      solution: [
        'EC = \\int_0^5 [(100-x^2) - 75]\\,dx',
        'EC = \\int_0^5 (25 - x^2)\\,dx',
        'EC = \\left[25x - \\frac{x^3}{3}\\right]_0^5',
        'EC = 125 - \\frac{125}{3}',
        'EC = \\frac{250}{3}'
      ],
      result: 'EC = \\frac{250}{3} \\approx 83.33 \\text{ unidades monetarias}'
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
    formula: 'F = \\int_a^b \\rho g \\cdot d(x) \\cdot w(x)\\,dx',
    example: {
      problem: '\\text{Fuerza sobre una placa rectangular vertical de 2m de ancho y 3m de alto, sumergida con su borde superior a 1m de la superficie}',
      solution: [
        '\\rho = 1000 \\text{ kg/m}^3,\\; g = 9.8 \\text{ m/s}^2',
        '\\text{Profundidad: } d(x) = 1 + x \\text{ (x desde 0 hasta 3)}',
        '\\text{Ancho: } w(x) = 2\\text{m (constante)}',
        'F = \\int_0^3 1000 \\cdot 9.8 \\cdot (1+x) \\cdot 2\\,dx',
        'F = 19600 \\int_0^3 (1+x)\\,dx',
        'F = 19600 \\left[x + \\frac{x^2}{2}\\right]_0^3',
        'F = 19600(3 + 4.5) = 19600(7.5)'
      ],
      result: 'F = 147{,}000 \\text{ N} = 147 \\text{ kN}'
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
      <div className="bg-gradient-to-r from-[#e94560]/10 to-red-600/10 rounded-xl p-6 border border-[#e94560]/20">
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
                  : 'bg-[#0f3460]/50 border-[#0f3460] hover:border-slate-600'
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
          <div className="bg-[#16213e]/70 rounded-xl p-6 border border-[#0f3460]/50">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${currentApp.color} flex items-center justify-center`}>
                <Icon size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">{currentApp.name}</h3>
            </div>
            <p className="text-slate-300 mb-4">{currentApp.description}</p>
            
            <div className="step-card" style={{ background: 'rgba(15, 52, 96, 0.5)' }}>
              <h4 style={{ color: '#93c5fd' }}>📐 FÓRMULA GENERAL</h4>
              <MathTex tex={currentApp.formula} display={true} />
            </div>
          </div>

          {/* Example */}
          <div className="bg-[#16213e]/70 rounded-xl p-6 border border-[#0f3460]/50">
            <h4 className="text-lg font-semibold text-white mb-3">📝 Ejemplo Resuelto</h4>
            <div className="step-card">
              <MathTex tex={currentApp.example.problem} />
            </div>
            
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="w-full bg-[#0f3460] hover:bg-[#1a4080] text-white font-medium py-2.5 rounded-lg transition-colors mb-3 mt-3"
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
                  <div key={i} className="step-card" style={{ marginBottom: '8px' }}>
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' }}>
                        {i + 1}
                      </span>
                      <div className="text-sm overflow-x-auto">
                        <MathTex tex={step} />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="step-card highlight">
                  <h4 style={{ color: '#fbbf24' }}>✅ RESULTADO:</h4>
                  <MathTex tex={currentApp.example.result} display={true} />
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Graph */}
        <div className="bg-[#16213e]/70 rounded-xl p-6 border border-[#0f3460]/50">
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
