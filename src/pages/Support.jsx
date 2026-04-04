import React, { useState } from 'react';
import { Search, Mail, MessageCircle, FileText, Settings, ShieldAlert, CreditCard, ExternalLink, ChevronDown, Rocket } from 'lucide-react';

export const Support = () => {
  const [activeFAQ, setActiveFAQ] = useState(null);

  const faqs = [
    {
      question: "How do I add a new savings goal?",
      answer: "Head over to the Dashboard or Transactions tab. Our new 'My Goals' smart-widget allows you to track custom teenage hardware targets seamlessly."
    },
    {
      question: "Can I manage physical and virtual cards?",
      answer: "Yes! Navigate to the Transactions tab to add and visually modify beautiful virtual metallic Visa cards mapped securely to the network."
    },
    {
      question: "What happens if I click 'Wipe Data'?",
      answer: "The 'Wipe Data' button located in your global layout settings completely eradicates local memory caches and purges all existing transactions. It cannot be reversed."
    },
    {
      question: "How does the Dark Mode theme tie into system settings?",
      answer: "Currently, our UI allows absolute override via the Settings menu toggle, bypassing system defaults to enforce either a clean slate Light mode or deep space Dark mode."
    }
  ];

  return (
    <div className="animate-fade-in flex flex-col gap-6 h-full pb-8">
      
      {/* Support Hero Header */}
      <div className="card border border-glass flex flex-col lg:flex-row lg:items-center justify-between p-4 sm:p-6 md:p-8 lg:p-12 gap-4 sm:gap-6 md:gap-8 relative lg:items-center items-center">
        {/* Decorative Background Accents */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10 flex flex-col gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0 lg:items-start items-center lg:text-left text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary tracking-tight">How can we help?</h1>
          <p className="text-xs sm:text-sm md:text-base text-muted font-medium line-clamp-none">Search our knowledge base or reach out to our dedicated priority support team.</p>
        </div>

        <div className="relative z-10 w-full lg:w-auto lg:min-w-[350px] shrink-0">
          <div className="relative w-full shadow-lg rounded-2xl">
            <Search size={14} className="sm:size-4 md:size-5 absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              className="w-full bg-white dark:bg-slate-900 border-2 border-indigo-500/30 dark:border-indigo-500/50 outline-none focus:border-indigo-500 transition-colors py-2 sm:py-2.5 md:py-3 pl-9 sm:pl-10 md:pl-12 pr-3 md:pr-4 rounded-2xl text-xs sm:text-sm md:text-base font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400" 
              placeholder="Search..." 
            />
          </div>
        </div>
      </div>

      {/* Grid Content wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full flex-1">
        
        {/* Main Body (Left Grid) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Quick Categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card p-5 border border-glass hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"><Settings size={20} /></div>
              <div>
                <h3 className="font-bold text-primary mb-1">Account & Settings</h3>
                <p className="text-xs text-muted leading-relaxed">Manage your profile securely and modify active layout states.</p>
              </div>
            </div>
            <div className="card p-5 border border-glass hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"><CreditCard size={20} /></div>
              <div>
                <h3 className="font-bold text-primary mb-1">Virtual Cards</h3>
                <p className="text-xs text-muted leading-relaxed">Request new physical limits and design beautiful virtual bounds.</p>
              </div>
            </div>
            <div className="card p-5 border border-glass hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"><ShieldAlert size={20} /></div>
              <div>
                <h3 className="font-bold text-primary mb-1">Privacy & Security</h3>
                <p className="text-xs text-muted leading-relaxed">Report suspicious behavior and review login architectures.</p>
              </div>
            </div>
            <div className="card p-5 border border-glass hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"><Rocket size={20} /></div>
              <div>
                <h3 className="font-bold text-primary mb-1">Feature Requests</h3>
                <p className="text-xs text-muted leading-relaxed">Got a brilliant idea? Submit logic pipelines directly to the dev team.</p>
              </div>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="card border border-glass h-full">
            <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <FileText size={20} className="text-indigo-500" />
              Frequently Asked Questions
            </h2>
            <div className="flex flex-col border border-glass rounded-xl overflow-hidden shadow-sm">
              {faqs.map((faq, idx) => {
                const isOpen = activeFAQ === idx;
                return (
                  <div key={idx} className={`border-b border-glass overflow-hidden ${idx === faqs.length - 1 ? 'border-b-0' : ''}`}>
                    <button 
                      onClick={() => setActiveFAQ(isOpen ? null : idx)}
                      className={`w-full text-left px-5 py-4 flex items-center justify-between font-semibold transition-colors ${isOpen ? 'bg-indigo-500/5 text-indigo-500' : 'text-secondary hover:bg-black/5 dark:hover:bg-white/5'}`}
                    >
                      {faq.question}
                      <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <p className="p-5 text-sm text-muted bg-black/5 dark:bg-black/20 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>

        {/* Sidebar Overlay (Right Grid) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          <div className="card border border-glass shadow-sm flex flex-col items-center text-center p-8 relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
             <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4"><MessageCircle size={32} /></div>
             <h3 className="text-lg font-bold text-primary mb-2">Live Chat Priority</h3>
             <p className="text-sm text-muted mb-6 leading-relaxed">Speak immediately with our tier-3 response engineers 24/7. Current wait time: <strong>&lt; 2 mins</strong>.</p>
             <button className="btn w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
               Start Chat Now <ExternalLink size={16} />
             </button>
          </div>

          <div className="card border border-glass shadow-sm flex flex-col items-center text-center p-8 relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
             <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4"><Mail size={32} /></div>
             <h3 className="text-lg font-bold text-primary mb-2">Direct Email</h3>
             <p className="text-sm text-muted mb-6 leading-relaxed">For business inquiries, complex architecture bugs, or partnerships, reach the founder directly at this dedicated address.</p>
             
             {/* The Explicit User Mandated Email Contact Line */}
             <div className="w-full bg-black/5 dark:bg-white/5 border border-glass rounded-xl p-3 flex flex-col items-center gap-1">
               <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Direct Inbox</span>
               <a href="mailto:Mr.aadarshkumarsingh@gmail.com" className="text-sm font-bold text-indigo-500 hover:text-indigo-400 break-all transition-colors underline decoration-indigo-500/30 underline-offset-4">
                 Mr.aadarshkumarsingh@gmail.com
               </a>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
};
