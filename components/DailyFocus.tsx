import React from 'react';
import { Sparkles } from 'lucide-react';

interface DailyFocusProps {
  focus: string;
  setFocus: (value: string) => void;
}

export const DailyFocus: React.FC<DailyFocusProps> = ({ focus, setFocus }) => {
  return (
    <div className="mb-12 animate-slide-up group">
      <div className="flex items-center gap-3 mb-2 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
        <Sparkles size={14} className="text-vesper-gold" />
        <span className="text-xs font-mono text-vesper-gold uppercase tracking-widest">Main Goal</span>
      </div>
      
      <input
        type="text"
        value={focus}
        onChange={(e) => setFocus(e.target.value)}
        placeholder="Qual seu foco principal hoje?"
        className="w-full bg-transparent text-2xl md:text-3xl text-vesper-title placeholder-vesper-border font-light focus:outline-none border-none p-0 transition-colors"
      />
      
      {/* Subtle underlining animation */}
      <div className="h-[1px] w-full bg-vesper-border mt-4 overflow-hidden relative">
         <div className={`absolute top-0 left-0 h-full bg-vesper-gold transition-all duration-700 ease-out ${focus ? 'w-full opacity-50' : 'w-0'}`} />
      </div>
    </div>
  );
};