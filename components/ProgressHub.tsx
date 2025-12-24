import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';
import { Activity, Flame, Trophy, Plus, Trash2, Edit2 } from 'lucide-react';
import { Habit, WeeklyMetric } from '../types';

interface ProgressHubProps {
  habits: Habit[];
  weeklyData: WeeklyMetric[];
  onAddHabit: (name: string) => void;
  onDeleteHabit: (id: string) => void;
  onUpdateHabitValue: (id: string, value: number) => void;
}

export const ProgressHub: React.FC<ProgressHubProps> = ({ 
  habits, 
  weeklyData, 
  onAddHabit, 
  onDeleteHabit,
  onUpdateHabitValue
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabitName.trim()) {
      onAddHabit(newHabitName);
      setNewHabitName('');
      setIsAdding(false);
    }
  };

  // Calculate consistency based on habits avg
  const todayConsistency = habits.length > 0 
    ? Math.round(habits.reduce((acc, h) => acc + h.value, 0) / habits.length)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up h-full">
      {/* Chart 1: Daily Performance Trend */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between min-h-[180px]">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Activity size={16} className="text-indigo-400" />
              Consistência
            </h3>
            <p className="text-xs text-slate-500 mt-1">Hoje</p>
          </div>
          <span className="text-2xl font-bold text-white">{todayConsistency}%</span>
        </div>
        
        <div className="h-24 w-full mt-auto">
          {weeklyData.length > 0 ? (
             <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={weeklyData}>
               <defs>
                 <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                   <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <Tooltip 
                  cursor={false} 
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }} 
                  itemStyle={{ color: '#818cf8' }}
               />
               <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#6366f1" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                  isAnimationActive={true}
                />
             </AreaChart>
           </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-slate-600 border border-dashed border-slate-800 rounded">
              Sem dados semanais
            </div>
          )}
        </div>
      </div>

      {/* Chart 2: Habit Streaks (Editable) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col min-h-[180px]">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Flame size={16} className="text-orange-500" />
              Hábitos
            </h3>
          </div>
          <button onClick={() => setIsAdding(!isAdding)} className="text-slate-500 hover:text-orange-400">
            <Plus size={16} />
          </button>
        </div>

        {isAdding && (
           <form onSubmit={handleAdd} className="mb-2 flex gap-2">
              <input 
                autoFocus
                className="bg-slate-800 text-xs text-white px-2 py-1 rounded w-full border border-slate-700 outline-none"
                placeholder="Novo hábito"
                value={newHabitName}
                onChange={e => setNewHabitName(e.target.value)}
              />
           </form>
        )}

        <div className="flex-1 flex items-end justify-between gap-2 overflow-x-auto pb-1 relative">
            {habits.length === 0 && !isAdding && (
               <div className="w-full text-center text-xs text-slate-600 mt-4">Adicione hábitos</div>
            )}

            {habits.map((habit) => (
                <div key={habit.id} className="group relative flex flex-col items-center gap-2 w-full h-full justify-end">
                     
                     {/* Hover Controls */}
                     <div className="absolute -top-8 hidden group-hover:flex gap-1 bg-slate-800 p-1 rounded z-20">
                        <button onClick={() => onDeleteHabit(habit.id)} className="text-red-400 p-1"><Trash2 size={10} /></button>
                     </div>

                     {/* Bar Container - Fixed height relative to parent */}
                     <div className="w-full h-20 bg-slate-800/50 rounded-lg relative overflow-hidden cursor-pointer hover:bg-slate-800 transition-colors">
                        {/* Clickable areas for basic editing (0, 50, 100 approx) */}
                        <div className="absolute inset-0 z-10 flex flex-col">
                           <div className="flex-1 hover:bg-white/5" onClick={() => onUpdateHabitValue(habit.id, 100)} title="100%"></div>
                           <div className="flex-1 hover:bg-white/5" onClick={() => onUpdateHabitValue(habit.id, 50)} title="50%"></div>
                           <div className="flex-1 hover:bg-white/5" onClick={() => onUpdateHabitValue(habit.id, 0)} title="0%"></div>
                        </div>
                        
                        {/* Actual Bar */}
                        <div 
                            className="absolute bottom-0 left-0 w-full transition-all duration-500 ease-out"
                            style={{ height: `${habit.value}%`, backgroundColor: habit.color, opacity: 0.9 }}
                        ></div>
                     </div>
                     <span className="text-[9px] md:text-[10px] text-slate-400 font-medium truncate w-full text-center">{habit.name}</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};