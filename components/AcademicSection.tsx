import React, { useState } from 'react';
import { UniApplication } from '../types';
import { GraduationCap, BookOpen, AlertCircle, Plus, Trash2 } from 'lucide-react';

interface AcademicSectionProps {
  applications: UniApplication[];
  onAddApp: (uni: string) => void;
  onDeleteApp: (id: string) => void;
}

const StatusDot: React.FC<{ status: UniApplication['status'] }> = ({ status }) => {
  const colors = {
    'Not Started': 'bg-slate-600',
    'In Progress': 'bg-blue-500 animate-pulse',
    'Submitted': 'bg-yellow-500',
    'Accepted': 'bg-emerald-500',
  };
  return <div className={`w-2 h-2 rounded-full ${colors[status]}`} />;
};

export const AcademicSection: React.FC<AcademicSectionProps> = ({ applications, onAddApp, onDeleteApp }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newUni, setNewUni] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUni.trim()) {
      onAddApp(newUni);
      setNewUni('');
      setIsAdding(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">
      {/* University Hub - Takes up 2 columns */}
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <GraduationCap size={20} className="text-indigo-400" />
            Applications Hub
          </h3>
          <button onClick={() => setIsAdding(!isAdding)} className="text-slate-500 hover:text-indigo-400">
            <Plus size={18} />
          </button>
        </div>

        {isAdding && (
          <form onSubmit={handleAdd} className="mb-4">
             <input 
                autoFocus
                className="bg-slate-800 text-sm text-white px-3 py-2 rounded w-full border border-slate-700 outline-none focus:border-indigo-500"
                placeholder="Nome da Universidade..."
                value={newUni}
                onChange={e => setNewUni(e.target.value)}
              />
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {applications.length === 0 && !isAdding && (
             <div className="col-span-2 text-center py-8 border-2 border-dashed border-slate-800 rounded-xl text-slate-600 text-sm">
                Nenhuma aplicação registrada. Adicione sua Dream School.
             </div>
          )}

          {applications.map((app) => (
            <div key={app.id} className="group relative bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl flex flex-col justify-between hover:border-slate-600 transition-colors">
              <button 
                onClick={() => onDeleteApp(app.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-opacity"
              >
                <Trash2 size={14} />
              </button>

              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide border ${
                  app.type === 'Reach' ? 'text-rose-300 border-rose-500/30 bg-rose-500/10' :
                  app.type === 'Target' ? 'text-blue-300 border-blue-500/30 bg-blue-500/10' :
                  'text-emerald-300 border-emerald-500/30 bg-emerald-500/10'
                }`}>
                  {app.type}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <AlertCircle size={10} /> {app.deadline}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-slate-200">{app.university}</h4>
                <div className="flex items-center gap-2 mt-2">
                  <StatusDot status={app.status} />
                  <span className="text-xs text-slate-400">{app.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Reading - Static for now but ready for dynamic */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center items-center text-center opacity-50 hover:opacity-100 transition-opacity">
        <BookOpen size={32} className="text-slate-700 mb-2" />
        <p className="text-sm text-slate-500">Área de Leitura (Em breve)</p>
      </div>
    </div>
  );
};