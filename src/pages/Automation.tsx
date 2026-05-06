import React from 'react';
import { Zap, Play, Pause, Trash2, ArrowRight } from 'lucide-react';
import { useActivity } from '../context/ActivityContext';
import { useAutomationRules } from '../hooks/useSupabaseData';

export const Automation: React.FC = () => {
  const { addActivity } = useActivity();
  const { rules, loading } = useAutomationRules();

  return (
    <div className="p-8 max-w-7xl mx-auto w-full pb-20">
      <div className="flex justify-between items-center mb-10">
        <div>
           <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest italic">Core Automations</h2>
           <p className="text-sm text-slate-400 font-medium">Rules-based triggers to keep your workspace running 24/7.</p>
        </div>
        <button className="px-6 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-500/20 active:scale-95 transition-all">Create New Logic</button>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-20 text-slate-400 uppercase font-black tracking-widest text-xs">Loading Cloud Rules...</div>
        ) : rules.map((rule, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm flex items-center justify-between group hover:border-brand-500/20 transition-all bg-[linear-gradient(to_right,transparent,rgb(14_142_220/0.01))]">
             <div className="flex items-center gap-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${rule.is_active ? 'bg-amber-50' : 'bg-slate-50'}`}>
                  <Zap className={`w-6 h-6 ${rule.is_active ? 'text-amber-500 fill-amber-200' : 'text-slate-300'}`} />
                </div>
                <div>
                   <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-2 group-hover:text-brand-600 transition-colors">Keyword: "{rule.keyword}"</h4>
                   <div className="flex items-center gap-3">
                      <span className="text-[9px] font-black uppercase text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 tracking-widest">Inbound Match</span>
                      <ArrowRight className="w-3 h-3 text-slate-300" />
                      <span className="text-[9px] font-black uppercase text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-100 tracking-widest">{rule.responses.length} Sequence Responses</span>
                   </div>
                </div>
             </div>
             
             <div className="flex items-center gap-12">
                <div className="text-center">
                   <p className="text-lg font-black text-slate-800 font-mono tracking-tighter">—</p>
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Active Status</p>
                </div>
                <div className="flex gap-2">
                   <button className="p-3 bg-slate-50 text-slate-300 rounded-xl hover:text-brand-600 transition-all border border-slate-100">{rule.is_active ? <Pause className="w-4 h-4 fill-slate-300" /> : <Play className="w-4 h-4 fill-slate-300" />}</button>
                   <button className="p-3 bg-red-50 text-red-200 rounded-xl hover:text-red-500 transition-all border border-red-100"><Trash2 className="w-4 h-4" /></button>
                </div>
             </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 p-8 bg-brand-600 rounded-[40px] text-white flex items-center justify-between relative overflow-hidden shadow-2xl shadow-brand-500/30">
         <div className="relative z-10 max-w-lg">
            <h3 className="text-xl font-black uppercase tracking-widest mb-3 italic">Autonomous Response Agent</h3>
            <p className="text-sm font-medium text-white/70 leading-relaxed mb-6">Train a custom AI agent on your business docs to handle 80% of customer inquiries automatically via WhatsApp.</p>
            <button className="px-8 py-3 bg-white text-brand-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all">Configure AI Agent</button>
         </div>
         <div className="w-48 h-48 bg-white/10 rounded-full blur-3xl absolute -right-12 -top-12" />
         <Zap className="w-40 h-40 absolute -right-10 -bottom-10 text-white/5 rotate-12" />
      </div>
    </div>
  );
};
