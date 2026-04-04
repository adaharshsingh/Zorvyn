import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ReceiptText, PieChart, ShieldAlert, ShieldCheck, TrendingUp, TrendingDown, Trash2, Moon, Bell, MessageSquare, Settings, ChevronsUpDown, Menu, LifeBuoy, Globe, CreditCard } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export const Layout = ({ children, currentTab, setCurrentTab }) => {
  const { role, toggleRole, clearAllData, theme, toggleTheme, globalToast, showToast } = useFinance();
  const [cryptoData, setCryptoData] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showWipeConfirm, setShowWipeConfirm] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === 'undefined') return true;
    const width = window.innerWidth;
    return width < 1024; // Closed on small/medium, open on large
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsCollapsed(width < 1024); // Closed on small/medium, open on large
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true')
      .then(res => res.json())
      .then(data => {
        const parsed = [
          { name: 'BTC', price: data.bitcoin.usd, change: data.bitcoin.usd_24h_change },
          { name: 'ETH', price: data.ethereum.usd, change: data.ethereum.usd_24h_change },
          { name: 'SOL', price: data.solana.usd, change: data.solana.usd_24h_change },
        ];
        setCryptoData([...parsed, ...parsed, ...parsed]);
      })
      .catch(err => console.error('Failed to fetch crypto data:', err));
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ReceiptText },
    { id: 'insights', label: 'Insights', icon: PieChart },
    { id: 'markets', label: 'Finance', icon: Globe },
  ];

  return (
    <div className="app-container flex relative overflow-hidden h-screen w-full">
      
      {/* Mobile Drawer Overlay */}
      {!isCollapsed && (
        <div className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setIsCollapsed(true)}></div>
      )}

      <aside className={`transition-all duration-300 ease-in-out flex flex-col z-50 fixed md:relative h-full ${isCollapsed ? '-translate-x-full md:translate-x-0 md:w-[84px] p-4 md:items-center shadow-none' : 'translate-x-0 w-[260px] p-6 shadow-2xl md:shadow-none'}`} style={{
        background: 'var(--glass-bg)',
        borderRight: 'var(--glass-border)',
        backdropFilter: 'blur(24px)',
      }}>
        <div className={`flex items-center mb-8 w-full ${isCollapsed ? 'justify-center flex-col gap-4' : 'justify-between'}`}>
          <div className="flex items-center">
            <img src="/logo.jpg" alt="Zorvyn Logo" className="w-8 h-8 rounded-lg object-cover shadow-sm bg-black/5 shrink-0" />
            <div className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[150px] opacity-100 ml-3'}`}>
              <h1 className="text-xl font-bold">Zorvyn</h1>
            </div>
          </div>
          {!isCollapsed && (
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg text-slate-500 dark:text-slate-400 transition-colors">
              <Menu size={20} />
            </button>
          )}
        </div>

        <nav className="flex-1 flex flex-col gap-2 w-full">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  if (window.innerWidth < 768) setIsCollapsed(true);
                }}
                className={`flex items-center rounded-xl transition-all duration-300 overflow-hidden ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'} ${isActive ? 'bg-slate-400 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 font-medium'}`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="shrink-0 flex items-center justify-center"><item.icon size={20} /></div>
                <div className={`overflow-hidden transition-all duration-300 whitespace-nowrap text-left flex-1 ${isCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[150px] opacity-100 ml-3'}`}>
                  {item.label}
                </div>
              </button>
            );
          })}
          
          <button
            onClick={() => {
              if (role !== 'admin') {
                showToast('Card Management is Admin-only!');
              } else {
                setCurrentTab('cards');
                if (window.innerWidth < 768) setIsCollapsed(true);
              }
            }}
            className={`md:hidden flex items-center rounded-xl transition-all duration-300 overflow-hidden ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'} text-slate-500 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 font-medium`}
            title={isCollapsed ? 'Add Card' : undefined}
          >
            <div className="shrink-0 flex items-center justify-center"><CreditCard size={20} /></div>
            <div className={`overflow-hidden transition-all duration-300 whitespace-nowrap text-left flex-1 ${isCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[150px] opacity-100 ml-3'}`}>
              Add Card
            </div>
          </button>
        </nav>

        {/* Secondary Menu */}
        <div className={`mt-auto pt-4 border-t w-full flex flex-col gap-1 transition-all duration-300`} style={{ borderColor: 'var(--border-color)' }}>
          
          <label className={`md:hidden flex items-center cursor-pointer rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3 justify-between'}`} title={isCollapsed ? 'Toggle Admin Role' : undefined}>
            <div className="flex items-center">
              <div className="shrink-0 flex items-center justify-center text-slate-500 dark:text-slate-400"><ShieldCheck size={20} /></div>
              <div className={`overflow-hidden transition-all duration-300 whitespace-nowrap text-left text-slate-500 dark:text-slate-400 font-medium text-sm ${isCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[100px] opacity-100 ml-3'}`}>
                Admin Role
              </div>
            </div>
            <div className={`overflow-hidden transition-all duration-300 flex items-center justify-end ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[50px] opacity-100'}`}>
              <div className="toggle-switch shrink-0 scale-90">
                <input type="checkbox" checked={role === 'admin'} onChange={toggleRole} />
                <span className="toggle-slider"></span>
              </div>
            </div>
          </label>
          
          <label className={`flex items-center cursor-pointer rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3 justify-between'}`} title={isCollapsed ? 'Toggle Dark Mode' : undefined}>
            <div className="flex items-center">
              <div className="shrink-0 flex items-center justify-center text-slate-500 dark:text-slate-400"><Moon size={20} /></div>
              <div className={`overflow-hidden transition-all duration-300 whitespace-nowrap text-left text-slate-500 dark:text-slate-400 font-medium text-sm ${isCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[100px] opacity-100 ml-3'}`}>
                Dark Mode
              </div>
            </div>
            <div className={`overflow-hidden transition-all duration-300 flex items-center justify-end ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[50px] opacity-100'}`}>
              <div className="toggle-switch shrink-0 scale-90">
                <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
                <span className="toggle-slider"></span>
              </div>
            </div>
          </label>

          <button 
             onClick={() => {
               setCurrentTab('support');
               if (window.innerWidth < 768) setIsCollapsed(true);
             }}
             className={`flex items-center rounded-xl transition-all duration-300 border-none ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'} ${currentTab === 'support' ? 'bg-slate-400 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 font-medium text-sm'}`} 
             title={isCollapsed ? 'Support' : undefined}
          >
             <div className="shrink-0 flex items-center justify-center"><MessageSquare size={20} /></div>
             <div className={`overflow-hidden transition-all duration-300 whitespace-nowrap text-left flex-1 ${isCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[100px] opacity-100 ml-3'}`}>
                Support
             </div>
          </button>
          
          <button 
             onClick={() => {
               if (role !== 'admin') {
                 showToast('Settings & Configurations are Admin-only features!');
               } else {
                 setShowSettings(!showSettings);
               }
             }}
             className={`flex items-center rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 text-slate-500 dark:text-slate-400 font-medium text-sm border-none ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'}`} title={isCollapsed ? 'Settings' : undefined}>
             <div className="shrink-0 flex items-center justify-center"><Settings size={20} /></div>
             <div className={`overflow-hidden transition-all duration-300 whitespace-nowrap text-left ${isCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[100px] opacity-100 ml-3'}`}>
                Settings
             </div>
          </button>

          {showSettings && role === 'admin' && (
             <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[50px] opacity-100 px-4 mt-2 mb-1'}`}>
               <button 
                 onClick={() => setShowWipeConfirm(true)}
                 className="w-full justify-center text-xs p-2.5 bg-red-50 text-red-600 dark:bg-rose-500/10 dark:text-rose-400 hover:bg-red-100 dark:hover:bg-rose-500/20 rounded-lg flex items-center gap-2 font-semibold transition-colors shadow-sm whitespace-nowrap"
                 title="Wipe Local Storage"
               >
                 <Trash2 size={14} /> Wipe Data
               </button>
             </div>
          )}

        </div>

        {/* User Card */}
        <div className={`mt-4 w-full rounded-2xl cursor-pointer shadow-sm transition-all duration-300 overflow-hidden border ${isCollapsed ? 'p-2 flex justify-center bg-transparent border-transparent' : 'p-3 flex items-center justify-between'}`} style={{ 
          background: isCollapsed ? 'transparent' : 'var(--bg-primary)',
          borderColor: isCollapsed ? 'transparent' : 'var(--border-color)'
        }}>
           <div className={`flex items-center`}>
             <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Avatar" className="w-10 h-10 rounded-full object-cover shrink-0 shadow-sm" />
             <div className={`overflow-hidden transition-all duration-300 whitespace-nowrap flex flex-col ${isCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[120px] opacity-100 ml-3'}`}>
               <p className="font-semibold text-sm mb-0.5 truncate" style={{ color: 'var(--text-primary)' }}>Adarsh</p>
               <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>hello@Adarsh.com</p>
             </div>
           </div>
           <div className={`overflow-hidden transition-all duration-300 flex items-center justify-center ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[20px] opacity-100'}`}>
             <ChevronsUpDown size={16} className="shrink-0" style={{ color: 'var(--text-muted)' }} />
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Top Navbar */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem 2rem',
          borderBottom: 'var(--glass-border)',
          background: 'var(--glass-bg)',
          zIndex: 5,
          position: 'relative'
        }}>
          <div>
            <h2 className="text-2xl font-bold" style={{ textTransform: 'capitalize' }}>{currentTab}</h2>
          </div>
          
           {/* Desktop Hamburger: Centered Base */}
           {isCollapsed && (
             <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
               <button onClick={() => setIsCollapsed(false)} className="p-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-xl text-primary transition-all shadow-sm border border-glass flex items-center justify-center border-indigo-500/20">
                 <Menu size={20} className="text-indigo-500" />
               </button>
             </div>
           )}
           
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginLeft: 'auto' }}>
            {/* Desktop Admin Role: Restored Top */}
            <label className="hidden md:flex items-center gap-3 cursor-pointer bg-bg-primary px-4 py-2 rounded-xl border border-glass shadow-sm" style={{ border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
              <span className="text-sm font-semibold" style={{ color: role === 'admin' ? 'var(--accent-primary)' : 'var(--text-muted)' }}>Admin Role</span>
              <div className="toggle-switch">
                <input type="checkbox" checked={role === 'admin'} onChange={toggleRole} />
                <span className="toggle-slider"></span>
              </div>
            </label>

            {/* Mobile Hamburger: Locked Top Right */}
            {isCollapsed && (
               <button onClick={() => setIsCollapsed(false)} className="md:hidden p-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-xl text-primary transition-all shadow-sm border border-glass flex items-center justify-center border-indigo-500/20">
                 <Menu size={20} className="text-indigo-500" />
               </button>
            )}
          </div>
        </header>

        {/* Crypto Ticker Marquee */}
        {currentTab === 'markets' && cryptoData.length > 0 && (
          <div style={{ 
            background: 'var(--glass-bg)', 
            borderBottom: 'var(--glass-border)', 
            padding: '0.5rem 0',
            display: 'flex',
            overflow: 'hidden',
            whiteSpace: 'nowrap'
          }}>
             <div className="ticker-track">
               {cryptoData.map((crypto, idx) => (
                 <div key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', margin: '0 2rem' }}>
                   <span className="font-bold text-sm text-secondary">{crypto.name}</span>
                   <span className="font-bold text-sm">${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                   <span className="text-xs" style={{ 
                     display: 'flex', alignItems: 'center', 
                     color: crypto.change >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)' 
                   }}>
                     {crypto.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                     {Math.abs(crypto.change).toFixed(2)}%
                   </span>
                 </div>
               ))}
             </div>
          </div>
        )}

        <main className="main-content">
          {children}
        </main>

      {/* Wipe Data Confirmation Modal */}
      {showWipeConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[150]" onClick={() => setShowWipeConfirm(false)}>
          <div className="card border border-glass p-8 rounded-2xl shadow-2xl max-w-md mx-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-rose-500/10 flex items-center justify-center text-red-600 dark:text-rose-400">
                <Trash2 size={24} />
              </div>
              <h2 className="text-xl font-bold text-primary">Wipe All Data?</h2>
            </div>
            <p className="text-muted mb-2 text-sm">This action will permanently delete all your transactions, settings, and stored data. This action <strong>cannot be undone</strong>.</p>
            <p className="text-muted mb-6 text-xs italic">All data will be reset to default values on next reload.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowWipeConfirm(false)}
                className="flex-1 px-4 py-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearAllData();
                  setShowSettings(false);
                  setShowWipeConfirm(false);
                  showToast('All data has been successfully wiped. Changes will take effect on next reload.');
                }}
                className="flex-1 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={16} /> Wipe Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Application Toast Overlay */}
      {globalToast && (
        <div className="fixed bottom-6 right-6 z-[100] animate-fade-in" style={{ pointerEvents: 'none' }}>
          <div className="bg-slate-900 border border-slate-700/50 shadow-2xl text-white px-5 py-4 rounded-xl flex items-start gap-3 max-w-sm backdrop-blur-sm pointer-events-auto">
            <span className="text-xl">⚠️</span>
            <p className="text-sm font-medium leading-tight">{globalToast}</p>
          </div>
        </div>
      )}

    </div>
    </div>
  );
};
