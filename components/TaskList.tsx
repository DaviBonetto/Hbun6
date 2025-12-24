import React, { useState, useRef } from 'react';
import { Task } from '../types';
import { Circle, CheckCircle2, Trash2, Plus, GripVertical, Check } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: (title: string, tag: Task['tag'], time: string) => void;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
}

const TagBadge: React.FC<{ tag: Task['tag'] }> = ({ tag }) => {
  const colors = {
    Study: 'text-indigo-300 bg-indigo-500/20 border-indigo-500/30',
    Health: 'text-emerald-300 bg-emerald-500/20 border-emerald-500/30',
    Life: 'text-slate-300 bg-slate-500/20 border-slate-500/30',
    Work: 'text-amber-300 bg-amber-500/20 border-amber-500/30',
  };

  return (
    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${colors[tag]}`}>
      {tag}
    </span>
  );
};

export const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle, onDelete, onAdd, onReorder }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [newTaskTag, setNewTaskTag] = useState<Task['tag']>('Study');
  
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      onAdd(newTaskTitle, newTaskTag, newTaskTime);
      setNewTaskTitle('');
      setNewTaskTime('');
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragItem.current = index;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      onReorder(dragItem.current, dragOverItem.current);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  // Progress Calculation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-full flex flex-col animate-slide-up min-h-[500px] shadow-xl shadow-black/20">
      
      {/* Header & Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-4">
            <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Agenda de Hoje</h3>
                <p className="text-sm text-slate-500 mt-1">Foco total na execução diária.</p>
            </div>
            <div className="text-right">
                <span className="text-3xl font-light text-indigo-400">{progress}%</span>
            </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
                className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
      </div>

      {/* Input Area */}
      <form onSubmit={handleAdd} className="mb-6 bg-slate-950 p-2 rounded-2xl border border-slate-800 flex items-center gap-2 shadow-inner">
        <div className="flex-1 px-3">
             <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Adicionar nova tarefa..."
                className="w-full bg-transparent text-sm text-white placeholder-slate-600 outline-none h-10"
            />
        </div>
        
        <div className="h-8 w-[1px] bg-slate-800"></div>

        <input 
            value={newTaskTime}
            onChange={(e) => setNewTaskTime(e.target.value)}
            placeholder="00:00"
            className="bg-transparent text-xs text-slate-400 placeholder-slate-700 outline-none w-12 text-center"
        />

        <div className="h-8 w-[1px] bg-slate-800"></div>

        <select 
            value={newTaskTag}
            onChange={(e) => setNewTaskTag(e.target.value as Task['tag'])}
            className="bg-transparent text-xs text-slate-400 font-medium outline-none cursor-pointer hover:text-white transition-colors"
        >
            <option value="Study">Study</option>
            <option value="Work">Work</option>
            <option value="Health">Health</option>
            <option value="Life">Life</option>
        </select>

        <button 
            type="submit" 
            className="w-10 h-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center transition-colors shadow-lg shadow-indigo-500/20"
        >
            <Plus size={18} />
        </button>
      </form>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-3">
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-slate-600">
            <CheckCircle2 size={32} className="mb-3 opacity-20" />
            <p className="text-sm">Lista vazia. Comece seu dia.</p>
          </div>
        )}

        {tasks.map((task, index) => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => e.preventDefault()}
            className={`group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-grab active:cursor-grabbing ${
              task.completed
                ? 'bg-slate-900 border-transparent opacity-40'
                : 'bg-slate-800/40 border-slate-800 hover:border-indigo-500/30 hover:bg-slate-800/60'
            }`}
          >
            {/* Drag Handle */}
            <div className="text-slate-700 opacity-0 group-hover:opacity-100 cursor-grab transition-opacity -ml-1">
               <GripVertical size={14} />
            </div>

            <button 
              onClick={() => onToggle(task.id)}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  task.completed 
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-500' 
                    : 'border-slate-600 text-transparent hover:border-indigo-400'
              }`}
            >
              <Check size={12} strokeWidth={4} />
            </button>
            
            <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
              <div className="flex flex-col">
                  <span className={`text-sm font-medium leading-tight transition-all ${task.completed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                    {task.title}
                  </span>
                  {task.time && (
                      <span className="text-[10px] text-slate-500 mt-0.5">{task.time}</span>
                  )}
              </div>
              <TagBadge tag={task.tag} />
            </div>

            <button 
               onClick={() => onDelete(task.id)}
               className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 p-2 hover:bg-slate-900 rounded-lg transition-all"
            >
               <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};