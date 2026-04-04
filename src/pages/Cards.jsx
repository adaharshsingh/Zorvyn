import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { CreditCard as CreditCardUI } from '../components/CreditCard';
import { Save, AlertTriangle, X } from 'lucide-react';

export const Cards = () => {
  const { cardData, setCardData, role, showToast } = useFinance();
  const [newCardForm, setNewCardForm] = useState({ number: '', expiry: '', name: '' });

  useEffect(() => {
    if (role !== 'admin') {
      window.dispatchEvent(new CustomEvent('change-tab', {detail: 'dashboard'}));
    }
  }, [role]);

  const handleSaveNewCard = (e) => {
    e.preventDefault();
    setCardData({
      number: newCardForm.number || '**** **** **** ****',
      expiry: newCardForm.expiry || 'MM/YY',
      name: newCardForm.name.toUpperCase() || 'CARD HOLDER'
    });
    setNewCardForm({ number: '', expiry: '', name: '' });
    showToast('Active card successfully replaced!');
  };

  if (role !== 'admin') return null;

  return (
    <div className="animate-fade-in flex flex-col gap-6 w-full max-w-6xl mx-auto p-4 h-full relative">
      <div className="w-full flex justify-between items-center bg-bg-secondary border border-glass rounded-xl p-5 shadow-sm z-10 mb-2">
        <h2 className="text-xl md:text-2xl font-bold">Card Management Layer</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        {/* Left Segment: Active View */}
        <div className="flex flex-col gap-6 w-full items-center lg:items-start group">
          <div className="w-full max-w-[450px] p-6 lg:ml-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-glass shadow-sm flex flex-col gap-8 transition-all hover:bg-black/10 dark:hover:bg-white/10 relative overflow-hidden">
             
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

             <div>
               <h3 className="font-semibold text-lg text-secondary mb-1">Active Network Card</h3>
               <p className="text-sm text-muted">Virtual physical proxy currently mapped to your primary ledger</p>
             </div>
             
             <div className="w-full relative z-10 transition-transform duration-500 group-hover:scale-[1.02]">
                <CreditCardUI cardData={cardData} />
             </div>
          </div>
        </div>

        {/* Right Segment: Configuration */}
        <div className="card p-6 border border-glass shadow-sm flex flex-col gap-6 w-full">
           <div className="card-header border-b border-glass pb-4 flex items-center justify-between">
             <div>
                <h3 className="text-lg md:text-xl font-bold flex items-center gap-2">Replace Active Card</h3>
                <p className="text-xs text-muted mt-1">Warning: Executing this replaces global mapping bindings.</p>
             </div>
             <div className="shrink-0 p-3 bg-red-50 text-red-500 dark:bg-rose-500/10 dark:text-rose-400 rounded-full">
               <AlertTriangle size={20} />
             </div>
           </div>
           
           <form onSubmit={handleSaveNewCard} className="flex flex-col gap-5">
              <div className="form-group">
                <label className="form-label text-sm">Name on Card</label>
                <input type="text" required className="form-input text-sm md:text-base py-3" placeholder="e.g., Jane Doe" value={newCardForm.name} onChange={e => setNewCardForm({...newCardForm, name: e.target.value})} maxLength={26} />
              </div>

              <div className="form-group">
                <label className="form-label text-sm">Card Number</label>
                <input type="text" required className="form-input font-mono text-sm md:text-base py-3 tracking-widest" placeholder="4242 4242 4242 4242" value={newCardForm.number} onChange={e => setNewCardForm({...newCardForm, number: e.target.value.replace(/[^0-9 ]/g, '')})} maxLength={19} />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="form-group flex-1">
                  <label className="form-label text-sm">Expiry (MM/YY)</label>
                  <input type="text" required className="form-input font-mono text-sm md:text-base py-3" placeholder="12/26" value={newCardForm.expiry} onChange={e => setNewCardForm({...newCardForm, expiry: e.target.value})} maxLength={5} />
                </div>
                <div className="form-group flex-1">
                  <label className="form-label text-sm">CVV Authorization</label>
                  <input type="password" required className="form-input font-mono text-sm md:text-base py-3" placeholder="•••" maxLength={3} />
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button type="submit" className="btn btn-primary flex-1 justify-center py-3.5 text-sm md:text-base font-bold flex items-center gap-2" style={{ background: 'var(--accent-primary)' }}>
                  <Save size={18} /> Overwrite & Sync Network Card
                </button>
                <button type="button" onClick={() => window.dispatchEvent(new CustomEvent('change-tab', {detail: 'transactions'}))} className="btn btn-ghost flex-1 justify-center py-3.5 text-sm md:text-base font-bold flex items-center gap-2">
                  <X size={18} /> Cancel
                </button>
              </div>
           </form>
        </div>
      </div>

    </div>
  );
};
