import React, { useState, useEffect } from 'react';

export const Header: React.FC = () => {
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
        
        {/* Abstract Decorative Element */}
        <div className="flex gap-1.5 pt-2">
            <div className="w-2 h-2 rounded-full bg-vesper-gold opacity-80"></div>
            <div className="w-2 h-2 rounded-full bg-vesper-border"></div>
            <div className="w-2 h-2 rounded-full bg-vesper-border"></div>
        </div>
      </div>
    </header>
  );
};