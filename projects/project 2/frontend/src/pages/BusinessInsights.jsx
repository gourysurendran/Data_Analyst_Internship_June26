import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import { Lightbulb, Info, AlertTriangle, ArrowUpRight, TrendingUp, DollarSign, Tag, Users } from 'lucide-react';

const BusinessInsights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch('/api/business-insights')
      .then(res => res.json())
      .then(data => {
        setInsights(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading business insights:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loader message="Compiling statistical findings..." />;
  }

  const categories = ["All", ...new Set(insights.map(i => i.category))];

  // Filtering logic
  const filteredInsights = insights.filter(ins => {
    const matchesCategory = filterCategory === "All" || ins.category === filterCategory;
    const matchesSearch = ins.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ins.detail.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ins.metric.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getImpactBadge = (impact) => {
    switch (impact) {
      case 'Critical':
        return <span className="px-2 py-0.5 rounded-full bg-brand-loss/10 text-brand-loss border border-brand-loss/20 text-[10px] font-bold">Critical</span>;
      case 'High':
        return <span className="px-2 py-0.5 rounded-full bg-brand-warning/10 text-brand-warning border border-brand-warning/20 text-[10px] font-bold">High Impact</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-brand-accent/10 text-brand-accent border border-brand-accent/20 text-[10px] font-bold">{impact} Impact</span>;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Sales Performance':
        return <ArrowUpRight className="text-brand-accent" size={18} />;
      case 'Profitability':
        return <TrendingUp className="text-brand-profit" size={18} />;
      case 'Pricing Strategy':
        return <Tag className="text-brand-warning" size={18} />;
      case 'Customer Behavior':
        return <Users className="text-[#a855f7]" size={18} />;
      default:
        return <Info className="text-brand-textMuted" size={18} />;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold font-outfit text-white">Business Insights Catalog</h1>
        <p className="text-xs text-brand-textMuted mt-0.5">Explore 15 key analytical insights generated from database patterns and customer transactions</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-brand-card p-4 rounded-xl border border-brand-border text-xs">
        {/* Search */}
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search insights..."
          className="w-full sm:w-64 bg-brand-cardLight border border-brand-border rounded-xl px-4 py-2 text-white font-medium focus:outline-none focus:border-brand-accent"
        />

        {/* Categories Chips */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                filterCategory === cat
                  ? "bg-brand-accent text-white border-brand-accent shadow-glow"
                  : "bg-brand-cardLight text-brand-textMuted border-brand-border hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Insights Grid */}
      {filteredInsights.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInsights.map((ins) => (
            <div 
              key={ins.id} 
              className={`border bg-brand-card p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${
                ins.impact === 'Critical' 
                  ? 'border-brand-loss/30 hover:border-brand-loss hover:shadow-glow-loss' 
                  : 'border-brand-border hover:border-brand-accent hover:shadow-glow'
              }`}
            >
              <div className="space-y-4">
                {/* Top Row */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-brand-cardLight border border-brand-border flex items-center justify-center">
                      {getCategoryIcon(ins.category)}
                    </div>
                    <span className="text-[10px] font-bold text-brand-textMuted uppercase tracking-wider">{ins.category}</span>
                  </div>
                  {getImpactBadge(ins.impact)}
                </div>

                {/* Insight details */}
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-white font-outfit">{ins.title}</h3>
                  <div className="text-[10px] font-bold text-brand-accent font-mono uppercase bg-brand-accent/5 inline-block px-2 py-0.5 rounded border border-brand-accent/10">
                    Metric: {ins.metric}
                  </div>
                  <p className="text-xs text-brand-textMuted leading-relaxed pt-1">{ins.detail}</p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-6 pt-4 border-t border-brand-border/40 flex justify-between items-center text-[10px] font-bold uppercase text-brand-textMuted font-mono">
                <span>Insight ID: {ins.id}</span>
                <span className="flex items-center gap-1"><Lightbulb size={12} className="text-brand-accent" /> Data-Verified</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-brand-border rounded-2xl bg-brand-card">
          <p className="text-xs text-brand-textMuted">No insights matches your search parameters.</p>
        </div>
      )}
    </div>
  );
};

export default BusinessInsights;
