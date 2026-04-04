import React, { useState } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Insights } from './pages/Insights';
import { Support } from './pages/Support';
import { Markets } from './pages/Markets';
import { Cards } from './pages/Cards';
import './index.css';

function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');

  React.useEffect(() => {
    const handleTabChange = (e) => setCurrentTab(e.detail);
    window.addEventListener('change-tab', handleTabChange);
    return () => window.removeEventListener('change-tab', handleTabChange);
  }, []);

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <Transactions />;
      case 'insights':
        return <Insights />;
      case 'markets':
        return <Markets />;
      case 'cards':
        return <Cards />;
      case 'support':
        return <Support />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <FinanceProvider>
      <Layout currentTab={currentTab} setCurrentTab={setCurrentTab}>
        {renderContent()}
      </Layout>
    </FinanceProvider>
  );
}

export default App;
