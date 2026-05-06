import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useDeals } from '../hooks/useSupabaseData';

export const Pipeline: React.FC = () => {
  const { deals: initialDeals } = useDeals();
  const [deals, setDeals] = useState(initialDeals);
  const stages = ['Lead', 'Contacted', 'Proposal Sent', 'Negotiation', 'Closed Won'];
  
  useEffect(() => { setDeals(initialDeals); }, [initialDeals]);
  
  const moveDeal = (id: string) => {
    setDeals(prev => prev.map(d => {
      if (d.id === id) {
        const next = stages[(stages.indexOf(d.stage) + 1) % stages.length];
        return { ...d, stage: next };
      }
      return d;
    }));
  };

  return (
    <div className="p-8 h-full flex flex-col min-w-0 bg-slate-50/30 overflow-x-auto">
      <div className="flex justify-between items-center mb-10 min-w-max">
         <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest">Active Sales Pipeline</h2>
         <div className="flex gap-3">
            <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold text-emerald-600 shadow-sm flex items-center gap-2">
               <Clock className="w-3.5 h-3.5" /> Est. Revenue: $42,300
            </div>
            <button className="px-6 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-500/20 active:scale-95 transition-all">New Deal</button>
         </div>
      </div>
      <div className="flex gap-6 h-full pb-10 min-w-max">
        {stages.map(stage => (
          <div key={stage} className="w-80 flex flex-col bg-slate-100/40 border border-slate-200/50 rounded-2xl p-4">
             <div className="flex justify-between items-center mb-4 px-2">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{stage}</span>
                <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-100 w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                  {deals.filter(d => d.stage === stage).length}
                </span>
             </div>
             <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
               {deals.filter(d => d.stage === stage).map(d => (
                 <motion.div 
                   layoutId={d.id} 
                   key={d.id} 
                   onClick={() => moveDeal(d.id)} 
                   className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-brand-500/30 cursor-pointer transition-all border-l-4 border-l-brand-600 shadow-brand-500/5 group relative overflow-hidden"
                 >
                    <div className="flex justify-between items-start mb-2">
                       <p className="text-xs font-bold text-slate-800 group-hover:text-brand-600 transition-colors uppercase tracking-tight line-clamp-1">{d.title}</p>
                       {d.score && (
                         <span className={cn(
                           "text-[9px] font-black px-1.5 py-0.5 rounded",
                           d.score > 70 ? "bg-emerald-50 text-emerald-600" :
                           d.score > 30 ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                         )}>
                           {d.score}%
                         </span>
                       )}
                    </div>
                    
                    <p className="text-[10px] font-black text-brand-600 mb-2">${d.value.toLocaleString()}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                       <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            d.health === 'Good' ? "bg-emerald-500" :
                            d.health === 'Fair' ? "bg-amber-500" : "bg-red-500"
                          )} />
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{d.health}</span>
                       </div>
                       
                       {/* Collaborative Signal */}
                       {Math.random() > 0.7 && (
                         <div className="flex -space-x-1.5">
                            {[1, 2].map(i => (
                              <div key={i} className="w-4 h-4 rounded-full bg-slate-200 border border-white text-[6px] font-black flex items-center justify-center text-slate-400">
                                 {String.fromCharCode(64 + i)}
                              </div>
                            ))}
                            <div className="w-4 h-4 rounded-full bg-brand-500 border border-white text-[6px] font-black flex items-center justify-center text-white animate-pulse">
                               +1
                            </div>
                         </div>
                       )}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-2 opacity-50 text-[8px] font-black uppercase tracking-widest text-slate-400 group-hover:opacity-100 transition-opacity">
                      <span>{d.contact_name}</span>
                      <span>Next Step ➔</span>
                    </div>
                 </motion.div>
               ))}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};
