import React, { useMemo, useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Sparkles, ArrowRight, ArrowDownRight, AlertTriangle, Lightbulb, Activity, Target, Search } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { categories } from '../utils/mockData';

export const Insights = () => {
  const { summary, transactions, formatCurrency } = useFinance();

  const [queryMonth, setQueryMonth] = useState('All Time');
  const [queryCategory, setQueryCategory] = useState('All Categories');

  const availableMonths = useMemo(() => {
    const months = new Set();
    transactions.forEach(t => {
      months.add(t.date.substring(0, 7));
    });
    return Array.from(months).sort((a, b) => b.localeCompare(a));
  }, [transactions]);

  const queryResult = useMemo(() => {
    let income = 0;
    let expenses = 0;
    let categorySpend = 0;

    transactions.forEach(t => {
      const isMonthMatch = queryMonth === 'All Time' || t.date.substring(0, 7) === queryMonth;
      if (isMonthMatch) {
         if (t.type === 'income') income += Number(t.amount);
         if (t.type === 'expense') expenses += Number(t.amount);
         if (t.type === 'expense' && (queryCategory === 'All Categories' || t.category === queryCategory)) {
            categorySpend += Number(t.amount);
         }
      }
    });

    return { income, expenses, categorySpend };
  }, [transactions, queryMonth, queryCategory]);

  const insights = useMemo(() => {
    let activeTransactions = transactions;
    if (queryMonth !== 'All Time') {
       activeTransactions = activeTransactions.filter(t => t.date.substring(0, 7) === queryMonth);
    }
    
    activeTransactions = activeTransactions.filter(t => t.category !== 'Stocks' && t.category !== 'Investment');

    if (activeTransactions.length === 0) return [];
    
    const results = [];
    
    // Calculate highest spending category
    const categoryTotals = {};
    const expenses = activeTransactions.filter(t => t.type === 'expense');
    expenses.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount);
    });
    
    let topCategory = null;
    let topAmount = 0;
    for (const [cat, amt] of Object.entries(categoryTotals)) {
      if (amt > topAmount) {
        topAmount = amt;
        topCategory = cat;
      }
    }

    if (topCategory) {
      results.push({
        title: 'Highest Spending Category',
        text: `Your biggest expense category is ${topCategory} at ${formatCurrency(topAmount)}. Consider reviewing your budget for this category.`,
        type: 'warning',
        icon: AlertTriangle
      });
    }

    // Savings rate dynamically calculated for the active query window
    const activeIncome = activeTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
    const activeExpenses = activeTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);

    if (activeIncome > 0) {
      const savingsRate = ((activeIncome - activeExpenses) / activeIncome) * 100;
      if (savingsRate > 20) {
        results.push({
          title: 'Great Savings Rate!',
          text: `You are saving ${savingsRate.toFixed(1)}% of your income. Keep up the excellent financial habits!`,
          type: 'success',
          icon: Sparkles
        });
      } else if (savingsRate > 0) {
        results.push({
          title: 'Positive Cash Flow',
          text: `You have a positive cash flow. You are saving ${savingsRate.toFixed(1)}% of your income. It's recommended to aim for at least 20%.`,
          type: 'neutral',
          icon: ArrowRight
        });
      } else {
        results.push({
          title: 'Negative Cash Flow',
          text: `You are spending more than you earn! Your expenses exceed your income by ${formatCurrency(Math.abs(activeIncome - activeExpenses))}.`,
          type: 'danger',
          icon: ArrowDownRight
        });
      }
    }

    // Largest single expense
    if (expenses.length > 0) {
      const largestExpense = expenses.reduce((prev, current) => (prev.amount > current.amount) ? prev : current);
      results.push({
        title: 'Largest Single Expense',
        text: `Your largest single purchase was "${largestExpense.description}" for ${formatCurrency(largestExpense.amount)} on ${new Date(largestExpense.date).toLocaleDateString()}.`,
        type: 'neutral',
        icon: ArrowRight
      });
    }

    results.push({
      title: 'Transaction Activity',
      text: `You processed ${activeTransactions.length} transactions across ${Object.keys(categoryTotals).length} categories ${queryMonth !== 'All Time' ? 'this month.' : 'overall.'}`,
      type: 'neutral',
      icon: Activity
    });

    const goalDeposits = expenses.filter(t => t.category === 'Savings' && t.description.includes('Goal'));
    if (goalDeposits.length > 0) {
       const totalSaved = goalDeposits.reduce((acc, t) => acc + Number(t.amount), 0);
       results.push({
         title: 'Goal Progress',
         text: `You've saved ${formatCurrency(totalSaved)} towards your goals. Great progress!`,
         type: 'success',
         icon: Target
       });
    }

    return results;
  }, [transactions, summary, queryMonth, formatCurrency]);

  const radarData = useMemo(() => {
    const categoryTotals = {};
    const expenses = transactions.filter(t => {
       const isMonthMatch = queryMonth === 'All Time' || t.date.substring(0, 7) === queryMonth;
       return t.type === 'expense' && isMonthMatch;
    });
    
    expenses.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount);
    });
    
    const maxAmount = Math.max(...Object.values(categoryTotals), 1);
    
    return Object.keys(categoryTotals).map(cat => ({
      subject: cat,
      volume: categoryTotals[cat],
      fullMark: maxAmount * 1.2
    }));
  }, [transactions, queryMonth]);

  return (
    <div className="animate-fade-in flex flex-col gap-6 h-full pb-8">
      
      {/* Top Level Custom Query Matrix */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-black/5 dark:bg-white/5 border border-glass px-6 py-5 rounded-2xl shadow-sm">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Search className="text-indigo-500" strokeWidth={2.5}/> Balance Insights
          </h2>
          <div className="flex items-center gap-3 mt-1">
             <select 
               className="form-input text-sm py-1.5 px-3 bg-black/5 dark:bg-white/5 border border-glass rounded-xl cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors" 
               value={queryMonth} 
               onChange={(e) => setQueryMonth(e.target.value)}
             >
                <option value="All Time">All Time</option>
                {availableMonths.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
             </select>
             
             <select 
               className="form-input text-sm py-1.5 px-3 bg-black/5 dark:bg-white/5 border border-glass rounded-xl cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors" 
               value={queryCategory} 
               onChange={(e) => setQueryCategory(e.target.value)}
             >
                <option value="All Categories">All Categories</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
             </select>
          </div>
        </div>
        
        <div className="flex items-center gap-6 bg-indigo-500/10 border border-indigo-500/20 px-6 py-3 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.15)] flex-1 md:flex-none">
           <div className="flex flex-col border-r border-indigo-500/20 pr-6">
             <span className="text-xs text-indigo-400 font-semibold mb-0.5">Total Income</span>
             <span className="text-sm font-bold text-success">+{formatCurrency(queryResult.income)}</span>
           </div>
           <div className="flex flex-col">
             <span className="text-xs text-indigo-400 font-semibold mb-0.5">
               {queryCategory === 'All Categories' ? 'Total Expenses' : `${queryCategory} Expense`}
             </span>
             <span className="text-sm font-bold text-danger">
               -{formatCurrency(queryCategory === 'All Categories' ? queryResult.expenses : queryResult.categorySpend)}
             </span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full flex-1">
        
        {/* Left Bento Module: Core Observations Only */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-primary flex items-center gap-2"><Sparkles size={18} className="text-emerald-500"/> Core Observations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            {insights.length > 0 ? (
              insights.map((insight, idx) => {
                let glowColor = 'border-indigo-500/30 bg-indigo-500/5 shadow-[0_0_15px_rgba(99,102,241,0.1)]';
                let iconColor = 'text-indigo-500';
                
                if (insight.type === 'success') {
                  glowColor = 'border-emerald-500/30 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.1)]';
                  iconColor = 'text-emerald-500';
                } else if (insight.type === 'warning') {
                  glowColor = 'border-amber-500/30 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.1)]';
                  iconColor = 'text-amber-500';
                } else if (insight.type === 'danger') {
                  glowColor = 'border-rose-500/30 bg-rose-500/5 shadow-[0_0_15px_rgba(244,63,94,0.1)]';
                  iconColor = 'text-rose-500';
                }

                return (
                  <div key={idx} className={`p-5 rounded-2xl border backdrop-blur-sm flex flex-col items-start gap-4 transition-all hover:-translate-y-1 ${glowColor}`}>
                    <div className={`shrink-0 bg-white/50 dark:bg-black/20 p-2.5 rounded-xl ${iconColor}`}>
                      <insight.icon size={24} strokeWidth={2.5}/>
                    </div>
                    <div>
                      <h3 className="font-bold text-primary mb-1.5 text-[1.05rem]">{insight.title}</h3>
                      <p className="text-sm font-medium text-secondary leading-relaxed">{insight.text}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 card border border-glass p-8 text-center flex flex-col items-center gap-3 h-full justify-center min-h-[300px]">
                 <AlertTriangle size={32} className="text-muted opacity-50" />
                 <p className="text-muted font-medium">Not enough continuous vector data to generate dynamic AI insights yet. Awaiting transactions.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Bento Module: Velocity Distribution Radar */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-primary mb-1 flex items-center gap-2">Expenditure Web</h3>
          <div className="card h-full min-h-[440px] border border-glass flex flex-col p-6 shadow-sm overflow-hidden relative">
            
            {/* Absolute blur accent */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {radarData.length >= 3 ? (
              <div className="flex-1 w-full relative z-10 -ml-2 -mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="60%" data={radarData}>
                    <PolarGrid stroke="rgba(148, 163, 184, 0.2)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'currentColor', fontSize: window.innerWidth < 768 ? 9 : 11, fontWeight: 600, opacity: 0.7 }} tickFormatter={(val) => window.innerWidth < 768 ? val.substring(0, 4) + '.' : val} className="text-slate-600 dark:text-slate-300" />
                    <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={false} axisLine={false} />
                    <Tooltip 
                       contentStyle={{ background: 'var(--tooltip-bg, rgba(15, 23, 42, 0.95))', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                       itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                    />
                    <Radar name="Spent" dataKey="volume" stroke="#6366f1" strokeWidth={2.5} fill="#6366f1" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4 border border-glass shadow-inner">
                  <Activity size={24} />
                </div>
                <h4 className="font-bold text-primary mb-1">Insufficient Vectors</h4>
                <p className="text-xs text-muted">A minimum of 3 diverse spending categories are required for the AI distribution radar mesh to construct correctly.</p>
              </div>
            )}
            
            {radarData.length > 0 && radarData.length >= 3 && (
              <div className="mt-4 pt-4 border-t border-glass flex items-center justify-between z-10 bg-black/5 dark:bg-white/5 p-4 rounded-xl">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Top Velocity Sector</p>
                  <p className="font-semibold text-primary text-sm mt-0.5">{radarData.reduce((prev, current) => (prev.volume > current.volume) ? prev : current).subject}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Active Vectors</p>
                  <p className="font-bold text-indigo-500 text-lg leading-none mt-0.5">{radarData.length}</p>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>

    </div>
  );
};
