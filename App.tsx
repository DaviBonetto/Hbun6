import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { DailyFocus } from './components/DailyFocus';
import { TaskList } from './components/TaskList';
import { QuickAccess } from './components/QuickAccess';
import { ReadingTracker } from './components/ReadingTracker';
import { SyncSettings } from './components/SyncSettings';
import { Task, QuickLink, Book, IconType, CloudConfig } from './types';

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
  // Application Data
  const [dailyFocus, setDailyFocus] = useState<string>(() => loadState('lifeos_focus', ''));
  const [tasks, setTasks] = useState<Task[]>(() => loadState('lifeos_tasks', []));
  const [book, setBook] = useState<Book | null>(() => loadState('lifeos_book', null));
  const [links, setLinks] = useState<QuickLink[]>(() => loadState('lifeos_links', []));
  
  // Sync Configuration
  const [cloudConfig, setCloudConfig] = useState<CloudConfig | null>(() => loadState('lifeos_cloud_config', null));
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  // System status for auto-save feedback
  const [systemStatus, setSystemStatus] = useState<'READY' | 'SAVING' | 'SYNCING' | 'ERROR' | 'IMPORTED'>('READY');

  // --- Task Management Handlers ---
  
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

  // Dedicated Move Handlers for Mobile
  const moveTaskUp = (index: number) => {
    if (index === 0) return;
    reorderTasks(index, index - 1);
  };

  const moveTaskDown = (index: number) => {
    if (index === tasks.length - 1) return;
    reorderTasks(index, index + 1);
  };

  // --- Links & Book Handlers ---

  const addLink = (label: string, url: string, icon: IconType) => {
    setLinks(prev => [...prev, { id: Date.now().toString(), label, url, icon }]);
  };
  const deleteLink = (id: string) => setLinks(prev => prev.filter(l => l.id !== id));

  // --- File Import / Export Handlers ---

  const handleExportFile = () => {
    const data = {
      dailyFocus,
      tasks,
      book,
      links,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `life-os-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.dailyFocus !== undefined) setDailyFocus(json.dailyFocus);
        if (json.tasks) setTasks(json.tasks);
        if (json.book) setBook(json.book);
        if (json.links) setLinks(json.links);
        setSystemStatus('IMPORTED');
        setTimeout(() => setSystemStatus('READY'), 2000);
        setIsSettingsOpen(false);
      } catch (err) {
        console.error("Invalid backup file", err);
        setSystemStatus('ERROR');
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = ''; 
  };

  // --- Cloud Sync Logic (JSONBin.io) ---

  const saveToCloud = useCallback(async () => {
    if (!cloudConfig?.binId || !cloudConfig?.apiKey) return;
    
    setSystemStatus('SYNCING');
    try {
      const payload = { dailyFocus, tasks, book, links };
      
      const response = await fetch(`https://api.jsonbin.io/v3/b/${cloudConfig.binId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': cloudConfig.apiKey
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSystemStatus('READY');
        setLastSynced(new Date());
      } else {
        console.error("Sync failed");
        setSystemStatus('ERROR');
      }
    } catch (e) {
      console.error(e);
      setSystemStatus('ERROR');
    }
  }, [cloudConfig, dailyFocus, tasks, book, links]);

  const loadFromCloud = useCallback(async () => {
    if (!cloudConfig?.binId || !cloudConfig?.apiKey) return;

    setSystemStatus('SYNCING');
    try {
      const response = await fetch(`https://api.jsonbin.io/v3/b/${cloudConfig.binId}/latest`, {
        method: 'GET',
        headers: {
          'X-Master-Key': cloudConfig.apiKey
        }
      });

      if (response.ok) {
        const json = await response.json();
        const data = json.record;
        
        if (data) {
          if (data.dailyFocus) setDailyFocus(data.dailyFocus);
          if (data.tasks) setTasks(data.tasks);
          if (data.book) setBook(data.book);
          if (data.links) setLinks(data.links);
          setLastSynced(new Date());
          setSystemStatus('READY');
        }
      } else {
        setSystemStatus('ERROR');
      }
    } catch (e) {
      console.error(e);
      setSystemStatus('ERROR');
    }
  }, [cloudConfig]);

  // --- Effects ---

  // 1. Initial Load from Cloud (Run once when config is loaded, if config exists)
  useEffect(() => {
    if (cloudConfig) {
      loadFromCloud();
    }
  }, [cloudConfig?.binId]); 

  // 2. Auto-save to LocalStorage (Instant) - Always runs
  useEffect(() => {
    setSystemStatus('SAVING');
    localStorage.setItem('lifeos_focus', JSON.stringify(dailyFocus));
    localStorage.setItem('lifeos_tasks', JSON.stringify(tasks));
    localStorage.setItem('lifeos_book', JSON.stringify(book));
    localStorage.setItem('lifeos_links', JSON.stringify(links));
    const timer = setTimeout(() => setSystemStatus('READY'), 500);
    return () => clearTimeout(timer);
  }, [dailyFocus, tasks, book, links]);

  // 3. Debounced Auto-save to Cloud (ONLY IF AUTO-SYNC IS ON)
  useEffect(() => {
    if (!cloudConfig || !cloudConfig.autoSync) return; // Exit if not configured or auto-sync disabled
    
    const timer = setTimeout(() => {
      saveToCloud();
    }, 5000); // 5-second debounce for cloud
    return () => clearTimeout(timer);
  }, [dailyFocus, tasks, book, links, cloudConfig, saveToCloud]);

  return (
    <div className="min-h-screen bg-vesper-bg text-vesper-text pb-12 selection:bg-vesper-gold selection:text-vesper-bg font-sans">
      <SyncSettings 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        config={cloudConfig}
        onSaveConfig={(cfg) => {
          setCloudConfig(cfg);
          localStorage.setItem('lifeos_cloud_config', JSON.stringify(cfg));
          // If turning ON auto-sync or changing keys, try to load
          if (cfg.apiKey !== cloudConfig?.apiKey) {
             setTimeout(loadFromCloud, 100);
          }
        }}
        onForceLoad={loadFromCloud}
        onForceSave={saveToCloud}
        onExportFile={handleExportFile}
        onImportFile={handleImportFile}
        lastSynced={lastSynced}
      />

      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <Header 
            onOpenSettings={() => setIsSettingsOpen(true)} 
            isSynced={!!cloudConfig}
        />
        
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
              onMoveUp={moveTaskUp}
              onMoveDown={moveTaskDown}
            />
          </div>
          
          {/* Right Sidebar */}
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
        
        <footer className="mt-20 flex justify-center">
          <div className="text-center">
            <p className={`text-[10px] font-mono transition-colors duration-300 ${
              systemStatus === 'SAVING' || systemStatus === 'SYNCING' ? 'text-vesper-gold' : 
              systemStatus === 'ERROR' ? 'text-vesper-red' : 
              systemStatus === 'IMPORTED' ? 'text-vesper-green' : 'text-vesper-text opacity-30'
            }`}>
              SYSTEM.{systemStatus} {lastSynced && systemStatus === 'READY' && `(Synced: ${lastSynced.toLocaleTimeString()})`}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;