import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react';
import Math from './Math';

interface Topic {
  id: string;
  title: string;
  definition: string;
  formula: string;
  explanation: string;
  example: string;
  tips: string[];
}

const topics: Topic[] = [
  {
    id: 'integral-def',
    title: 'Definición de Integral Definida',
    definition: 'La integral definida de f(x) desde a hasta b es el límite de las sumas de Riemann cuando el número de subintervalos tiende a infinito.',
    formula: '\\int_a^b f(x)\\,dx = \\lim_{n \\to \\infty} \\sum_{i=1}^{n} f(x_i^*) \\cdot \\Delta x',
    explanation: 'Geométricamente, la integral definida representa el área neta (área arriba del eje x menos área abajo) entre la curva f(x) y el eje x, desde x=a hasta x=b.',
    example: '\\int_0^2 x^2\\,dx = \\left[\\frac{x^3}{3}\\right]_0^2 = \\frac{8}{3} - 0 = \\frac{8}{3}',
    tips: [
      'La integral definida produce un número, no una función',
      'Si f(x) \\geq 0 en [a,b], la integral es el área bajo la curva',
      'Propiedad: \\int_a^b f(x)\\,dx = -\\int_b^a f(x)\\,dx'
    ]
  },
  {
    id: 'integral-indef',
    title: 'Integral Indefinida (Antiderivada)',
    definition: 'La integral indefinida de f(x) es la familia de todas las funciones F(x) tales que F\'(x) = f(x).',
    formula: '\\int f(x)\\,dx = F(x) + C, \\quad \\text{donde } F\'(x) = f(x)',
    explanation: 'La constante C (constante de integración) es esencial porque la derivada de cualquier constante es cero. Sin ella, perderíamos infinitas soluciones.',
    example: '\\int 3x^2\\,dx = x^3 + C',
    tips: [
      'Siempre incluye la constante C',
      'Verifica derivando tu resultado',
      '\\int k \\cdot f(x)\\,dx = k \\int f(x)\\,dx \\quad \\text{(linealidad)}'
    ]
  },
  {
    id: 'ftc',
    title: 'Teorema Fundamental del Cálculo',
    definition: 'Si f es continua en [a,b] y F es cualquier antiderivada de f, entonces la integral definida se evalúa como la diferencia de F en los extremos.',
    formula: '\\int_a^b f(x)\\,dx = F(b) - F(a)',
    explanation: 'Este teorema conecta la derivación con la integración, mostrando que son operaciones inversas. Es el puente entre el cálculo diferencial e integral.',
    example: '\\int_1^3 2x\\,dx = \\left[x^2\\right]_1^3 = 9 - 1 = 8',
    tips: [
      'Es el teorema más importante del cálculo',
      'Permite evaluar integrales sin usar límites',
      'F(b) - F(a) se lee "F evaluada en b menos F evaluada en a"'
    ]
  },
  {
    id: 'linearity',
    title: 'Propiedades de Linealidad',
    definition: 'La integral es un operador lineal: respeta la suma de funciones y la multiplicación por constantes.',
    formula: '\\int \\left[a \\cdot f(x) + b \\cdot g(x)\\right]\\,dx = a\\int f(x)\\,dx + b\\int g(x)\\,dx',
    explanation: 'Esta propiedad permite descomponer integrales complejas en partes más simples que podemos resolver individualmente.',
    example: '\\int (3x^2 + 2x)\\,dx = 3\\int x^2\\,dx + 2\\int x\\,dx = x^3 + x^2 + C',
    tips: [
      'Separa la integral en términos individuales',
      'Saca las constantes fuera de la integral',
      'Útil para polinomios de cualquier grado'
    ]
  },
  {
    id: 'basic-formulas',
    title: 'Fórmulas Básicas de Integración',
    definition: 'Son las antiderivadas fundamentales que todo estudiante debe memorizar como punto de partida.',
    formula: '\\int x^n\\,dx = \\frac{x^{n+1}}{n+1}+C \\;|\\; \\int e^x\\,dx = e^x+C \\;|\\; \\int \\frac{1}{x}\\,dx = \\ln|x|+C',
    explanation: 'Estas fórmulas son el "alfabeto" de la integración. Dominarlas es prerrequisito para técnicas más avanzadas.',
    example: '\\int \\left(x^3 + e^x + \\frac{1}{x}\\right)\\,dx = \\frac{x^4}{4} + e^x + \\ln|x| + C',
    tips: [
      '\\int x^{-1}\\,dx = \\ln|x|+C \\quad \\text{(caso especial, } n=-1\\text{)}',
      '\\int \\sin(x)\\,dx = -\\cos(x)+C \\quad \\text{(ojo con el signo)}',
      '\\int \\cos(x)\\,dx = \\sin(x)+C',
      '\\int \\sec^2(x)\\,dx = \\tan(x)+C'
    ]
  },
  {
    id: 'definite-props',
    title: 'Propiedades de la Integral Definida',
    definition: 'Propiedades algebraicas y geométricas que cumplen las integrales definidas.',
    formula: '\\int_a^a f(x)\\,dx = 0 \\;|\\; \\int_a^b f(x)\\,dx + \\int_b^c f(x)\\,dx = \\int_a^c f(x)\\,dx',
    explanation: 'Estas propiedades permiten manipular integrales definidas de manera algebraica, descomponer intervalos y simplificar cálculos.',
    example: '\\int_{-1}^{1} x^3\\,dx = 0 \\quad \\text{(función impar en intervalo simétrico)}',
    tips: [
      'Si f es par: \\int_{-a}^{a} f(x)\\,dx = 2\\int_0^a f(x)\\,dx',
      'Si f es impar: \\int_{-a}^{a} f(x)\\,dx = 0',
      'Valor medio: \\int_a^b f(x)\\,dx = f(c) \\cdot (b-a) \\text{ para algún } c'
    ]
  }
];

