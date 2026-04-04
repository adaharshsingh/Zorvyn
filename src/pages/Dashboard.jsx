import React, { useMemo, useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Wallet, TrendingUp, TrendingDown, Target, Edit2, Check, Settings, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#64748b'];

export const Dashboard = () => {
  const { summary, transactions, monthlyBudget, updateMonthlyBudget, role, formatCurrency } = useFinance();
  const [editingBudget, setEditingBudget] = useState(false);
  const [editAmount, setEditAmount] = useState('');

  const [trendMonth, setTrendMonth] = useState(() => new Date().toISOString().substring(0, 7));
  const [pieMonth, setPieMonth] = useState('All Time');

  const availableMonths = useMemo(() => {
    const months = new Set();
    transactions.forEach(t => {
      months.add(t.date.substring(0, 7));
    });
    return Array.from(months).sort((a, b) => b.localeCompare(a));
  }, [transactions]);

  // Prepare trend data (balance over time)
  const trendData = useMemo(() => {
    // Sort transactions by date ascending
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    let currentBalance = 0;
    const dailyBalance = {};

    sorted.forEach(t => {
      if (t.type === 'income') currentBalance += Number(t.amount);
      if (t.type === 'expense') currentBalance -= Number(t.amount);
      
      const monthStr = t.date.substring(0, 7);
      if (trendMonth === 'All Time' || monthStr === trendMonth) {
         dailyBalance[t.date] = currentBalance;
      }
    });

    return Object.entries(dailyBalance).map(([date, balance]) => ({
      date,
      balance
    }));
  }, [transactions, trendMonth]);

  // Prepare spending breakdown
  const pieData = useMemo(() => {
    let expenses = transactions.filter(t => t.type === 'expense');
    
    if (pieMonth !== 'All Time') {
       expenses = expenses.filter(t => t.date.substring(0, 7) === pieMonth);
    }

    const categoryTotals = {};
    expenses.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount);
    });
    
    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value); // Sort descending
  }, [transactions, pieMonth]);

  const cards = [
    { title: 'Total Balance', amount: summary.balance, icon: Wallet, color: 'var(--accent-primary)', bg: 'rgba(99, 102, 241, 0.1)' },
    { title: 'Total Income', amount: summary.income, icon: TrendingUp, color: 'var(--accent-success)', bg: 'rgba(16, 185, 129, 0.1)' },
    { title: 'Total Expenses', amount: summary.expenses, icon: TrendingDown, color: 'var(--accent-danger)', bg: 'rgba(239, 68, 68, 0.1)' }
  ];

  // Prepare Month-by-Month analytics
  const monthlyData = useMemo(() => {
    const monthlyMap = {};
    transactions.forEach(t => {
      // Get YYYY-MM
      const monthStr = t.date.substring(0, 7);
      if (!monthlyMap[monthStr]) {
        monthlyMap[monthStr] = { month: monthStr, income: 0, expenses: 0 };
      }
      if (t.type === 'income') monthlyMap[monthStr].income += Number(t.amount);
      if (t.type === 'expense') monthlyMap[monthStr].expenses += Number(t.amount);
    });

    return Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month)); // Sort chronologically
  }, [transactions]);

  // Total Monthly Spent
  const totalSpent = useMemo(() => {
    const currentMonth = new Date().toISOString().substring(0, 7);
    let spent = 0;
    transactions.forEach(t => {
      if (t.type === 'expense' && t.date.substring(0, 7) === currentMonth) {
         spent += Number(t.amount);
      }
    });
    return spent;
  }, [transactions]);

  const budgetPercentage = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;
  
  const getSegmentColor = (index, totalFilled) => {
    if (totalFilled <= 1) return '#3b82f6';
    const ratio = index / (totalFilled - 1);
    const r = Math.round(59 + (236 - 59) * ratio); // 59, 130, 246 (blue) to 236, 72, 153 (pink)
    const g = Math.round(130 + (72 - 130) * ratio);
    const b = Math.round(246 + (153 - 246) * ratio);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const handleSaveBudget = () => {
    updateMonthlyBudget(editAmount);
    setEditingBudget(false);
  };

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <div style={{ marginBottom: '-0.5rem' }}>
        <p className="text-muted" style={{ fontSize: '1.1rem' }}>Welcome back, <span className="font-bold text-primary">Adarsh Singh</span></p>
      </div>
      
      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="card flex items-center gap-4 md:gap-6 p-4 md:p-5">
            <div style={{ background: card.bg, color: card.color }} className="p-2 md:p-4 rounded-2xl shrink-0">
              <card.icon size={20} className="md:hidden" />
              <card.icon size={28} className="hidden md:block" />
            </div>
            <div>
              <p className="text-secondary text-xs md:text-sm font-semibold mb-1">{card.title}</p>
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">{formatCurrency(card.amount)}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: Trend & Budget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Trend Chart */}
        <div className="card lg:col-span-8 h-[400px] flex flex-col">
        <div className="card-header flex items-center justify-between">
          <h3 className="font-semibold text-lg">Balance Trend</h3>
          <select 
            className="form-input text-sm py-1.5 px-3 bg-black/5 dark:bg-white/5 border border-glass rounded-xl cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors" 
            value={trendMonth} 
            onChange={(e) => setTrendMonth(e.target.value)}
          >
             {availableMonths.map(m => (
               <option key={m} value={m}>{m}</option>
             ))}
          </select>
        </div>
        <div className="flex-1 min-h-0 overflow-x-auto w-full">
          {trendData.length > 0 ? (
            <div className="min-w-[500px] h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => window.innerWidth < 768 ? val.substring(5) : val} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => formatCurrency(val)} />
                  <Tooltip 
                    contentStyle={{ background: 'var(--bg-secondary)', border: 'var(--glass-border)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--text-primary)' }}
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Line type="monotone" dataKey="balance" stroke="var(--accent-primary)" strokeWidth={3} dot={{ fill: 'var(--bg-primary)', r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
              <p className="text-muted">No data available for trend chart.</p>
            </div>
          )}
        </div>
      </div>

      {/* Budget Status Tracker */}
      <div className="card lg:col-span-4 h-[400px] flex flex-col w-full">
        <div className="card-header" style={{ marginBottom: '2rem' }}>
          <h3 className="font-semibold text-xl">Budget Control</h3>
          {role === 'admin' && (
            <button className="btn btn-ghost" style={{ padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }} onClick={() => { setEditingBudget(!editingBudget); setEditAmount(monthlyBudget); }}>
              <Settings size={18} />
            </button>
          )}
        </div>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p className="text-muted text-sm mb-2" style={{ fontWeight: 500 }}>Monthly Transaction Limit</p>
          
          {editingBudget ? (
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
               <span className="text-2xl font-bold">$</span>
               <input 
                 type="number" 
                 className="form-input" 
                 style={{ padding: '0.25rem 0.5rem', fontSize: '1.5rem', width: '150px', fontWeight: 'bold' }}
                 value={editAmount}
                 onChange={e => setEditAmount(e.target.value)}
                 autoFocus
               />
               <button className="btn btn-ghost" onClick={handleSaveBudget}>
                 <Check size={20} className="text-success" />
               </button>
             </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <h2 className="text-3xl font-bold">{formatCurrency(totalSpent)}</h2>
              <span className="text-muted">of {formatCurrency(monthlyBudget)}</span>
            </div>
          )}

          {/* Segmented Progress Bar */}
          <div style={{ display: 'flex', gap: '3px', width: '100%', height: '24px' }}>
            {Array.from({ length: 40 }).map((_, i) => {
              const segmentsFilled = Math.floor((budgetPercentage / 100) * 40);
              const isFilled = i < segmentsFilled;
              return (
                <div 
                  key={i} 
                  style={{ 
                    flex: 1, 
                    borderRadius: '2px', 
                    background: isFilled ? getSegmentColor(i, segmentsFilled) : 'var(--bg-tertiary)',
                    opacity: isFilled ? 1 : (document.documentElement.getAttribute('data-theme') === 'dark' ? 0.3 : 0.6)
                  }}
                ></div>
              );
            })}
          </div>

          {/* Alert */}
          {budgetPercentage >= 80 && (
            <div style={{ 
              background: document.documentElement.getAttribute('data-theme') === 'dark' ? 'rgba(236, 72, 153, 0.15)' : '#fce7f3', 
              color: '#db2777', 
              padding: '0.75rem 1rem', 
              borderRadius: '0.5rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              marginTop: '2rem', 
              fontSize: '0.875rem', 
              fontWeight: 600,
              border: `1px solid ${document.documentElement.getAttribute('data-theme') === 'dark' ? 'rgba(236, 72, 153, 0.3)' : '#fbcfe8'}`
            }}>
               <AlertTriangle size={18} />
               {budgetPercentage >= 100 ? "You have exceeded your monthly limit!" : "Your spending is almost at its peak"}
            </div>
          )}
        </div>
      </div>
      
      </div> {/* End Row 2 */}

      {/* Row 3: Income/Expenses & Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

      {/* Monthly Bar Chart */}
      <div className="card lg:col-span-7 h-[400px] flex flex-col">
        <div className="card-header">
          <h3 className="font-semibold text-lg">Income vs Expenses (Monthly)</h3>
        </div>
        <div className="flex-1 min-h-0 overflow-x-auto w-full">
          {monthlyData.length > 0 ? (
            <div className="min-w-[500px] h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => window.innerWidth < 768 ? val.substring(5) : val} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => formatCurrency(val)} />
                  <Tooltip 
                    contentStyle={{ background: 'var(--bg-secondary)', border: 'var(--glass-border)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--text-primary)' }}
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Bar dataKey="income" fill="var(--accent-success)" radius={[4, 4, 0, 0]} name="Income" />
                  <Bar dataKey="expenses" fill="var(--accent-danger)" radius={[4, 4, 0, 0]} name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
              <p className="text-muted">No data available for monthly chart.</p>
            </div>
          )}
        </div>
      </div>

      {/* Spending Breakdown */}
      <div className="card lg:col-span-5 h-auto lg:min-h-[400px] flex flex-col">
        <div className="card-header flex items-center justify-between">
          <h3 className="font-semibold text-lg">Top Categories</h3>
          <select 
            className="form-input text-sm py-1.5 px-3 bg-black/5 dark:bg-white/5 border border-glass rounded-xl cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors" 
            value={pieMonth} 
            onChange={(e) => setPieMonth(e.target.value)}
          >
             <option value="All Time">All Time</option>
             {availableMonths.map(m => (
               <option key={m} value={m}>{m}</option>
             ))}
          </select>
        </div>
        <div className="flex flex-col md:flex-row flex-1 min-h-0 items-center justify-center gap-6 w-full">
          {pieData.length > 0 ? (
            <>
              <div className="w-full md:w-[45%] h-[240px] md:h-full shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{ background: 'var(--bg-secondary)', border: 'var(--glass-border)', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 w-full flex flex-col gap-3">
                {pieData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: COLORS[index % COLORS.length] }}></div>
                      <span className="text-sm font-semibold text-secondary">{entry.name}</span>
                    </div>
                    <span className="text-sm font-bold">{formatCurrency(entry.value)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <p className="text-muted">No expense data available.</p>
            </div>
          )}
        </div>
      </div>

      </div> {/* End Row 3 */}
      
    </div>
  );
};
