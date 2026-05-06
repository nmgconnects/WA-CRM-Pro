import React, { useState } from 'react';
import { Send, Zap, Clock, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { geminiService } from '../services/geminiService';
import { useActivity } from '../context/ActivityContext';

export const Broadcast: React.FC = () => {
  const [draft, setDraft] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const { addActivity } = useActivity();

  const handleRefine = async () => {
    if (!draft) return;
    setIsRefining(true);
    const refined = await geminiService.refineMessage(draft);
    setDraft(refined);
    setIsRefining(false);
    addActivity({ user: 'AI Assistant', action: 'Refined broadcast message', icon: 'Zap' });
  };

  const handleLaunch = () => {
    addActivity({ user: 'You', action: 'Launched campaign: "' + draft.substring(0, 15) + '..."', icon: 'Send' });
    alert('Campaign launched successfully!');
    setDraft('');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full pb-20 space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest">Mass Broadcast</h2>
          <p className="text-sm font-medium text-slate-400">Campaign management & analytics for bulk outreach.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
              <div className="p-2 bg-brand-50 rounded-xl">
                <Send className="w-5 h-5 text-brand-600 font-black" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Compose Campaign</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Campaign Label</label>
                <input type="text" placeholder="e.g. Q4 Kickoff" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand-600/50" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Recipient Segment</label>
                <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs focus:outline-none">
                  <option>All Contacts (2.4k)</option>
                  <option>Hot Leads (142)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Message Draft</label>
              <div className="relative">
                <textarea 
                  rows={6} 
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type your personalized message here... Use {{name}} as placeholder." 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs font-medium focus:outline-none resize-none" 
                />
                <button 
                  onClick={handleRefine}
                  disabled={isRefining || !draft}
                  className="absolute bottom-4 right-4 px-3 py-1.5 bg-brand-600 text-white text-[9px] font-black uppercase rounded-lg shadow-lg flex items-center gap-1.5 hover:bg-brand-700 transition-all disabled:opacity-50"
                >
                  <Zap className="w-3 h-3 fill-white/20" /> 
                  {isRefining ? 'Thinking...' : 'AI Refine'}
                </button>
              </div>
            </div>

            <button 
              onClick={handleLaunch}
              disabled={!draft}
              className="w-full py-4 bg-brand-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-brand-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
            >
              Launch Sequence
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-6">Recent Campaigns</h4>
            <div className="space-y-3">
              {[ {n:'Holiday Blast',s:1200,r:'84%'}, {n:'Webinar Followup',s:45,r:'98%'} ].map((c,i)=>(
                <div key={i} className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-slate-800 tracking-tight">{c.n}</span>
                    <span className="text-[8px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded tracking-tighter">Done</span>
                  </div>
                  <div className="flex justify-between px-2">
                    <p className="text-center">
                      <span className="text-xs font-black text-slate-800 block leading-none">{c.s}</span>
                      <span className="text-[8px] font-bold text-slate-300 uppercase">Sent</span>
                    </p>
                    <p className="text-center">
                      <span className="text-xs font-black text-emerald-600 block leading-none">{c.r}</span>
                      <span className="text-[8px] font-bold text-slate-300 uppercase">Read</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-8 bg-brand-600 rounded-3xl text-white shadow-xl shadow-brand-500/20 relative overflow-hidden">
            <div className="relative z-10">
              <Info className="w-6 h-6 fill-white/20 mb-4" />
              <h3 className="text-sm font-bold mb-2 font-black uppercase tracking-widest">Anti-Ban Security</h3>
              <p className="text-[10px] text-white/70 leading-relaxed font-medium">Auto-humanized spacing logic enabled. Spacing out messages by 5-15 seconds to prevent WhatsApp flags.</p>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
