import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { initialTransactions } from '../utils/mockData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { formatCurrency as globalCurrencyFormatter } from '../utils/currencyFormatter';

const FinanceContext = createContext();

export const useFinance = () => {
  return useContext(FinanceContext);
};

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useLocalStorage('finance_transactions', initialTransactions);
  const [role, setRole] = useLocalStorage('finance_role', 'viewer');
  const [theme, setTheme] = useLocalStorage('finance_theme', 'light');
  const [monthlyBudget, setMonthlyBudget] = useLocalStorage('finance_monthly_budget', 2300);
  const [currency, setCurrency] = useLocalStorage('finance_currency', 'USD');
  const [cardData, setCardData] = useLocalStorage('finance_card', {
      number: '**** **** 6541',
      expiry: '12/26',
      name: 'Adarsh Kumar Singh'
  });

  // Sync theme with DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Actions
  const addTransaction = (t) => {
    setTransactions(prev => [{ ...t, id: Date.now().toString() }, ...prev]);
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateMonthlyBudget = (amount) => {
    setMonthlyBudget(Number(amount));
  };

  const clearAllData = () => {
    setTransactions([]);
    setMonthlyBudget(2300);
    setRole('viewer');
    setTheme('light');
    setCurrency('USD');
    localStorage.removeItem('finance_transactions');
    localStorage.removeItem('finance_monthly_budget');
    localStorage.removeItem('finance_role');
    localStorage.removeItem('finance_theme');
    localStorage.removeItem('finance_currency');
  };

  const toggleRole = () => {
    setRole(prev => prev === 'admin' ? 'viewer' : 'admin');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Computed data
  const summary = useMemo(() => {
    let income = 0;
    let expenses = 0;
    transactions.forEach(t => {
      if (t.type === 'income') income += Number(t.amount);
      if (t.type === 'expense') expenses += Number(t.amount);
    });
    return {
      income,
      expenses,
      balance: income - expenses
    };
  }, [transactions]);

  const formatCurrency = (amount) => globalCurrencyFormatter(amount, currency);

  const [globalToast, setGlobalToast] = useState('');
  
  const showToast = (msg, duration = 3000) => {
    setGlobalToast(msg);
    setTimeout(() => setGlobalToast(''), duration);
  };

  return (
    <FinanceContext.Provider value={{
      globalToast,
      showToast,
      transactions,
      monthlyBudget,
      role,
      theme,
      currency,
      setCurrency,
      cardData,
      setCardData,
      formatCurrency,
      addTransaction,
      deleteTransaction,
      updateMonthlyBudget,
      clearAllData,
      toggleRole,
      toggleTheme,
      summary
    }}>
      {children}
    </FinanceContext.Provider>
  );
};
