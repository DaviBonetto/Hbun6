import React, { useState } from 'react';
import { QuickLink, IconType } from '../types';
import { Plus, Trash2, Link, Database, FileText, Youtube, Code, Layout } from 'lucide-react';

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
    <div className="mt-16 animate-slide-up">
      <div className="flex items-center gap-4 mb-6">
        <h3 className="text-xs font-mono text-vesper-text uppercase tracking-widest opacity-60">Resources</h3>
        <div className="h-[1px] flex-1 bg-vesper-border opacity-50"></div>
        <button 
            onClick={() => setIsAdding(!isAdding)} 
            className="text-vesper-text hover:text-vesper-gold transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="mb-6 flex flex-wrap gap-2 bg-vesper-surface p-4 rounded border border-vesper-border">
          <input 
            placeholder="Label"
            value={form.label}
            onChange={e => setForm({...form, label: e.target.value})}
            className="bg-vesper-bg border border-vesper-border rounded px-3 py-1.5 text-xs text-vesper-title focus:outline-none focus:border-vesper-gold"
          />
           <input 
            placeholder="https://..."
            value={form.url}
            onChange={e => setForm({...form, url: e.target.value})}
            className="flex-1 bg-vesper-bg border border-vesper-border rounded px-3 py-1.5 text-xs text-vesper-title focus:outline-none focus:border-vesper-gold"
          />
           <select 
                value={form.icon}
                onChange={e => setForm({...form, icon: e.target.value as IconType})}
                className="bg-vesper-bg border border-vesper-border rounded px-3 py-1.5 text-xs text-vesper-text focus:outline-none"
             >
                <option value="Link">Link</option>
                <option value="Notion">Notion</option>
                <option value="Google">Google</option>
                <option value="YouTube">YT</option>
                <option value="Code">Code</option>
             </select>
          <button type="submit" className="text-xs font-mono bg-vesper-border hover:bg-vesper-gold hover:text-vesper-bg px-3 py-1.5 rounded transition-colors">
            ADD
          </button>
        </form>
      )}

      <div className="flex flex-wrap gap-3">
        {links.map((link) => (
          <div key={link.id} className="relative group">
            <a 
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3 py-2 bg-vesper-surface border border-vesper-border rounded text-xs text-vesper-text hover:text-vesper-gold hover:border-vesper-gold/30 transition-all duration-200"
            >
              <span className="opacity-70">{ICONS[link.icon]}</span>
              <span className="font-medium">{link.label}</span>
            </a>
            <button 
              onClick={(e) => { e.preventDefault(); onDeleteLink(link.id); }}
              className="absolute -top-1.5 -right-1.5 bg-vesper-bg border border-vesper-border rounded-full p-1 text-vesper-text hover:text-vesper-red opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 size={10} />
            </button>
          </div>
        ))}
        {links.length === 0 && !isAdding && (
             <span className="text-xs text-vesper-text opacity-20 font-mono">// No links added</span>
        )}
      </div>
    </div>
  );
};