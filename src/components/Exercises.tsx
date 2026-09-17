import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Trophy, Star, ArrowRight, RotateCcw } from 'lucide-react';
import MathTex from './Math';

interface Exercise {
  id: number;
  question: string;
  expression: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
}

const exercises: Exercise[] = [
  {
    id: 1,
    question: '¿Cuál es la integral de x⁴?',
    expression: '\\int x^4\\,dx = \\;?',
    options: ['\\frac{x^5}{5} + C', '4x^3 + C', 'x^5 + C', '5x^5 + C'],
    correctIndex: 0,
    explanation: 'Regla de la potencia: \\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C. Con n=4: \\frac{x^5}{5} + C',
    category: 'Básicas'
  },
  {
    id: 2,
    question: '¿Cuál es la integral de cos(x)?',
    expression: '\\int \\cos(x)\\,dx = \\;?',
    options: ['-\\sin(x) + C', '\\sin(x) + C', '\\cos(x) + C', '-\\cos(x) + C'],
    correctIndex: 1,
    explanation: 'La antiderivada de \\cos(x) es \\sin(x). Recuerda: \\frac{d}{dx}[\\sin(x)] = \\cos(x)',
    category: 'Trigonométricas'
  },
  {
    id: 3,
    question: '¿Cuál es la integral de e^(2x)?',
    expression: '\\int e^{2x}\\,dx = \\;?',
    options: ['e^{2x} + C', '2e^{2x} + C', '\\frac{e^{2x}}{2} + C', 'xe^{2x} + C'],
    correctIndex: 2,
    explanation: 'Usando sustitución u=2x: \\int e^u \\cdot \\frac{du}{2} = \\frac{e^u}{2} = \\frac{e^{2x}}{2} + C',
    category: 'Exponenciales'
  },
  {
    id: 4,
    question: '¿Cuál es la integral de 1/x?',
    expression: '\\int \\frac{1}{x}\\,dx = \\;?',
    options: ['x^{-1} + C', '-\\frac{1}{x^2} + C', '\\ln|x| + C', '\\log(x) + C'],
    correctIndex: 2,
    explanation: 'La integral de \\frac{1}{x} es \\ln|x| + C. Es un caso especial porque la regla de potencia no aplica con n=-1.',
    category: 'Básicas'
  },
  {
    id: 5,
    question: '¿Cuál es la integral de sen(x)?',
    expression: '\\int \\sin(x)\\,dx = \\;?',
    options: ['\\cos(x) + C', '-\\cos(x) + C', '\\sin(x) + C', '-\\sin(x) + C'],
    correctIndex: 1,
    explanation: 'La antiderivada de \\sin(x) es -\\cos(x) + C. Verifica: \\frac{d}{dx}[-\\cos(x)] = \\sin(x) ✓',
    category: 'Trigonométricas'
  },
  {
    id: 6,
    question: '¿Qué método usarías para esta integral?',
    expression: '\\int x \\cdot e^x\\,dx',
    options: ['Sustitución', 'Integración por Partes', 'Fracciones Parciales', 'Sustitución Trigonométrica'],
    correctIndex: 1,
    explanation: 'Es un producto de funciones de diferente naturaleza (polinomio × exponencial). Usamos partes con u=x,\\; dv=e^x\\,dx.',
    category: 'Métodos'
  },
  {
    id: 7,
    question: '¿Cuál es la integral de sec²(x)?',
    expression: '\\int \\sec^2(x)\\,dx = \\;?',
    options: ['\\sec(x)\\tan(x) + C', '\\tan(x) + C', '-\\csc(x) + C', '\\sec(x) + C'],
    correctIndex: 1,
    explanation: 'La integral de \\sec^2(x) es \\tan(x) + C. Es una integral directa que debes memorizar.',
    category: 'Trigonométricas'
  },
  {
    id: 8,
    question: '¿Cuál es la integral de 1/(1+x²)?',
    expression: '\\int \\frac{1}{1+x^2}\\,dx = \\;?',
    options: ['\\ln(1+x^2) + C', '\\arctan(x) + C', '\\arcsin(x) + C', '\\frac{x}{1+x^2} + C'],
    correctIndex: 1,
    explanation: 'Es la forma estándar: \\int \\frac{1}{a^2+x^2}\\,dx = \\frac{1}{a}\\arctan\\left(\\frac{x}{a}\\right)+C \\text{ con } a=1.',
    category: 'Inversas'
  },
  {
    id: 9,
    question: 'Si F\'(x) = f(x), entonces la integral definida es:',
    expression: '\\int_a^b f(x)\\,dx = \\;?',
    options: ['F(a) - F(b)', 'F(b) - F(a)', 'f(b) - f(a)', 'F(a) + F(b)'],
    correctIndex: 1,
    explanation: 'Teorema Fundamental del Cálculo: \\int_a^b f(x)\\,dx = F(b) - F(a), donde F es antiderivada de f.',
    category: 'Teoremas'
  },
  {
    id: 10,
    question: '¿Cuál es la integral de x/(x²+1)?',
    expression: '\\int \\frac{x}{x^2+1}\\,dx = \\;?',
    options: ['\\arctan(x) + C', '\\frac{1}{2}\\ln(x^2+1) + C', '\\frac{x^2}{x^2+1} + C', '\\frac{1}{(x^2+1)^2} + C'],
    correctIndex: 1,
    explanation: 'Sustitución u=x^2+1,\\; du=2x\\,dx. Entonces \\int \\frac{1}{2}\\frac{du}{u} = \\frac{1}{2}\\ln|u| = \\frac{1}{2}\\ln(x^2+1) + C',
    category: 'Sustitución'
  }
];

