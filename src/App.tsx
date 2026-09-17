import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, BookOpen, Calculator, BarChart3, Award, 
  GraduationCap, ChevronRight, Menu, X, Zap
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Theory from './components/Theory';
import IntegrationMethods from './components/IntegrationMethods';
import IntegralCalculator from './components/IntegralCalculator';
import Exercises from './components/Exercises';
import Graphs from './components/Graphs';
import Applications from './components/Applications';

type Section = 'dashboard' | 'theory' | 'methods' | 'calculator' | 'exercises' | 'graphs' | 'applications';

const navItems = [
  { id: 'dashboard' as Section, label: 'Dashboard', icon: Home },
  { id: 'theory' as Section, label: 'Teoría', icon: BookOpen },
  { id: 'methods' as Section, label: 'Métodos', icon: GraduationCap },
  { id: 'calculator' as Section, label: 'Calculadora', icon: Calculator },
  { id: 'exercises' as Section, label: 'Ejercicios', icon: Award },
  { id: 'graphs' as Section, label: 'Gráficas', icon: BarChart3 },
  { id: 'applications' as Section, label: 'Aplicaciones', icon: Zap },
];

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard': return <Dashboard onNavigate={setActiveSection} />;
      case 'theory': return <Theory />;
      case 'methods': return <IntegrationMethods />;
      case 'calculator': return <IntegralCalculator />;
      case 'exercises': return <Exercises />;
      case 'graphs': return <Graphs />;
      case 'applications': return <Applications />;
      default: return <Dashboard onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-800/95 backdrop-blur-xl border-r border-slate-700/50 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/25">
                ∫
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">IntegralLab</h1>
                <p className="text-xs text-slate-400">Pro Edition</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-blue-400' : ''} />
                  <span>{item.label}</span>
                  {isActive && <ChevronRight size={14} className="ml-auto text-blue-400" />}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-700/50">
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl p-4 border border-blue-500/20">
              <p className="text-xs text-slate-400">Cálculo Integral</p>
              <p className="text-sm text-white font-medium">Material Didáctico</p>
              <p className="text-xs text-slate-500 mt-1">v2.0 — 2026</p>
            </div>
            <div className="mt-3 text-center">
              <p className="text-xs text-slate-500">Desarrollado por</p>
              <p className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Jhon Fredy González
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {navItems.find(i => i.id === activeSection)?.label || 'Dashboard'}
                </h2>
                <p className="text-sm text-slate-400">
                  {activeSection === 'dashboard' && 'Resumen general del laboratorio'}
                  {activeSection === 'theory' && 'Conceptos fundamentales del cálculo integral'}
                  {activeSection === 'methods' && 'Técnicas y métodos de integración'}
                  {activeSection === 'calculator' && 'Resuelve integrales con retroalimentación'}
                  {activeSection === 'exercises' && 'Practica con ejercicios interactivos'}
                  {activeSection === 'graphs' && 'Visualización gráfica de funciones'}
                  {activeSection === 'applications' && 'Aplicaciones reales de la integración'}
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-2 border border-slate-700">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-xs text-slate-400">Sistema Activo</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
