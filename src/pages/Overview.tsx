import React, { useState, useEffect } from 'react';
import { Users, Zap, Clock, Kanban, MoreVertical } from 'lucide-react';
import { motion } from 'motion/react';
import { ResponsiveContainer, AreaChart, Area, XAxis, CartesianGrid, Tooltip } from 'recharts';
import { cn } from '../lib/utils';
import { useActivity } from '../context/ActivityContext';

export const Overview: React.FC = () => {
  const { addActivity } = useActivity();
  const [leadCount, setLeadCount] = useState(2481);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setLeadCount(prev => prev + 1);
        addActivity({ user: 'System', action: 'New lead captured from WhatsApp', icon: 'Zap' });
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [addActivity]);

  const stats = [
    { label: 'Total Leads', value: leadCount.toLocaleString(), change: '+12%', icon: Users, color: 'text-brand-600', bg: 'bg-brand-50' },
    { label: 'Conversion', value: '18.4%', change: '+4%', icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Response Time', value: '4m 12s', change: '-30s', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pipeline Value', value: '$84,200', change: '+24%', icon: Kanban, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
               <div className={cn("p-2.5 rounded-xl", stat.bg)}>
                 <stat.icon className={cn("w-5 h-5", stat.color)} />
               </div>
               <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter", stat.change.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600")}>
                 {stat.change}
               </span>
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 mb-1">{stat.label}</h4>
            <p className="text-2xl font-black text-slate-800">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="p-8 bg-slate-900 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 space-y-4">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
                     <Zap className="w-6 h-6 text-white fill-white" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-brand-400">AI Insight Pulse</h3>
               </div>
               <p className="text-xl font-bold leading-tight">"Detected 3 'Hot Leads' from the Q4 Broadcast showing high conversion signals. Action recommended: Send personalized follow-up in the next 4 hours."</p>
               <div className="flex gap-4">
                  <button className="px-6 py-2.5 bg-brand-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-500 transition-all">Review Leads</button>
                  <button className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Dismiss</button>
               </div>
            </div>
            <div className="hidden lg:block w-px h-32 bg-white/10" />
            <div className="grid grid-cols-2 gap-8 shrink-0">
               <div className="text-center">
                  <p className="text-3xl font-black text-brand-400">92%</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Confidence</p>
               </div>
               <div className="text-center">
                  <p className="text-3xl font-black text-emerald-400">+$4.2k</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Est. Impact</p>
               </div>
            </div>
         </div>
         <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-brand-600/10 rounded-full blur-[100px] group-hover:bg-brand-600/20 transition-all" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
           <div className="flex items-center justify-between mb-8">
             <h3 className="text-sm font-bold text-slate-800">Engagement Overview</h3>
             <div className="flex gap-2">
               <button className="px-3 py-1 bg-slate-50 text-[10px] font-bold text-slate-500 rounded-lg border border-slate-100">7 Days</button>
               <button className="px-3 py-1 bg-white text-[10px] font-bold text-slate-400 rounded-lg border border-slate-100">30 Days</button>
             </div>
           </div>
           <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={[{n:'M',v:400},{n:'T',v:300},{n:'W',v:600},{n:'T',v:800},{n:'F',v:500},{n:'S',v:900},{n:'S',v:700}]}>
                 <defs>
                   <linearGradient id="colorO" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#0e8edc" stopOpacity={0.1}/>
                     <stop offset="95%" stopColor="#0e8edc" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="n" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#cbd5e1' }} />
                 <Tooltip />
                 <Area type="monotone" dataKey="v" stroke="#0e8edc" strokeWidth={3} fillOpacity={1} fill="url(#colorO)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col">
           <h3 className="text-sm font-bold text-slate-800 mb-6">Upcoming Tasks</h3>
           <div className="space-y-4 flex-1">
              {[
                { title: 'Follow up with Alex', time: '10:00 AM', type: 'high' },
                { title: 'Send Q4 Deck', time: '11:30 AM', type: 'med' },
                { title: 'Review campaign stats', time: '2:00 PM', type: 'low' },
              ].map((task, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                   <div className="flex gap-3 items-center">
                     <div className={cn("w-1.5 h-1.5 rounded-full", task.type === 'high' ? "bg-brand-600" : "bg-slate-300")} />
                     <div>
                       <p className="text-xs font-bold text-slate-800">{task.title}</p>
                       <p className="text-[9px] font-bold text-slate-400 font-mono mt-1 uppercase">{task.time}</p>
                     </div>
                   </div>
                   <button className="text-slate-300 hover:text-slate-600"><MoreVertical className="w-4 h-4" /></button>
                </div>
              ))}
           </div>
           <button className="w-full mt-6 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:bg-slate-100 italic transition-all">View All Reminders</button>
        </div>
      </div>
    </div>
  );
};
