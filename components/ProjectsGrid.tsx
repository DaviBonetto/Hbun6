import React, { useState } from 'react';
import { Project } from '../types';
import { FolderGit2, Plus, Trash2, PlayCircle, PauseCircle, CheckCircle } from 'lucide-react';

interface ProjectsGridProps {
  projects: Project[];
  onAddProject: (title: string) => void;
  onDeleteProject: (id: string) => void;
  onUpdateProgress: (id: string, progress: number) => void;
  onToggleStatus: (id: string) => void;
}

export const ProjectsGrid: React.FC<ProjectsGridProps> = ({ 
    projects, 
    onAddProject, 
    onDeleteProject, 
    onUpdateProgress,
    onToggleStatus 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      onAddProject(newTitle);
      setNewTitle('');
      setIsAdding(false);
    }
  };

  const getStatusColor = (status: Project['status']) => {
      switch(status) {
          case 'Active': return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
          case 'Paused': return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
          case 'Done': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      }
  };

  const getStatusIcon = (status: Project['status']) => {
      switch(status) {
          case 'Active': return <PlayCircle size={10} className="mr-1" />;
          case 'Paused': return <PauseCircle size={10} className="mr-1" />;
          case 'Done': return <CheckCircle size={10} className="mr-1" />;
      }
  };

  return (
    <div className="animate-slide-up mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <FolderGit2 size={20} className="text-purple-400" />
          Projetos Ativos
        </h3>
        <button onClick={() => setIsAdding(!isAdding)} className="text-slate-500 hover:text-purple-400 transition-colors">
           {isAdding ? 'Cancelar' : <Plus size={20} />}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="mb-4">
          <input 
            autoFocus
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 outline-none focus:border-purple-500"
            placeholder="Nome do Projeto..."
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
          />
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.length === 0 && !isAdding && (
          <div className="col-span-full text-center py-10 border-2 border-dashed border-slate-800 rounded-2xl text-slate-600">
             Sem projetos ativos. Inicie algo novo.
          </div>
        )}

        {projects.map((project) => (
          <div key={project.id} className={`bg-slate-900 border p-5 rounded-2xl transition-all group relative ${project.status === 'Done' ? 'border-slate-800 opacity-60' : 'border-slate-800 hover:border-purple-500/30'}`}>
             <button 
                onClick={() => onDeleteProject(project.id)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 z-10 p-2 bg-slate-950 rounded-full transition-all"
              >
                <Trash2 size={14} />
              </button>
            
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${project.status === 'Active' ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-800 text-slate-500'}`}>
                <FolderGit2 size={20} />
              </div>
            </div>

            <h4 className={`font-semibold text-slate-200 mb-2 truncate pr-8 ${project.status === 'Done' ? 'line-through text-slate-500' : ''}`}>{project.title}</h4>
            
            <button 
                onClick={() => onToggleStatus(project.id)}
                className={`flex items-center text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded border hover:opacity-80 transition-opacity ${getStatusColor(project.status)}`}
            >
              {getStatusIcon(project.status)}
              {project.status === 'Active' ? 'Em andamento' : project.status === 'Paused' ? 'Pausado' : 'Concluído'}
            </button>

            <div className="mt-4">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Progresso</span>
                <span>{project.progress}%</span>
              </div>
              
              {/* Progress Slider */}
              <div className="relative h-4 w-full flex items-center">
                  <div className="w-full bg-slate-800 rounded-full h-1.5 absolute">
                    <div 
                      className={`h-1.5 rounded-full transition-all ${
                          project.status === 'Done' ? 'bg-emerald-500' : 
                          project.status === 'Paused' ? 'bg-amber-500' : 'bg-purple-500'
                        }`} 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    disabled={project.status === 'Done'}
                    value={project.progress}
                    onChange={(e) => onUpdateProgress(project.id, parseInt(e.target.value))}
                    className={`absolute top-0 left-0 w-full h-full opacity-0 z-20 ${project.status !== 'Done' ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                    title={project.status === 'Done' ? 'Concluído' : 'Ajustar progresso'}
                  />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};