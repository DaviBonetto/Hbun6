import React from 'react';
import { Target, CheckCircle2 } from 'lucide-react';

interface DailyFocusProps {
  focus: string;
  setFocus: (value: string) => void;
}

export const DailyFocus: React.FC<DailyFocusProps> = ({ focus, setFocus }) => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 mb-6 animate-slide-up backdrop-blur-sm relative overflow-hidden group hover:border-indigo-500/30 transition-colors duration-300">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
        <Target size={80} className="text-indigo-500" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3 text-indigo-400">
          <Target size={18} />
          <span className="text-xs font-bold uppercase tracking-wider">Prioridade Absoluta</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="text-slate-600 hover:text-indigo-500 transition-colors">
            <CheckCircle2 size={32} />
          </button>
          <input
            type="text"
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
            placeholder="Qual é a sua única prioridade hoje?"
            className="text-2xl md:text-3xl font-medium text-slate-100 placeholder-slate-700 w-full bg-transparent border-none outline-none focus:ring-0"
          />
        </div>
        <p className="mt-2 text-slate-500 text-sm ml-12">
          {focus ? 'Impacto: Alto • Foco Total' : 'Defina seu foco para iniciar o dia'}
        </p>
      </div>
    </div>
  );
};