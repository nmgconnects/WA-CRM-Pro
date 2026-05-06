import React, { useState, useEffect } from 'react';
import { Search, Send, Users, Target, Zap, MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: any) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  
  const commands = [
    { id: 'overview', label: 'Dashboard Overview', icon: Zap, category: 'Navigation' },
    { id: 'inbox', label: 'Open Inbox', icon: MessageSquare, category: 'Navigation' },
    { id: 'broadcast', label: 'New Campaign', icon: Send, category: 'Actions' },
    { id: 'contacts', label: 'Manage Contacts', icon: Users, category: 'Navigation' },
    { id: 'pipeline', label: 'Sales Pipeline', icon: Target, category: 'Navigation' },
  ];

  const filtered = commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-xl bg-white rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 flex items-center gap-4">
             <Search className="w-5 h-5 text-slate-400" />
             <input 
               autoFocus
               placeholder="Search actions, contacts, or navigation..." 
               className="flex-1 bg-transparent border-none text-sm font-medium focus:outline-none text-slate-800"
               value={query}
               onChange={(e) => setQuery(e.target.value)}
             />
             <div className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest">ESC</div>
          </div>

          <div className="max-h-[400px] overflow-y-auto p-4 space-y-4">
             {filtered.length > 0 ? (
               <div className="space-y-1">
                 {filtered.map((cmd) => (
                   <button
                     key={cmd.id}
                     onClick={() => { onNavigate(cmd.id); onClose(); }}
                     className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-brand-50 group transition-all text-left"
                   >
                      <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-brand-600 transition-colors">
                        <cmd.icon className="w-4 h-4 text-slate-400 group-hover:text-white" />
                      </div>
                      <div className="flex-1">
                         <p className="text-xs font-bold text-slate-800">{cmd.label}</p>
                         <p className="text-[10px] text-slate-400 font-medium">{cmd.category}</p>
                      </div>
                   </button>
                 ))}
               </div>
             ) : (
               <div className="p-10 text-center space-y-3">
                  <X className="w-8 h-8 text-slate-200 mx-auto" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">No results found for "{query}"</p>
               </div>
             )}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
             <div className="flex gap-4">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5"><Search className="w-3 h-3" /> Select</span>
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5"><Target className="w-3 h-3" /> Navigate</span>
             </div>
             <p className="text-[9px] font-bold text-slate-300 italic">v2.4.0 Stable</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
