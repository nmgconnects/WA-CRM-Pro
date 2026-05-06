import React from 'react';
import { Copy, Plus, MoreVertical } from 'lucide-react';
import { useActivity } from '../context/ActivityContext';

export const Templates: React.FC = () => {
  const { addActivity } = useActivity();
  const categories = ['All', 'Onboarding', 'Promotional', 'Support', 'Re-engagement'];
  const templates = [
    { title: 'Welcome Greeting', body: 'Hi {{name}}, welcome to our platform! How can we help today?', cat: 'Onboarding' },
    { title: 'Special Promo Q4', body: 'Hey {{name}}, don\'t miss our exclusive 20% discount!', cat: 'Promotional' },
    { title: 'Inactive Followup', body: 'Long time no see, {{name}}! We\'ve missed you.', cat: 'Re-engagement' },
  ];

  const handleCopy = (title: string) => {
    addActivity({ user: 'You', action: `Copied template: ${title}`, icon: 'Copy' });
    alert('Template copied to clipboard!');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full pb-20">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest">Message Blueprints</h2>
          <p className="text-sm font-medium text-slate-400">Standardized templates for ultra-fast outreach.</p>
        </div>
        <button className="px-6 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-500/20 flex items-center gap-2 hover:scale-[1.02] transition-all active:scale-95">
          <Plus className="w-4 h-4 text-white font-black" /> Draft Blueprint
        </button>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-4 custom-scrollbar">
        {categories.map(cat => (
          <button key={cat} className="px-5 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-brand-600 hover:text-brand-600 transition-all shadow-sm">
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((t, i) => (
          <div key={i} className="p-8 bg-white border border-slate-200 rounded-[32px] shadow-sm group hover:border-brand-500/20 transition-all flex flex-col h-full bg-[radial-gradient(circle_at_top_right,rgba(14,142,220,0.02),transparent)]">
            <div className="flex justify-between items-start mb-6">
              <span className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 bg-slate-100 text-slate-400 rounded-lg">{t.cat}</span>
              <button className="text-slate-200 hover:text-slate-400"><MoreVertical className="w-4 h-4" /></button>
            </div>
            <h4 className="text-sm font-black text-slate-800 mb-3 uppercase tracking-tight group-hover:text-brand-600 transition-colors">{t.title}</h4>
            <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100/50 flex-1 relative mb-6">
              <p className="text-xs text-slate-500 leading-relaxed font-medium italic">"{t.body}"</p>
              <div className="absolute top-2 right-2 flex gap-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                 <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              </div>
            </div>
            <button 
              onClick={() => handleCopy(t.title)}
              className="w-full py-3.5 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 rounded-xl hover:bg-brand-600 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Copy className="w-3.5 h-3.5" /> Duplicate Blueprint
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
