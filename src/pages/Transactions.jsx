import React, { useState, useMemo, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Plus, Search, Filter, Trash2, ArrowUpDown, Download, Wallet, TrendingUp, CreditCard, Send, Zap, Clock, Wifi, ArrowUpRight, ArrowDownLeft, History, Cpu, Gamepad2, Monitor, Target, Pencil } from 'lucide-react';
import { categories } from '../utils/mockData';
import { CreditCard as CreditCardIcon } from 'lucide-react';
import { CreditCard as CreditCardUI } from '../components/CreditCard';

export const Transactions = () => {
  const { transactions, summary, role, addTransaction, deleteTransaction, editTransaction, currency, setCurrency, formatCurrency, cardData, showToast } = useFinance();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, income, expense
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc'); // desc = newest first
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, filterCategory, sortOrder]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [editForm, setEditForm] = useState({ date: '', amount: '', category: '', type: '', description: '' });
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Keyboard navigation: Escape closes modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (editingTx) setEditingTx(null);
        else if (isModalOpen) setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingTx, isModalOpen]);

  // Clear selection when filters change
  useEffect(() => {
    setSelectedIds(new Set());
  }, [searchTerm, filterType, filterCategory, sortOrder, currentPage]);
  
  const dynamicGoals = useMemo(() => {
    let rtxSum = 0, ps5Sum = 0, monSum = 0;
    transactions.forEach(t => {
      if (t.category === 'Savings') {
        const desc = t.description.toLowerCase();
        if (desc.includes('rtx')) rtxSum += Number(t.amount);
        else if (desc.includes('ps5') || desc.includes('playstation')) ps5Sum += Number(t.amount);
        else if (desc.includes('monitor')) monSum += Number(t.amount);
      }
    });

    const rtxTarget = 4000;
    // Siphon any extra RTX overflow directly into the PS5 fund!
    if (rtxSum > rtxTarget) {
      const overflow = rtxSum - rtxTarget;
      rtxSum = rtxTarget; // Cap the RTX at 100%
      ps5Sum += overflow; // Dump the extra money into PlayStation!
    }
    
    // Safety cap the PS5 so it preserves UI integrity if it overflows
    if (ps5Sum > 600) {
      ps5Sum = 600; 
    }

    // Direct injection requested by user
    monSum += 62;

    return [
      { id: 1, name: 'RTX 5090 GPU', current: rtxSum, target: rtxTarget, icon: Cpu, color: 'text-indigo-500', bg: 'bg-indigo-500/10', bar: 'bg-indigo-500' },
      { id: 2, name: 'PlayStation 5 Pro', current: ps5Sum, target: 600, icon: Gamepad2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', bar: 'bg-emerald-500' },
      { id: 3, name: 'Curved Gaming Monitor', current: monSum, target: 800, icon: Monitor, color: 'text-rose-500', bg: 'bg-rose-500/10', bar: 'bg-rose-500' }
    ];
  }, [transactions]);

  // Dynamic Upcoming Bills
  const upcomingBills = useMemo(() => {
    const subs = transactions.filter(t => t.category === 'Subscriptions');
    const utils = transactions.filter(t => t.category === 'Utilities');
    
    // Grab newest 1 of each
    const latestSub = subs.length > 0 ? subs[0] : { description: 'Netflix Premium', amount: 19.99 };
    const latestUtil = utils.length > 0 ? utils[0] : { description: 'Fiber Internet', amount: 85.00 };
    
    return [
      { id: 1, name: latestSub.description, amount: latestSub.amount, icon: Zap, color: 'text-rose-500', bg: 'bg-rose-500/10', due: 'Auto-pay in 2 days' },
      { id: 2, name: latestUtil.description, amount: latestUtil.amount, icon: Wifi, color: 'text-emerald-500', bg: 'bg-emerald-500/10', due: 'Auto-pay in 5 days' }
    ];
  }, [transactions]);
  
  // New Tx Form State
  const [newTx, setNewTx] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: categories[0],
    type: 'expense',
    description: ''
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = filterType === 'all' || t.type === filterType;
      const matchCat = filterCategory === 'all' || t.category === filterCategory;
      return matchSearch && matchType && matchCat;
    }).sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [transactions, searchTerm, filterType, filterCategory, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / itemsPerPage));
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newTx.amount || !newTx.description || !newTx.date) return;
    
    addTransaction({
      ...newTx,
      amount: Number(newTx.amount)
    });
    setIsModalOpen(false);
    setNewTx({ ...newTx, amount: '', description: '' });
  };

  const openEditModal = (t) => {
    setEditingTx(t);
    setEditForm({
      date: t.date,
      amount: t.amount,
      category: t.category,
      type: t.type,
      description: t.description
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editForm.amount || !editForm.description || !editForm.date) return;
    editTransaction(editingTx.id, {
      ...editForm,
      amount: Number(editForm.amount)
    });
    showToast('Transaction updated successfully!');
    setEditingTx(null);
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedTransactions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedTransactions.map(t => t.id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    selectedIds.forEach(id => deleteTransaction(id));
    showToast(`${selectedIds.size} transaction(s) deleted`);
    setSelectedIds(new Set());
  };

  const handleExportCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => [
        t.date,
        `"${t.description.replace(/"/g, '""')}"`, // escape quotes for CSV
        t.category,
        t.type,
        t.amount
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `transactions_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-full min-h-max" style={{ paddingBottom: '2rem' }}>
      
      {/* ---------------- LEFT COLUMN ---------------- */}
      <div className="lg:col-span-8 flex flex-col gap-6 lg:h-full lg:min-h-0">
        
        {/* Top Row: Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Main Wallet */}
          <div className="card flex flex-col justify-between p-6 h-[200px] border border-glass shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-black/50 flex items-center justify-center text-white border border-slate-700 shadow-sm">
                  <Wallet size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-sm text-secondary">Main Wallet</h3>
                  <p className="text-xs text-muted font-mono">0x124412</p>
                </div>
              </div>
              {role === 'admin' && (
                <button 
                  onClick={() => showToast('Wallet Management is an upcoming feature!')}
                  className="text-xs font-semibold text-secondary hover:text-primary transition-colors">
                  Manage
                </button>
              )}
            </div>
            
            <div className="mt-auto">
              <p className="text-sm text-secondary font-medium mb-1">Total Balance</p>
              <div className="flex flex-wrap gap-2 items-end justify-between">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-3xl font-bold tracking-tight text-primary">{formatCurrency(summary?.balance || 0)}</h2>
                  <span className={`flex items-center text-xs font-bold gap-0.5 ${(summary?.balance || 0) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {(summary?.balance || 0) >= 0 ? <TrendingUp size={12} strokeWidth={3} /> : <TrendingDown size={12} strokeWidth={3} />} {(summary?.balance || 0) >= 0 ? '15%' : '8%'}
                  </span>
                </div>
                <select className="form-select text-xs py-1 px-2 border-glass bg-bg-tertiary font-bold rounded-lg cursor-pointer" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="USD">🇺🇸 USD</option>
                  <option value="EUR">🇪🇺 EUR</option>
                  <option value="GBP">🇬🇧 GBP</option>
                  <option value="INR">🇮🇳 INR</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Upcoming Bills Widget */}
          <div className="card flex flex-col p-6 h-[200px] border border-glass shadow-sm relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
             
             <div className="flex items-center justify-between mb-4 z-10">
               <h3 className="font-semibold text-md text-primary">Upcoming Bills</h3>
               <button className="text-xs font-semibold text-accent-primary hover:underline">View All</button>
             </div>
             
             <div className="flex flex-col gap-4 overflow-y-auto pr-2 z-10" style={{ scrollbarWidth: 'none' }}>
                {upcomingBills.map(bill => (
                  <div key={bill.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${bill.bg} ${bill.color}`}>
                        <bill.icon size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-primary overflow-hidden text-ellipsis whitespace-nowrap max-w-[100px]">{bill.name}</p>
                        <p className="text-xs text-muted">{bill.due}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-primary">-{formatCurrency(bill.amount)}</span>
                  </div>
                ))}
             </div>
          </div>

        </div>

        {/* Transactions Table Section */}
        <div className="card flex-1 flex flex-col p-0 overflow-hidden border border-glass shadow-sm">
          {/* Header & Controls */}
          <div className="flex flex-col gap-4 items-start p-5 border-b border-glass bg-bg-secondary w-full">
            {/* Search Bar */}
            <div className="relative w-full">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input 
                type="text" 
                className="form-input w-full pl-10 text-sm md:text-base" 
                placeholder="      Search transactions..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search transactions"
                id="transaction-search"
              />
            </div>
            
            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <select className="form-select flex-1 text-xs md:text-sm" value={filterType} onChange={(e) => setFilterType(e.target.value)} aria-label="Filter by transaction type">
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              
              <select className="form-select flex-1 text-xs md:text-sm" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} aria-label="Filter by category">
                <option value="all">Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              
              <button 
                className="btn btn-ghost w-full sm:w-auto text-xs md:text-sm px-3"
                onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                title="Sort by Date"
                aria-label={`Sort by date, currently ${sortOrder === 'desc' ? 'newest first' : 'oldest first'}`}
              >
                <ArrowUpDown size={16} aria-hidden="true" /> Date {sortOrder === 'desc' ? '(Newest)' : '(Oldest)'}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:items-center">
              {role === 'admin' && selectedIds.size > 0 && (
                <button 
                  className="btn flex-1 sm:flex-none text-xs md:text-sm bg-rose-500/10 text-rose-500 border border-rose-500/30 hover:bg-rose-500/20 transition-colors" 
                  onClick={handleBulkDelete}
                  aria-label={`Delete ${selectedIds.size} selected transactions`}
                >
                  <Trash2 size={16} aria-hidden="true" /> Delete {selectedIds.size} Selected
                </button>
              )}
              {role === 'admin' && (
                <button className="btn btn-ghost flex-1 sm:flex-none text-xs md:text-sm" onClick={handleExportCSV} aria-label="Export transactions to CSV">
                  <Download size={18} aria-hidden="true" /> Export CSV
                </button>
              )}
              
              {role === 'admin' && (
                <button className="btn btn-primary flex-1 sm:flex-none text-xs md:text-sm" onClick={() => setIsModalOpen(true)} aria-label="Add new transaction">
                  <Plus size={18} aria-hidden="true" /> Add Transaction
                </button>
              )}
            </div>
          </div>
          
          {/* Table */}
          <div className="table-container overflow-x-auto w-full text-xs md:text-sm" role="region" aria-label="Transactions list" style={{ flex: 1, overflowY: 'auto' }}>
            <table className="w-full min-w-[600px]" role="table" aria-label="Financial transactions">
              <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-primary)', zIndex: 1 }}>
                <tr>
                  {role === 'admin' && (
                    <th style={{ width: '40px', textAlign: 'center' }}>
                      <input 
                        type="checkbox" 
                        checked={paginatedTransactions.length > 0 && selectedIds.size === paginatedTransactions.length}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-glass cursor-pointer accent-indigo-500"
                        aria-label="Select all transactions on this page"
                        tabIndex={0}
                      />
                    </th>
                  )}
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                  {role === 'admin' && <th style={{ width: '90px', textAlign: 'center' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={role === 'admin' ? 7 : 4} style={{ textAlign: 'center', padding: '3rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
                        <Filter size={48} opacity={0.2} aria-hidden="true" />
                        <p>No transactions found.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedTransactions.map((t, idx) => (
                    <tr 
                      key={t.id} 
                      className={`${selectedIds.has(t.id) ? 'bg-indigo-500/5' : ''} transition-colors`}
                      tabIndex={0}
                      role="row"
                      aria-label={`${t.description}, ${t.type === 'income' ? 'income' : 'expense'} of ${t.amount}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && role === 'admin') openEditModal(t);
                        if (e.key === 'Delete' && role === 'admin') deleteTransaction(t.id);
                        if (e.key === ' ' && role === 'admin') { e.preventDefault(); toggleSelect(t.id); }
                      }}
                    >
                      {role === 'admin' && (
                        <td style={{ textAlign: 'center' }}>
                          <input 
                            type="checkbox" 
                            checked={selectedIds.has(t.id)}
                            onChange={() => toggleSelect(t.id)}
                            className="w-4 h-4 rounded border-glass cursor-pointer accent-indigo-500"
                            aria-label={`Select ${t.description}`}
                            tabIndex={0}
                          />
                        </td>
                      )}
                      <td>{new Date(t.date).toLocaleDateString()}</td>
                      <td className="font-semibold text-primary">{t.description}</td>
                      <td><span className="badge badge-neutral">{t.category}</span></td>
                      <td className={t.type === 'income' ? 'text-success font-semibold' : 'text-danger font-semibold'}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </td>
                      {role === 'admin' && (
                        <td style={{ textAlign: 'center' }}>
                          <div className="flex items-center justify-center gap-1">
                            <button 
                              onClick={() => openEditModal(t)}
                              className="btn btn-ghost" 
                              style={{ padding: '0.25rem', color: 'var(--accent-primary)' }}
                              title="Edit transaction"
                              aria-label={`Edit ${t.description}`}
                              tabIndex={0}
                            >
                              <Pencil size={15} aria-hidden="true" />
                            </button>
                            <button 
                              onClick={() => deleteTransaction(t.id)}
                              className="btn btn-ghost" 
                              style={{ padding: '0.25rem', color: 'var(--accent-danger)' }}
                              title="Delete transaction"
                              aria-label={`Delete ${t.description}`}
                              tabIndex={0}
                            >
                              <Trash2 size={15} aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {filteredTransactions.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t border-glass bg-black/5 dark:bg-white/5 mt-auto">
              <button 
                className="btn btn-ghost text-xs px-3 py-1.5 font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <span className="text-xs font-semibold text-muted">
                Page <span className="text-primary">{currentPage}</span> of {totalPages}
              </span>
              <button 
                className="btn btn-ghost text-xs px-3 py-1.5 font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          )}

        </div>
      </div>

      {/* ---------------- RIGHT COLUMN ---------------- */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Top Tabs & Controls */}
        <div className="hidden lg:flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCardIcon size={20} className="text-indigo-500" />
            <h3 className="text-lg font-bold text-secondary">My Card</h3>
          </div>
          {role === 'admin' && (
            <button 
               onClick={() => window.dispatchEvent(new CustomEvent('change-tab', {detail: 'cards'}))}
               className="btn btn-ghost bg-bg-secondary border border-glass text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1.5 hover:bg-black/5 shadow-sm">
              <Plus size={14} /> Add Card
            </button>
          )}
        </div>

        {/* Credit Card UI */}
        <div className="hidden lg:block">
          <CreditCardUI cardData={cardData} />
        </div>

        {/* My Goals Section */}
        <div className="mt-2 flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-semibold text-secondary flex items-center gap-2"><Target size={16}/> Savings Goals</h3>
            <button 
              onClick={() => showToast('Coming soon: Create custom savings goals!')}
              className="btn btn-ghost text-xs text-primary hover:text-indigo-500 flex items-center gap-1 font-bold">
              <Plus size={14}/> Add Goal
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {dynamicGoals.map(goal => {
              const progress = Math.min((goal.current / goal.target) * 100, 100);
              return (
                <div key={goal.id} className="card p-4 border border-glass shadow-sm hover:border-slate-500/30 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${goal.bg} ${goal.color}`}>
                        <goal.icon size={20} className="group-hover:scale-110 transition-transform"/>
                      </div>
                      <div>
                        <p className="font-semibold text-primary text-sm line-clamp-1">{goal.name}</p>
                        <p className="text-xs text-muted font-medium mt-0.5">
                          <span className="text-primary">{formatCurrency(goal.current)}</span> / {formatCurrency(goal.target)}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold font-mono tracking-tight">{Math.round(progress)}%</span>
                  </div>
                  
                  {/* Progress Bar Container */}
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${goal.bar} shadow-[0_0_8px_currentColor]`} 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Add Transaction Modal */}
      {isModalOpen && role === 'admin' && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="card-header">
              <h2 className="text-xl font-bold">New Transaction</h2>
              <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label">Type</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="radio" value="expense" checked={newTx.type === 'expense'} onChange={e => setNewTx({...newTx, type: e.target.value})} /> Expense
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="radio" value="income" checked={newTx.type === 'income'} onChange={e => setNewTx({...newTx, type: e.target.value})} /> Income
                  </label>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Date</label>
                <input type="date" required className="form-input" value={newTx.date} onChange={e => setNewTx({...newTx, date: e.target.value})} />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <input type="text" required className="form-input" placeholder="e.g., Groceries" value={newTx.description} onChange={e => setNewTx({...newTx, description: e.target.value})} />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Amount ($)</label>
                  <input type="number" step="0.01" min="0" required className="form-input" placeholder="0.00" value={newTx.amount} onChange={e => setNewTx({...newTx, amount: e.target.value})} />
                </div>
                
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Category</label>
                  <select className="form-select" value={newTx.category} onChange={e => setNewTx({...newTx, category: e.target.value})}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Transaction</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Transaction Modal */}
      {editingTx && role === 'admin' && (
        <div className="modal-overlay" onClick={() => setEditingTx(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="card-header">
              <h2 className="text-xl font-bold flex items-center gap-2"><Pencil size={20} className="text-indigo-500"/> Edit Transaction</h2>
              <button className="btn btn-ghost" onClick={() => setEditingTx(null)}>&times;</button>
            </div>
            
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label className="form-label">Type</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="radio" value="expense" checked={editForm.type === 'expense'} onChange={e => setEditForm({...editForm, type: e.target.value})} /> Expense
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="radio" value="income" checked={editForm.type === 'income'} onChange={e => setEditForm({...editForm, type: e.target.value})} /> Income
                  </label>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Date</label>
                <input type="date" required className="form-input" value={editForm.date} onChange={e => setEditForm({...editForm, date: e.target.value})} />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <input type="text" required className="form-input" placeholder="e.g., Groceries" value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Amount ($)</label>
                  <input type="number" step="0.01" min="0" required className="form-input" placeholder="0.00" value={editForm.amount} onChange={e => setEditForm({...editForm, amount: e.target.value})} />
                </div>
                
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Category</label>
                  <select className="form-select" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setEditingTx(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}



    </div>
  );
};
