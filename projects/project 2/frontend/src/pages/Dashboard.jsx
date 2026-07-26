import React, { useState, useEffect } from 'react';
import KPICard from '../components/KPICard';
import Loader from '../components/Loader';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, 
  PieChart, Pie, Cell, BarChart, Bar, Legend 
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

const Dashboard = () => {
  const [kpis, setKpis] = useState(null);
  const [dbData, setDbData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = () => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetch('/api/kpis').then(res => {
        if (!res.ok) throw new Error("Failed to fetch KPIs");
        return res.json();
      }),
      fetch('/api/dashboard').then(res => {
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        return res.json();
      })
    ])
    .then(([kpiRes, dbRes]) => {
      setKpis(kpiRes);
      setDbData(dbRes);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error loading dashboard data:", err);
      setError("Could not connect to the backend server. Please verify that the backend is running on port 8001.");
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <Loader message="Analyzing transaction registers..." />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-brand-loss/20 bg-[#1e131d] rounded-2xl text-center space-y-4 max-w-2xl mx-auto my-12 shadow-glow">
        <div className="text-brand-loss text-xl font-bold font-outfit">Connection Refused</div>
        <p className="text-xs text-brand-textMuted leading-relaxed">
          {error}
        </p>
        <button 
          onClick={loadData}
          className="mt-2 px-4 py-2 bg-brand-cardLight hover:bg-brand-card border border-brand-border text-white text-xs font-semibold rounded-lg transition shadow-sm"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // Format currencies nicely
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const kpiItems = [
    { title: "Total Sales", value: kpis.total_sales, iconName: "DollarSign", prefix: "$", change: "12.4%", isPositive: true, subtitle: "YoY growth" },
    { title: "Total Profit", value: kpis.total_profit, iconName: "TrendingUp", prefix: "$", change: "8.2%", isPositive: true, subtitle: "YoY growth" },
    { title: "Profit Margin", value: kpis.profit_margin, iconName: "Percent", suffix: "%", change: "2.1%", isPositive: true, subtitle: "vs baseline" },
    { title: "Total Orders", value: kpis.total_orders, iconName: "ShoppingBag", change: "5.8%", isPositive: true, subtitle: "order count growth" },
    { title: "Avg Order Value", value: kpis.avg_order_value, iconName: "CreditCard", prefix: "$", change: "6.2%", isPositive: true, subtitle: "AOV growth" },
    { title: "Average Discount", value: kpis.avg_discount, iconName: "Tag", suffix: "%", change: "1.4%", isPositive: false, subtitle: "increase in discounts" },
    { title: "Total Customers", value: kpis.total_customers, iconName: "Users", change: "9.3%", isPositive: true, subtitle: "unique customer growth" }
  ];

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-outfit text-white">Operations Dashboard</h1>
          <p className="text-xs text-brand-textMuted mt-0.5">High-level financial KPIs and operational overview</p>
        </div>
        <div className="text-xs text-brand-textMuted bg-brand-card px-3 py-1.5 rounded-lg border border-brand-border font-medium">
          Source: SQLite DB • Data Live
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiItems.slice(0, 4).map((k, idx) => (
          <KPICard 
            key={idx}
            title={k.title}
            value={k.value.toLocaleString(undefined, { maximumFractionDigits: k.prefix ? 0 : undefined })}
            iconName={k.iconName}
            prefix={k.prefix}
            suffix={k.suffix}
            change={k.change}
            isPositive={k.isPositive}
            subtitle={k.subtitle}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {kpiItems.slice(4).map((k, idx) => (
          <KPICard 
            key={idx}
            title={k.title}
            value={k.value.toLocaleString(undefined, { maximumFractionDigits: k.prefix ? 0 : undefined })}
            iconName={k.iconName}
            prefix={k.prefix}
            suffix={k.suffix}
            change={k.change}
            isPositive={k.isPositive}
            subtitle={k.subtitle}
          />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Sales & Profit Trend */}
        <div className="lg:col-span-2 border bg-brand-card border-brand-border rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white font-outfit">Revenue & Net Profit Trend</h3>
            <p className="text-[10px] text-brand-textMuted">Monthly trajectory of sales revenue against net profit margins</p>
          </div>
          <div className="h-80 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dbData.monthly_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />
                <XAxis dataKey="Month" stroke="#64748b" />
                <YAxis stroke="#64748b" tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#151c2c', borderColor: '#1f293d', color: '#f8fafc' }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Area type="monotone" dataKey="Sales" name="Total Sales" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#salesGrad)" />
                <Area type="monotone" dataKey="Profit" name="Net Profit" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#profitGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Split Donut Chart */}
        <div className="border bg-brand-card border-brand-border rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white font-outfit">Product Category Distribution</h3>
            <p className="text-[10px] text-brand-textMuted">Share of revenue across primary business departments</p>
          </div>
          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dbData.category_split}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="Sales"
                  nameKey="Category"
                >
                  {dbData.category_split.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#151c2c', borderColor: '#1f293d', color: '#f8fafc' }}
                  formatter={(value) => formatCurrency(value)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5">
            {dbData.category_split.map((c, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                  <span className="font-semibold text-brand-textMuted">{c.Category}</span>
                </div>
                <div className="font-bold text-white">
                  {formatCurrency(c.Sales)} <span className="font-semibold text-brand-profit text-[10px] ml-1">({formatCurrency(c.Profit)} profit)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Regional performance bar chart */}
        <div className="border bg-brand-card border-brand-border rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white font-outfit">Geographic Regional Split</h3>
            <p className="text-[10px] text-brand-textMuted">Revenue and profits compared across regions</p>
          </div>
          <div className="h-60 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dbData.region_split} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />
                <XAxis dataKey="Region" stroke="#64748b" />
                <YAxis stroke="#64748b" tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#151c2c', borderColor: '#1f293d', color: '#f8fafc' }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Bar dataKey="Sales" name="Sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Profit" name="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent transactions */}
        <div className="lg:col-span-2 border bg-brand-card border-brand-border rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white font-outfit">Recent Sales Ledger</h3>
            <p className="text-[10px] text-brand-textMuted">The last 5 transactions processed in the SQLite database</p>
          </div>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-brand-border text-brand-textMuted font-bold">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3 text-right">Revenue</th>
                  <th className="pb-3 text-right">Profit</th>
                  <th className="pb-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/40 font-medium">
                {dbData.recent_transactions.map((t, idx) => (
                  <tr key={idx} className="hover:bg-brand-cardLight/30">
                    <td className="py-3 font-mono text-brand-accent">{t["Order ID"]}</td>
                    <td className="py-3 text-white">{t["Customer Name"]}</td>
                    <td className="py-3 text-brand-textMuted">{t["Category"]}</td>
                    <td className="py-3 text-right text-white font-bold">{formatCurrency(t["Sales"])}</td>
                    <td className={`py-3 text-right font-bold ${t["Profit"] >= 0 ? 'text-brand-profit' : 'text-brand-loss'}`}>
                      {t["Profit"] >= 0 ? '+' : ''}{formatCurrency(t["Profit"])}
                    </td>
                    <td className="py-3 text-right text-brand-textMuted">{t["Order Date"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
