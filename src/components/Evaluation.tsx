import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Code, CheckCircle, Clock, Award, BookOpen, Target, Layers } from 'lucide-react';
import { renderMath } from './Math';

export default function Evaluation() {
  const [activeTab, setActiveTab] = useState<'overview' | 'part1' | 'part2' | 'rubric'>('overview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#e94560]/10 to-red-600/10 rounded-xl p-6 border border-[#e94560]/20">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#e94560] to-red-600 flex items-center justify-center">
            <FileText size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Evaluación Integral</h2>
            <p className="text-sm text-slate-400">Cálculo Integral + Desarrollo de Software</p>
          </div>
        </div>
        <p className="text-slate-300">
          Evaluación dual: resuelve problemas de cálculo integral y construye una plataforma interactiva como la que estás usando.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'overview' as const, label: 'Vista General', icon: BookOpen },
          { id: 'part1' as const, label: 'Parte I: Cálculo', icon: FileText },
          { id: 'part2' as const, label: 'Parte II: Software', icon: Code },
          { id: 'rubric' as const, label: 'Rúbrica', icon: Award },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[#e94560] text-white shadow-lg'
                  : 'bg-[#0f3460]/50 text-slate-400 border border-[#0f3460] hover:text-white'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'part1' && <Part1Tab />}
      {activeTab === 'part2' && <Part2Tab />}
      {activeTab === 'rubric' && <RubricTab />}
    </div>
  );
}

