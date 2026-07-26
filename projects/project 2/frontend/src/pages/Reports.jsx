import React, { useState } from 'react';
import { 
  FileText, Presentation, FileCode, Database, Download, Eye, ChevronLeft, ChevronRight, CheckCircle 
} from 'lucide-react';

const Reports = () => {
  const [selectedAsset, setSelectedAsset] = useState("pdf");
  const [activeSlide, setActiveSlide] = useState(0);

  const assets = [
    { 
      id: "pdf", 
      title: "Analytical Project Report", 
      format: "PDF Document", 
      icon: FileText, 
      desc: "Comprehensive 4-page formal report outlining the data pipeline, geographic margin leaks, categories, and business summaries.",
      filename: "Retail_Performance_Report.pdf",
      endpoint: "/api/reports/download/pdf"
    },
    { 
      id: "pptx", 
      title: "Business Presentation Deck", 
      format: "PowerPoint (PPTX)", 
      icon: Presentation, 
      desc: "Executive slide presentation (8 slides) covering KPIs, seasonal trends, unprofitable territories, and strategic recommendations.",
      filename: "Retail_Performance_Presentation.pptx",
      endpoint: "/api/reports/download/pptx"
    },
    { 
      id: "sql", 
      title: "Structured SQL Scripts", 
      format: "SQL File (.sql)", 
      icon: FileCode, 
      desc: "Pre-written database setup and execution queries matching the 15 portfolio SQL questions.",
      filename: "retail_queries.sql",
      endpoint: "/api/reports/download/sql"
    },
    { 
      id: "csv", 
      title: "Raw Sales Dataset", 
      format: "CSV File (.csv)", 
      icon: FileText, 
      desc: "Cleaned transactional history dataset (5,000+ orders, 21 columns) containing Superstore simulated records.",
      filename: "retail_sales_dataset.csv",
      endpoint: "/api/reports/download/csv"
    },
    { 
      id: "sqlite", 
      title: "SQLite Database File", 
      format: "SQLite Database (.db)", 
      icon: Database, 
      desc: "The complete SQLite database file containing the initialized sales_data tables and index configurations.",
      filename: "retail_analytics.db",
      endpoint: "/api/reports/download/sqlite"
    }
  ];

  // PowerPoint slides mockup for the interactive previewer
  const pptxSlides = [
    {
      title: "Slide 1: Title Slide",
      content: (
        <div className="bg-[#0f172a] text-white p-8 h-64 rounded-xl flex flex-col justify-center items-center text-center space-y-3 border border-brand-border">
          <h2 className="text-xl font-bold font-outfit text-white">Retail Business Performance & Profitability Analysis</h2>
          <p className="text-xs text-brand-accent font-semibold font-outfit">Retail Performance & Profitability Analysis</p>
          <span className="text-[10px] text-brand-textMuted">Presented by: Business Intelligence Platform</span>
        </div>
      )
    },
    {
      title: "Slide 2: Executive Summary",
      content: (
        <div className="bg-brand-card text-brand-text p-6 h-64 rounded-xl border border-brand-border flex flex-col justify-between">
          <h3 className="text-sm font-bold text-white border-b border-brand-border pb-2">Slide 2: Executive Summary Overview</h3>
          <p className="text-xs text-brand-textMuted leading-relaxed">
            Evaluation of sales transactions and net operating profitability across 2.5 years of transactions (2024-2026) to identify margin leakage.
          </p>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-[#0e1422] p-2.5 rounded-lg border border-brand-border">
              <span className="block text-[8px] text-brand-textMuted font-bold">SALES</span>
              <span className="text-xs font-bold text-white font-mono">$1.1M+</span>
            </div>
            <div className="bg-[#0e1422] p-2.5 rounded-lg border border-brand-border">
              <span className="block text-[8px] text-brand-textMuted font-bold">NET PROFIT</span>
              <span className="text-xs font-bold text-brand-profit font-mono">$114k+</span>
            </div>
            <div className="bg-[#0e1422] p-2.5 rounded-lg border border-brand-border">
              <span className="block text-[8px] text-brand-textMuted font-bold">MARGIN</span>
              <span className="text-xs font-bold text-white font-mono">10.3%</span>
            </div>
            <div className="bg-[#0e1422] p-2.5 rounded-lg border border-brand-border">
              <span className="block text-[8px] text-brand-textMuted font-bold">ORDERS</span>
              <span className="text-xs font-bold text-brand-accent font-mono">5.5k+</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Slide 3: Sales & Profit Trends",
      content: (
        <div className="bg-brand-card text-brand-text p-6 h-64 rounded-xl border border-brand-border flex flex-col justify-between">
          <h3 className="text-sm font-bold text-white border-b border-brand-border pb-2">Slide 3: Monthly Operational Seasonality</h3>
          <ul className="text-xs text-brand-textMuted space-y-2 list-disc list-inside">
            <li><b>Holiday Surges:</b> Q4 sales (November and December) represent nearly 30% of total annual volumes.</li>
            <li><b>Inventory Constraints:</b> Supply and logistics capacity must be loaded in Q3 to support holiday shipping.</li>
            <li><b>Profit Tracking:</b> Profits closely match sales curves, but margin efficiency peaks during zero-discount months.</li>
          </ul>
          <div className="text-[10px] text-brand-accent font-bold uppercase font-mono bg-brand-accent/5 p-2 rounded text-center border border-brand-accent/10">
            Peak Season sales are 1.8x higher than average quarters.
          </div>
        </div>
      )
    },
    {
      title: "Slide 4: Regional Analysis",
      content: (
        <div className="bg-brand-card text-brand-text p-6 h-64 rounded-xl border border-brand-border flex flex-col justify-between">
          <h3 className="text-sm font-bold text-white border-b border-brand-border pb-2">Slide 4: Regional Performance discrepancies</h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <h4 className="font-bold text-brand-accent">Best Performing Region</h4>
              <p className="text-brand-textMuted leading-relaxed text-[11px]">
                <b>West:</b> Highest revenue matched with the most efficient margin profile (18.5%), indicating clean logistics pipelines.
              </p>
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-brand-loss">Unprofitable Areas</h4>
              <p className="text-brand-textMuted leading-relaxed text-[11px]">
                <b>Texas & Ohio:</b> Generate massive sales volume but operate at net losses due to aggressive local discounting overrides.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Slide 5: Product Categories",
      content: (
        <div className="bg-brand-card text-brand-text p-6 h-64 rounded-xl border border-brand-border flex flex-col justify-between">
          <h3 className="text-sm font-bold text-white border-b border-brand-border pb-2">Slide 5: Category & Sub-category Performance</h3>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-[#0e1422] p-2 border border-brand-border rounded-lg">
              <span className="block font-bold text-brand-accent">Technology</span>
              <span className="text-[10px] text-brand-textMuted">High revenue and top profit driver (Copiers/Phones).</span>
            </div>
            <div className="bg-[#0e1422] p-2 border border-brand-border rounded-lg">
              <span className="block font-bold text-brand-profit">Office Supplies</span>
              <span className="text-[10px] text-brand-textMuted">Low ticket size, but high steady margin anchor (Paper/Binders).</span>
            </div>
            <div className="bg-[#0e1422] p-2 border border-brand-border rounded-lg border-brand-loss/30">
              <span className="block font-bold text-brand-loss">Furniture</span>
              <span className="text-[10px] text-brand-textMuted">Loss-making subcategories (Tables) due to freight overhead.</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Slide 6: Business Insights",
      content: (
        <div className="bg-brand-card text-brand-text p-6 h-64 rounded-xl border border-brand-border flex flex-col justify-between">
          <h3 className="text-sm font-bold text-white border-b border-brand-border pb-2">Slide 6: Selected 5 Key Insights</h3>
          <div className="space-y-1 text-[11px] text-brand-textMuted">
            <p>• <b>Discount Trap:</b> Transactions with discounts &gt; 20% operate at structural net losses.</p>
            <p>• <b>Bulky Freight:</b> Heavy furniture items leak margins directly on shipping costs.</p>
            <p>• <b>Revenue concentration:</b> Top 10% of customers generate 40% of overall sales volume.</p>
            <p>• <b>Segment profiling:</b> Home Office accounts carry the highest average order value (AOV).</p>
            <p>• <b>Loss territories:</b> Major cities in Texas lead in sales, but generate net losses.</p>
          </div>
        </div>
      )
    },
    {
      title: "Slide 7: Actionable Recommendations",
      content: (
        <div className="bg-brand-card text-brand-text p-6 h-64 rounded-xl border border-brand-border flex flex-col justify-between">
          <h3 className="text-sm font-bold text-white border-b border-brand-border pb-2">Slide 7: Operational Action Plan</h3>
          <div className="space-y-1.5 text-[11px] text-brand-textMuted">
            <p><b>1. Cap Furniture Discounting:</b> Enforce a maximum discount cap of 10% on Tables.</p>
            <p><b>2. Shipping Contract Restructure:</b> Negotiate bulk cargo rates for bulky inventory.</p>
            <p><b>3. Regional Pricing Floor:</b> Enforce minimum margin gates in Texas and Ohio.</p>
            <p><b>4. targeted B2B Marketing:</b> Bundle high-value technology items for Home Office buyers.</p>
            <p><b>5. VIP loyalty protection:</b> Safeguard top 10% corporate customers via loyalty portals.</p>
          </div>
        </div>
      )
    },
    {
      title: "Slide 8: Portfolio Showcase Summary",
      content: (
        <div className="bg-[#0f172a] text-white p-6 h-64 rounded-xl flex flex-col justify-between text-center border border-brand-border">
          <h3 className="text-sm font-bold text-white border-b border-brand-border/40 pb-2">Slide 8: Technical Architecture Summary</h3>
          <div className="text-xs text-brand-textMuted space-y-1 py-4">
            <p>✔ <b>Database core:</b> SQLite containing structured transaction datasets.</p>
            <p>✔ <b>Backend REST:</b> FastAPI routes conducting real-time aggregations.</p>
            <p>✔ <b>Frontend:</b> React dashboards styled with Tailwind CSS using Recharts.</p>
            <p>✔ <b>Reporting:</b> PDF & PPTX compiled programmatically via Python.</p>
          </div>
          <span className="text-[10px] text-brand-profit font-semibold uppercase font-mono">Verified Portfolio-Ready Submission</span>
        </div>
      )
    }
  ];

  const currentAssetObj = assets.find(a => a.id === selectedAsset);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold font-outfit text-white">Reports & Documentation Workspace</h1>
        <p className="text-xs text-brand-textMuted mt-0.5">Generate, preview, and download project reports, slides, raw datasets, and SQL files</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Asset Selectors (1 Col) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="border bg-brand-card border-brand-border rounded-2xl p-4 space-y-2">
            <span className="block text-[10px] font-bold text-brand-textMuted uppercase tracking-widest px-2 mb-3">Downloadable Assets</span>
            {assets.map((asset) => {
              const Icon = asset.icon;
              return (
                <button
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-200 border ${
                    selectedAsset === asset.id 
                      ? 'bg-brand-cardLight border-brand-accent/50 text-white font-bold' 
                      : 'border-transparent text-brand-textMuted hover:bg-brand-cardLight/30 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${selectedAsset === asset.id ? 'bg-brand-accent text-white' : 'bg-brand-cardLight text-brand-textMuted'}`}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <span className="block text-xs font-semibold">{asset.title}</span>
                      <span className="block text-[9px] text-brand-textMuted mt-0.5">{asset.format}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Preview & Download Panel (2 Col) */}
        <div className="lg:col-span-2 space-y-6">
          {currentAssetObj && (
            <div className="border bg-brand-card border-brand-border rounded-2xl p-6 space-y-6">
              
              {/* Asset Header Info */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-brand-border/40">
                <div className="space-y-1">
                  <h2 className="text-base font-bold font-outfit text-white">{currentAssetObj.title}</h2>
                  <p className="text-xs text-brand-textMuted">{currentAssetObj.desc}</p>
                </div>
                <a
                  href={currentAssetObj.endpoint}
                  download={currentAssetObj.filename}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-accent hover:bg-brand-accentHover text-white font-bold text-xs transition-all duration-200 shadow-glow cursor-pointer whitespace-nowrap self-start sm:self-auto"
                >
                  <Download size={14} /> Download File
                </a>
              </div>

              {/* Asset Interactive Previewer */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-brand-textMuted">
                  <Eye size={14} /> Asset Preview Panel
                </div>

                {/* PDF Report Preview */}
                {selectedAsset === "pdf" && (
                  <div className="border border-brand-border/80 bg-brand-cardLight/20 rounded-xl p-6 space-y-8 font-serif text-brand-textMuted max-h-[400px] overflow-y-auto shadow-inner text-xs">
                    {/* Page 1 Title block */}
                    <div className="border-b border-brand-border pb-6 space-y-2">
                      <h1 className="text-lg font-bold font-sans text-white">Retail Business Performance & Profitability Analysis</h1>
                      <p className="text-[10px] text-brand-accent font-semibold font-sans uppercase">Retail Business Performance & Profitability Analysis Report</p>
                      <p className="text-[10px] text-brand-textMuted font-sans">Published: July 2026 • Lead Analyst Report</p>
                    </div>

                    {/* Section 1 */}
                    <div className="space-y-2">
                      <h3 className="font-sans font-bold text-white text-xs uppercase tracking-wider">1. Executive Summary</h3>
                      <p className="leading-relaxed">
                        This document details an audit of business operations across US retail centers. Analyzing over 5,000 sales transactions processed in SQLite, we highlight localized margin erosion, discounting anomalies, and offer recommendations to defend operating incomes.
                      </p>
                    </div>

                    {/* Section 2 */}
                    <div className="space-y-2">
                      <h3 className="font-sans font-bold text-white text-xs uppercase tracking-wider">2. Financial KPI Baselines</h3>
                      <p className="leading-relaxed">
                        Financial aggregates establish gross sales revenues exceeding $1,100,000, pulling in net profits of $114,000. While overall margins are stable at 10.3%, regional managers run highly custom promotional models that lead to severe margin diluting.
                      </p>
                    </div>

                    {/* Section 3 */}
                    <div className="space-y-2">
                      <h3 className="font-sans font-bold text-white text-xs uppercase tracking-wider">3. Regional & Territory Leakages</h3>
                      <p className="leading-relaxed">
                        Regional slicing shows the West is our star operations center, combining highest revenues with 18.5% margins. Conversely, Central and South operations are unprofitable. Specifically, Texas and Ohio exhibit aggregate net losses due to aggressive manager price overrides.
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="pt-6 border-t border-brand-border flex justify-between text-[9px] font-sans text-brand-textMuted">
                      <span>Document ref: Retail_BI_2026</span>
                      <span>Page 1 of 4</span>
                    </div>
                  </div>
                )}

                {/* PowerPoint Slides Deck Preview */}
                {selectedAsset === "pptx" && (
                  <div className="space-y-4">
                    {/* Render active slide */}
                    <div>
                      {pptxSlides[activeSlide].content}
                    </div>
                    {/* Controls */}
                    <div className="flex justify-between items-center text-xs font-semibold px-2">
                      <span className="text-brand-textMuted font-mono">
                        Slide {activeSlide + 1} of {pptxSlides.length}: {pptxSlides[activeSlide].title}
                      </span>
                      <div className="flex gap-2">
                        <button
                          disabled={activeSlide === 0}
                          onClick={() => setActiveSlide(activeSlide - 1)}
                          className="p-1.5 rounded-lg border border-brand-border bg-[#0e1422] text-brand-textMuted hover:text-white disabled:opacity-40 transition-colors"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          disabled={activeSlide === pptxSlides.length - 1}
                          onClick={() => setActiveSlide(activeSlide + 1)}
                          className="p-1.5 rounded-lg border border-brand-border bg-[#0e1422] text-brand-textMuted hover:text-white disabled:opacity-40 transition-colors"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* SQL Code script preview */}
                {selectedAsset === "sql" && (
                  <div className="border border-brand-border bg-[#0e1422] rounded-xl p-4 font-mono text-xs text-blue-300 max-h-[300px] overflow-y-auto leading-relaxed select-all">
                    <pre className="whitespace-pre">
{`-- ====================================================================
-- RETAIL BUSINESS PERFORMANCE & PROFITABILITY ANALYSIS
-- Retail Performance & Profitability Analysis - SQL Queries
-- ====================================================================

-- 1. OVERALL KPI SUMMARY
SELECT 
    ROUND(SUM(Sales), 2) AS Total_Sales, 
    ROUND(SUM(Profit), 2) AS Total_Profit, 
    COUNT(DISTINCT Order_ID) AS Total_Orders, 
    SUM(Quantity) AS Total_Items_Sold, 
    ROUND(AVG(Discount) * 100, 2) AS Avg_Discount_Pct 
FROM sales_data;

-- 2. SALES AND PROFITABILITY BY REGION
SELECT 
    Region, 
    ROUND(SUM(Sales), 2) AS Regional_Sales, 
    ROUND(SUM(Profit), 2) AS Regional_Profit, 
    ROUND((SUM(Profit)/SUM(Sales)) * 100, 2) AS Profit_Margin_Pct 
FROM sales_data 
GROUP BY Region 
ORDER BY Regional_Sales DESC;

-- [Continued in full downloaded file...]`}
                    </pre>
                  </div>
                )}

                {/* CSV Dataset Preview */}
                {selectedAsset === "csv" && (
                  <div className="border border-brand-border bg-[#0e1422] rounded-xl p-4 font-mono text-xs text-brand-textMuted overflow-x-auto max-h-[300px]">
                    <table className="w-full text-left text-[10px]">
                      <thead>
                        <tr className="text-white border-b border-brand-border">
                          <th className="pb-1.5 pr-4">Row ID</th>
                          <th className="pb-1.5 pr-4">Order ID</th>
                          <th className="pb-1.5 pr-4">Order Date</th>
                          <th className="pb-1.5 pr-4">Segment</th>
                          <th className="pb-1.5 pr-4">State</th>
                          <th className="pb-1.5 pr-4">Category</th>
                          <th className="pb-1.5 pr-4 text-right">Sales</th>
                          <th className="pb-1.5 text-right">Profit</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-1">1</td>
                          <td className="text-brand-accent">CA-2024-152156</td>
                          <td>2024-11-08</td>
                          <td>Consumer</td>
                          <td>Kentucky</td>
                          <td>Furniture</td>
                          <td className="text-right text-white">$261.96</td>
                          <td className="text-right text-brand-profit">$41.91</td>
                        </tr>
                        <tr>
                          <td className="py-1">2</td>
                          <td className="text-brand-accent">CA-2024-152156</td>
                          <td>2024-11-08</td>
                          <td>Consumer</td>
                          <td>Kentucky</td>
                          <td>Furniture</td>
                          <td className="text-right text-white">$731.94</td>
                          <td className="text-right text-brand-profit">$219.58</td>
                        </tr>
                        <tr>
                          <td className="py-1">3</td>
                          <td className="text-brand-accent">CA-2024-138688</td>
                          <td>2024-06-12</td>
                          <td>Corporate</td>
                          <td>California</td>
                          <td>Office Supplies</td>
                          <td className="text-right text-white">$14.62</td>
                          <td className="text-right text-brand-profit">$6.87</td>
                        </tr>
                        <tr>
                          <td className="py-1">4</td>
                          <td className="text-brand-accent">US-2025-108966</td>
                          <td>2025-10-11</td>
                          <td>Consumer</td>
                          <td>Florida</td>
                          <td>Furniture</td>
                          <td className="text-right text-white">$957.58</td>
                          <td className="text-right text-brand-loss">-$383.03</td>
                        </tr>
                        <tr>
                          <td className="py-1">5</td>
                          <td className="text-brand-accent">US-2025-108966</td>
                          <td>2025-10-11</td>
                          <td>Consumer</td>
                          <td>Florida</td>
                          <td>Office Supplies</td>
                          <td className="text-right text-white">$22.368</td>
                          <td className="text-right text-brand-profit">$2.516</td>
                        </tr>
                      </tbody>
                    </table>
                    <p className="mt-4 text-[9px] text-brand-textMuted italic">Table contains top 5 mockup sample rows of 5,500 total database rows.</p>
                  </div>
                )}

                {/* SQLite Database Preview */}
                {selectedAsset === "sqlite" && (
                  <div className="border border-brand-border bg-brand-cardLight/20 rounded-xl p-5 text-center text-xs space-y-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                      <Database size={24} />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-white">retail_analytics.db Database Properties</p>
                      <p className="text-brand-textMuted">Binary Database Format suitable for SQLite3 engines</p>
                    </div>
                    <div className="max-w-xs mx-auto grid grid-cols-2 gap-2 text-[10px] text-brand-textMuted font-mono">
                      <div className="bg-[#0e1422] p-2 rounded border border-brand-border">
                        <span>Database Size:</span>
                        <span className="block font-bold text-white mt-0.5">~1.2 MB</span>
                      </div>
                      <div className="bg-[#0e1422] p-2 rounded border border-brand-border">
                        <span>Core Table:</span>
                        <span className="block font-bold text-white mt-0.5">sales_data</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-brand-textMuted leading-relaxed max-w-sm mx-auto">
                      Use standard DB Browser for SQLite or Python's sqlite3 driver to load and query files on local systems. Includes built-in indexes on date and customer columns.
                    </p>
                  </div>
                )}

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
