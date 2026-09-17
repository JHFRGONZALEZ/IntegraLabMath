import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight } from 'lucide-react';

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
    formula: '∫f(g(x))·g\'(x)dx = ∫f(u)du, donde u = g(x)',
    steps: [
      'Identifica u = g(x) como la parte "interna" de la función compuesta',
      'Calcula du = g\'(x)dx',
      'Sustituye en la integral para obtener ∫f(u)du',
      'Resuelve la integral en términos de u',
      'Regresa a la variable original: reemplaza u por g(x)'
    ],
    examples: [
      {
        problem: '∫ 2x·cos(x²) dx',
        steps: [
          'Sea u = x², entonces du = 2x dx',
          'Sustituyendo: ∫ cos(u) du',
          'Integramos: sen(u) + C',
          'Regresamos: sen(x²) + C'
        ],
        result: 'sen(x²) + C'
      },
      {
        problem: '∫ e^(3x) dx',
        steps: [
          'Sea u = 3x, entonces du = 3 dx → dx = du/3',
          'Sustituyendo: (1/3)∫ e^u du',
          'Integramos: (1/3)e^u + C',
          'Regresamos: (1/3)e^(3x) + C'
        ],
        result: '(1/3)e^(3x) + C'
      }
    ],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'parts',
    name: 'Integración por Partes',
    subtitle: 'Método LIATE',
    when: 'Cuando la integral es producto de dos funciones de diferente naturaleza (polinomio × exponencial, polinomio × trigonométrica, etc.)',
    formula: '∫u dv = uv - ∫v du',
    steps: [
      'Identifica u y dv usando la regla LIATE (Logarítmica, Inversa trig., Algebraica, Trigonométrica, Exponencial)',
      'Calcula du = u\'dx derivando u',
      'Calcula v = ∫dv integrando dv',
      'Aplica la fórmula: uv - ∫v du',
      'Si es necesario, aplica el método nuevamente'
    ],
    examples: [
      {
        problem: '∫ x·eˣ dx',
        steps: [
          'u = x (algebraica), dv = eˣdx',
          'du = dx, v = eˣ',
          'Aplicando: x·eˣ - ∫eˣ dx',
          'Resolviendo: x·eˣ - eˣ + C',
          'Factorizando: eˣ(x - 1) + C'
        ],
        result: 'eˣ(x - 1) + C'
      },
      {
        problem: '∫ x²·ln(x) dx',
        steps: [
          'u = ln(x) (logarítmica), dv = x²dx',
          'du = (1/x)dx, v = x³/3',
          'Aplicando: (x³/3)ln(x) - ∫(x³/3)(1/x)dx',
          'Simplificando: (x³/3)ln(x) - (1/3)∫x²dx',
          'Resolviendo: (x³/3)ln(x) - x³/9 + C'
        ],
        result: '(x³/3)ln(x) - x³/9 + C'
      }
    ],
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'partial-fractions',
    name: 'Fracciones Parciales',
    subtitle: 'Descomposición en fracciones simples',
    when: 'Cuando el integrando es una fracción racional P(x)/Q(x) donde el grado de P es menor que el grado de Q.',
    formula: 'P(x)/Q(x) = A/(x-a) + B/(x-b) + ...',
    steps: [
      'Verifica que el grado del numerador sea menor que el del denominador',
      'Factoriza completamente el denominador Q(x)',
      'Descompón en fracciones parciales según los factores',
      'Determina las constantes multiplicando por Q(x) e igualando',
      'Integra cada fracción simple por separado'
    ],
    examples: [
      {
        problem: '∫ 1/(x²-1) dx',
        steps: [
          'Factorizamos: x²-1 = (x-1)(x+1)',
          'Descomponemos: 1/((x-1)(x+1)) = A/(x-1) + B/(x+1)',
          'Resolvemos: 1 = A(x+1) + B(x-1)',
          'x=1: A=1/2 | x=-1: B=-1/2',
          'Integramos: (1/2)ln|x-1| - (1/2)ln|x+1| + C'
        ],
        result: '(1/2)ln|(x-1)/(x+1)| + C'
      }
    ],
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'trig',
    name: 'Integrales Trigonométricas',
    subtitle: 'Identidades y reducción',
    when: 'Cuando el integrando contiene productos de funciones trigonométricas como senⁿ(x)cosᵐ(x), tanⁿ(x)secᵐ(x), etc.',
    formula: 'sen²(x) + cos²(x) = 1 | sen(2x) = 2sen(x)cos(x)',
    steps: [
      'Identifica el tipo de producto trigonométrico',
      'Si hay sen impar: guarda un sen(x) y convierte el resto a cosenos',
      'Si hay cos impar: guarda un cos(x) y convierte el resto a senos',
      'Si ambos son pares: usa identidades de ángulo doble',
      'Aplica sustitución si es necesario'
    ],
    examples: [
      {
        problem: '∫ sen³(x) dx',
        steps: [
          'Reescribimos: ∫ sen²(x)·sen(x) dx',
          'Identidad: sen²(x) = 1 - cos²(x)',
          'Sustitución: u = cos(x), du = -sen(x)dx',
          '∫ -(1-u²)du = -u + u³/3 + C',
          'Resultado: -cos(x) + cos³(x)/3 + C'
        ],
        result: '-cos(x) + cos³(x)/3 + C'
      }
    ],
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'trig-sub',
    name: 'Sustitución Trigonométrica',
    subtitle: 'Para expresiones con √(a²-x²), √(a²+x²), √(x²-a²)',
    when: 'Cuando aparece una raíz cuadrada de la forma √(a²-x²), √(a²+x²) o √(x²-a²) en el integrando.',
    formula: '√(a²-x²)→x=asen(θ) | √(a²+x²)→x=atan(θ) | √(x²-a²)→x=asec(θ)',
    steps: [
      'Identifica la forma de la expresión radical',
      'Aplica la sustitución trigonométrica correspondiente',
      'Simplifica usando identidades trigonométricas',
      'Resuelve la integral trigonométrica resultante',
      'Regresa a la variable original usando el triángulo de referencia'
    ],
    examples: [
      {
        problem: '∫ 1/√(1-x²) dx',
        steps: [
          'Forma: √(a²-x²) con a=1',
          'Sustitución: x = sen(θ), dx = cos(θ)dθ',
          '√(1-sen²θ) = cos(θ)',
          '∫ cos(θ)/cos(θ) dθ = ∫ dθ = θ + C',
          'Regresamos: θ = arcsen(x)',
          'Resultado: arcsen(x) + C'
        ],
        result: 'arcsen(x) + C'
      }
    ],
    color: 'from-rose-500 to-red-500'
  },
  {
    id: 'improper',
    name: 'Integrales Impropias',
    subtitle: 'Límites infinitos y discontinuidades',
    when: 'Cuando los límites de integración son infinitos o la función tiene discontinuidades en el intervalo.',
    formula: '∫ₐ^∞ f(x)dx = lim(t→∞) ∫ₐᵗ f(x)dx',
    steps: [
      'Identifica el tipo de impropiedad (límite infinito o discontinuidad)',
      'Reemplaza el límite impropio por una variable t',
      'Evalúa la integral definida en términos de t',
      'Calcula el límite cuando t tiende al valor impropio',
      'Si el límite existe y es finito: la integral converge. Si no: diverge.'
    ],
    examples: [
      {
        problem: '∫₁^∞ 1/x² dx',
        steps: [
          'Reemplazamos: lim(t→∞) ∫₁ᵗ 1/x² dx',
          'Integramos: lim(t→∞) [-1/x]₁ᵗ',
          'Evaluamos: lim(t→∞) (-1/t + 1)',
          'Límite: 0 + 1 = 1',
          'La integral converge a 1'
        ],
        result: '1 (converge)'
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
      <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-xl p-6 border border-purple-500/20">
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
                : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:border-slate-600 hover:text-white'
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
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
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
          <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/20 mb-4">
            <p className="text-sm font-semibold text-blue-400 mb-1">¿Cuándo usar este método?</p>
            <p className="text-slate-300">{currentMethod.when}</p>
          </div>

          {/* Formula */}
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30 mb-4">
            <p className="text-sm font-semibold text-purple-400 mb-2">Fórmula General</p>
            <p className="text-lg font-mono text-purple-200 text-center">{currentMethod.formula}</p>
          </div>

          {/* Steps */}
          <div>
            <p className="text-sm font-semibold text-emerald-400 mb-3">Pasos del Método</p>
            <div className="space-y-2">
              {currentMethod.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3 bg-slate-900/30 rounded-lg p-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-emerald-400">{i + 1}</span>
                  </div>
                  <p className="text-sm text-slate-300">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Examples */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <h4 className="text-lg font-semibold text-white mb-4">📝 Ejemplos Resueltos</h4>
          <div className="space-y-3">
            {currentMethod.examples.map((ex, i) => (
              <div key={i} className="border border-slate-700/30 rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowExample(showExample === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 bg-slate-900/30 hover:bg-slate-900/50 transition-colors"
                >
                  <span className="font-mono text-blue-300">{ex.problem}</span>
                  <ChevronRight size={16} className={`text-slate-400 transition-transform ${showExample === i ? 'rotate-90' : ''}`} />
                </button>
                {showExample === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 space-y-2 bg-slate-900/20"
                  >
                    {ex.steps.map((step, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm">
                        <ArrowRight size={12} className="text-emerald-400 flex-shrink-0" />
                        <span className="text-slate-300">{step}</span>
                      </div>
                    ))}
                    <div className="mt-3 pt-3 border-t border-slate-700/30">
                      <span className="text-sm text-slate-400">Resultado: </span>
                      <span className="font-mono text-emerald-300 font-semibold">{ex.result}</span>
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