function OverviewTab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#16213e]/70 rounded-xl p-5 border border-[#0f3460]/50">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={18} className="text-[#e94560]" />
            <span className="text-sm font-semibold text-white">Duración</span>
          </div>
          <p className="text-2xl font-bold text-white">2 semanas</p>
          <p className="text-xs text-slate-400 mt-1">Parte I: 1 semana | Parte II: 1 semana</p>
        </div>
        <div className="bg-[#16213e]/70 rounded-xl p-5 border border-[#0f3460]/50">
          <div className="flex items-center gap-2 mb-3">
            <Target size={18} className="text-[#e94560]" />
            <span className="text-sm font-semibold text-white">Valor</span>
          </div>
          <p className="text-2xl font-bold text-white">100%</p>
          <p className="text-xs text-slate-400 mt-1">Parte I: 40% | Parte II: 60%</p>
        </div>
        <div className="bg-[#16213e]/70 rounded-xl p-5 border border-[#0f3460]/50">
          <div className="flex items-center gap-2 mb-3">
            <Layers size={18} className="text-[#e94560]" />
            <span className="text-sm font-semibold text-white">Modalidad</span>
          </div>
          <p className="text-2xl font-bold text-white">Individual</p>
          <p className="text-xs text-slate-400 mt-1">Con defensa presencial del proyecto</p>
        </div>
      </div>

      {/* Objective */}
      <div className="bg-[#16213e]/70 rounded-xl p-6 border border-[#0f3460]/50">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <Target size={20} className="text-[#e94560]" />
          Objetivo de la Evaluación
        </h3>
        <p className="text-slate-300 leading-relaxed">
          Demostrar competencias en <strong className="text-white">cálculo integral</strong> (antiderivadas, primitivas, 
          sumas de Riemann, área bajo la curva y técnicas de integración) y aplicar esos conocimientos en el 
          <strong className="text-white"> desarrollo de una plataforma web interactiva</strong> que permita visualizar 
          y resolver problemas de integración, integrando matemáticas, programación y diseño de interfaces.
        </p>
      </div>

      {/* Structure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#16213e]/70 rounded-xl p-6 border border-[#0f3460]/50">
          <h3 className="text-lg font-bold text-[#e94560] mb-3">📐 PARTE I: Cálculo Integral (40%)</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2"><CheckCircle size={14} className="text-[#22c55e] mt-0.5 flex-shrink-0" /> Antiderivadas y primitivas</li>
            <li className="flex items-start gap-2"><CheckCircle size={14} className="text-[#22c55e] mt-0.5 flex-shrink-0" /> Sumas de Riemann (calculadas a mano)</li>
            <li className="flex items-start gap-2"><CheckCircle size={14} className="text-[#22c55e] mt-0.5 flex-shrink-0" /> Área bajo la curva</li>
            <li className="flex items-start gap-2"><CheckCircle size={14} className="text-[#22c55e] mt-0.5 flex-shrink-0" /> Técnicas de integración</li>
            <li className="flex items-start gap-2"><CheckCircle size={14} className="text-[#22c55e] mt-0.5 flex-shrink-0" /> Problemas de aplicación</li>
          </ul>
        </div>
        <div className="bg-[#16213e]/70 rounded-xl p-6 border border-[#0f3460]/50">
          <h3 className="text-lg font-bold text-[#e94560] mb-3">💻 PARTE II: Desarrollo de Software (60%)</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2"><CheckCircle size={14} className="text-[#22c55e] mt-0.5 flex-shrink-0" /> Plataforma web interactiva</li>
            <li className="flex items-start gap-2"><CheckCircle size={14} className="text-[#22c55e] mt-0.5 flex-shrink-0" /> Visualizador de Sumas de Riemann</li>
            <li className="flex items-start gap-2"><CheckCircle size={14} className="text-[#22c55e] mt-0.5 flex-shrink-0" /> Calculadora de integrales</li>
            <li className="flex items-start gap-2"><CheckCircle size={14} className="text-[#22c55e] mt-0.5 flex-shrink-0" /> Renderizado de fórmulas (LaTeX/KaTeX)</li>
            <li className="flex items-start gap-2"><CheckCircle size={14} className="text-[#22c55e] mt-0.5 flex-shrink-0" /> Desarrollo paso a paso</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

function Part1Tab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="bg-[#16213e]/70 rounded-xl p-6 border border-[#0f3460]/50">
        <h3 className="text-xl font-bold text-white mb-2">📐 PARTE I: Resolución de Problemas de Cálculo Integral</h3>
        <p className="text-slate-400 text-sm mb-4">Resuelva cada problema mostrando todo el procedimiento. Valor: 40% de la nota final.</p>

        {/* Sección A */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-[#e94560] mb-3 uppercase tracking-wide">Sección A: Antiderivadas y Primitivas (8 puntos)</h4>
          <p className="text-xs text-slate-400 mb-3">Encuentre la antiderivada (primitiva) de cada función. Incluya la constante de integración C.</p>
          
          <div className="space-y-3">
            {[
              { n: 1, tex: '\\int (4x^3 - 3x^2 + 2x - 7)\\,dx', pts: 2 },
              { n: 2, tex: '\\int \\left(\\frac{3}{x^2} - \\frac{2}{\\sqrt{x}} + 5e^x\\right)\\,dx', pts: 2 },
              { n: 3, tex: '\\int \\frac{x^2 + 3x + 2}{x}\\,dx', pts: 2 },
              { n: 4, tex: '\\int \\left(\\sec^2(x) + \\frac{1}{1+x^2}\\right)\\,dx', pts: 2 },
            ].map(q => (
              <div key={q.n} className="step-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-300">Problema A{q.n}</span>
                  <span className="text-xs text-amber-400">{q.pts} pts</span>
                </div>
                <div dangerouslySetInnerHTML={{ __html: renderMath(q.tex, true) }} />
              </div>
            ))}
          </div>
        </div>

        {/* Sección B */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-[#e94560] mb-3 uppercase tracking-wide">Sección B: Sumas de Riemann (8 puntos)</h4>
          <p className="text-xs text-slate-400 mb-3">Para la función <span dangerouslySetInnerHTML={{ __html: renderMath('f(x) = x^2', false) }} /> en el intervalo <span dangerouslySetInnerHTML={{ __html: renderMath('[0, 2]', false) }} />:</p>
          
          <div className="space-y-3">
            <div className="step-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-300">Problema B1</span>
                <span className="text-xs text-amber-400">2 pts</span>
              </div>
              <p className="text-sm text-slate-300 mb-2">Calcule <span dangerouslySetInnerHTML={{ __html: renderMath('\\Delta x', false) }} /> y los puntos <span dangerouslySetInnerHTML={{ __html: renderMath('x_i', false) }} /> para <span dangerouslySetInnerHTML={{ __html: renderMath('n = 4', false) }} /> subintervalos.</p>
            </div>
            <div className="step-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-300">Problema B2</span>
                <span className="text-xs text-amber-400">2 pts</span>
              </div>
              <p className="text-sm text-slate-300 mb-2">Calcule la <strong>Suma de Riemann por la izquierda</strong> <span dangerouslySetInnerHTML={{ __html: renderMath('L_4', false) }} />.</p>
            </div>
            <div className="step-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-300">Problema B3</span>
                <span className="text-xs text-amber-400">2 pts</span>
              </div>
              <p className="text-sm text-slate-300 mb-2">Calcule la <strong>Suma de Riemann por la derecha</strong> <span dangerouslySetInnerHTML={{ __html: renderMath('R_4', false) }} />.</p>
            </div>
            <div className="step-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-300">Problema B4</span>
                <span className="text-xs text-amber-400">2 pts</span>
              </div>
              <p className="text-sm text-slate-300 mb-2">Calcule la <strong>Suma de Riemann por punto medio</strong> <span dangerouslySetInnerHTML={{ __html: renderMath('M_4', false) }} /> y compare con el valor exacto <span dangerouslySetInnerHTML={{ __html: renderMath('\\int_0^2 x^2\\,dx = \\frac{8}{3}', false) }} />.</p>
            </div>
          </div>
        </div>

        {/* Sección C */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-[#e94560] mb-3 uppercase tracking-wide">Sección C: Área Bajo la Curva (8 puntos)</h4>
          
          <div className="space-y-3">
            <div className="step-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-300">Problema C1</span>
                <span className="text-xs text-amber-400">3 pts</span>
              </div>
              <p className="text-sm text-slate-300 mb-2">Calcule el área bajo <span dangerouslySetInnerHTML={{ __html: renderMath('f(x) = 2x + 1', false) }} /> en <span dangerouslySetInnerHTML={{ __html: renderMath('[0, 3]', false) }} /> usando la definición de integral definida (límite de sumas de Riemann).</p>
            </div>
            <div className="step-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-300">Problema C2</span>
                <span className="text-xs text-amber-400">3 pts</span>
              </div>
              <p className="text-sm text-slate-300 mb-2">Halle el área de la región encerrada entre <span dangerouslySetInnerHTML={{ __html: renderMath('f(x) = x^2', false) }} /> y <span dangerouslySetInnerHTML={{ __html: renderMath('g(x) = 2x', false) }} />.</p>
            </div>
            <div className="step-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-300">Problema C3</span>
                <span className="text-xs text-amber-400">2 pts</span>
              </div>
              <p className="text-sm text-slate-300 mb-2">Explique con sus propias palabras la relación entre las Sumas de Riemann y el Área bajo la curva. Incluya un dibujo.</p>
            </div>
          </div>
        </div>

        {/* Sección D */}
        <div>
          <h4 className="text-sm font-bold text-[#e94560] mb-3 uppercase tracking-wide">Sección D: Técnicas de Integración (16 puntos)</h4>
          
          <div className="space-y-3">
            {[
              { n: 1, tex: '\\int x \\cdot e^{2x}\\,dx', method: 'Integración por partes', pts: 4 },
              { n: 2, tex: '\\int \\frac{3x + 2}{x^2 + x}\\,dx', method: 'Fracciones parciales', pts: 4 },
              { n: 3, tex: '\\int \\frac{x}{\\sqrt{9 - x^2}}\\,dx', method: 'Sustitución', pts: 4 },
              { n: 4, tex: '\\int_0^{\\infty} e^{-x}\\,dx', method: 'Integral impropia (¿converge o diverge?)', pts: 4 },
            ].map(q => (
              <div key={q.n} className="step-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-300">Problema D{q.n} — {q.method}</span>
                  <span className="text-xs text-amber-400">{q.pts} pts</span>
                </div>
                <div dangerouslySetInnerHTML={{ __html: renderMath(q.tex, true) }} />
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="step-card highlight mt-6">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white">TOTAL PARTE I</span>
            <span className="text-xl font-bold text-amber-400">40 puntos</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Part2Tab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="bg-[#16213e]/70 rounded-xl p-6 border border-[#0f3460]/50">
        <h3 className="text-xl font-bold text-white mb-2">💻 PARTE II: Proyecto de Desarrollo de Software</h3>
        <p className="text-slate-400 text-sm mb-4">Construya una plataforma web interactiva para enseñanza de cálculo integral. Valor: 60% de la nota final.</p>

        {/* Enunciado */}
        <div className="step-card formula mb-6">
          <h4 style={{ color: '#e94560' }}>📋 ENUNCIADO DEL PROYECTO</h4>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Como estudiante de <strong className="text-white">Desarrollo de Software</strong>, usted debe diseñar y construir una 
            <strong className="text-white"> plataforma web interactiva</strong> que sirva como herramienta didáctica para la enseñanza 
            del cálculo integral. La plataforma debe permitir a los estudiantes <strong className="text-white">visualizar, practicar 
            y comprender</strong> los conceptos de integración de manera interactiva.
          </p>
        </div>

        {/* Requisitos funcionales */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-[#e94560] mb-3 uppercase tracking-wide">Requisitos Funcionales (Obligatorios)</h4>
          <div className="space-y-2">
            {[
              { title: 'Visualizador de Sumas de Riemann', desc: 'El usuario puede seleccionar función, intervalo [a,b], número de rectángulos (n) y tipo de suma (izquierda, derecha, punto medio). Se muestran los rectángulos sobre la curva en tiempo real.' },
              { title: 'Cálculo paso a paso', desc: 'La plataforma muestra el desarrollo completo: Δx, puntos de evaluación, tabla de valores, suma y resultado final con fórmulas renderizadas en LaTeX/KaTeX.' },
              { title: 'Gráfica de convergencia', desc: 'Una segunda gráfica muestra cómo la suma Sₙ converge al valor exacto cuando n crece.' },
              { title: 'Múltiples funciones', desc: 'Al menos 4 funciones predefinidas (x², sin(x), eˣ, etc.) y opción de ingresar función personalizada.' },
              { title: 'Tabla de convergencia', desc: 'Tabla que muestra los valores de S_izq, S_der, S_med y el error para diferentes valores de n.' },
              { title: 'Interfaz profesional', desc: 'Diseño responsive, modo oscuro, navegación clara y experiencia de usuario pulida.' },
            ].map((req, i) => (
              <div key={i} className="step-card">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(233, 69, 96, 0.2)' }}>
                    <span className="text-xs font-bold text-[#e94560]">{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{req.title}</p>
                    <p className="text-xs text-slate-400 mt-1">{req.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Requisitos técnicos */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-[#e94560] mb-3 uppercase tracking-wide">Requisitos Técnicos</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { title: 'Frontend', items: ['HTML5 semántico', 'CSS3 (o Tailwind CSS)', 'JavaScript/TypeScript', 'Canvas API o SVG para gráficas'] },
              { title: 'Librerías permitidas', items: ['KaTeX o MathJax (fórmulas)', 'React o Vue (opcional)', 'Chart.js o D3.js (opcional)', 'Cualquier librería justificada'] },
              { title: 'Funcionalidades extra (bonus)', items: ['Animación de n creciente', 'Exportar resultados (PNG/TXT)', 'Comparación de tipos de suma', 'Valor exacto con antiderivada'] },
              { title: 'Entregables', items: ['Código fuente completo', 'README.md con instrucciones', 'Demostración en vivo', 'Documento de diseño'] },
            ].map((col, i) => (
              <div key={i} className="step-card">
                <h4 className="text-xs font-bold text-blue-300 mb-2">{col.title}</h4>
                <ul className="space-y-1">
                  {col.items.map((item, j) => (
                    <li key={j} className="text-xs text-slate-400 flex items-center gap-2">
                      <span className="text-[#22c55e]">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Cronograma */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-[#e94560] mb-3 uppercase tracking-wide">Cronograma de Entrega</h4>
          <div className="space-y-2">
            {[
              { week: 'Semana 1', task: 'Parte I — Resolución de problemas de cálculo integral (entrega escrita)', pct: '40%' },
              { week: 'Semana 2 — Día 1-3', task: 'Prototipo funcional: visualizador básico con canvas', pct: '' },
              { week: 'Semana 2 — Día 4-5', task: 'Implementación completa: paso a paso, convergencia, tabla', pct: '' },
              { week: 'Semana 2 — Día 6-7', task: 'Pulido, documentación y demostración final', pct: '60%' },
            ].map((item, i) => (
              <div key={i} className="step-card" style={{ marginBottom: '8px' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{item.week}</p>
                    <p className="text-xs text-slate-400">{item.task}</p>
                  </div>
                  {item.pct && <span className="text-xs font-bold text-amber-400">{item.pct}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nota importante */}
        <div className="step-card error">
          <h4 style={{ color: '#f87171' }}>⚠️ NOTA IMPORTANTE</h4>
          <p className="text-sm text-slate-300 mt-2">
            La plataforma que estás usando ahora mismo (<strong className="text-white">IntegralLab Pro</strong>) es el 
            <strong className="text-white"> ejemplo de referencia</strong>. No se espera que repliquen el 100% de su funcionalidad, 
            pero sí deben demostrar comprensión de los conceptos matemáticos implementándolos en código. 
            El <strong className="text-white">visualizador de Sumas de Riemann</strong> es el componente mínimo obligatorio.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function RubricTab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="bg-[#16213e]/70 rounded-xl p-6 border border-[#0f3460]/50">
        <h3 className="text-xl font-bold text-white mb-4">🏆 Rúbrica de Evaluación</h3>

        {/* Parte I */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-[#e94560] mb-3">PARTE I: Cálculo Integral (40 puntos)</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-[#0f3460]">
                  <th className="text-left p-2">Criterio</th>
                  <th className="text-center p-2">Excelente</th>
                  <th className="text-center p-2">Bueno</th>
                  <th className="text-center p-2">Deficiente</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { crit: 'Procedimiento', exc: 'Completo y claro', good: 'Parcial', bad: 'Ausente o incorrecto' },
                  { crit: 'Resultado', exc: 'Correcto', good: 'Error menor', bad: 'Incorrecto' },
                  { crit: 'Notación', exc: 'Matemática formal', good: 'Aceptable', bad: 'Informal o confusa' },
                  { crit: 'Justificación', exc: 'Teoremas citados', good: 'Parcial', bad: 'Sin justificación' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-[#0f3460]/30">
                    <td className="p-2 font-semibold text-white">{row.crit}</td>
                    <td className="p-2 text-center text-green-300">{row.exc}</td>
                    <td className="p-2 text-center text-amber-300">{row.good}</td>
                    <td className="p-2 text-center text-red-300">{row.bad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Parte II */}
        <div>
          <h4 className="text-sm font-bold text-[#e94560] mb-3">PARTE II: Desarrollo de Software (60 puntos)</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-[#0f3460]">
                  <th className="text-left p-2">Criterio</th>
                  <th className="text-center p-2">Puntos</th>
                  <th className="text-left p-2">Descripción</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { crit: 'Visualizador de Riemann funcional', pts: '15', desc: 'Canvas con rectángulos, curva, ejes y controles interactivos' },
                  { crit: 'Cálculo paso a paso', pts: '10', desc: 'Desarrollo completo con Δx, tabla, suma y resultado renderizado en KaTeX' },
                  { crit: 'Gráfica de convergencia', pts: '8', desc: 'Segunda gráfica mostrando convergencia de Sₙ al valor exacto' },
                  { crit: 'Múltiples funciones', pts: '5', desc: 'Al menos 4 funciones predefinidas + personalizada' },
                  { crit: 'Tabla de convergencia', pts: '5', desc: 'Tabla con S_izq, S_der, S_med y error para distintos n' },
                  { crit: 'Diseño y UX', pts: '7', desc: 'Interfaz profesional, responsive, modo oscuro, navegación clara' },
                  { crit: 'Código limpio', pts: '5', desc: 'Estructura organizada, comentarios, buenas prácticas' },
                  { crit: 'Documentación', pts: '3', desc: 'README con instrucciones de instalación y uso' },
                  { crit: 'Bonus: animación', pts: '2', desc: 'Animación de n creciente mostrando convergencia' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-[#0f3460]/30">
                    <td className="p-2 font-semibold text-white">{row.crit}</td>
                    <td className="p-2 text-center text-amber-400 font-bold">{row.pts}</td>
                    <td className="p-2 text-slate-400">{row.desc}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-[#e94560]/30">
                  <td className="p-2 font-bold text-white">TOTAL</td>
                  <td className="p-2 text-center text-[#e94560] font-bold text-sm">60</td>
                  <td className="p-2"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Escala */}
        <div className="mt-6 step-card formula">
          <h4 style={{ color: '#e94560' }}>ESCALA DE CALIFICACIÓN</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            {[
              { range: '90-100', grade: 'A', color: '#22c55e' },
              { range: '80-89', grade: 'B', color: '#3b82f6' },
              { range: '70-79', grade: 'C', color: '#f59e0b' },
              { range: '< 70', grade: 'D', color: '#ef4444' },
            ].map(s => (
              <div key={s.grade} className="text-center p-2 rounded-lg" style={{ background: s.color + '20', border: `1px solid ${s.color}40` }}>
                <p className="text-lg font-bold" style={{ color: s.color }}>{s.grade}</p>
                <p className="text-xs text-slate-400">{s.range}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
