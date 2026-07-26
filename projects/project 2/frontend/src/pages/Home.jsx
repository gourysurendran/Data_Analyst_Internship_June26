import React, { useState, useEffect } from 'react';
import { Play, Database, FileSpreadsheet, Server, Award, ChevronRight, BarChart2, ShieldAlert } from 'lucide-react';
import Loader from '../components/Loader';

const Home = ({ onStartExploration }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/kpis')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load KPIs for homepage:", err);
        setLoading(false);
      });
  }, []);

  const techStack = [
    { category: "Frontend", items: ["React.js", "Tailwind CSS", "Recharts", "Lucide Icons"] },
    { category: "Backend", items: ["FastAPI", "Uvicorn", "RESTful Routing"] },
    { category: "Database", items: ["SQLite", "Structured Query Language (SQL)"] },
    { category: "Data Analysis", items: ["Python", "Pandas", "NumPy"] },
    { category: "Visualizations", items: ["Plotly", "Matplotlib"] },
    { category: "Reports", items: ["ReportLab (PDF)", "Python-pptx (PowerPoint)"] }
  ];

  const workflowSteps = [
    { title: "1. Data Generation", desc: "Generating 5,000+ realistic transactional retail rows based on Superstore behaviors." },
    { title: "2. Data Cleaning & Load", desc: "Removing duplicate records and filling missing codes with Pandas, then loading to SQLite." },
    { title: "3. SQL Insights querying", desc: "Executing 15 complex business SQL queries (aggregates, windows, rankings) on the DB." },
    { title: "4. REST API deployment", desc: "Exposing query results and analytical statistics through secure FastAPI routes." },
    { title: "5. Visual Analytics", desc: "Visualizing metrics using React & interactive Recharts charts with deep cross-filters." },
    { title: "6. Business Decisions", desc: "Formulating 15 key analytical findings and 10 actionable recommendations for the business." }
  ];

  return (
    <div className="space-y-12 pb-12 animate-fadeIn">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-brand-border bg-gradient-to-br from-[#121829] via-brand-card to-[#0b0f19] p-8 md:p-12 shadow-glow">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-accent/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-brand-profit/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-accent/10 text-brand-accent border border-brand-accent/20">
            <Award size={12} /> Retail Business Analytics
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white font-outfit mt-4 leading-tight">
            Retail Business Performance & <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-blue-400">
              Profitability Analysis
            </span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-brand-textMuted leading-relaxed">
            An interactive, production-ready Business Intelligence application analyzing transactional sales pipelines, regional margins, and inventory performance. This project showcases the end-to-end analytics workflow from database extraction to strategic business recommendations.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button 
              onClick={onStartExploration}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white font-semibold transition-all duration-200 shadow-glow"
            >
              <Play size={16} fill="white" /> Launch Dashboard <ChevronRight size={16} />
            </button>
            <a 
              href="#problem-statement"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-cardLight border border-brand-border hover:border-brand-textMuted text-brand-text font-semibold transition-all duration-200"
            >
              Read Business Case
            </a>
          </div>
        </div>
      </section>

      {/* Quick Statistics Summary */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-outfit text-white">Live Operations Summary</h2>
        {loading ? (
          <div className="h-28 flex items-center justify-center border border-brand-border rounded-2xl bg-brand-card"><Loader message="Connecting to SQLite..." /></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border bg-brand-card border-brand-border rounded-2xl p-5">
              <span className="text-xs font-semibold text-brand-textMuted uppercase tracking-wider">Total Revenue</span>
              <p className="text-2xl font-bold font-outfit text-white mt-1">${stats?.total_sales.toLocaleString()}</p>
            </div>
            <div className="border bg-brand-card border-brand-border rounded-2xl p-5">
              <span className="text-xs font-semibold text-brand-textMuted uppercase tracking-wider">Net Profit</span>
              <p className="text-2xl font-bold font-outfit text-brand-profit mt-1">${stats?.total_profit.toLocaleString()}</p>
            </div>
            <div className="border bg-brand-card border-brand-border rounded-2xl p-5">
              <span className="text-xs font-semibold text-brand-textMuted uppercase tracking-wider">Transactions Analyzed</span>
              <p className="text-2xl font-bold font-outfit text-brand-accent mt-1">{stats?.total_orders.toLocaleString()} orders</p>
            </div>
            <div className="border bg-brand-card border-brand-border rounded-2xl p-5">
              <span className="text-xs font-semibold text-brand-textMuted uppercase tracking-wider">Overall Margin</span>
              <p className="text-2xl font-bold font-outfit text-white mt-1">{stats?.profit_margin}%</p>
            </div>
          </div>
        )}
      </section>

      {/* Business Problem & Objectives */}
      <section id="problem-statement" className="grid md:grid-cols-2 gap-6">
        <div className="border bg-brand-card border-brand-border rounded-2xl p-6 md:p-8 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-brand-loss/10 border border-brand-loss/20 flex items-center justify-center text-brand-loss">
            <ShieldAlert size={24} />
          </div>
          <h2 className="text-xl font-bold font-outfit text-white">The Business Problem</h2>
          <p className="text-sm text-brand-textMuted leading-relaxed">
            The national retail operations are witnessing significant revenue expansion, yet net operating income is stagnating or contracting. Regional sales managers are hitting aggregate volume targets, but margins are eroding. 
          </p>
          <p className="text-sm text-brand-textMuted leading-relaxed">
            Without granular transparency across categories, customer tiers, shipping pipelines, and promotional discount strategies, executive leadership is unable to identify where capital is leaking and how to restructure pricing guidelines.
          </p>
        </div>

        <div className="border bg-brand-card border-brand-border rounded-2xl p-6 md:p-8 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-brand-profit/10 border border-brand-profit/20 flex items-center justify-center text-brand-profit">
            <BarChart2 size={24} />
          </div>
          <h2 className="text-xl font-bold font-outfit text-white">Project Objectives</h2>
          <ul className="text-sm text-brand-textMuted space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-brand-profit font-bold">✓</span>
              <span>Integrate multi-source data concepts into a centralized SQLite database for high-performance indexing and analytical querying.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-profit font-bold">✓</span>
              <span>Build robust backend API infrastructure to handle complex, real-time multi-dimensional aggregations and slicing.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-profit font-bold">✓</span>
              <span>Create an interactive React dashboards visual workspace modeling key Power BI dashboard reporting principles.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand-profit font-bold">✓</span>
              <span>Extract database-verified corporate insights and build actionable executive recommendations to defend margins.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Dataset Information */}
      <section className="border bg-brand-card border-brand-border rounded-2xl p-6 md:p-8 space-y-6">
        <h2 className="text-xl font-bold font-outfit text-white">Dataset Information</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-brand-accent flex items-center gap-1.5"><FileSpreadsheet size={16} /> Core Data Structure</h3>
            <p className="text-xs text-brand-textMuted">
              Simulates a US-based commercial retail distributor (Superstore dataset architecture) capturing details on orders, shipping, catalog categories, geographic nodes, and transaction finance.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-brand-accent flex items-center gap-1.5"><Database size={16} /> Database Schema</h3>
            <p className="text-xs text-brand-textMuted">
              Housed in SQLite under the table <b>sales_data</b>, schema properties: Order_ID (TEXT), Order_Date (TEXT), Ship_Mode (TEXT), Segment (TEXT), State (TEXT), Region (TEXT), Product_ID (TEXT), Category (TEXT), Sub_Category (TEXT), Sales (REAL), Profit (REAL), Discount (REAL), and Quantity (INTEGER).
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-brand-accent flex items-center gap-1.5"><Server size={16} /> Pipeline Validation</h3>
            <p className="text-xs text-brand-textMuted">
              Cleaned automatically with Python Pandas. Truncates duplicate transactions, repairs structural anomalies (empty codes), and converts metrics to database data types on server startup.
            </p>
          </div>
        </div>
      </section>

      {/* Project Workflow */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-outfit text-white">Project Analytical Workflow</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {workflowSteps.map((step, idx) => (
            <div key={idx} className="border bg-brand-card border-brand-border rounded-xl p-5 hover:border-brand-accent transition-all duration-300">
              <h3 className="text-sm font-bold text-white font-outfit">{step.title}</h3>
              <p className="text-xs text-brand-textMuted mt-2 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technology Stack Grid */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-outfit text-white">Technology Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {techStack.map((stack, idx) => (
            <div key={idx} className="border bg-[#0e1422] border-brand-border rounded-xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-brand-textMuted uppercase tracking-wider">{stack.category}</span>
              <div className="mt-2 space-y-1">
                {stack.items.map((item, i) => (
                  <span key={i} className="block text-xs font-semibold text-white">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
