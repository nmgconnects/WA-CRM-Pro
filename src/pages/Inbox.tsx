import React, { useState } from 'react';
import { Zap, MoreVertical, Send, MessageSquare, BookOpen, Clock, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { geminiService } from '../services/geminiService';
import { useActivity } from '../context/ActivityContext';

export const Inbox: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [reply, setReply] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [followUp, setFollowUp] = useState<{ time: string, reason: string } | null>(null);
  const [analysis, setAnalysis] = useState<{ sentiment: string, intent: string } | null>(null);
  const { addActivity } = useActivity();

  const chats = [
    { id: 1, name: 'Alex Rivera', msg: 'The proposal looks good!', time: '2m', status: 'Hot Lead' },
    { id: 2, name: 'Mila Kunis', msg: 'Sent the documents.', time: '1h', status: 'Customer' },
    { id: 3, name: 'Gordon Ramsay', msg: 'This CRM is amazing!', time: '3h', status: 'New' },
  ];

  const handleAISuggest = async () => {
    const activeChat = chats.find(c => c.id === selectedChat);
    if (!activeChat) return;

    setIsGenerating(true);
    
    // Multi-AI agent flow: Analyze sentiment then suggest reply
    const [suggestion, sentimentResult] = await Promise.all([
      geminiService.helpCompose(activeChat.msg, "Informal but professional follow-up"),
      geminiService.analyzeSentiment(activeChat.msg)
    ]);

    setReply(suggestion);
    
    // Parse sentiment result: SENTIMENT: [category] | INTENT: [intent or none]
    const parts = sentimentResult.split('|');
    const sentiment = parts[0]?.split(':')[1]?.trim() || 'UNKNOWN';
    const intent = parts[1]?.split(':')[1]?.trim() || 'NONE';
    setAnalysis({ sentiment, intent });

    setIsGenerating(false);
    addActivity({ user: 'AI Assistant', action: 'Drafted reply for ' + activeChat.name, icon: 'MessageSquare' });
  };

  const handleSummarize = async () => {
    const activeChat = chats.find(c => c.id === selectedChat);
    if (!activeChat) return;
    setIsSummarizing(true);
    // In a real app, we'd pass the actual conversation log
    const conversationLog = `User: ${activeChat.msg}`;
    const result = await geminiService.summarizeChat(conversationLog);
    setSummary(result);
    setIsSummarizing(false);
    addActivity({ user: 'AI Assistant', action: 'Generated chat summary', icon: 'BookOpen' });
  };

  const handleSmartSchedule = async () => {
    const activeChat = chats.find(c => c.id === selectedChat);
    if (!activeChat) return;
    const result = await geminiService.suggestFollowUpDate(activeChat.msg);
    const parts = result.split('|');
    const time = parts[0]?.split(':')[1]?.trim() || '';
    const reason = parts[1]?.split(':')[1]?.trim() || '';
    setFollowUp({ time, reason });
    addActivity({ user: 'AI Assistant', action: 'Suggested follow-up for ' + activeChat.name, icon: 'Calendar' });
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white">
      <div className="w-80 border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-100">
          <input type="text" placeholder="Filter conversations..." className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs focus:outline-none" />
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map(chat => (
            <div 
              key={chat.id} 
              onClick={() => setSelectedChat(chat.id)} 
              className={cn(
                "p-5 cursor-pointer hover:bg-slate-50 transition-all border-b border-slate-100", 
                selectedChat === chat.id && "bg-brand-50/50 border-r-4 border-r-brand-600"
              )}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-800">{chat.name}</span>
                <span className="text-[9px] font-bold text-slate-400">{chat.time}</span>
              </div>
              <p className="text-[11px] text-slate-500 truncate mb-2">{chat.msg}</p>
              <span className="px-2 py-0.5 bg-slate-100 text-[8px] font-black uppercase text-slate-400 rounded">{chat.status}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col bg-slate-50/50">
        {selectedChat ? (
          <>
            <div className="h-16 border-b border-slate-100 bg-white px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">A</div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">{chats.find(c => c.id === selectedChat)?.name}</h3>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleAISuggest}
                  disabled={isGenerating}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase border border-indigo-100 hover:bg-indigo-100 transition-all disabled:opacity-50"
                  )}
                >
                  <Zap className="w-3.5 h-3.5 fill-indigo-200" />
                  {isGenerating ? 'Drafting...' : 'AI Suggest'}
                </button>
                <button 
                  onClick={handleSummarize}
                  disabled={isSummarizing}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-black uppercase border border-slate-100 hover:bg-slate-100 transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  {isSummarizing ? 'Thinking...' : 'AI Recap'}
                </button>
                <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"><MoreVertical className="w-4 h-4" /></button>
              </div>
            </div>
            
            <AnimatePresence>
              {summary && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-brand-50 border-b border-brand-100 overflow-hidden"
                >
                  <div className="p-6 relative">
                    <button onClick={() => setSummary(null)} className="absolute top-4 right-4 text-brand-400 hover:text-brand-600">
                       <MoreVertical className="w-4 h-4 rotate-90" />
                    </button>
                    <h4 className="text-[10px] font-black text-brand-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <Zap className="w-3 h-3 fill-brand-400" /> Conversation Intelligence
                    </h4>
                    <div className="text-xs text-brand-900/70 leading-relaxed prose prose-slate max-w-none prose-xs">
                       {summary}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {analysis && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-b border-slate-100 px-6 py-2 flex gap-4 overflow-x-auto whitespace-nowrap scrollbar-none"
              >
                <div className="flex items-center gap-1.5">
                   <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Sentiment:</span>
                   <span className={cn(
                     "px-2 py-0.5 rounded text-[8px] font-black uppercase",
                     analysis.sentiment === 'POSITIVE' ? "bg-emerald-50 text-emerald-600" :
                     analysis.sentiment === 'NEGATIVE' ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-600"
                   )}>{analysis.sentiment}</span>
                </div>
                {analysis.intent && analysis.intent !== 'NONE' && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Detected Intent:</span>
                    <span className="px-2 py-0.5 bg-brand-50 text-brand-600 rounded text-[8px] font-black uppercase">{analysis.intent}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 ml-auto">
                    <span className="text-[8px] font-black uppercase text-indigo-600 italic tracking-[0.1em]">AI Confidence: 94%</span>
                </div>
              </motion.div>
            )}
            
            <div className="flex-1 p-8 space-y-4 overflow-y-auto">
              <div className="max-w-md bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm">
                <p className="text-sm text-slate-700">{chats.find(c => c.id === selectedChat)?.msg}</p>
                <span className="text-[8px] font-bold text-slate-300 mt-2 block uppercase font-mono tracking-widest">Sent 4:12 PM</span>
              </div>
              {reply && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-md bg-brand-600 text-white rounded-2xl rounded-tr-none p-4 shadow-md ml-auto"
                >
                  <p className="text-sm italic opacity-80 mb-2 text-[10px] uppercase font-black tracking-widest border-b border-white/20 pb-1">AI Draft</p>
                  <p className="text-sm">{reply}</p>
                </motion.div>
              )}
            </div>
            
            <div className="p-6 bg-white border-t border-slate-100">
              <AnimatePresence>
                {followUp && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-4 p-4 bg-indigo-600 rounded-2xl text-white shadow-xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                       <div className="p-2 bg-white/10 rounded-xl"><Calendar className="w-4 h-4" /></div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-70">AI Schedule Suggestion</p>
                          <p className="text-xs font-bold">{followUp.time} — <span className="opacity-70 font-medium italic">{followUp.reason}</span></p>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => setFollowUp(null)} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-black uppercase">Accept</button>
                       <button onClick={() => setFollowUp(null)} className="px-3 py-1.5 hover:bg-white/10 rounded-lg text-[10px] font-black uppercase opacity-50">Dismiss</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex gap-2 mb-4">
                 <button onClick={handleSmartSchedule} className="flex items-center gap-2 px-3 py-1.5 text-indigo-600 text-[9px] font-black uppercase hover:bg-indigo-50 rounded-lg transition-all">
                    <Clock className="w-3 h-3" /> Get Smart Follow-up
                 </button>
              </div>
              <div className="flex gap-4">
                <textarea 
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply..." 
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none resize-none h-14" 
                />
                <button className="w-14 h-14 bg-brand-600 text-white flex items-center justify-center rounded-2xl shadow-lg hover:bg-brand-700 transition-all">
                   <Send className="w-5 h-5 fill-white" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-xs font-medium uppercase tracking-widest italic animate-pulse">Select a conversation to begin</div>
        )}
      </div>
    </div>
  );
};