export default function Exercises() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [category, setCategory] = useState<string>('Todas');

  const exercise = exercises[currentExercise];
  const categories = ['Todas', ...Array.from(new Set(exercises.map(e => e.category)))];
  const filteredExercises = category === 'Todas' ? exercises : exercises.filter(e => e.category === category);

  const handleSelect = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    setShowExplanation(true);
    setAnswered(prev => prev + 1);
    if (index === exercise.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const nextExercise = () => {
    const next = (currentExercise + 1) % filteredExercises.length;
    setCurrentExercise(next);
    setSelectedOption(null);
    setShowExplanation(false);
  };

  const resetAll = () => {
    setCurrentExercise(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setAnswered(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#e94560]/10 to-red-600/10 rounded-xl p-6 border border-[#e94560]/20">
        <h2 className="text-2xl font-bold text-white mb-2">🏆 Banco de Ejercicios</h2>
        <p className="text-slate-300">
          Pon a prueba tu conocimiento con ejercicios de opción múltiple. ¡Gana puntos!
        </p>
      </div>

      {/* Score Board */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#16213e]/70 rounded-xl p-4 border border-[#0f3460]/50 text-center">
          <Trophy size={24} className="text-amber-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-white">{score}</p>
          <p className="text-xs text-slate-400">Correctas</p>
        </div>
        <div className="bg-[#16213e]/70 rounded-xl p-4 border border-[#0f3460]/50 text-center">
          <Star size={24} className="text-blue-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-white">{answered}</p>
          <p className="text-xs text-slate-400">Respondidas</p>
        </div>
        <div className="bg-[#16213e]/70 rounded-xl p-4 border border-[#0f3460]/50 text-center">
          <div className="text-2xl font-bold text-white mb-1">
            {answered > 0 ? Math.round((score / answered) * 100) : 0}%
          </div>
          <p className="text-xs text-slate-400">Precisión</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => { setCategory(cat); setCurrentExercise(0); setSelectedOption(null); setShowExplanation(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              category === cat
                ? 'bg-[#e94560] text-white'
                : 'bg-[#0f3460] text-slate-400 border border-[#0f3460] hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Exercise Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentExercise}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-[#16213e]/70 rounded-xl p-6 border border-[#0f3460]/50"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-500">Ejercicio {currentExercise + 1} de {filteredExercises.length}</span>
            <span className="px-2 py-1 rounded text-xs bg-[#0f3460] text-slate-300">{exercise.category}</span>
          </div>

          <h3 className="text-lg font-semibold text-white mb-2">{exercise.question}</h3>
          <div className="step-card" style={{ background: 'rgba(15, 52, 96, 0.5)' }}>
            <MathTex tex={exercise.expression} display={true} />
          </div>

          {/* Options */}
          <div className="space-y-3 mt-4">
            {exercise.options.map((option, i) => {
              let btnClass = 'bg-[#0f0f23]/50 border-[#0f3460]/50 hover:border-[#e94560]/50 text-slate-300';
              if (selectedOption !== null) {
                if (i === exercise.correctIndex) {
                  btnClass = 'bg-emerald-900/30 border-emerald-500/50 text-emerald-300';
                } else if (i === selectedOption && i !== exercise.correctIndex) {
                  btnClass = 'bg-red-900/30 border-red-500/50 text-red-300';
                } else {
                  btnClass = 'bg-[#0f0f23]/30 border-[#0f3460]/30 text-slate-500';
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={selectedOption !== null}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${btnClass}`}
                >
                  <span className="w-8 h-8 rounded-lg bg-[#0f3460] flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <div className="overflow-x-auto flex-1">
                    <MathTex tex={option} />
                  </div>
                  {selectedOption !== null && i === exercise.correctIndex && (
                    <CheckCircle size={18} className="ml-auto text-emerald-400 flex-shrink-0" />
                  )}
                  {selectedOption === i && i !== exercise.correctIndex && (
                    <XCircle size={18} className="ml-auto text-red-400 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 step-card"
            >
              <h4 style={{ color: '#93c5fd' }}>💡 EXPLICACIÓN:</h4>
              <div className="text-sm overflow-x-auto">
                <MathTex tex={exercise.explanation} />
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={nextExercise}
              className="flex-1 flex items-center justify-center gap-2 bg-[#e94560] text-white font-medium py-3 rounded-xl hover:bg-[#d63851] transition-all"
            >
              Siguiente <ArrowRight size={16} />
            </button>
            <button
              onClick={resetAll}
              className="px-4 py-3 bg-[#0f3460] text-slate-300 rounded-xl hover:bg-[#1a4080] transition-colors"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
