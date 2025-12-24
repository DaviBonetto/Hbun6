import React, { useState } from 'react';
import { QuickLink, IconType } from '../types';
import { ExternalLink, Plus, Trash2, Link, Database, FileText, Youtube, Code, Layout } from 'lucide-react';

interface QuickAccessProps {
  links: QuickLink[];
  onAddLink: (label: string, url: string, icon: IconType) => void;
  onDeleteLink: (id: string) => void;
}

const ICONS: Record<IconType, React.ReactNode> = {
  Link: <Link size={14} />,
  Notion: <Database size={14} />,
  Google: <FileText size={14} />,
  YouTube: <Youtube size={14} />,
  Code: <Code size={14} />,
  Figma: <Layout size={14} />,
};

export const QuickAccess: React.FC<QuickAccessProps> = ({ links, onAddLink, onDeleteLink }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ label: '', url: '', icon: 'Link' as IconType });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.label.trim() && form.url.trim()) {
      onAddLink(form.label, form.url, form.icon);
      setForm({ label: '', url: '', icon: 'Link' });
      setIsAdding(false);
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-slate-800/50 animate-slide-up">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Acesso Rápido</h3>
        <button onClick={() => setIsAdding(!isAdding)} className="text-slate-600 hover:text-white transition-colors">
          {isAdding ? 'Cancelar' : <Plus size={16} />}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="mb-6 bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row gap-2">
          <div className="flex-1">
            <input 
              placeholder="Nome (ex: Notion)"
              value={form.label}
              onChange={e => setForm({...form, label: e.target.value})}
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex-[2]">
             <input 
              placeholder="URL (https://...)"
              value={form.url}
              onChange={e => setForm({...form, url: e.target.value})}
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white outline-none focus:border-indigo-500"
            />
          </div>
          <div className="w-full md:w-32">
             <select 
                value={form.icon}
                onChange={e => setForm({...form, icon: e.target.value as IconType})}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white outline-none"
             >
                <option value="Link">Link Geral</option>
                <option value="Notion">Notion</option>
                <option value="Google">Docs/Drive</option>
                <option value="YouTube">YouTube</option>
                <option value="Figma">Figma/Design</option>
                <option value="Code">Dev/Github</option>
             </select>
          </div>
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-xs font-bold transition-colors">
            Adicionar
          </button>
        </form>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {links.length === 0 && !isAdding && (
          <span className="col-span-full text-xs text-slate-700 italic text-center py-4">Adicione links para seus hubs de estudo.</span>
        )}

        {links.map((link) => (
          <div key={link.id} className="relative group">
            <a 
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-2 px-4 py-4 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-600 hover:-translate-y-1 transition-all duration-200 h-24"
            >
              <div className={`p-2 rounded-full bg-slate-950 ${
                link.icon === 'Notion' ? 'text-slate-200' :
                link.icon === 'YouTube' ? 'text-red-400' :
                link.icon === 'Google' ? 'text-blue-400' :
                link.icon === 'Code' ? 'text-emerald-400' :
                link.icon === 'Figma' ? 'text-purple-400' :
                'text-indigo-400'
              }`}>
                 {ICONS[link.icon]}
              </div>
              <span className="text-xs font-medium truncate max-w-full">{link.label}</span>
            </a>
            <button 
              onClick={(e) => {
                e.preventDefault();
                onDeleteLink(link.id);
              }}
              className="absolute -top-2 -right-2 bg-slate-950 border border-slate-700 rounded-full p-1.5 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all shadow-lg z-10 cursor-pointer"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};