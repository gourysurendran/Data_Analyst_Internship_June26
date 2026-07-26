import React from 'react';
import * as Icons from 'lucide-react';

const KPICard = ({ title, value, iconName, change, isPositive, prefix = "", suffix = "", subtitle = "vs prev year" }) => {
  const IconComponent = Icons[iconName] || Icons.TrendingUp;

  return (
    <div className="relative overflow-hidden transition-all duration-300 border bg-brand-card border-brand-border rounded-2xl p-6 shadow-md hover:shadow-glow hover:border-brand-accent group">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-brand-textMuted">
            {title}
          </span>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-white font-outfit">
            {prefix}{value}{suffix}
          </h3>
        </div>
        <div className="p-3 transition-all duration-300 border rounded-xl bg-brand-cardLight border-brand-border text-brand-accent group-hover:bg-brand-accent group-hover:text-white">
          <IconComponent size={20} />
        </div>
      </div>
      
      {change !== undefined && (
        <div className="flex items-center mt-4 text-xs">
          <span className={`px-2 py-0.5 rounded-full font-bold flex items-center mr-2 ${
            isPositive 
              ? 'bg-brand-profit/10 text-brand-profit' 
              : 'bg-brand-loss/10 text-brand-loss'
          }`}>
            {isPositive ? '↑' : '↓'} {change}
          </span>
          <span className="text-brand-textMuted font-medium">{subtitle}</span>
        </div>
      )}
    </div>
  );
};

export default KPICard;