export default function Theory() {
  const [expandedTopic, setExpandedTopic] = useState<string | null>('integral-def');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-xl p-6 border border-blue-500/20">
        <h2 className="text-2xl font-bold text-white mb-2">📚 Fundamentos Teóricos</h2>
        <p className="text-slate-300">
          Domina los conceptos fundamentales del cálculo integral. Cada tema incluye definición formal, 
          fórmula, explicación intuitiva y ejemplos prácticos.
        </p>
      </div>

      {/* Topics */}
      <div className="space-y-4">
        {topics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden"
          >
            {/* Topic Header */}
            <button
              onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-700/20 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-white">{topic.title}</h3>
              </div>
              {expandedTopic === topic.id ? (
                <ChevronUp size={20} className="text-slate-400" />
              ) : (
                <ChevronDown size={20} className="text-slate-400" />
              )}
            </button>

            {/* Topic Content */}
            {expandedTopic === topic.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-5 pb-5 space-y-4"
              >
                {/* Definition */}
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={16} className="text-emerald-400" />
                    <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wide">Definición</span>
                  </div>
                  <p className="text-slate-300">{topic.definition}</p>
                </div>

                {/* Formula */}
                <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-4 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">📐</span>
                    <span className="text-sm font-semibold text-blue-400 uppercase tracking-wide">Fórmula</span>
                  </div>
                  <div className="py-2 overflow-x-auto">
                    <Math tex={topic.formula} display={true} />
                  </div>
                </div>

                {/* Explanation */}
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb size={16} className="text-amber-400" />
                    <span className="text-sm font-semibold text-amber-400 uppercase tracking-wide">Explicación</span>
                  </div>
                  <p className="text-slate-300">{topic.explanation}</p>
                </div>

                {/* Example */}
                <div className="bg-emerald-900/20 rounded-lg p-4 border border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">✏️</span>
                    <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wide">Ejemplo</span>
                  </div>
                  <div className="overflow-x-auto">
                    <Math tex={topic.example} display={true} className="text-emerald-200" />
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-amber-900/10 rounded-lg p-4 border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={16} className="text-amber-400" />
                    <span className="text-sm font-semibold text-amber-400 uppercase tracking-wide">Puntos Clave</span>
                  </div>
                  <ul className="space-y-2">
                    {topic.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="text-amber-400 mt-0.5">•</span>
                        <span className="overflow-x-auto">
                          <Math tex={tip} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
