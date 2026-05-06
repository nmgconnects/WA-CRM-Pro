import React from 'react';
import { Users, Clock, Zap, BarChart3, TrendingUp, Bell } from 'lucide-react';
import { motion } from 'motion/react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { cn } from '../lib/utils';
import { useAutomationAnalytics } from '../hooks/useSupabaseData';

export const Analytics: React.FC = () => {
  const { triggers } = useAutomationAnalytics();
  const data = [
    { name: 'Mon', conversations: 400, revenue: 2400 },
    { name: 'Tue', conversations: 300, revenue: 1398 },
    { name: 'Wed', conversations: 600, revenue: 9800 },
    { name: 'Thu', conversations: 800, revenue: 3908 },
    { name: 'Fri', conversations: 500, revenue: 4800 },
    { name: 'Sat', conversations: 900, revenue: 3800 },
    { name: 'Sun', conversations: 700, revenue: 4300 },
  ];

  const COLORS = ['#0e8edc', '#10b981', '#6366f1', '#f59e0b'];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest">Business Intelligence</h2>
          <p className="text-sm text-slate-400 font-medium tracking-tight">Real-time performance metrics and conversation conversion analytics.</p>
        </div>
        <button className="px-6 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-500/20 active:scale-95 transition-all">Download PDF Report</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Lead Conversion', value: '14.8%', change: '+2%', icon: Users, color: 'emerald' },
          { label: 'Avg Response Time', value: '2m 45s', change: '-14s', icon: Clock, color: 'blue' },
          { label: 'Engagement Score', value: '94.2', change: '+5.4', icon: TrendingUp, color: 'indigo' },
        ].map((s, i) => (
          <div key={i} className="p-8 bg-white border border-slate-200 rounded-[32px] shadow-sm hover:border-brand-500/20 transition-all group overflow-hidden relative">
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="p-2.5 rounded-2xl bg-slate-50 group-hover:bg-brand-50 transition-colors">
                <s.icon className="w-5 h-5 text-slate-400 group-hover:text-brand-600 transition-all" />
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-lg tracking-widest">{s.change}</span>
            </div>
            <h4 className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest relative z-10">{s.label}</h4>
            <p className="text-3xl font-black text-slate-800 relative z-10">{s.value}</p>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50/50 rounded-full blur-2xl group-hover:bg-brand-500/10 transition-all" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-8 bg-white border border-slate-200 rounded-[40px] shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-600" /> Revenue Stream
            </h3>
            <span className="text-[10px] font-bold text-slate-400">LAST 7 DAYS</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0e8edc" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0e8edc" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#cbd5e1' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#cbd5e1' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 800, color: '#1e293b' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0e8edc" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-8 bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl text-white">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8">Conversion Funnel</h3>
          <div className="space-y-6">
            {[
              { label: 'DELIVERED', value: '4,281', percent: '100%', color: 'bg-indigo-500' },
              { label: 'OPENED', value: '3,842', percent: '89%', color: 'bg-brand-500' },
              { label: 'CLICKED', value: '1,240', percent: '32%', color: 'bg-emerald-500' },
              { label: 'CONVERTED', value: '412', percent: '10%', color: 'bg-amber-500' },
            ].map((f, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-end">
                   <span className="text-[9px] font-black tracking-widest text-slate-500">{f.label}</span>
                   <span className="text-xs font-bold">{f.value}</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }} 
                     whileInView={{ width: f.percent }} 
                     transition={{ duration: 1, delay: i * 0.1 }}
                     className={cn("h-full rounded-full", f.color)} 
                   />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 p-4 bg-white/5 rounded-2xl border border-white/10">
             <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">"Funnel efficiency is up 12% following the AI-optimized broadcast rollout."</p>
          </div>
        </div>
      </div>

      <div className="p-8 bg-white border border-slate-200 rounded-[40px] shadow-sm">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 mb-6 flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald-500" /> Recent Automation Triggers
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trigger Rule</th>
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
                <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Time Offset</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {triggers.length > 0 ? triggers.map((t, i) => (
                <tr key={i} className="group">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-sm font-bold text-slate-800">Keyword: <span className="text-emerald-600 uppercase">"{t.keyword}"</span></span>
                    </div>
                  </td>
                  <td className="py-4 text-sm font-semibold text-slate-500">{t.contact_name}</td>
                  <td className="py-4 text-right">
                    <span className="text-[10px] font-black font-mono text-slate-300 uppercase tracking-tighter">
                      {new Date(t.triggered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-sm font-medium text-slate-400">
                    No automation events recorded yet. Rule triggers will appear here in real-time.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
