import React from 'react';
import { Settings as SettingsIcon, Zap } from 'lucide-react';

export const Settings: React.FC = () => (
   <div className="p-8 max-w-4xl mx-auto w-full pb-20 space-y-8">
      <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest">Settings Hub</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="p-8 bg-white border border-slate-200 rounded-3xl space-y-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
               <SettingsIcon className="w-4 h-4 text-brand-600" /> Primary Identity
            </h3>
            <div className="space-y-4">
               <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Workspace Owner</label>
                  <input type="text" defaultValue="Admin User" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs focus:outline-none" />
               </div>
               <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Support Number</label>
                  <input type="text" defaultValue="+1 999 000 0000" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs focus:outline-none" />
               </div>
            </div>
            <button className="w-full py-3 bg-brand-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-brand-500/20 active:scale-95 transition-all">Sync Changes</button>
         </div>
         <div className="p-8 bg-white border border-slate-200 rounded-3xl space-y-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
               <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-4 h-4 text-brand-600" /> Cloud Integration
               </h3>
               <p className="text-xs font-medium text-slate-400 leading-relaxed">Connected to Supabase. Real-time hooks are active for Contact and Deal databases.</p>
               <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-lg border border-emerald-100 tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Status: Live
               </div>
            </div>
            <button className="w-full py-3 border border-slate-200 text-slate-400 rounded-xl text-[10px] font-black uppercase hover:text-brand-600 hover:bg-slate-50 transition-all italic">Check DB Health</button>
         </div>
      </div>

      <div className="p-10 bg-slate-50 border border-slate-200 rounded-[40px] space-y-8">
         <div className="flex justify-between items-start">
            <div>
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">WhatsApp Business API</h3>
               <p className="text-xs text-slate-400 font-medium">Configure your production Meta credentials to enable live message syncing.</p>
            </div>
            <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Sandbox Mode</span>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
               <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Phone Number ID</label>
               <input type="password" placeholder="••••••••••••••••" className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-xs focus:outline-none focus:border-brand-600" />
            </div>
            <div className="space-y-1">
               <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Meta Access Token</label>
               <input type="password" placeholder="EAABw..." className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-xs focus:outline-none focus:border-brand-600" />
            </div>
         </div>

         <div className="p-6 bg-white border border-slate-100 rounded-[32px] flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-brand-50 rounded-2xl">
                  <Zap className="w-5 h-5 text-brand-600" />
               </div>
               <div>
                  <p className="text-xs font-bold text-slate-800">Webhook Connection</p>
                  <p className="text-[10px] text-slate-400 font-medium tracking-tight">Listening for incoming message events...</p>
               </div>
            </div>
            <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase shadow-lg active:scale-95 transition-all">Enable Webhook</button>
         </div>
      </div>
   </div>
);
