import React from 'react';
import { Home, LayoutDashboard, BarChart3, Database, Lightbulb, CheckSquare, FileText, LineChart } from 'lucide-react';

const Sidebar = ({ currentPage, setCurrentPage }) => {
  const menuItems = [
    { id: 'home', label: 'Home Page', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics Workspace', icon: BarChart3 },
    { id: 'sql', label: 'SQL Insights', icon: Database },
    { id: 'insights', label: 'Business Insights', icon: Lightbulb },
    { id: 'recommendations', label: 'Recommendations', icon: CheckSquare },
    { id: 'reports', label: 'Reports & Exports', icon: FileText },
  ];

  return (
    <aside className="sticky top-0 flex flex-col justify-between w-64 h-screen shrink-0 border-r bg-brand-card border-brand-border z-30">
      <div>
        {/* Sidebar Header logo */}
        <div className="flex items-center gap-3 p-6 border-b border-brand-border">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-accent to-blue-400 text-white shadow-glow">
            <LineChart size={20} />
          </div>
          <div>
            <h1 className="text-sm font-bold leading-tight tracking-tight text-white font-outfit">
              Elevate Analytics
            </h1>
            <span className="block text-[10px] font-bold text-brand-textMuted uppercase tracking-widest">
              Retail Portal
            </span>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="p-4 mt-6 space-y-1.5">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-accent to-blue-600 text-white shadow-glow border-l-4 border-white'
                    : 'text-brand-textMuted hover:bg-brand-cardLight hover:text-white'
                }`}
              >
                <IconComponent size={18} className={isActive ? 'text-white' : 'text-brand-textMuted group-hover:text-white'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer info */}
      <div className="p-6 border-t border-brand-border bg-[#0e1422]">
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-textMuted">
            RETAIL BUSINESS
          </span>
          <span className="mt-1 text-xs font-semibold text-white font-outfit">
            Performance Dashboard
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
