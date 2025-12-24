import React, { useState } from 'react';
import { Book as BookIcon, Edit3, Trash2, Plus, Minus, ChevronRight } from 'lucide-react';
import { Book } from '../types';

interface ReadingTrackerProps {
  book: Book | null;
  onUpdateBook: (book: Book | null) => void;
}

export const ReadingTracker: React.FC<ReadingTrackerProps> = ({ book, onUpdateBook }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Book>({
    title: '',
    author: '',
    currentPage: 0,
    totalPages: 0
  });

  const startEditing = () => {
    if (book) setEditForm(book);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editForm.title && editForm.totalPages > 0) {
      onUpdateBook(editForm);
      setIsEditing(false);
    }
  };

  const updatePage = (amount: number) => {
    if (!book) return;
    const newPage = Math.min(Math.max(0, book.currentPage + amount), book.totalPages);
    onUpdateBook({ ...book, currentPage: newPage });
  };

  const handleManualPageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      if(!book) return;
      const val = parseInt(e.target.value);
      if(!isNaN(val)) {
          const newPage = Math.min(Math.max(0, val), book.totalPages);
          onUpdateBook({ ...book, currentPage: newPage });
      }
  }

  const calculateProgress = () => {
    if (!book || book.totalPages === 0) return 0;
    return Math.round((book.currentPage / book.totalPages) * 100);
  };

  // Empty State
  if (!book && !isEditing) {
    return (
      <div 
        onClick={() => setIsEditing(true)}
        className="bg-slate-900/50 border border-slate-800 hover:border-indigo-500/30 rounded-2xl h-full flex items-center justify-center cursor-pointer transition-all animate-slide-up group min-h-[140px]"
      >
        <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                <Plus size={20} />
            </div>
            <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200">Leitura Atual</span>
        </div>
      </div>
    );
  }

  // Edit Mode
  if (isEditing) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 h-full animate-slide-up min-h-[140px]">
        <div className="space-y-2">
          <input
            className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-white text-xs focus:border-indigo-500 outline-none"
            placeholder="Título"
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            autoFocus
          />
          <input
            className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-white text-xs focus:border-indigo-500 outline-none"
            placeholder="Autor"
            value={editForm.author}
            onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
          />
          <div className="flex gap-2">
             <input
                type="number"
                placeholder="Pág Atual"
                className="w-1/2 bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-white text-xs outline-none"
                value={editForm.currentPage || ''}
                onChange={(e) => setEditForm({ ...editForm, currentPage: parseInt(e.target.value) || 0 })}
            />
            <input
                type="number"
                placeholder="Total Pág"
                className="w-1/2 bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-white text-xs outline-none"
                value={editForm.totalPages || ''}
                onChange={(e) => setEditForm({ ...editForm, totalPages: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="flex gap-2 pt-1">
             <button onClick={handleSave} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-1 rounded text-[10px] font-bold uppercase transition-colors">Salvar</button>
             <button onClick={() => setIsEditing(false)} className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 py-1 rounded text-[10px] font-bold uppercase transition-colors">Cancelar</button>
          </div>
        </div>
      </div>
    );
  }

  // Compact View Mode
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 h-full flex flex-col justify-between relative group min-h-[140px]">
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button onClick={startEditing} className="p-1 text-slate-500 hover:text-indigo-400 hover:bg-slate-800 rounded"><Edit3 size={12} /></button>
            <button onClick={() => onUpdateBook(null)} className="p-1 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded"><Trash2 size={12} /></button>
        </div>

        <div className="flex gap-3">
            <div className="w-12 h-16 bg-slate-800 rounded border border-slate-700 flex items-center justify-center shrink-0">
                <BookIcon size={18} className="text-indigo-400/50" />
            </div>
            <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-slate-100 truncate">{book?.title}</h3>
                <p className="text-[10px] text-slate-500 truncate">{book?.author}</p>
                <div className="mt-2 flex items-center gap-2">
                     <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                            style={{ width: `${calculateProgress()}%` }}
                        />
                     </div>
                     <span className="text-xs font-bold text-indigo-400">{calculateProgress()}%</span>
                </div>
            </div>
        </div>

        <div className="mt-3 bg-slate-950/50 rounded-lg p-2 border border-slate-800 flex items-center justify-between">
             <button 
                onClick={() => updatePage(-1)}
                className="w-6 h-6 flex items-center justify-center rounded bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
             >
                <Minus size={12} />
             </button>
             
             <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Pág</span>
                <input 
                    type="number" 
                    value={book?.currentPage} 
                    onChange={handleManualPageInput}
                    className="w-10 bg-transparent text-center text-sm font-bold text-white outline-none border-b border-transparent focus:border-indigo-500 transition-colors p-0"
                />
                <span className="text-[10px] text-slate-600">/ {book?.totalPages}</span>
             </div>

             <button 
                onClick={() => updatePage(1)}
                className="w-6 h-6 flex items-center justify-center rounded bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
             >
                <Plus size={12} />
             </button>
        </div>
    </div>
  );
};