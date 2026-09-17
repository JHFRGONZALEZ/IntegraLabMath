import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight } from 'lucide-react';
import Math from './Math';

interface Method {
  id: string;
  name: string;
  subtitle: string;
  when: string;
  formula: string;
  steps: string[];
  examples: { problem: string; steps: string[]; result: string }[];
  color: string;
}

const methods: Method[] = [
  {
    id: 'substitution',
    name: 'Sustitución (Cambio de Variable)',
    subtitle: 'Método u-sustitución',
    when: 'Cuando identificas una función compuesta donde la derivada del argumento interno está presente (o un múltiplo de ella).',
    formula: '\\int f(g(x)) \\cdot g\'(x)\\,dx = \\int f(u)\\,du, \\quad u = g(x)',
    steps: [
      'Identifica u = g(x) como la parte "interna" de la función compuesta',
      'Calcula du = g\'(x)\\,dx',
      'Sustituye en la integral para obtener \\int f(u)\\,du',
      'Resuelve la integral en términos de u',
      'Regresa a la variable original: reemplaza u por g(x)'
    ],
    examples: [
      {
        problem: '\\int 2x \\cdot \\cos(x^2)\\,dx',
        steps: [
          'Sea u = x^2, \\text{ entonces } du = 2x\\,dx',
          'Sustituyendo: \\int \\cos(u)\\,du',
          'Integramos: \\sin(u) + C',
          'Regresamos: \\sin(x^2) + C'
        ],
        result: '\\sin(x^2) + C'
      },
      {
        problem: '\\int e^{3x}\\,dx',
        steps: [
          'Sea u = 3x, \\text{ entonces } du = 3\\,dx \\Rightarrow dx = \\frac{du}{3}',
          'Sustituyendo: \\frac{1}{3}\\int e^u\\,du',
          'Integramos: \\frac{1}{3}e^u + C',
          'Regresamos: \\frac{1}{3}e^{3x} + C'
        ],
        result: '\\frac{1}{3}e^{3x} + C'
      }
    ],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'parts',
    name: 'Integración por Partes',
    subtitle: 'Método LIATE',
    when: 'Cuando la integral es producto de dos funciones de diferente naturaleza (polinomio × exponencial, polinomio × trigonométrica, etc.)',
    formula: '\\int u\\,dv = uv - \\int v\\,du',
    steps: [
      'Identifica u y dv usando la regla LIATE (Logarítmica, Inversa trig., Algebraica, Trigonométrica, Exponencial)',
      'Calcula du = u\'\\,dx derivando u',
      'Calcula v = \\int dv integrando dv',
      'Aplica la fórmula: uv - \\int v\\,du',
      'Si es necesario, aplica el método nuevamente'
    ],
    examples: [
      {
        problem: '\\int x \\cdot e^x\\,dx',
        steps: [
          'u = x \\text{ (algebraica)},\\; dv = e^x\\,dx',
          'du = dx,\\; v = e^x',
          '\\text{Aplicando: } x \\cdot e^x - \\int e^x\\,dx',
          '\\text{Resolviendo: } x \\cdot e^x - e^x + C',
          '\\text{Factorizando: } e^x(x - 1) + C'
        ],
        result: 'e^x(x - 1) + C'
      }
    ],
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'partial-fractions',
    name: 'Fracciones Parciales',
    subtitle: 'Descomposición en fracciones simples',
    when: 'Cuando el integrando es una fracción racional P(x)/Q(x) donde el grado de P es menor que el grado de Q.',
    formula: '\\frac{P(x)}{Q(x)} = \\frac{A}{x-a} + \\frac{B}{x-b} + \\cdots',
    steps: [
      'Verifica que el grado del numerador sea menor que el del denominador',
      'Factoriza completamente el denominador Q(x)',
      'Descompón en fracciones parciales según los factores',
      'Determina las constantes multiplicando por Q(x) e igualando',
      'Integra cada fracción simple por separado'
    ],
    examples: [
      {
        problem: '\\int \\frac{1}{x^2 - 1}\\,dx',
        steps: [
          '\\text{Factorizamos: } x^2 - 1 = (x-1)(x+1)',
          '\\text{Descomponemos: } \\frac{1}{(x-1)(x+1)} = \\frac{A}{x-1} + \\frac{B}{x+1}',
          '\\text{Resolvemos: } 1 = A(x+1) + B(x-1)',
          'x=1: A=\\frac{1}{2} \\;|\\; x=-1: B=-\\frac{1}{2}',
          '\\text{Integramos: } \\frac{1}{2}\\ln|x-1| - \\frac{1}{2}\\ln|x+1| + C'
        ],
        result: '\\frac{1}{2}\\ln\\left|\\frac{x-1}{x+1}\\right| + C'
      }
    ],
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'trig',
    name: 'Integrales Trigonométricas',
    subtitle: 'Identidades y reducción',
    when: 'Cuando el integrando contiene productos de funciones trigonométricas como \\sin^n(x)\\cos^m(x), \\tan^n(x)\\sec^m(x), etc.',
    formula: '\\sin^2(x) + \\cos^2(x) = 1 \\;|\\; \\sin(2x) = 2\\sin(x)\\cos(x)',
    steps: [
      'Identifica el tipo de producto trigonométrico',
      'Si hay \\sin impar: guarda un \\sin(x) y convierte el resto a cosenos',
      'Si hay \\cos impar: guarda un \\cos(x) y convierte el resto a senos',
      'Si ambos son pares: usa identidades de ángulo doble',
      'Aplica sustitución si es necesario'
    ],
    examples: [
      {
        problem: '\\int \\sin^3(x)\\,dx',
        steps: [
          '\\text{Reescribimos: } \\int \\sin^2(x) \\cdot \\sin(x)\\,dx',
          '\\text{Identidad: } \\sin^2(x) = 1 - \\cos^2(x)',
          '\\text{Sustitución: } u = \\cos(x),\\; du = -\\sin(x)\\,dx',
          '\\int -(1-u^2)\\,du = -u + \\frac{u^3}{3} + C',
          '\\text{Resultado: } -\\cos(x) + \\frac{\\cos^3(x)}{3} + C'
        ],
        result: '-\\cos(x) + \\frac{\\cos^3(x)}{3} + C'
      }
    ],
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'trig-sub',
    name: 'Sustitución Trigonométrica',
    subtitle: 'Para expresiones con \\sqrt{a^2-x^2}, \\sqrt{a^2+x^2}, \\sqrt{x^2-a^2}',
    when: 'Cuando aparece una raíz cuadrada de la forma \\sqrt{a^2-x^2}, \\sqrt{a^2+x^2} o \\sqrt{x^2-a^2} en el integrando.',
    formula: '\\sqrt{a^2-x^2} \\to x=a\\sin\\theta \\;|\\; \\sqrt{a^2+x^2} \\to x=a\\tan\\theta \\;|\\; \\sqrt{x^2-a^2} \\to x=a\\sec\\theta',
    steps: [
      'Identifica la forma de la expresión radical',
      'Aplica la sustitución trigonométrica correspondiente',
      'Simplifica usando identidades trigonométricas',
      'Resuelve la integral trigonométrica resultante',
      'Regresa a la variable original usando el triángulo de referencia'
    ],
    examples: [
      {
        problem: '\\int \\frac{1}{\\sqrt{1-x^2}}\\,dx',
        steps: [
          '\\text{Forma: } \\sqrt{a^2-x^2} \\text{ con } a=1',
          '\\text{Sustitución: } x = \\sin(\\theta),\\; dx = \\cos(\\theta)\\,d\\theta',
          '\\sqrt{1-\\sin^2\\theta} = \\cos(\\theta)',
          '\\int \\frac{\\cos(\\theta)}{\\cos(\\theta)}\\,d\\theta = \\int d\\theta = \\theta + C',
          '\\text{Regresamos: } \\theta = \\arcsin(x)',
          '\\text{Resultado: } \\arcsin(x) + C'
        ],
        result: '\\arcsin(x) + C'
      }
    ],
    color: 'from-rose-500 to-red-500'
  },
  {
    id: 'improper',
    name: 'Integrales Impropias',
    subtitle: 'Límites infinitos y discontinuidades',
    when: 'Cuando los límites de integración son infinitos o la función tiene discontinuidades en el intervalo.',
    formula: '\\int_a^{\\infty} f(x)\\,dx = \\lim_{t \\to \\infty} \\int_a^t f(x)\\,dx',
    steps: [
      'Identifica el tipo de impropiedad (límite infinito o discontinuidad)',
      'Reemplaza el límite impropio por una variable t',
      'Evalúa la integral definida en términos de t',
      'Calcula el límite cuando t tiende al valor impropio',
      'Si el límite existe y es finito: la integral converge. Si no: diverge.'
    ],
    examples: [
      {
        problem: '\\int_1^{\\infty} \\frac{1}{x^2}\\,dx',
        steps: [
          '\\text{Reemplazamos: } \\lim_{t \\to \\infty} \\int_1^t \\frac{1}{x^2}\\,dx',
          '\\text{Integramos: } \\lim_{t \\to \\infty} \\left[-\\frac{1}{x}\\right]_1^t',
          '\\text{Evaluamos: } \\lim_{t \\to \\infty} \\left(-\\frac{1}{t} + 1\\right)',
          '\\text{Límite: } 0 + 1 = 1',
          '\\text{La integral converge a } 1'
        ],
        result: '1 \\quad \\text{(converge)}'
      }
    ],
    color: 'from-indigo-500 to-violet-500'
  }
];

