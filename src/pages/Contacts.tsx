import React, { useState } from 'react';
import { MoreVertical, Zap, Phone, Mail, Calendar, MessageSquare, X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useContacts } from '../hooks/useSupabaseData';
import { type Contact } from '../lib/supabase';

export const Contacts: React.FC = () => {
  const { contacts, loading, error, addContact } = useContacts();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContact, setNewContact] = useState({ first_name: '', last_name: '', phone: '', email: '', status: 'lead' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (loading) return <div className="p-20 text-center font-black uppercase tracking-[0.3em] text-slate-200 text-xl animate-pulse">Initializing DNA Sync...</div>;
  if (error) return <div className="p-20 text-center text-red-500 font-bold">{error}</div>;

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await addContact(newContact);
    setIsSubmitting(false);
    if (result.success) {
      setIsAddingContact(false);
      setNewContact({ first_name: '', last_name: '', phone: '', email: '', status: 'lead' });
    } else {
      alert('Error adding contact: ' + result.error);
    }
  };

  const handleExportCSV = () => {
    const headers = ['First Name', 'Last Name', 'Phone', 'Email', 'Status', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...contacts.map(c => [
        c.first_name,
        c.last_name,
        c.phone,
        c.email || '',
        c.status,
        c.created_at
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `wa-crm-contacts-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full pb-20 relative">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-normal">Relationship Manager</h2>
          <p className="text-sm text-slate-400 font-medium">Synced WhatsApp contacts and relationship stages.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50">Filter</button>
          <button 
            onClick={() => setIsAddingContact(true)}
            className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 flex items-center gap-2 shadow-lg shadow-brand-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Contact
          </button>
          <button 
            onClick={handleExportCSV}
            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50"
          >
            Export CSV
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isAddingContact && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-10 p-8 bg-white border border-slate-200 rounded-3xl shadow-sm relative overflow-hidden"
          >
            <button 
              onClick={() => setIsAddingContact(false)} 
              className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-6">New Contact Entry</h3>
            <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">First Name</label>
                <input 
                  required
                  type="text" 
                  value={newContact.first_name}
                  onChange={e => setNewContact({...newContact, first_name: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  placeholder="e.g. John"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Last Name</label>
                <input 
                  required
                  type="text" 
                  value={newContact.last_name}
                  onChange={e => setNewContact({...newContact, last_name: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  placeholder="e.g. Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Phone Number</label>
                <input 
                  required
                  type="tel" 
                  value={newContact.phone}
                  onChange={e => setNewContact({...newContact, phone: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  placeholder="e.g. +1 234 567 890"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Address</label>
                <input 
                  type="email" 
                  value={newContact.email}
                  onChange={e => setNewContact({...newContact, email: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  placeholder="e.g. john@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Initial Status</label>
                <select 
                  value={newContact.status}
                  onChange={e => setNewContact({...newContact, status: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all appearance-none"
                >
                  <option value="lead">Lead</option>
                  <option value="contact">Contact</option>
                  <option value="customer">Customer</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="flex items-end pb-1 lg:col-span-1 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                <button 
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full py-4 bg-brand-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-brand-500/20 hover:bg-brand-700 disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? 'Syncing...' : 'Register Contact'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Name & Identity</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">WhatsApp Handle</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Stage</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Last Seen</th>
              <th className="px-8 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {contacts.map(c => (
              <tr 
                key={c.id} 
                onClick={() => setSelectedContact(c)}
                className="hover:bg-brand-50/20 transition-all group cursor-pointer"
              >
                <td className="px-8 py-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-400 text-xs uppercase">{c.first_name?.[0] || '?'}{c.last_name?.[0]}</div>
                  <span className="text-sm font-bold text-slate-800 tracking-tight">{c.first_name} {c.last_name}</span>
                </td>
                <td className="px-8 py-5 text-sm text-slate-500 font-mono tracking-tighter">{c.phone}</td>
                <td className="px-8 py-5">
                   <span className={cn("px-2.5 py-1 rounded-lg text-[9px] font-black uppercase", c.status === 'customer' ? "bg-emerald-50 text-emerald-600" : "bg-brand-50 text-brand-600")}>{c.status}</span>
                </td>
                <td className="px-8 py-5 text-xs text-slate-400 font-bold uppercase font-mono tracking-tighter">{new Date(c.created_at).toLocaleDateString()}</td>
                <td className="px-8 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                   <button className="text-slate-300 hover:text-brand-600"><MoreVertical className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {selectedContact && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedContact(null)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50" 
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[450px] bg-white shadow-2xl z-50 flex flex-col border-l border-slate-100"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center text-white text-xl font-bold shadow-xl shadow-brand-500/20">
                      {selectedContact.first_name?.[0]}
                    </div>
                    <div>
                       <h3 className="text-lg font-black text-slate-800 tracking-tight leading-none mb-1">{selectedContact.first_name} {selectedContact.last_name}</h3>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedContact.status}</span>
                    </div>
                 </div>
                 <button onClick={() => setSelectedContact(null)} className="p-2 text-slate-300 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                 <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Contact Intel</h4>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <Phone className="w-3.5 h-3.5 text-slate-300 mb-2" />
                          <p className="text-xs font-bold text-slate-700">{selectedContact.phone}</p>
                       </div>
                       <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <Mail className="w-3.5 h-3.5 text-slate-300 mb-2" />
                          <p className="text-xs font-bold text-slate-700 truncate">{selectedContact.email || 'No email'}</p>
                       </div>
                    </div>
                 </div>

                 <div className="p-6 bg-brand-600 rounded-[32px] text-white shadow-xl shadow-brand-500/20 relative overflow-hidden">
                    <div className="relative z-10">
                       <div className="flex items-center justify-between mb-4">
                          <h4 className="text-[10px] font-black uppercase tracking-widest opacity-70">AI Lead Score</h4>
                          <Zap className="w-4 h-4 fill-white animate-pulse" />
                       </div>
                       <div className="flex items-end gap-3 mb-4">
                          <p className="text-4xl font-black">84</p>
                          <span className="text-[10px] font-bold opacity-60 mb-1">/ 100</span>
                       </div>
                       <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                          <p className="text-[10px] font-medium leading-relaxed italic">"High intent signals detected in last message. Ready for conversion sequence."</p>
                       </div>
                    </div>
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
                 </div>

                 <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Last Interactions</h4>
                    <div className="space-y-1 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                       {[
                         { icon: MessageSquare, text: 'Replied to broadcast Q4', time: '2h ago' },
                         { icon: Calendar, text: 'Meeting scheduled', time: 'Yesterday' },
                       ].map((act, i) => (
                         <div key={i} className="flex items-center gap-4 pl-0 py-3 group">
                            <div className="w-6 h-6 rounded-lg bg-white border border-slate-100 flex items-center justify-center z-10">
                               <act.icon className="w-3 h-3 text-slate-400 group-hover:text-brand-600 transition-colors" />
                            </div>
                            <div>
                               <p className="text-xs font-bold text-slate-700 tracking-tight">{act.text}</p>
                               <span className="text-[8px] font-bold text-slate-300 font-mono italic uppercase tracking-wider">{act.time}</span>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="p-8 border-t border-slate-100 flex gap-4">
                 <button className="flex-1 py-3.5 bg-brand-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-500/20 hover:bg-brand-700 transition-all">Quick Reply</button>
                 <button className="px-6 py-3.5 border border-slate-200 text-slate-400 rounded-xl text-[10px] font-black uppercase hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all">Archive</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
