import React, { useState, useRef } from 'react';
import { CloudConfig } from '../types';
import { Cloud, X, ExternalLink, Download, Upload, Save, RefreshCw, FileJson } from 'lucide-react';

interface SyncSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  config: CloudConfig | null;
  onSaveConfig: (config: CloudConfig) => void;
  onForceLoad: () => void;
  onForceSave: () => void;
  onExportFile: () => void;
  onImportFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  lastSynced: Date | null;
}

export const SyncSettings: React.FC<SyncSettingsProps> = ({ 
  isOpen, onClose, config, onSaveConfig, onForceLoad, onForceSave, onExportFile, onImportFile, lastSynced 
}) => {
  const [formData, setFormData] = useState<CloudConfig>({
    binId: config?.binId || '',
    apiKey: config?.apiKey || '',
    autoSync: config?.autoSync || false
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-vesper-bg border border-vesper-border w-full max-w-md rounded-xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button onClick={onClose} className="absolute top-4 right-4 text-vesper-text hover:text-vesper-red">
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6 text-vesper-gold">
          <Cloud size={24} />
          <h2 className="text-xl font-medium tracking-tight text-vesper-title">Dados & Sincronização</h2>
        </div>

        {/* --- SECTION 1: FILE BACKUP (The "Best" Option for simple users) --- */}
        <div className="mb-8 border-b border-vesper-border pb-8">
            <h3 className="text-xs font-mono text-vesper-text uppercase mb-4 flex items-center gap-2">
                <FileJson size={14} /> Backup Local (Arquivo)
            </h3>
            <p className="text-sm text-vesper-text opacity-70 mb-4">
                Baixe seus dados para um arquivo e envie para seus outros dispositivos (WhatsApp, Drive, etc). Ilimitado.
            </p>
            <div className="grid grid-cols-2 gap-3">
                <button 
                    onClick={onExportFile}
                    className="flex items-center justify-center gap-2 bg-vesper-surface hover:bg-vesper-border text-vesper-title py-2.5 rounded border border-vesper-border transition-colors text-sm"
                >
                    <Download size={14} /> Baixar Dados
                </button>
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 bg-vesper-surface hover:bg-vesper-border text-vesper-title py-2.5 rounded border border-vesper-border transition-colors text-sm"
                >
                    <Upload size={14} /> Carregar Dados
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={onImportFile}
                    accept=".json"
                    className="hidden"
                />
            </div>
        </div>

        {/* --- SECTION 2: CLOUD SYNC (JSONBin) --- */}
        <div>
            <h3 className="text-xs font-mono text-vesper-text uppercase mb-4 flex items-center gap-2">
                <Cloud size={14} /> Nuvem (JSONBin.io)
            </h3>
            
            {!config ? (
                <>
                    <p className="text-sm text-vesper-text mb-6 leading-relaxed opacity-70">
                        Para sincronizar automaticamente via internet. Requer configuração.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-mono text-vesper-text uppercase mb-1">Bin ID</label>
                            <input 
                            value={formData.binId}
                            onChange={e => setFormData({...formData, binId: e.target.value})}
                            placeholder="ex: 65e8a..."
                            className="w-full bg-vesper-surface border border-vesper-border rounded p-2 text-vesper-title text-sm focus:border-vesper-gold focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-vesper-text uppercase mb-1">X-Master-Key</label>
                            <input 
                            value={formData.apiKey}
                            onChange={e => setFormData({...formData, apiKey: e.target.value})}
                            placeholder="ex: $2a$10$..."
                            type="password"
                            className="w-full bg-vesper-surface border border-vesper-border rounded p-2 text-vesper-title text-sm focus:border-vesper-gold focus:outline-none"
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="w-full bg-vesper-gold/10 hover:bg-vesper-gold text-vesper-gold hover:text-vesper-bg border border-vesper-gold transition-all py-2 rounded text-sm font-medium mt-2"
                        >
                            Conectar Nuvem
                        </button>
                    </form>
                    <div className="mt-4 flex justify-center">
                        <a href="https://jsonbin.io/app/bins" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[10px] text-vesper-text/50 hover:text-vesper-gold transition-colors">
                            Obter chaves no JSONBin.io <ExternalLink size={8} />
                        </a>
                    </div>
                </>
            ) : (
                <div className="space-y-4">
                    {/* Auto Sync Toggle */}
                    <div className="flex items-center justify-between bg-vesper-surface p-3 rounded border border-vesper-border">
                        <div>
                            <span className="text-sm text-vesper-title block">Sync Automático</span>
                            <span className="text-[10px] text-vesper-text opacity-60">
                                {formData.autoSync ? 'Consome requisições a cada alteração.' : 'Economiza requisições. Só salva ao clicar.'}
                            </span>
                        </div>
                        <button 
                            onClick={() => {
                                const newVal = !formData.autoSync;
                                setFormData({...formData, autoSync: newVal});
                                onSaveConfig({...formData, autoSync: newVal});
                            }}
                            className={`w-10 h-5 rounded-full relative transition-colors ${formData.autoSync ? 'bg-vesper-gold' : 'bg-vesper-border'}`}
                        >
                            <div className={`absolute top-1 w-3 h-3 rounded-full bg-vesper-bg transition-all ${formData.autoSync ? 'left-6' : 'left-1'}`} />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                         <button 
                            onClick={onForceSave}
                            className="flex items-center justify-center gap-2 bg-vesper-bg border border-vesper-border hover:border-vesper-gold hover:text-vesper-gold py-2 rounded text-xs text-vesper-text transition-all"
                        >
                            <Save size={12} /> Upload (Salvar)
                        </button>
                        <button 
                            onClick={onForceLoad}
                            className="flex items-center justify-center gap-2 bg-vesper-bg border border-vesper-border hover:border-vesper-gold hover:text-vesper-gold py-2 rounded text-xs text-vesper-text transition-all"
                        >
                            <RefreshCw size={12} /> Download (Baixar)
                        </button>
                    </div>

                    <div className="pt-2 border-t border-vesper-border/50">
                        <p className="text-[10px] text-center text-vesper-text/40 font-mono mb-2">
                            Último sync: {lastSynced ? lastSynced.toLocaleTimeString() : 'Nunca'}
                        </p>
                        <button 
                            onClick={() => {
                                onSaveConfig({ binId: '', apiKey: '', autoSync: false });
                                setFormData({ binId: '', apiKey: '', autoSync: false });
                            }}
                            className="w-full text-[10px] text-vesper-red hover:underline text-center"
                        >
                            Desconectar Nuvem
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};