export default function IntegrationMethods() {
  const [selectedMethod, setSelectedMethod] = useState<string>('substitution');
  const [showExample, setShowExample] = useState<number | null>(null);

  const currentMethod = methods.find(m => m.id === selectedMethod)!;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#e94560]/10 to-red-600/10 rounded-xl p-6 border border-[#e94560]/20">
        <h2 className="text-2xl font-bold text-white mb-2">🎓 Métodos de Integración</h2>
        <p className="text-slate-300">
          Cada método tiene su momento de aplicación. Aprende a identificar cuándo usar cada técnica.
        </p>
      </div>

      {/* Method Selector */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {methods.map((method) => (
          <button
            key={method.id}
            onClick={() => { setSelectedMethod(method.id); setShowExample(null); }}
            className={`p-3 rounded-xl text-xs font-medium transition-all duration-200 border ${
              selectedMethod === method.id
                ? 'bg-gradient-to-r ' + method.color + ' text-white border-transparent shadow-lg'
                : 'bg-[#0f3460]/50 text-slate-400 border-[#0f3460] hover:border-slate-600 hover:text-white'
            }`}
          >
            {method.name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Method Detail */}
      <motion.div
        key={selectedMethod}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Method Info */}
        <div className="bg-[#16213e]/70 rounded-xl p-6 border border-[#0f3460]/50">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${currentMethod.color} flex items-center justify-center`}>
              <span className="text-white font-bold text-lg">∫</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{currentMethod.name}</h3>
              <p className="text-sm text-slate-400">{currentMethod.subtitle}</p>
            </div>
          </div>

          {/* When to use */}
          <div className="step-card">
            <h4 style={{ color: '#93c5fd' }}>¿CUÁNDO USAR ESTE MÉTODO?</h4>
            <p>{currentMethod.when}</p>
          </div>

          {/* Formula */}
          <div className="step-card" style={{ background: 'rgba(15, 52, 96, 0.5)' }}>
            <h4 style={{ color: '#93c5fd' }}>📐 FÓRMULA GENERAL</h4>
            <Math tex={currentMethod.formula} display={true} />
          </div>

          {/* Steps */}
          <div>
            <h4 className="text-xs font-bold mb-3" style={{ color: '#22c55e' }}>PASOS DEL MÉTODO</h4>
            <div className="space-y-2">
              {currentMethod.steps.map((step, i) => (
                <div key={i} className="step-card" style={{ marginBottom: '8px' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(34, 197, 94, 0.2)' }}>
                      <span className="text-xs font-bold" style={{ color: '#22c55e' }}>{i + 1}</span>
                    </div>
                    <div className="text-sm overflow-x-auto">
                      <Math tex={step} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Examples */}
        <div className="bg-[#16213e]/70 rounded-xl p-6 border border-[#0f3460]/50">
          <h4 className="text-lg font-semibold text-white mb-4">📝 Ejemplos Resueltos</h4>
          <div className="space-y-3">
            {currentMethod.examples.map((ex, i) => (
              <div key={i} className="border border-[#0f3460]/50 rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowExample(showExample === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 bg-[#0f0f23]/50 hover:bg-[#0f3460]/30 transition-colors"
                >
                  <div className="overflow-x-auto">
                    <Math tex={ex.problem} />
                  </div>
                  <ChevronRight size={16} className={`text-slate-400 transition-transform flex-shrink-0 ml-2 ${showExample === i ? 'rotate-90' : ''}`} />
                </button>
                {showExample === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 space-y-2 bg-[#0f0f23]/30"
                  >
                    {ex.steps.map((step, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm">
                        <ArrowRight size={12} className="text-[#22c55e] flex-shrink-0" />
                        <div className="overflow-x-auto">
                          <Math tex={step} />
                        </div>
                      </div>
                    ))}
                    <div className="mt-3 pt-3 border-t border-[#0f3460]/30">
                      <span className="text-sm text-slate-400">Resultado: </span>
                      <Math tex={ex.result} className="text-emerald-300 font-semibold" />
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
