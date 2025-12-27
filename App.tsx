import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DailyFocus } from './components/DailyFocus';
import { TaskList } from './components/TaskList';
import { QuickAccess } from './components/QuickAccess';
import { ReadingTracker } from './components/ReadingTracker';
import { Task, QuickLink, Book, IconType } from './types';

// Helper to load data safely from localStorage
const loadState = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.warn(`Error loading ${key}:`, error);
    return fallback;
  }
};

const App: React.FC = () => {
  const [dailyFocus, setDailyFocus] = useState<string>(() => loadState('lifeos_focus', ''));
  const [tasks, setTasks] = useState<Task[]>(() => loadState('lifeos_tasks', []));
  const [book, setBook] = useState<Book | null>(() => loadState('lifeos_book', null));
  const [links, setLinks] = useState<QuickLink[]>(() => loadState('lifeos_links', []));

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };
  
  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };
  
  const addTask = (title: string, tag: Task['tag'], time: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      tag,
      time: time || undefined
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const reorderTasks = (dragIndex: number, hoverIndex: number) => {
    const newTasks = [...tasks];
    const dragTask = newTasks[dragIndex];
    newTasks.splice(dragIndex, 1);
    newTasks.splice(hoverIndex, 0, dragTask);
    setTasks(newTasks);
  };

  const addLink = (label: string, url: string, icon: IconType) => {
    setLinks(prev => [...prev, { id: Date.now().toString(), label, url, icon }]);
  };
  const deleteLink = (id: string) => setLinks(prev => prev.filter(l => l.id !== id));

  useEffect(() => localStorage.setItem('lifeos_focus', JSON.stringify(dailyFocus)), [dailyFocus]);
  useEffect(() => localStorage.setItem('lifeos_tasks', JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem('lifeos_book', JSON.stringify(book)), [book]);
  useEffect(() => localStorage.setItem('lifeos_links', JSON.stringify(links)), [links]);

  return (
    <div className="min-h-screen bg-vesper-bg text-vesper-text pb-12 selection:bg-vesper-gold selection:text-vesper-bg font-sans">
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <Header />
        
        <DailyFocus focus={dailyFocus} setFocus={setDailyFocus} />
        
        {/* Main Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Main Tasks Column - Wider */}
          <div className="md:col-span-2">
            <TaskList 
              tasks={tasks} 
              onToggle={toggleTask} 
              onDelete={deleteTask}
              onAdd={addTask}
              onReorder={reorderTasks}
            />
          </div>
          
          {/* Right Sidebar - Sticky maybe? */}
          <div className="md:col-span-1 flex flex-col gap-8">
            <ReadingTracker 
              book={book}
              onUpdateBook={setBook}
            />
          </div>
        </div>
        
        <QuickAccess 
          links={links}
          onAddLink={addLink}
          onDeleteLink={deleteLink}
        />
        
        <footer className="mt-20 text-center text-vesper-text opacity-30 text-[10px] font-mono">
          <p>SYSTEM.READY</p>
        </footer>
      </div>
    </div>
  );
};

export default App;