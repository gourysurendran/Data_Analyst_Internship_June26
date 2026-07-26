import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import { Terminal, Clock, Play, FileCode, CheckCircle, Database } from 'lucide-react';

const SQLInsights = () => {
  const [queriesList, setQueriesList] = useState([]);
  const [selectedQueryId, setSelectedQueryId] = useState(1);
  const [activeTab, setActiveTab] = useState("predefined"); // predefined, custom
  
  // Custom query console states
  const [customSql, setCustomSql] = useState("SELECT Category, SUM(Sales) as Sales, SUM(Profit) as Profit FROM sales_data GROUP BY Category;");
  const [customResult, setCustomResult] = useState(null);
  const [customRunning, setCustomRunning] = useState(false);

  // Predefined query states
  const [queryResult, setQueryResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [loadingList, setLoadingList] = useState(true);

  useEffect(() => {
    // Load queries metadata
    fetch('/api/sql-insights')
      .then(res => res.json())
      .then(data => {
        setQueriesList(data);
        setLoadingList(false);
      })
      .catch(err => {
        console.error("Error loading SQL queries metadata:", err);
        setLoadingList(false);
      });
  }, []);

  // Run selected predefined query
  useEffect(() => {
    if (loadingList || queriesList.length === 0) return;
    runPredefinedQuery(selectedQueryId);
  }, [selectedQueryId, queriesList, loadingList]);

  const runPredefinedQuery = (id) => {
    setRunning(true);
    fetch(`/api/sql-insights/${id}`)
      .then(res => res.json())
      .then(data => {
        setQueryResult(data);
        setRunning(false);
      })
      .catch(err => {
        console.error(`Error running query ${id}:`, err);
        setRunning(false);
      });
  };

  const handleRunCustomQuery = () => {
    setCustomRunning(true);
    setCustomResult(null);
    fetch('/api/sql-insights/custom', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql: customSql })
    })
      .then(res => res.json())
      .then(data => {
        setCustomResult(data);
        setCustomRunning(false);
      })
      .catch(err => {
        console.error("Error running custom SQL query:", err);
        setCustomResult({ success: false, error: "Network or Server error occurred." });
        setCustomRunning(false);
      });
  };

  if (loadingList) {
    return <Loader message="Indexing SQL catalogs..." />;
  }

  const selectedQueryMeta = queriesList.find(q => q.id === selectedQueryId);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-outfit text-white">SQL Insights Engine</h1>
          <p className="text-xs text-brand-textMuted mt-0.5">Execute structured SQL queries directly on the SQLite database and extract analytical parameters</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab("predefined")}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
              activeTab === "predefined" 
                ? "bg-brand-accent text-white border-brand-accent shadow-glow" 
                : "bg-brand-card text-brand-textMuted border-brand-border hover:text-white"
            }`}
          >
            Portfolio Queries (15)
          </button>
          <button 
            onClick={() => setActiveTab("custom")}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
              activeTab === "custom" 
                ? "bg-brand-accent text-white border-brand-accent shadow-glow" 
                : "bg-brand-card text-brand-textMuted border-brand-border hover:text-white"
            }`}
          >
            Custom SQL Console
          </button>
        </div>
      </div>

      {activeTab === "predefined" ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Query Selection List (Left 1 Col) */}
          <div className="lg:col-span-1 border bg-brand-card border-brand-border rounded-2xl p-4 h-[calc(100vh-200px)] overflow-y-auto space-y-1">
            <span className="block text-[10px] font-bold text-brand-textMuted uppercase tracking-widest px-2 mb-3">SQL Catalog</span>
            {queriesList.map((q) => (
              <button
                key={q.id}
                onClick={() => setSelectedQueryId(q.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  selectedQueryId === q.id 
                    ? 'bg-brand-cardLight border border-brand-accent/50 text-white font-bold' 
                    : 'text-brand-textMuted hover:bg-brand-cardLight/30 hover:text-white'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="font-mono text-[10px] mt-0.5 bg-brand-border px-1.5 py-0.5 rounded text-brand-textMuted font-bold">{q.id}</span>
                  <span>{q.title}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Query Executor & Output (Right 3 Col) */}
          <div className="lg:col-span-3 space-y-6">
            {selectedQueryMeta && (
              <div className="border bg-brand-card border-brand-border rounded-2xl p-6 space-y-6">
                
                {/* Meta details */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Database size={16} className="text-brand-accent" />
                    <h2 className="text-base font-bold font-outfit text-white">{selectedQueryMeta.title}</h2>
                  </div>
                  <p className="text-xs text-brand-textMuted leading-relaxed">{selectedQueryMeta.description}</p>
                </div>

                {/* SQL Code Block */}
                <div className="relative border border-brand-border bg-[#0e1422] rounded-xl p-4 overflow-hidden group">
                  <div className="absolute top-3 right-3 text-[9px] font-bold uppercase text-brand-textMuted bg-brand-card border border-brand-border px-1.5 py-0.5 rounded flex items-center gap-1">
                    <FileCode size={10} /> SQLite Syntax
                  </div>
                  <pre className="font-mono text-xs text-blue-300 overflow-x-auto select-all leading-relaxed whitespace-pre-wrap pt-2 font-medium">
                    {selectedQueryMeta.sql}
                  </pre>
                </div>

                {/* Action button */}
                <div className="flex justify-between items-center text-xs font-semibold">
                  <div className="flex gap-4 items-center text-brand-textMuted">
                    {queryResult?.success && (
                      <>
                        <span className="flex items-center gap-1.5 text-brand-profit font-bold">
                          <CheckCircle size={14} /> Completed
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {queryResult.execution_time_ms} ms
                        </span>
                        <span>
                          Rows: {queryResult.data.length}
                        </span>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => runPredefinedQuery(selectedQueryId)}
                    disabled={running}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white font-bold transition-all disabled:opacity-50"
                  >
                    <Play size={12} fill="white" /> {running ? "Running..." : "Execute SQL"}
                  </button>
                </div>

                {/* Business Insight block */}
                <div className="border border-brand-profit/20 bg-brand-profit/5 rounded-xl p-4 space-y-1">
                  <h4 className="text-xs font-bold text-brand-profit uppercase tracking-wider">Business Analyst Insight</h4>
                  <p className="text-xs text-brand-textMuted leading-relaxed">{selectedQueryMeta.business_insight}</p>
                </div>

                {/* Results Table */}
                {running ? (
                  <Loader message={`Querying sales database for query ID ${selectedQueryId}...`} />
                ) : queryResult?.success ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase text-brand-textMuted tracking-wider">Execution Ledger Output</span>
                    </div>
                    
                    <div className="overflow-x-auto border border-brand-border/60 rounded-xl max-h-[300px]">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead className="bg-[#0e1422] sticky top-0 border-b border-brand-border">
                          <tr className="text-brand-textMuted font-bold font-mono">
                            {queryResult.columns.map((col, idx) => (
                              <th key={idx} className="p-3 whitespace-nowrap">{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-border/40 font-medium">
                          {queryResult.data.map((row, rowIdx) => (
                            <tr key={rowIdx} className="hover:bg-brand-cardLight/20 font-mono text-white">
                              {queryResult.columns.map((col, colIdx) => {
                                const val = row[col];
                                return (
                                  <td key={colIdx} className="p-3">
                                    {val === null || val === undefined 
                                      ? <span className="text-brand-loss">NULL</span> 
                                      : typeof val === 'number' && col.toLowerCase().includes('sales') || col.toLowerCase().includes('profit') || col.toLowerCase().includes('spent')
                                      ? `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                      : typeof val === 'number'
                                      ? val.toLocaleString()
                                      : val.toString()}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : queryResult && !queryResult.success ? (
                  <div className="border border-brand-loss/30 bg-brand-loss/5 p-4 rounded-xl text-xs space-y-1">
                    <h4 className="font-bold text-brand-loss">Query Execution Error</h4>
                    <p className="font-mono text-brand-textMuted">{queryResult.error}</p>
                  </div>
                ) : null}

              </div>
            )}
          </div>
        </div>
      ) : (
        /* Custom SQL Console Workspace */
        <div className="border bg-brand-card border-brand-border rounded-2xl p-6 space-y-6">
          <div className="space-y-1.5">
            <h2 className="text-base font-bold font-outfit text-white flex items-center gap-1.5">
              <Terminal size={18} className="text-brand-accent" /> SQL Console Playground
            </h2>
            <p className="text-xs text-brand-textMuted leading-relaxed">
              Write custom read-only SQL commands against the database schema. Only <b>SELECT</b> operations are permitted for data safety. The main database table is <b>sales_data</b>.
            </p>
          </div>

          {/* Text Editor */}
          <div className="space-y-2">
            <textarea
              value={customSql}
              onChange={(e) => setCustomSql(e.target.value)}
              className="w-full h-32 bg-[#0e1422] border border-brand-border rounded-xl p-4 font-mono text-xs text-blue-300 focus:outline-none focus:border-brand-accent leading-relaxed select-all"
              placeholder="SELECT * FROM sales_data LIMIT 10;"
            />
            <div className="flex justify-end gap-3 text-xs font-semibold">
              <button 
                onClick={() => setCustomSql("SELECT State, SUM(Sales) as Revenue, SUM(Profit) as Net_Profit FROM sales_data WHERE Region = 'East' GROUP BY State ORDER BY Revenue DESC;")}
                className="px-3.5 py-2 border border-brand-border bg-brand-card hover:bg-brand-cardLight rounded-xl text-brand-textMuted hover:text-white transition-colors"
              >
                Sample Query
              </button>
              <button
                onClick={handleRunCustomQuery}
                disabled={customRunning || !customSql.trim()}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white font-bold transition-all disabled:opacity-50"
              >
                <Play size={12} fill="white" /> {customRunning ? "Running..." : "Run Custom Query"}
              </button>
            </div>
          </div>

          {/* Results grid */}
          {customRunning ? (
            <Loader message="Accessing database records..." />
          ) : customResult ? (
            customResult.success ? (
              <div className="space-y-3">
                <div className="flex gap-4 items-center text-xs font-semibold text-brand-textMuted">
                  <span className="text-brand-profit font-bold flex items-center gap-1"><CheckCircle size={14} /> Completed</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {customResult.execution_time_ms} ms</span>
                  <span>Returned Rows: {customResult.data.length}</span>
                </div>
                
                {customResult.data.length > 0 ? (
                  <div className="overflow-x-auto border border-brand-border/60 rounded-xl max-h-[350px]">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead className="bg-[#0e1422] sticky top-0 border-b border-brand-border">
                        <tr className="text-brand-textMuted font-bold font-mono">
                          {customResult.columns.map((col, idx) => (
                            <th key={idx} className="p-3">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-border/40 font-medium">
                        {customResult.data.map((row, rowIdx) => (
                          <tr key={rowIdx} className="hover:bg-brand-cardLight/20 font-mono text-white">
                            {customResult.columns.map((col, colIdx) => (
                              <td key={colIdx} className="p-3">
                                {row[col] === null || row[col] === undefined 
                                  ? <span className="text-brand-loss">NULL</span> 
                                  : row[col].toString()}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-xs text-brand-textMuted text-center py-6 border border-brand-border/40 rounded-xl bg-brand-cardLight/10">
                    Query ran successfully but returned 0 rows.
                  </div>
                )}
              </div>
            ) : (
              <div className="border border-brand-loss/30 bg-brand-loss/5 p-4 rounded-xl text-xs space-y-1">
                <h4 className="font-bold text-brand-loss">SQL Parsing & Execution Error</h4>
                <p className="font-mono text-brand-textMuted">{customResult.error}</p>
              </div>
            )
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SQLInsights;
