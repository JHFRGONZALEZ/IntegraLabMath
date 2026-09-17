import { motion } from 'framer-motion';
import { BookOpen, Calculator, BarChart3, Award, GraduationCap, Zap, TrendingUp, Users, Clock } from 'lucide-react';
import Math from './Math';

type Section = 'dashboard' | 'theory' | 'methods' | 'calculator' | 'exercises' | 'graphs' | 'applications';

interface DashboardProps {
  onNavigate: (section: Section) => void;
}

const stats = [
  { label: 'Temas Disponibles', value: '7', icon: BookOpen, color: 'from-blue-500 to-blue-600', change: '+2 nuevos' },
  { label: 'Ejercicios', value: '50+', icon: Calculator, color: 'from-purple-500 to-purple-600', change: 'Interactivos' },
  { label: 'Gráficas', value: '∞', icon: BarChart3, color: 'from-emerald-500 to-emerald-600', change: 'Dinámicas' },
  { label: 'Métodos', value: '6', icon: GraduationCap, color: 'from-amber-500 to-amber-600', change: 'Completos' },
];

const quickActions = [
  { id: 'theory' as Section, title: 'Fundamentos Teóricos', desc: 'Definiciones, teoremas y conceptos clave', icon: BookOpen, gradient: 'from-blue-600 to-cyan-600' },
  { id: 'methods' as Section, title: 'Métodos de Integración', desc: 'Sustitución, partes, fracciones parciales...', icon: GraduationCap, gradient: 'from-purple-600 to-pink-600' },
  { id: 'calculator' as Section, title: 'Calculadora Inteligente', desc: 'Resuelve integrales paso a paso', icon: Calculator, gradient: 'from-emerald-600 to-teal-600' },
  { id: 'exercises' as Section, title: 'Banco de Ejercicios', desc: 'Practica con retroalimentación inmediata', icon: Award, gradient: 'from-amber-600 to-orange-600' },
  { id: 'graphs' as Section, title: 'Visualización Gráfica', desc: 'Modelos gráficos interactivos', icon: BarChart3, gradient: 'from-rose-600 to-red-600' },
  { id: 'applications' as Section, title: 'Aplicaciones Reales', desc: 'Áreas, volúmenes, física, economía', icon: Zap, gradient: 'from-indigo-600 to-violet-600' },
];

export default function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border border-slate-700/50 p-8"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium border border-blue-500/30">
              Calculo Integral
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-medium border border-purple-500/30">
              Interactivo
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Laboratorio de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Integración</span>
          </h1>
          <p className="text-slate-300 max-w-2xl text-lg">
            Plataforma educativa interactiva para dominar el cálculo integral. 
            Explora métodos, practica con ejercicios y visualiza conceptos con gráficas dinámicas.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Users size={16} className="text-blue-400" />
              <span>Diseñado para estudiantes</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <TrendingUp size={16} className="text-emerald-400" />
              <span>Aprendizaje progresivo</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Clock size={16} className="text-amber-400" />
              <span>Acceso ilimitado</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50 hover:border-slate-600/50 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <Icon size={20} className="text-white" />
                </div>
                <span className="text-xs text-slate-500">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-slate-400">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Módulos del Curso</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                onClick={() => onNavigate(action.id)}
                className="group relative overflow-hidden bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 text-left transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} className="text-white" />
                </div>
                <h4 className="text-white font-semibold mb-1 group-hover:text-blue-300 transition-colors">{action.title}</h4>
                <p className="text-sm text-slate-400">{action.desc}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Formula Showcase */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-[#16213e]/70 rounded-xl p-6 border border-[#0f3460]/50"
      >
        <h3 className="text-lg font-semibold text-white mb-4">📐 Fórmula del Día</h3>
        <div className="step-card" style={{ background: 'rgba(15, 52, 96, 0.5)' }}>
          <Math tex="\int x^n\,dx = \frac{x^{n+1}}{n+1} + C, \quad \text{donde } n \neq -1" display={true} />
        </div>
        <p className="text-sm text-slate-400 mt-3 text-center">
          Regla de la potencia — La base de toda integración
        </p>
      </motion.div>

      {/* Developer Credit */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-slate-800/50 to-slate-800/30 rounded-xl p-6 border border-slate-700/30 text-center"
      >
        <p className="text-sm text-slate-500 mb-1">Desarrollado por</p>
        <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          Jhon Fredy González
        </p>
        <p className="text-xs text-slate-500 mt-2">
          IntegralLab Pro — Plataforma Educativa de Cálculo Integral — 2026
        </p>
      </motion.div>
    </div>
  );
}
