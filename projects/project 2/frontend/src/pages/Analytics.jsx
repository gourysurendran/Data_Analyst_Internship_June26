import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, 
  BarChart, Bar, Legend, ScatterChart, Scatter, ZAxis, LabelList
} from 'recharts';
import { Filter, Calendar, RefreshCw } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f43f5e'];

const Analytics = () => {
  // Filter states
  const [filterOptions, setFilterOptions] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedSegments, setSelectedSegments] = useState([]);
  const [selectedShipModes, setSelectedShipModes] = useState([]);
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2026-06-30");

  const [activeTab, setActiveTab] = useState("trends");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch initial filter options and data
  useEffect(() => {
    fetchData(true);
  }, []);

  const fetchData = (initFilters = false) => {
    setLoading(true);
    const params = new URLSearchParams();
    
    selectedCategories.forEach(c => params.append("category", c));
    selectedRegions.forEach(r => params.append("region", r));
    selectedSegments.forEach(s => params.append("segment", s));
    selectedShipModes.forEach(sm => params.append("ship_mode", sm));
    
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);

    fetch(`/api/analytics?${params.toString()}`)
      .then(res => res.json())
      .then(resData => {
        setData(resData);
        if (initFilters && resData.filter_options) {
          setFilterOptions(resData.filter_options);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load analytics data:", err);
        setLoading(false);
      });
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedRegions([]);
    setSelectedSegments([]);
    setSelectedShipModes([]);
    setStartDate("2024-01-01");
    setEndDate("2026-06-30");
    // Trigger fetch directly by clearing variables (needs an effect, or run manually)
    setLoading(true);
    fetch(`/api/analytics`)
      .then(res => res.json())
      .then(resData => {
        setData(resData);
        setLoading(false);
      });
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const toggleFilter = (list, setList, val) => {
    if (list.includes(val)) {
      setList(list.filter(item => item !== val));
    } else {
      setList([...list, val]);
    }
  };

  // Custom tooltips
  const CurrencyTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-brand-card border border-brand-border p-3 rounded-lg shadow-lg text-xs font-semibold">
          <p className="text-brand-textMuted mb-1.5">{label}</p>
          {payload.map((p, idx) => (
            <p key={idx} style={{ color: p.color || p.fill }}>
              {p.name}: {formatCurrency(p.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold font-outfit text-white">Analytics Workspace</h1>
        <p className="text-xs text-brand-textMuted mt-0.5">Explore granular financial and operational performance metrics with cross-filtering</p>
      </div>

      {/* Global Filters Panel */}
      <div className="border bg-brand-card border-brand-border rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-brand-border/40">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-brand-accent">
            <Filter size={14} /> Control Panel Filters
          </div>
          <button 
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-[10px] font-bold uppercase text-brand-textMuted hover:text-white border border-brand-border px-2 py-1 rounded transition-colors"
          >
            <RefreshCw size={10} /> Reset Filters
          </button>
        </div>

        {filterOptions ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
            {/* Category Filter */}
            <div className="space-y-1.5">
              <span className="font-bold text-brand-textMuted">Categories</span>
              <div className="space-y-1">
                {filterOptions.categories.map((c, i) => (
                  <label key={i} className="flex items-center gap-2 text-white font-medium cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={selectedCategories.includes(c)}
                      onChange={() => toggleFilter(selectedCategories, setSelectedCategories, c)}
                      className="rounded border-brand-border text-brand-accent focus:ring-brand-accent bg-brand-cardLight"
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>

            {/* Region Filter */}
            <div className="space-y-1.5">
              <span className="font-bold text-brand-textMuted">Regions</span>
              <div className="space-y-1">
                {filterOptions.regions.map((r, i) => (
                  <label key={i} className="flex items-center gap-2 text-white font-medium cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={selectedRegions.includes(r)}
                      onChange={() => toggleFilter(selectedRegions, setSelectedRegions, r)}
                      className="rounded border-brand-border text-brand-accent focus:ring-brand-accent bg-brand-cardLight"
                    />
                    {r}
                  </label>
                ))}
              </div>
            </div>

            {/* Segment Filter */}
            <div className="space-y-1.5">
              <span className="font-bold text-brand-textMuted">Segments</span>
              <div className="space-y-1">
                {filterOptions.segments.map((s, i) => (
                  <label key={i} className="flex items-center gap-2 text-white font-medium cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={selectedSegments.includes(s)}
                      onChange={() => toggleFilter(selectedSegments, setSelectedSegments, s)}
                      className="rounded border-brand-border text-brand-accent focus:ring-brand-accent bg-brand-cardLight"
                    />
                    {s}
                  </label>
                ))}
              </div>
            </div>

            {/* Shipping Mode Filter */}
            <div className="space-y-1.5">
              <span className="font-bold text-brand-textMuted">Shipping Speed</span>
              <div className="space-y-1">
                {filterOptions.ship_modes.map((sm, i) => (
                  <label key={i} className="flex items-center gap-2 text-white font-medium cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={selectedShipModes.includes(sm)}
                      onChange={() => toggleFilter(selectedShipModes, setSelectedShipModes, sm)}
                      className="rounded border-brand-border text-brand-accent focus:ring-brand-accent bg-brand-cardLight"
                    />
                    {sm}
                  </label>
                ))}
              </div>
            </div>

            {/* Date Filters */}
            <div className="space-y-1.5">
              <span className="font-bold text-brand-textMuted flex items-center gap-1.5"><Calendar size={12} /> Date Range</span>
              <div className="space-y-2">
                <div>
                  <span className="block text-[10px] text-brand-textMuted">Start Date</span>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full mt-1 bg-brand-cardLight border border-brand-border rounded px-2.5 py-1 text-white text-xs font-semibold focus:outline-none focus:border-brand-accent"
                  />
                </div>
                <div>
                  <span className="block text-[10px] text-brand-textMuted">End Date</span>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full mt-1 bg-brand-cardLight border border-brand-border rounded px-2.5 py-1 text-white text-xs font-semibold focus:outline-none focus:border-brand-accent"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs text-brand-textMuted animate-pulse">Initializing filter modules...</div>
        )}

        <div className="flex justify-end pt-2 border-t border-brand-border/40">
          <button 
            onClick={() => fetchData(false)}
            className="px-6 py-2 rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white font-semibold text-xs transition-all duration-200"
          >
            Apply Active Filters
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-brand-border text-xs font-bold">
        {[
          { id: 'trends', label: '1. Sales & Profit Trends' },
          { id: 'products', label: '2. Product & Category Health' },
          { id: 'demographics', label: '3. Customer Tiers & Shipping' },
          { id: 'geography', label: '4. Regional Analysis' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 border-b-2 font-semibold transition-colors duration-200 ${
              activeTab === tab.id 
                ? 'border-brand-accent text-brand-accent' 
                : 'border-transparent text-brand-textMuted hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading state or analytics widgets */}
      {loading ? (
        <Loader message="Recalculating multi-dimensional analytics..." />
      ) : data ? (
        <div className="space-y-6">
          
          {/* TAB 1: Trends */}
          {activeTab === 'trends' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sales Trend Chart */}
              <div className="border bg-brand-card border-brand-border rounded-2xl p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white font-outfit">Revenue Sales Trend</h3>
                  <p className="text-[10px] text-brand-textMuted">Monthly sales revenue growth trajectory</p>
                </div>
                <div className="h-64 w-full text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.sales_profit_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="salesTrendGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />
                      <XAxis dataKey="Month" stroke="#64748b" />
                      <YAxis stroke="#64748b" tickFormatter={(v) => `$${v/1000}k`} />
                      <Tooltip content={<CurrencyTooltip />} />
                      <Area type="monotone" dataKey="Sales" name="Sales" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#salesTrendGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Profit Trend Chart */}
              <div className="border bg-brand-card border-brand-border rounded-2xl p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white font-outfit">Net Profit Trend</h3>
                  <p className="text-[10px] text-brand-textMuted">Monthly net profit margins over time</p>
                </div>
                <div className="h-64 w-full text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.sales_profit_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="profitTrendGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />
                      <XAxis dataKey="Month" stroke="#64748b" />
                      <YAxis stroke="#64748b" tickFormatter={(v) => `$${v/1000}k`} />
                      <Tooltip content={<CurrencyTooltip />} />
                      <Area type="monotone" dataKey="Profit" name="Net Profit" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#profitTrendGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Products & Categories */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Analysis */}
                <div className="border bg-brand-card border-brand-border rounded-2xl p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white font-outfit">Category Performance</h3>
                    <p className="text-[10px] text-brand-textMuted">Sales and Profit comparison across main categories</p>
                  </div>
                  <div className="h-64 w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.category_analysis} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />
                        <XAxis dataKey="Category" stroke="#64748b" />
                        <YAxis stroke="#64748b" tickFormatter={(v) => `$${v/1000}k`} />
                        <Tooltip content={<CurrencyTooltip />} />
                        <Legend iconType="circle" />
                        <Bar dataKey="Sales" name="Sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Profit" name="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Sub-Category Analysis */}
                <div className="border bg-brand-card border-brand-border rounded-2xl p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white font-outfit">Sub-Category Sales Breakdown</h3>
                    <p className="text-[10px] text-brand-textMuted">Top sales drivers across all sub-departments</p>
                  </div>
                  <div className="h-64 w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.subcategory_analysis} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" horizontal={false} />
                        <XAxis type="number" stroke="#64748b" tickFormatter={(v) => `$${v/1000}k`} />
                        <YAxis type="category" dataKey="Sub-Category" stroke="#64748b" width={80} />
                        <Tooltip content={<CurrencyTooltip />} />
                        <Bar dataKey="Sales" name="Sales" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Product rankings (Top 10 / Bottom 10) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top 10 Profitable Products */}
                <div className="border bg-brand-card border-brand-border rounded-2xl p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white font-outfit">Top 10 Products by Profit</h3>
                    <p className="text-[10px] text-brand-textMuted">Catalogue items generating the highest net profits</p>
                  </div>
                  <div className="h-80 w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.top_products} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" horizontal={false} />
                        <XAxis type="number" stroke="#64748b" tickFormatter={(v) => `$${v}`} />
                        <YAxis type="category" dataKey="Product Name" stroke="#64748b" width={100} tickFormatter={(v) => v.length > 15 ? `${v.substring(0, 15)}...` : v} />
                        <Tooltip content={<CurrencyTooltip />} />
                        <Bar dataKey="Profit" name="Profit Yield" fill="#10b981" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Bottom 10 Profit Loss Products */}
                <div className="border bg-brand-card border-brand-border rounded-2xl p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white font-outfit">Bottom 10 Products by Profit</h3>
                    <p className="text-[10px] text-brand-textMuted">Catalogue items generating the highest net losses</p>
                  </div>
                  <div className="h-80 w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.bottom_products} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" horizontal={false} />
                        <XAxis type="number" stroke="#64748b" tickFormatter={(v) => `$${v}`} />
                        <YAxis type="category" dataKey="Product Name" stroke="#64748b" width={100} tickFormatter={(v) => v.length > 15 ? `${v.substring(0, 15)}...` : v} />
                        <Tooltip content={<CurrencyTooltip />} />
                        <Bar dataKey="Profit" name="Net Loss" fill="#f43f5e" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Demographics & Shipping */}
          {activeTab === 'demographics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Segment Analysis */}
                <div className="border bg-brand-card border-brand-border rounded-2xl p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white font-outfit">Customer Segment split</h3>
                    <p className="text-[10px] text-brand-textMuted">Sales volume compared to net profit contributions</p>
                  </div>
                  <div className="h-64 w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.segment_analysis} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />
                        <XAxis dataKey="Segment" stroke="#64748b" />
                        <YAxis stroke="#64748b" tickFormatter={(v) => `$${v/1000}k`} />
                        <Tooltip content={<CurrencyTooltip />} />
                        <Legend iconType="circle" />
                        <Bar dataKey="Sales" name="Sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Profit" name="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Ship Mode Analysis */}
                <div className="border bg-brand-card border-brand-border rounded-2xl p-5 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-white font-outfit">Shipping Speed split</h3>
                    <p className="text-[10px] text-brand-textMuted">Order count and net margin yields per shipping class</p>
                  </div>
                  <div className="h-64 w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.ship_mode_analysis} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />
                        <XAxis dataKey="Ship Mode" stroke="#64748b" />
                        <YAxis stroke="#64748b" tickFormatter={(v) => `$${v/1000}k`} />
                        <Tooltip content={<CurrencyTooltip />} />
                        <Legend iconType="circle" />
                        <Bar dataKey="Sales" name="Sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Profit" name="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Discount vs Profit Margin Analysis (Scatter Chart) */}
              <div className="border bg-brand-card border-brand-border rounded-2xl p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white font-outfit">Discount vs. Profitability scatter analysis</h3>
                  <p className="text-[10px] text-brand-textMuted">Scatter plot mapping transactional discount percentage against profit margin (200 random transactions)</p>
                </div>
                <div className="h-80 w-full text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
                      <CartesianGrid stroke="#1f293d" />
                      <XAxis type="number" dataKey="Discount" name="Discount" unit="%" stroke="#64748b" tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                      <YAxis type="number" dataKey="Profit" name="Profit" unit="$" stroke="#64748b" tickFormatter={(v) => `$${v}`} />
                      <ZAxis type="number" dataKey="Sales" range={[40, 400]} name="Sales" unit="$" />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }}
                        contentStyle={{ backgroundColor: '#151c2c', borderColor: '#1f293d', color: '#f8fafc' }}
                        formatter={(value, name) => {
                          if (name === "Discount") return `${(value * 100).toFixed(0)}%`;
                          if (name === "Profit" || name === "Sales") return formatCurrency(value);
                          return value;
                        }}
                      />
                      <Legend />
                      <Scatter name="Transaction" data={data.discount_analysis} fill="#3b82f6" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Geography */}
          {activeTab === 'geography' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Region performance */}
              <div className="border bg-brand-card border-brand-border rounded-2xl p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white font-outfit">Regional Sales and Profits</h3>
                  <p className="text-[10px] text-brand-textMuted">Financial totals grouped by sales regions</p>
                </div>
                <div className="h-64 w-full text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.region_analysis} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />
                      <XAxis dataKey="Region" stroke="#64748b" />
                      <YAxis stroke="#64748b" tickFormatter={(v) => `$${v/1000}k`} />
                      <Tooltip content={<CurrencyTooltip />} />
                      <Legend iconType="circle" />
                      <Bar dataKey="Sales" name="Sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Profit" name="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* State Performance (Top 10) */}
              <div className="border bg-brand-card border-brand-border rounded-2xl p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white font-outfit">Top 10 States by Revenue</h3>
                  <p className="text-[10px] text-brand-textMuted">States generating the largest sales volume</p>
                </div>
                <div className="h-64 w-full text-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.state_analysis} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" horizontal={false} />
                      <XAxis type="number" stroke="#64748b" tickFormatter={(v) => `$${v/1000}k`} />
                      <YAxis type="category" dataKey="State" stroke="#64748b" width={80} />
                      <Tooltip content={<CurrencyTooltip />} />
                      <Bar dataKey="Sales" name="Sales" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="Profit" name="Profit" fill="#10b981" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

        </div>
      ) : (
        <div className="text-sm text-brand-textMuted text-center py-12">No data loaded. Try adjusting filters.</div>
      )}
    </div>
  );
};

export default Analytics;
