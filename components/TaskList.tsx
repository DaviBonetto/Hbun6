import React, { useState } from 'react';
import { Task } from '../types';
import { Trash2, GripVertical, Square, CheckSquare, ChevronUp, ChevronDown } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: (title: string, tag: Task['tag'], time: string) => void;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

// Vesper color mapping for tags
const TagIndicator: React.FC<{ tag: Task['tag'] }> = ({ tag }) => {
  const colors = {
    Study: 'bg-vesper-gold shadow-[0_0_8px_rgba(255,207,168,0.3)]', // Gold
    Work: 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.3)]',     // Blue
    Health: 'bg-vesper-green shadow-[0_0_8px_rgba(152,195,121,0.3)]', // Green
    Life: 'bg-vesper-purple shadow-[0_0_8px_rgba(160,160,229,0.3)]',  // Purple
  };

  return (
    <div className={`w-1.5 h-1.5 rounded-full ${colors[tag]} opacity-80`} title={tag} />
  );
};

export const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle, onDelete, onAdd, onReorder, onMoveUp, onMoveDown }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTag, setNewTaskTag] = useState<Task['tag']>('Study');
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      onAdd(newTaskTitle, newTaskTag, '');
      setNewTaskTitle('');
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    onReorder(draggedItemIndex, index);
    setDraggedItemIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };

  return (
    <div className="flex flex-col h-full animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-mono text-vesper-text uppercase tracking-widest">Tasks.json</span>
        <span className="text-xs font-mono text-vesper-text opacity-40">
           {tasks.filter(t => t.completed).length}/{tasks.length} Done
        </span>
      </div>

      {/* Input Line */}
      <form onSubmit={handleAdd} className="group relative mb-8 flex items-center gap-3 border-b border-vesper-border pb-2 focus-within:border-vesper-gold transition-colors">
        <span className="text-vesper-text opacity-50 group-focus-within:text-vesper-gold transition-colors font-mono text-sm">{`>`}</span>
        <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add new task..."
            className="flex-1 bg-transparent text-sm text-vesper-title placeholder-vesper-text/30 focus:outline-none"
        />
        
        {/* Minimal Tag Selector */}
        <select 
            value={newTaskTag}
            onChange={(e) => setNewTaskTag(e.target.value as Task['tag'])}
            className="bg-transparent text-[10px] font-mono uppercase text-vesper-text/60 focus:text-vesper-gold focus:outline-none cursor-pointer hover:text-vesper-title transition-colors"
        >
            <option value="Study">Study</option>
            <option value="Work">Work</option>
            <option value="Health">Health</option>
            <option value="Life">Life</option>
        </select>
        <button type="submit" className="hidden">Add</button>
      </form>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar pr-2">
        {tasks.length === 0 && (
            <div className="py-10 text-center opacity-30 text-sm font-mono text-vesper-text">
               // No active tasks
            </div>
        )}

        {tasks.map((task, index) => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`group flex items-center gap-3 py-3 px-2 rounded hover:bg-vesper-surface transition-all duration-200 ${draggedItemIndex === index ? 'opacity-50' : ''}`}
          >
            {/* Desktop Drag Handle */}
            <div className="cursor-grab opacity-0 group-hover:opacity-20 hover:!opacity-100 transition-opacity hidden md:block">
                <GripVertical size={12} className="text-vesper-text" />
            </div>

            {/* Mobile/Easy Sort Buttons - Visible on group hover or always on touch */}
            <div className="flex flex-col gap-0.5 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button onClick={() => onMoveUp(index)} disabled={index === 0} className="text-vesper-text/40 hover:text-vesper-gold disabled:opacity-0">
                    <ChevronUp size={10} />
                </button>
                <button onClick={() => onMoveDown(index)} disabled={index === tasks.length - 1} className="text-vesper-text/40 hover:text-vesper-gold disabled:opacity-0">
                    <ChevronDown size={10} />
                </button>
            </div>

            {/* Checkbox */}
            <button 
              onClick={() => onToggle(task.id)}
              className={`transition-colors duration-200 ${task.completed ? 'text-vesper-text opacity-40' : 'text-vesper-text hover:text-vesper-gold'}`}
            >
              {task.completed ? <CheckSquare size={16} /> : <Square size={16} />}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0 flex items-center justify-between group/text">
              <span className={`text-sm transition-all font-light truncate mr-4 ${
                  task.completed ? 'text-vesper-text opacity-30 line-through decoration-vesper-border' : 'text-vesper-title'
              }`}>
                {task.title}
              </span>
              
              <div className="flex items-center gap-3">
                 <TagIndicator tag={task.tag} />
                 <button 
                    onClick={() => onDelete(task.id)}
                    className="opacity-100 md:opacity-0 md:group-hover:opacity-100 text-vesper-text hover:text-vesper-red transition-all"
                 >
                    <Trash2 size={12} />
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};