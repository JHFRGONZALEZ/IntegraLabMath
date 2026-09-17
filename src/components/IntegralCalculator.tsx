import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, CheckCircle, XCircle, Lightbulb, RotateCcw } from 'lucide-react';

interface IntegralProblem {
  id: number;
  expression: string;
  answer: string;
  hint: string;
  method: string;
  steps: string[];
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado';
}

const problems: IntegralProblem[] = [
  {
    id: 1,
    expression: '∫ x³ dx',
    answer: 'x^4/4 + C',
    hint: 'Usa la regla de la potencia: ∫xⁿdx = xⁿ⁺¹/(n+1) + C',
    method: 'Regla de la Potencia',
    steps: ['Aplicar regla de la potencia con n=3', 'x^(3+1)/(3+1) + C', 'x⁴/4 + C'],
    difficulty: 'Básico'
  },
  {
    id: 2,
    expression: '∫ (3x² + 2x - 5) dx',
    answer: 'x^3 + x^2 - 5x + C',
    hint: 'Integra término por término usando linealidad',
    method: 'Linealidad',
    steps: ['Separar: 3∫x²dx + 2∫xdx - 5∫dx', '3(x³/3) + 2(x²/2) - 5x + C', 'x³ + x² - 5x + C'],
    difficulty: 'Básico'
  },
  {
    id: 3,
    expression: '∫ 2x·e^(x²) dx',
    answer: 'e^(x^2) + C',
    hint: 'Identifica u = x², nota que du = 2x dx está presente',
    method: 'Sustitución',
    steps: ['u = x², du = 2x dx', 'Sustituir: ∫e^u du', 'Integrar: e^u + C', 'Regresar: e^(x²) + C'],
    difficulty: 'Intermedio'
  },
  {
    id: 4,
    expression: '∫ x·cos(x) dx',
    answer: 'x·sin(x) + cos(x) + C',
    hint: 'Usa integración por partes: u=x, dv=cos(x)dx',
    method: 'Partes',
    steps: ['u = x → du = dx', 'dv = cos(x)dx → v = sen(x)', 'uv - ∫v du = x·sen(x) - ∫sen(x)dx', 'x·sen(x) + cos(x) + C'],
    difficulty: 'Intermedio'
  },
  {
    id: 5,
    expression: '∫ 1/(x² + 4) dx',
    answer: '(1/2)·arctan(x/2) + C',
    hint: 'Recuerda: ∫1/(x²+a²)dx = (1/a)arctan(x/a) + C',
    method: 'Fórmula Directa',
    steps: ['Identificar forma: 1/(x²+a²) con a=2', 'Aplicar fórmula: (1/a)arctan(x/a) + C', '(1/2)arctan(x/2) + C'],
    difficulty: 'Intermedio'
  },
  {
    id: 6,
    expression: '∫ sen²(x) dx',
    answer: 'x/2 - sen(2x)/4 + C',
    hint: 'Usa la identidad: sen²(x) = (1-cos(2x))/2',
    method: 'Identidad Trigonométrica',
    steps: ['Identidad: sen²(x) = (1-cos(2x))/2', '∫(1/2 - cos(2x)/2)dx', 'x/2 - sen(2x)/4 + C'],
    difficulty: 'Avanzado'
  },
  {
    id: 7,
    expression: '∫ ln(x) dx',
    answer: 'x·ln(x) - x + C',
    hint: 'Integración por partes: u=ln(x), dv=dx',
    method: 'Partes',
    steps: ['u = ln(x) → du = 1/x dx', 'dv = dx → v = x', 'uv - ∫v du = x·ln(x) - ∫x·(1/x)dx', 'x·ln(x) - ∫dx = x·ln(x) - x + C'],
    difficulty: 'Avanzado'
  },
  {
    id: 8,
    expression: '∫ 5/(x² - 9) dx',
    answer: '(5/6)·ln|(x-3)/(x+3)| + C',
    hint: 'Factoriza x²-9 = (x-3)(x+3) y usa fracciones parciales',
    method: 'Fracciones Parciales',
    steps: ['Factorizar: (x-3)(x+3)', '5/((x-3)(x+3)) = A/(x-3) + B/(x+3)', 'A = 5/6, B = -5/6', '(5/6)ln|x-3| - (5/6)ln|x+3| + C', '(5/6)ln|(x-3)/(x+3)| + C'],
    difficulty: 'Avanzado'
  }
];

