import React, { useState } from 'react';
    import { BookOpen, Edit2, X, Check } from 'lucide-react';
    import { Book } from '../types';
    
    interface ReadingTrackerProps {
      book: Book | null;
      onUpdateBook: (book: Book | null) => void;
    }
    
    export const ReadingTracker: React.FC<ReadingTrackerProps> = ({ book, onUpdateBook }) => {
      const [isEditing, setIsEditing] = useState(false);
      const [editForm, setEditForm] = useState<Book>({ title: '', author: '', currentPage: 0, totalPages: 0 });
    
      const startEditing = () => {
        if (book) setEditForm(book);
        setIsEditing(true);
      };
    
      const handleSave = () => {
        if (editForm.title) {
          onUpdateBook(editForm);
          setIsEditing(false);
        }
      };
    
      const calculateProgress = () => {
        if (!book || book.totalPages === 0) return 0;
        return Math.min(100, Math.round((book.currentPage / book.totalPages) * 100));
      };
    
      // Empty State
      if (!book && !isEditing) {
        return (
          <div 
            onClick={() => setIsEditing(true)}
            className="h-full min-h-[140px] border border-dashed border-vesper-border rounded-lg flex items-center justify-center cursor-pointer hover:border-vesper-gold/50 transition-colors group animate-slide-up"
          >
            <span className="text-xs font-mono text-vesper-text opacity-50 group-hover:text-vesper-gold transition-colors">
                + Add Current Read
            </span>
          </div>
        );
      }
    
      // Edit Mode
      if (isEditing) {
        return (
          <div className="bg-vesper-surface border border-vesper-border rounded-lg p-5 animate-slide-up">
            <div className="flex flex-col gap-3">
               <input
                  className="bg-transparent border-b border-vesper-border pb-1 text-sm text-vesper-title focus:border-vesper-gold focus:outline-none placeholder-vesper-text/30"
                  placeholder="Book Title"
                  value={editForm.title}
                  onChange={e => setEditForm({...editForm, title: e.target.value})}
                  autoFocus
               />
               <input
                  className="bg-transparent border-b border-vesper-border pb-1 text-xs text-vesper-text focus:border-vesper-gold focus:outline-none placeholder-vesper-text/30"
                  placeholder="Author"
                  value={editForm.author}
                  onChange={e => setEditForm({...editForm, author: e.target.value})}
               />
               <div className="flex gap-4 pt-2">
                 <div className="flex-1">
                     <label className="text-[9px] font-mono text-vesper-text uppercase opacity-60">Current</label>
                     <input
                        type="number"
                        className="w-full bg-vesper-bg rounded px-2 py-1 text-xs text-vesper-title focus:outline-none focus:ring-1 ring-vesper-gold/50"
                        value={editForm.currentPage || ''}
                        onChange={e => setEditForm({...editForm, currentPage: parseInt(e.target.value) || 0})}
                     />
                 </div>
                 <div className="flex-1">
                    <label className="text-[9px] font-mono text-vesper-text uppercase opacity-60">Total</label>
                     <input
                        type="number"
                        className="w-full bg-vesper-bg rounded px-2 py-1 text-xs text-vesper-title focus:outline-none focus:ring-1 ring-vesper-gold/50"
                        value={editForm.totalPages || ''}
                        onChange={e => setEditForm({...editForm, totalPages: parseInt(e.target.value) || 0})}
                     />
                 </div>
               </div>
               <div className="flex justify-end gap-2 mt-2">
                  <button onClick={() => setIsEditing(false)} className="p-1 hover:text-vesper-red"><X size={14}/></button>
                  <button onClick={handleSave} className="p-1 hover:text-vesper-green"><Check size={14}/></button>
               </div>
            </div>
          </div>
        );
      }
    
      // View Mode
      return (
        <div className="bg-vesper-surface border border-vesper-border rounded-lg p-5 relative group h-full flex flex-col justify-between animate-slide-up hover:border-vesper-border/80 transition-colors">
            {/* Minimal Header */}
            <div className="flex justify-between items-start">
               <div className="flex items-center gap-2 text-vesper-gold opacity-80 mb-1">
                  <BookOpen size={14} />
                  <span className="text-[10px] font-mono uppercase tracking-widest">Reading</span>
               </div>
               <button 
                  onClick={startEditing} 
                  className="text-vesper-text opacity-0 group-hover:opacity-100 hover:text-vesper-gold transition-all"
                >
                  <Edit2 size={12} />
               </button>
            </div>
    
            <div className="mt-2">
                <h3 className="text-lg font-medium text-vesper-title leading-tight">{book?.title}</h3>
                <p className="text-sm text-vesper-text opacity-60 mt-0.5">{book?.author}</p>
            </div>
    
            <div className="mt-6">
                <div className="flex justify-between items-end text-xs font-mono text-vesper-text mb-2">
                    <span className="opacity-50">Progress</span>
                    <span>
                        <span className="text-vesper-title">{book?.currentPage}</span>
                        <span className="opacity-40"> / {book?.totalPages}</span>
                    </span>
                </div>
                {/* Thin Progress Line */}
                <div className="h-[2px] w-full bg-vesper-border rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-vesper-gold opacity-80"
                        style={{ width: `${calculateProgress()}%` }}
                    />
                </div>
            </div>
        </div>
      );
    };