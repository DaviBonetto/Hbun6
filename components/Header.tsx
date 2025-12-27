import React, { useState, useEffect } from 'react';
import { Cloud } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  isSynced: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, isSynced }) => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const formattedDate = formatDate(date);

  return (
    <header className="flex flex-col gap-6 mb-12 animate-fade-in select-none">
      <div className="flex justify-between items-start border-b border-vesper-border pb-6">
        <div>
          <h2 className="text-vesper-gold font-mono text-xs uppercase tracking-widest mb-2 opacity-80">
             // {formattedDate}
          </h2>
          <h1 className="text-3xl md:text-4xl font-semibold text-vesper-title tracking-tight">
            Olá, Davi.
          </h1>
        </div>
        
        <div className="flex flex-col items-end gap-3">
            {/* Decorative Dots */}
            <div className="flex gap-1.5 pt-2">
                <div className="w-2 h-2 rounded-full bg-vesper-gold opacity-80"></div>
                <div className="w-2 h-2 rounded-full bg-vesper-border"></div>
                <div className="w-2 h-2 rounded-full bg-vesper-border"></div>
            </div>

            {/* Sync Button */}
            <button 
                onClick={onOpenSettings}
                className={`p-2 rounded-full transition-all ${isSynced ? 'text-vesper-gold bg-vesper-gold/10' : 'text-vesper-text hover:text-vesper-gold'}`}
                title="Sincronização Nuvem"
            >
                <Cloud size={18} />
            </button>
        </div>
      </div>
    </header>
  );
};