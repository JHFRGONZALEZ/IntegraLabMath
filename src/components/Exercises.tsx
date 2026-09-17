import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Trophy, Star, ArrowRight, RotateCcw } from 'lucide-react';

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
    expression: '∫ x⁴ dx = ?',
    options: ['x⁵/5 + C', '4x³ + C', 'x⁵ + C', '5x⁵ + C'],
    correctIndex: 0,
    explanation: 'Regla de la potencia: ∫xⁿdx = xⁿ⁺¹/(n+1) + C. Con n=4: x⁵/5 + C',
    category: 'Básicas'
  },
  {
    id: 2,
    question: '¿Cuál es ∫ cos(x) dx?',
    expression: '∫ cos(x) dx = ?',
    options: ['-sen(x) + C', 'sen(x) + C', 'cos(x) + C', '-cos(x) + C'],
    correctIndex: 1,
    explanation: 'La antiderivada de cos(x) es sen(x). Recuerda: d/dx[sen(x)] = cos(x)',
    category: 'Trigonométricas'
  },
  {
    id: 3,
    question: '¿Cuál es ∫ e^(2x) dx?',
    expression: '∫ e^(2x) dx = ?',
    options: ['e^(2x) + C', '2e^(2x) + C', 'e^(2x)/2 + C', 'xe^(2x) + C'],
    correctIndex: 2,
    explanation: 'Usando sustitución u=2x: ∫e^u·(du/2) = e^u/2 = e^(2x)/2 + C',
    category: 'Exponenciales'
  },
  {
    id: 4,
    question: '¿Cuál es ∫ 1/x dx?',
    expression: '∫ 1/x dx = ?',
    options: ['x⁻¹ + C', '-1/x² + C', 'ln|x| + C', 'log(x) + C'],
    correctIndex: 2,
    explanation: 'La integral de 1/x es ln|x| + C. Es un caso especial porque la regla de potencia no aplica con n=-1.',
    category: 'Básicas'
  },
  {
    id: 5,
    question: '¿Cuál es ∫ sen(x) dx?',
    expression: '∫ sen(x) dx = ?',
    options: ['cos(x) + C', '-cos(x) + C', 'sen(x) + C', '-sen(x) + C'],
    correctIndex: 1,
    explanation: 'La antiderivada de sen(x) es -cos(x) + C. Verifica: d/dx[-cos(x)] = sen(x) ✓',
    category: 'Trigonométricas'
  },
  {
    id: 6,
    question: '¿Qué método usarías para ∫ x·eˣ dx?',
    expression: '∫ x·eˣ dx',
    options: ['Sustitución', 'Integración por Partes', 'Fracciones Parciales', 'Sustitución Trigonométrica'],
    correctIndex: 1,
    explanation: 'Es un producto de funciones de diferente naturaleza (polinomio × exponencial). Usamos partes con u=x, dv=eˣdx.',
    category: 'Métodos'
  },
  {
    id: 7,
    question: '¿Cuál es ∫ sec²(x) dx?',
    expression: '∫ sec²(x) dx = ?',
    options: ['sec(x)·tan(x) + C', 'tan(x) + C', '-csc(x) + C', 'sec(x) + C'],
    correctIndex: 1,
    explanation: 'La integral de sec²(x) es tan(x) + C. Es una integral directa que debes memorizar.',
    category: 'Trigonométricas'
  },
  {
    id: 8,
    question: '¿Cuál es ∫ 1/(1+x²) dx?',
    expression: '∫ 1/(1+x²) dx = ?',
    options: ['ln(1+x²) + C', 'arctan(x) + C', 'arcsen(x) + C', 'x/(1+x²) + C'],
    correctIndex: 1,
    explanation: 'Es la forma estándar de la integral que produce arcotangente: ∫1/(a²+x²)dx = (1/a)arctan(x/a)+C con a=1.',
    category: 'Inversas'
  },
  {
    id: 9,
    question: 'Si F\'(x) = f(x), entonces ∫ₐᵇ f(x)dx = ?',
    expression: '∫ₐᵇ f(x)dx = ?',
    options: ['F(a) - F(b)', 'F(b) - F(a)', 'f(b) - f(a)', 'F(a) + F(b)'],
    correctIndex: 1,
    explanation: 'Teorema Fundamental del Cálculo: ∫ₐᵇ f(x)dx = F(b) - F(a), donde F es antiderivada de f.',
    category: 'Teoremas'
  },
  {
    id: 10,
    question: '¿Cuál es ∫ x/(x²+1) dx?',
    expression: '∫ x/(x²+1) dx = ?',
    options: ['arctan(x) + C', 'ln(x²+1)/2 + C', 'x²/(x²+1) + C', '1/(x²+1)² + C'],
    correctIndex: 1,
    explanation: 'Sustitución u=x²+1, du=2xdx. Entonces ∫(1/2)(du/u) = (1/2)ln|u| = ln(x²+1)/2 + C',
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
      <div className="bg-gradient-to-r from-amber-600/10 to-orange-600/10 rounded-xl p-6 border border-amber-500/20">
        <h2 className="text-2xl font-bold text-white mb-2">🏆 Banco de Ejercicios</h2>
        <p className="text-slate-300">
          Pon a prueba tu conocimiento con ejercicios de opción múltiple. ¡Gana puntos!
        </p>
      </div>

      {/* Score Board */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center">
          <Trophy size={24} className="text-amber-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-white">{score}</p>
          <p className="text-xs text-slate-400">Correctas</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center">
          <Star size={24} className="text-blue-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-white">{answered}</p>
          <p className="text-xs text-slate-400">Respondidas</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center">
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
                ? 'bg-amber-500 text-white'
                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
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
          className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-500">Ejercicio {currentExercise + 1} de {filteredExercises.length}</span>
            <span className="px-2 py-1 rounded text-xs bg-slate-700 text-slate-300">{exercise.category}</span>
          </div>

          <h3 className="text-lg font-semibold text-white mb-2">{exercise.question}</h3>
          <p className="text-xl font-mono text-blue-300 mb-6">{exercise.expression}</p>

          {/* Options */}
          <div className="space-y-3">
            {exercise.options.map((option, i) => {
              let btnClass = 'bg-slate-900/50 border-slate-700/50 hover:border-blue-500/50 text-slate-300';
              if (selectedOption !== null) {
                if (i === exercise.correctIndex) {
                  btnClass = 'bg-emerald-900/30 border-emerald-500/50 text-emerald-300';
                } else if (i === selectedOption && i !== exercise.correctIndex) {
                  btnClass = 'bg-red-900/30 border-red-500/50 text-red-300';
                } else {
                  btnClass = 'bg-slate-900/30 border-slate-700/30 text-slate-500';
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={selectedOption !== null}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${btnClass}`}
                >
                  <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="font-mono">{option}</span>
                  {selectedOption !== null && i === exercise.correctIndex && (
                    <CheckCircle size={18} className="ml-auto text-emerald-400" />
                  )}
                  {selectedOption === i && i !== exercise.correctIndex && (
                    <XCircle size={18} className="ml-auto text-red-400" />
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
              className="mt-4 bg-blue-900/20 rounded-lg p-4 border border-blue-500/20"
            >
              <p className="text-sm font-semibold text-blue-400 mb-1">💡 Explicación:</p>
              <p className="text-sm text-slate-300">{exercise.explanation}</p>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={nextExercise}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium py-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all"
            >
              Siguiente <ArrowRight size={16} />
            </button>
            <button
              onClick={resetAll}
              className="px-4 py-3 bg-slate-700 text-slate-300 rounded-xl hover:bg-slate-600 transition-colors"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
