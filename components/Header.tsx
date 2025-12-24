import React, { useState, useEffect } from 'react';
import { Battery, Wifi } from 'lucide-react';

export const Header: React.FC = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (d: Date) => {
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const dateString = formatDate(date);
  const formattedDate = dateString.charAt(0).toUpperCase() + dateString.slice(1);

  return (
    <header className="flex flex-col gap-2 mb-8 animate-fade-in select-none">
      <div className="flex justify-between items-center text-slate-400 text-xs uppercase tracking-widest">
        <span>Life Operating System v2.1</span>
        <div className="flex items-center gap-3">
          <Wifi size={14} />
          <Battery size={14} />
          <span>100%</span>
        </div>
      </div>
      
      <div className="flex justify-between items-end mt-4">
        <div>
          <h2 className="text-slate-400 text-lg font-medium">{formattedDate}</h2>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mt-1">
            Bom dia, <span className="text-indigo-400">Davi</span>.
          </h1>
        </div>
        <div className="text-5xl md:text-6xl font-light text-slate-700 tabular-nums hidden sm:block">
          {formatTime(date)}
        </div>
      </div>
    </header>
  );
};