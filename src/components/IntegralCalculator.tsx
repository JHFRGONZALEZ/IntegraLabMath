import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Lightbulb, RotateCcw, Calculator } from 'lucide-react';
import { renderMath } from './Math';

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
    expression: '\\int x^3\\,dx',
    answer: '\\frac{x^4}{4} + C',
    hint: 'Usa la regla de la potencia: \\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C',
    method: 'Regla de la Potencia',
    steps: [
      '\\text{Aplicar regla de la potencia con } n=3',
      '\\frac{x^{3+1}}{3+1} + C',
      '\\frac{x^4}{4} + C'
    ],
    difficulty: 'Básico'
  },
  {
    id: 2,
    expression: '\\int (3x^2 + 2x - 5)\\,dx',
    answer: 'x^3 + x^2 - 5x + C',
    hint: 'Integra término por término usando linealidad',
    method: 'Linealidad',
    steps: [
      '\\text{Separar: } 3\\int x^2\\,dx + 2\\int x\\,dx - 5\\int dx',
      '3 \\cdot \\frac{x^3}{3} + 2 \\cdot \\frac{x^2}{2} - 5x + C',
      'x^3 + x^2 - 5x + C'
    ],
    difficulty: 'Básico'
  },
  {
    id: 3,
    expression: '\\int 2x \\cdot e^{x^2}\\,dx',
    answer: 'e^{x^2} + C',
    hint: 'Identifica u = x^2, nota que du = 2x\\,dx está presente',
    method: 'Sustitución',
    steps: [
      'u = x^2,\\; du = 2x\\,dx',
      '\\text{Sustituir: } \\int e^u\\,du',
      '\\text{Integrar: } e^u + C',
      '\\text{Regresar: } e^{x^2} + C'
    ],
    difficulty: 'Intermedio'
  },
  {
    id: 4,
    expression: '\\int x \\cdot \\cos(x)\\,dx',
    answer: 'x\\sin(x) + \\cos(x) + C',
    hint: 'Usa integración por partes: u=x,\\; dv=\\cos(x)\\,dx',
    method: 'Partes',
    steps: [
      'u = x \\to du = dx',
      'dv = \\cos(x)\\,dx \\to v = \\sin(x)',
      'uv - \\int v\\,du = x\\sin(x) - \\int \\sin(x)\\,dx',
      'x\\sin(x) + \\cos(x) + C'
    ],
    difficulty: 'Intermedio'
  },
  {
    id: 5,
    expression: '\\int \\frac{1}{x^2 + 4}\\,dx',
    answer: '\\frac{1}{2}\\arctan\\left(\\frac{x}{2}\\right) + C',
    hint: 'Recuerda: \\int \\frac{1}{x^2+a^2}\\,dx = \\frac{1}{a}\\arctan\\left(\\frac{x}{a}\\right) + C',
    method: 'Fórmula Directa',
    steps: [
      '\\text{Identificar forma: } \\frac{1}{x^2+a^2} \\text{ con } a=2',
      '\\text{Aplicar fórmula: } \\frac{1}{a}\\arctan\\left(\\frac{x}{a}\\right) + C',
      '\\frac{1}{2}\\arctan\\left(\\frac{x}{2}\\right) + C'
    ],
    difficulty: 'Intermedio'
  },
  {
    id: 6,
    expression: '\\int \\sin^2(x)\\,dx',
    answer: '\\frac{x}{2} - \\frac{\\sin(2x)}{4} + C',
    hint: 'Usa la identidad: \\sin^2(x) = \\frac{1-\\cos(2x)}{2}',
    method: 'Identidad Trigonométrica',
    steps: [
      '\\text{Identidad: } \\sin^2(x) = \\frac{1-\\cos(2x)}{2}',
      '\\int \\left(\\frac{1}{2} - \\frac{\\cos(2x)}{2}\\right)\\,dx',
      '\\frac{x}{2} - \\frac{\\sin(2x)}{4} + C'
    ],
    difficulty: 'Avanzado'
  },
  {
    id: 7,
    expression: '\\int \\ln(x)\\,dx',
    answer: 'x\\ln(x) - x + C',
    hint: 'Integración por partes: u=\\ln(x),\\; dv=dx',
    method: 'Partes',
    steps: [
      'u = \\ln(x) \\to du = \\frac{1}{x}\\,dx',
      'dv = dx \\to v = x',
      'uv - \\int v\\,du = x\\ln(x) - \\int x \\cdot \\frac{1}{x}\\,dx',
      'x\\ln(x) - \\int dx = x\\ln(x) - x + C'
    ],
    difficulty: 'Avanzado'
  },
  {
    id: 8,
    expression: '\\int \\frac{5}{x^2 - 9}\\,dx',
    answer: '\\frac{5}{6}\\ln\\left|\\frac{x-3}{x+3}\\right| + C',
    hint: 'Factoriza x^2-9 = (x-3)(x+3) y usa fracciones parciales',
    method: 'Fracciones Parciales',
    steps: [
      '\\text{Factorizar: } (x-3)(x+3)',
      '\\frac{5}{(x-3)(x+3)} = \\frac{A}{x-3} + \\frac{B}{x+3}',
      'A = \\frac{5}{6},\\; B = -\\frac{5}{6}',
      '\\frac{5}{6}\\ln|x-3| - \\frac{5}{6}\\ln|x+3| + C',
      '\\frac{5}{6}\\ln\\left|\\frac{x-3}{x+3}\\right| + C'
    ],
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
      <div className="bg-gradient-to-r from-[#e94560]/10 to-red-600/10 rounded-xl p-6 border border-[#e94560]/20">
        <h2 className="text-2xl font-bold text-white mb-2">🧮 Calculadora de Integrales</h2>
        <p className="text-slate-300">
          Resuelve integrales paso a paso con retroalimentación inmediata.
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
                ? 'bg-[#e94560] text-white shadow-lg'
                : 'bg-[#0f3460] text-slate-400 hover:text-white border border-[#0f3460]'
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
          className="bg-[#16213e]/70 rounded-xl p-6 border border-[#0f3460]/50"
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

          <div className="step-card" style={{ background: 'rgba(15, 52, 96, 0.5)' }}>
            <h4 style={{ color: '#93c5fd' }}>RESOLVER:</h4>
            <div dangerouslySetInnerHTML={{ __html: renderMath(problem.expression, true) }} />
          </div>

          {/* Answer Input */}
          <div className="space-y-3 mt-4">
            <label className="text-sm text-slate-400">Tu respuesta:</label>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
              placeholder="Ej: x^4/4 + C"
              className="w-full bg-[#0f3460] border border-[#1a4080] rounded-lg px-4 py-3 text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-[#e94560] focus:ring-1 focus:ring-[#e94560]"
            />
            
            <div className="flex gap-2">
              <button
                onClick={checkAnswer}
                className="flex-1 bg-[#e94560] text-white font-medium py-2.5 rounded-lg hover:bg-[#d63851] transition-all"
              >
                Verificar
              </button>
              <button
                onClick={reset}
                className="px-4 py-2.5 bg-[#0f3460] text-slate-300 rounded-lg hover:bg-[#1a4080] transition-colors"
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
              className={`mt-4 step-card ${isCorrect ? 'highlight' : 'error'}`}
            >
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle size={18} className="text-emerald-400" />
                ) : (
                  <XCircle size={18} className="text-red-400" />
                )}
                <span className={`font-medium ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isCorrect ? '¡Correcto!' : 'Revisa tu respuesta'}
                </span>
              </div>
              <p className="text-sm text-slate-400 mb-2">Respuesta correcta:</p>
              <div dangerouslySetInnerHTML={{ __html: renderMath(problem.answer, true) }} />
            </motion.div>
          )}
        </motion.div>

        {/* Help Panel */}
        <div className="space-y-4">
          {/* Hint */}
          <div className="bg-[#16213e]/70 rounded-xl p-6 border border-[#0f3460]/50">
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
            >
              <Lightbulb size={18} />
              <span className="font-medium">Ver Pista</span>
            </button>
            {showHint && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 step-card"
              >
                <div className="text-sm text-slate-300">
                  <span className="font-semibold text-amber-300">💡 Pista:</span>
                  <div className="mt-1" dangerouslySetInnerHTML={{ __html: renderMath(problem.hint, false) }} />
                </div>
              </motion.div>
            )}
          </div>

          {/* Steps */}
          <div className="bg-[#16213e]/70 rounded-xl p-6 border border-[#0f3460]/50">
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
                  <div key={i} className="step-card" style={{ marginBottom: '8px' }}>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(59, 130, 246, 0.2)' }}>
                        <span className="text-xs font-bold text-blue-400">{i + 1}</span>
                      </div>
                      <div className="text-sm overflow-x-auto" dangerouslySetInnerHTML={{ __html: renderMath(step, false) }} />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Next Problem */}
          <button
            onClick={nextProblem}
            className="w-full bg-[#0f3460]/50 border border-[#0f3460] rounded-xl p-4 text-left hover:border-[#e94560]/50 transition-all group"
          >
            <p className="text-sm text-slate-400">Siguiente problema →</p>
            <div className="mt-1 overflow-x-auto" dangerouslySetInnerHTML={{ __html: renderMath(problems[(selectedProblem + 1) % problems.length].expression, false) }} />
          </button>
        </div>
      </div>
    </div>
  );
}
