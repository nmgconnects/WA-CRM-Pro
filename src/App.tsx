import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  MessageCircle, 
  Users, 
  Target, 
  Send, 
  FileText, 
  Zap, 
  BarChart3, 
  Settings as SettingsIcon,
  Search,
  Bell,
  Menu,
  X,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

// Context & Types
import { ActivityProvider, useActivity } from './context/ActivityContext';

// Pages
import { Overview } from './pages/Overview';
import { Contacts } from './pages/Contacts';
import { Pipeline } from './pages/Pipeline';
import { Inbox } from './pages/Inbox';
import { Broadcast } from './pages/Broadcast';
import { Templates } from './pages/Templates';
import { Automation } from './pages/Automation';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { CommandPalette } from './components/CommandPalette';

type Page = 'overview' | 'inbox' | 'contacts' | 'pipeline' | 'broadcast' | 'templates' | 'automation' | 'analytics' | 'settings';

function App() {
  const [activePage, setActivePage] = useState<Page>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // CMD+K listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const events = [
      "New lead synced from WhatsApp: Alex Rivera",
      "AI detected high-intent message from Gordon Ramsay",
      "Draft conversion sequence ready for review",
    ];

    const timer = setInterval(() => {
      if (Math.random() > 0.85 && !notification) {
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        setNotification(randomEvent);
        setTimeout(() => setNotification(null), 5000);
      }
    }, 12000);

    return () => clearInterval(timer);
  }, [notification]);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'inbox', label: 'Inbox', icon: MessageCircle, badge: '3' },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'pipeline', label: 'Pipeline', icon: Target },
    { id: 'broadcast', label: 'Broadcast', icon: Send },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'automation', label: 'Automation', icon: Zap },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const renderPage = () => {
    switch (activePage) {
      case 'overview': return <Overview />;
      case 'inbox': return <Inbox />;
      case 'contacts': return <Contacts />;
      case 'pipeline': return <Pipeline />;
      case 'broadcast': return <Broadcast />;
      case 'templates': return <Templates />;
      case 'automation': return <Automation />;
      case 'analytics': return <Analytics />;
      case 'settings': return <Settings />;
      default: return <Overview />;
    }
  };

  return (
    <ActivityProvider>
      <div className="flex h-screen bg-white font-sans text-slate-800 selection:bg-brand-100 selection:text-brand-900 overflow-hidden">
        {/* Progress Sidebar */}
        <motion.aside 
          initial={false}
          animate={{ width: isSidebarOpen ? 280 : 80 }}
          className="bg-white border-r border-slate-200 flex flex-col h-full z-40 relative group/sidebar"
        >
          <div className="h-16 flex items-center px-6 border-b border-slate-50 overflow-hidden whitespace-nowrap">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/20">
                  <Zap className="w-5 h-5 text-white fill-white" />
               </div>
               {isSidebarOpen && <span className="text-sm font-black uppercase tracking-[0.2em] italic bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">WA-CRM Pro</span>}
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id as Page)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative group",
                  activePage === item.id 
                    ? "bg-slate-50 text-slate-900 border border-slate-100" 
                    : "text-slate-400 hover:text-brand-600 hover:bg-brand-50/50 hover:border-brand-100/50 border border-transparent"
                )}
              >
                <item.icon className={cn("w-5 h-5", activePage === item.id ? "text-brand-600" : "group-hover:scale-110 transition-transform")} />
                {isSidebarOpen && (
                  <span className="text-[11px] font-black uppercase tracking-widest flex-1 text-left">
                    {item.label}
                  </span>
                )}
                {item.id === activePage && <motion.div layoutId="nav-pill" className="absolute left-0 w-1 h-5 bg-brand-600 rounded-r-full" />}
                {item.badge && isSidebarOpen && (
                  <span className="px-1.5 py-0.5 bg-brand-600 text-white text-[8px] font-black rounded-lg shadow-sm">{item.badge}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-50 overflow-hidden">
            <div className="flex items-center gap-3 px-2 py-3 bg-slate-50/50 rounded-2xl border border-slate-100/50">
               <div className="w-8 h-8 rounded-xl bg-indigo-500 shadow-xl shadow-indigo-500/20 flex items-center justify-center text-white text-xs font-bold">U</div>
               {isSidebarOpen && (
                 <div className="min-w-0">
                    <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Admin User</p>
                    <p className="text-[9px] font-bold text-slate-400 lowercase truncate">Synced Now</p>
                 </div>
               )}
            </div>
          </div>
        </motion.aside>

        {/* Global Layer */}
        <main className="flex-1 flex flex-col min-w-0 relative h-full">
           {/* Top Navigation */}
           <header className="h-16 px-8 bg-white border-b border-slate-100 flex items-center justify-between z-30">
              <div className="flex items-center gap-10 flex-1">
                 <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400 hover:text-brand-600 transition-colors">
                    {isSidebarOpen ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
                 </button>
                 
                 <div className="relative max-w-md w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-brand-600 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search workspace (CMD+K)" 
                      readOnly
                      onClick={() => setIsCommandPaletteOpen(true)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-2 text-xs font-medium focus:outline-none focus:bg-white focus:border-brand-600/20 focus:ring-4 focus:ring-brand-500/5 transition-all cursor-pointer" 
                    />
                 </div>
              </div>

              <div className="flex items-center gap-4">
                 <button 
                   onClick={() => setIsDarkMode(!isDarkMode)}
                   className="p-2 text-slate-400 hover:text-brand-600 bg-slate-50 border border-slate-100 rounded-xl transition-all"
                 >
                    {isDarkMode ? <Zap className="w-5 h-5 fill-amber-400 text-amber-400" /> : <LayoutDashboard className="w-5 h-5" />}
                 </button>
                 <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold border border-slate-100 hover:bg-slate-100 transition-all active:scale-95">
                    <Plus className="w-4 h-4" /> New Inbound
                 </button>
                 <div className="h-8 w-px bg-slate-100" />
                 <button className="relative p-2 text-slate-400 hover:text-brand-600">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-brand-600 border-2 border-white rounded-full" />
                 </button>
              </div>
           </header>

           {/* Dynamic Content */}
           <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar relative">
              <AnimatePresence mode="wait">
                 <motion.div
                   key={activePage}
                   initial={{ opacity: 0, x: 10 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -10 }}
                   transition={{ duration: 0.2 }}
                 >
                    {renderPage()}
                 </motion.div>
              </AnimatePresence>

              {/* Activity Sidebar Overlay (Toggleable if needed, showing fixed here) */}
              <ActivitySidebar />
           </div>
        </main>

        <AnimatePresence>
          {notification && (
            <motion.div 
              initial={{ opacity: 0, x: 50, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-8 right-20 z-[100] bg-slate-900 text-white p-5 rounded-[32px] shadow-2xl border border-white/10 flex items-center gap-4 min-w-[320px] max-w-[400px]"
            >
              <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center animate-pulse shrink-0">
                <Zap className="w-5 h-5 fill-white text-white" />
              </div>
              <div className="flex-1">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-400 mb-1">Live Intelligence</p>
                 <p className="text-xs font-bold leading-tight">{notification}</p>
              </div>
              <button onClick={() => setNotification(null)} className="p-2 text-white/30 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <CommandPalette 
          isOpen={isCommandPaletteOpen} 
          onClose={() => setIsCommandPaletteOpen(false)} 
          onNavigate={(page) => setActivePage(page)}
        />
      </div>
    </ActivityProvider>
  );
}

const ActivitySidebar: React.FC = () => {
  const { activities } = useActivity();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn(
      "fixed right-0 top-16 bottom-0 bg-white border-l border-slate-100 transition-all duration-500 z-40 flex shadow-2xl shadow-slate-200/50 overflow-hidden",
      isOpen ? "w-80" : "w-12 border-transparent bg-transparent shadow-none pointer-events-none"
    )}>
       <button 
         onClick={() => setIsOpen(!isOpen)}
         className={cn(
           "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-32 bg-white border border-slate-200 rounded-full flex items-center justify-center cursor-pointer pointer-events-auto hover:bg-slate-50 transition-all group shadow-sm",
           isOpen ? "rotate-0" : "rotate-180"
         )}
       >
          <div className="w-1 h-8 bg-slate-200 group-hover:bg-brand-600 rounded-full transition-colors" />
       </button>

       <div className={cn("p-6 w-full flex flex-col", !isOpen && "opacity-0")}>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Stream Activity</h3>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="space-y-8 flex-1 overflow-y-auto custom-scrollbar">
             {activities.map((act) => (
               <div key={act.id} className="relative pl-6 border-l border-slate-100 pb-2">
                  <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-brand-600 shadow-lg shadow-brand-500/50" />
                  <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight mb-1">{act.user}</p>
                  <p className="text-[11px] text-slate-400 leading-tight font-medium mb-1">{act.action}</p>
                  <span className="text-[9px] font-bold text-slate-300 font-mono italic uppercase">{act.time}</span>
               </div>
             ))}
          </div>
       </div>
    </div>
  );
};

export default App;