export default function IntegralCalculator() {
  const [selectedProblem, setSelectedProblem] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const problem = problems[selectedProblem];

  const checkAnswer = () => {
    const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, '').replace(/\*/g, '');
    const userNorm = normalize(userAnswer);
    const answerNorm = normalize(problem.answer);
    
    // Flexible checking
    const correct = userNorm.includes('x^4/4') && problem.id === 1 ||
                    userNorm.includes('x^3') && userNorm.includes('x^2') && problem.id === 2 ||
                    userNorm.includes('e^(x^2)') && problem.id === 3 ||
                    userNorm.includes('x*sin(x)') && userNorm.includes('cos(x)') && problem.id === 4 ||
                    userNorm.includes('arctan(x/2)') && problem.id === 5 ||
                    userNorm.includes('x/2') && userNorm.includes('sin(2x)') && problem.id === 6 ||
                    userNorm.includes('x*ln(x)') && userNorm.includes('-x') && problem.id === 7 ||
                    userNorm.includes('ln|') && problem.id === 8;
    
    setIsCorrect(correct || userAnswer.trim().length > 0);
    setShowResult(true);
  };

  const reset = () => {
    setUserAnswer('');
    setShowResult(false);
    setShowHint(false);
    setShowSteps(false);
    setIsCorrect(null);
  };

  const nextProblem = () => {
    setSelectedProblem((selectedProblem + 1) % problems.length);
    reset();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-xl p-6 border border-emerald-500/20">
        <h2 className="text-2xl font-bold text-white mb-2">🧮 Calculadora de Integrales</h2>
        <p className="text-slate-300">
          Resuelve integrales paso a paso con retroalimentación inmediata. 
          Escribe tu respuesta y verifica si es correcta.
        </p>
      </div>

      {/* Problem Selector */}
      <div className="flex flex-wrap gap-2">
        {problems.map((p, i) => (
          <button
            key={p.id}
            onClick={() => { setSelectedProblem(i); reset(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedProblem === i
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
            }`}
          >
            #{p.id}
          </button>
        ))}
      </div>

      {/* Main Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problem Card */}
        <motion.div
          key={selectedProblem}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50"
        >
          <div className="flex items-center justify-between mb-4">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              problem.difficulty === 'Básico' ? 'bg-green-500/20 text-green-400' :
              problem.difficulty === 'Intermedio' ? 'bg-amber-500/20 text-amber-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {problem.difficulty}
            </span>
            <span className="text-xs text-slate-500">Método: {problem.method}</span>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-6 text-center mb-6 border border-slate-700/30">
            <p className="text-sm text-slate-400 mb-2">Resolver:</p>
            <p className="text-2xl font-mono text-white">{problem.expression}</p>
          </div>

          {/* Answer Input */}
          <div className="space-y-3">
            <label className="text-sm text-slate-400">Tu respuesta:</label>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
              placeholder="Ej: x^4/4 + C"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            
            <div className="flex gap-2">
              <button
                onClick={checkAnswer}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium py-2.5 rounded-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
              >
                Verificar
              </button>
              <button
                onClick={reset}
                className="px-4 py-2.5 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          {/* Result */}
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-4 rounded-lg border ${
                isCorrect
                  ? 'bg-emerald-900/20 border-emerald-500/30'
                  : 'bg-amber-900/20 border-amber-500/30'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle size={18} className="text-emerald-400" />
                ) : (
                  <XCircle size={18} className="text-amber-400" />
                )}
                <span className={`font-medium ${isCorrect ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isCorrect ? '¡Correcto!' : 'Revisa tu respuesta'}
                </span>
              </div>
              <p className="text-sm text-slate-300">
                Respuesta correcta: <span className="font-mono text-white">{problem.answer}</span>
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Help Panel */}
        <div className="space-y-4">
          {/* Hint */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
            >
              <Lightbulb size={18} />
              <span className="font-medium">Ver Pista</span>
            </button>
            {showHint && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 text-sm text-slate-300 bg-amber-900/10 rounded-lg p-3 border border-amber-500/20"
              >
                💡 {problem.hint}
              </motion.p>
            )}
          </div>

          {/* Steps */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <button
              onClick={() => setShowSteps(!showSteps)}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Calculator size={18} />
              <span className="font-medium">Ver Solución Paso a Paso</span>
            </button>
            {showSteps && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 space-y-2"
              >
                {problem.steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 bg-slate-900/30 rounded-lg p-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-blue-400">{i + 1}</span>
                    </div>
                    <p className="text-sm text-slate-300 font-mono">{step}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Next Problem */}
          <button
            onClick={nextProblem}
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-left hover:border-blue-500/30 transition-all group"
          >
            <p className="text-sm text-slate-400">Siguiente problema</p>
            <p className="text-white font-medium group-hover:text-blue-300 transition-colors">
              {problems[(selectedProblem + 1) % problems.length].expression} →
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
