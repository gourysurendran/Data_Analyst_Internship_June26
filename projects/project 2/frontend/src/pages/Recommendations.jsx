import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import { CheckSquare, Square, ShieldAlert, Award, FileSpreadsheet, Send, TrendingUp, Info } from 'lucide-react';

const Recommendations = () => {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState("All");
  
  // Interactive feature: user can check/uncheck items to mark as "implemented" or "in progress"
  const [completedRecs, setCompletedRecs] = useState([]);

  useEffect(() => {
    fetch('/api/recommendations')
      .then(res => res.json())
      .then(data => {
        setRecs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading recommendations:", err);
        setLoading(false);
      });
  }, []);

  const toggleCompleted = (id) => {
    if (completedRecs.includes(id)) {
      setCompletedRecs(completedRecs.filter(item => item !== id));
    } else {
      setCompletedRecs([...completedRecs, id]);
    }
  };

  if (loading) {
    return <Loader message="Formulating corporate recommendations..." />;
  }

  const priorities = ["All", "High", "Medium", "Low"];

  const filteredRecs = recs.filter(r => {
    return filterPriority === "All" || r.priority === filterPriority;
  });

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High':
        return 'border-l-4 border-brand-loss bg-brand-loss/5';
      case 'Medium':
        return 'border-l-4 border-brand-warning bg-brand-warning/5';
      default:
        return 'border-l-4 border-brand-accent bg-brand-accent/5';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return <span className="px-2 py-0.5 rounded-full bg-brand-loss/15 text-brand-loss text-[9px] font-bold uppercase tracking-wider">High Priority</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded-full bg-brand-warning/15 text-brand-warning text-[9px] font-bold uppercase tracking-wider">Medium Priority</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-brand-accent/15 text-brand-accent text-[9px] font-bold uppercase tracking-wider">Low Priority</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-outfit text-white">Actionable Recommendations</h1>
          <p className="text-xs text-brand-textMuted mt-0.5">Database-validated corporate operations, logistics, and pricing strategy improvements</p>
        </div>
        <div className="text-xs text-brand-textMuted bg-[#0e1422] border border-brand-border px-3 py-1.5 rounded-lg flex items-center gap-2">
          <span>Implementation progress:</span>
          <span className="font-bold text-brand-profit font-outfit">
            {completedRecs.length}/{recs.length} ({Math.round((completedRecs.length/recs.length)*100)}%)
          </span>
        </div>
      </div>

      {/* Priority Filter Bar */}
      <div className="flex gap-2 bg-brand-card p-3 rounded-xl border border-brand-border text-xs">
        <span className="self-center font-bold text-brand-textMuted px-2 mr-2">Filter Priority:</span>
        {priorities.map((p, idx) => (
          <button
            key={idx}
            onClick={() => setFilterPriority(p)}
            className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
              filterPriority === p
                ? "bg-brand-accent text-white border-brand-accent shadow-glow"
                : "bg-brand-cardLight text-brand-textMuted border-brand-border hover:text-white"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Recommendations Cards List */}
      <div className="space-y-4">
        {filteredRecs.map((r) => {
          const isDone = completedRecs.includes(r.id);
          return (
            <div 
              key={r.id}
              className={`border bg-brand-card border-brand-border rounded-2xl p-5 transition-all duration-300 flex gap-4 ${getPriorityStyle(r.priority)} ${
                isDone ? 'opacity-60 saturate-50' : 'hover:border-brand-border/80'
              }`}
            >
              {/* Checkbox selector */}
              <button 
                onClick={() => toggleCompleted(r.id)}
                className="self-start mt-1 text-brand-accent hover:text-brand-accent/80 transition-colors"
              >
                {isDone ? (
                  <CheckSquare size={20} className="text-brand-profit" />
                ) : (
                  <Square size={20} className="text-brand-textMuted" />
                )}
              </button>

              {/* Recommendation Details */}
              <div className="space-y-2 w-full">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-outfit">{r.title}</span>
                    <span className="text-[10px] font-bold text-brand-textMuted bg-brand-cardLight border border-brand-border px-2 py-0.5 rounded">
                      Area: {r.area}
                    </span>
                  </div>
                  {getPriorityBadge(r.priority)}
                </div>
                
                <p className="text-xs text-brand-textMuted leading-relaxed">
                  {r.action}
                </p>

                {/* Checklist implementation status */}
                <div className="pt-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-textMuted font-mono">
                  <span>Status:</span>
                  <span className={isDone ? "text-brand-profit" : "text-brand-warning"}>
                    {isDone ? "Implemented & Verified" : "Awaiting Operational Review"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Recommendations;
