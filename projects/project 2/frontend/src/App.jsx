import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import SQLInsights from './pages/SQLInsights';
import BusinessInsights from './pages/BusinessInsights';
import Recommendations from './pages/Recommendations';
import Reports from './pages/Reports';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onStartExploration={() => setCurrentPage('dashboard')} />;
      case 'dashboard':
        return <Dashboard />;
      case 'analytics':
        return <Analytics />;
      case 'sql':
        return <SQLInsights />;
      case 'insights':
        return <BusinessInsights />;
      case 'recommendations':
        return <Recommendations />;
      case 'reports':
        return <Reports />;
      default:
        return <Home onStartExploration={() => setCurrentPage('dashboard')} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-brand-bg text-brand-text">
      {/* Sidebar Navigation */}
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Main Workspace Area */}
      <main className="flex-1 p-6 md:p-8 lg:p-10 h-screen overflow-y-auto bg-gradient-to-b from-[#0b0f19] to-[#05070c]">
        <div className="max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;
