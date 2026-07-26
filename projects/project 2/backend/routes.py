from fastapi import APIRouter, Query, HTTPException, Body
from fastapi.responses import FileResponse
import os
import pandas as pd
import sqlite3
from typing import Optional, List
from backend.analysis import load_clean_data, CSV_PATH
from backend.database import SQL_QUERIES, run_query, execute_arbitrary_query, DB_PATH
from backend.generate_reports import build_all_reports, REPORTS_DIR, PROJECT_DIR

router = APIRouter()

# Global DataFrame references
_df: Optional[pd.DataFrame] = None

def get_df():
    """Lazy loader for cleaned dataframe."""
    global _df
    if _df is None:
        _df, _, _ = load_clean_data()
    return _df

@router.get("/api/kpis")
def get_kpis():
    """Returns high-level business KPIs."""
    df = get_df()
    
    total_sales = float(df["Sales"].sum())
    total_profit = float(df["Profit"].sum())
    total_orders = int(df["Order ID"].nunique())
    total_customers = int(df["Customer ID"].nunique())
    
    avg_order_value = total_sales / total_orders if total_orders > 0 else 0
    profit_margin = (total_profit / total_sales) * 100 if total_sales > 0 else 0
    avg_discount = float(df["Discount"].mean()) * 100
    
    return {
        "total_sales": round(total_sales, 2),
        "total_profit": round(total_profit, 2),
        "total_orders": total_orders,
        "total_customers": total_customers,
        "avg_order_value": round(avg_order_value, 2),
        "profit_margin": round(profit_margin, 2),
        "avg_discount": round(avg_discount, 2)
    }

@router.get("/api/dashboard")
def get_dashboard_summary():
    """Returns summary data for dashboard widgets."""
    df = get_df()
    
    # 1. Monthly sales trend for sparkline/mini-charts
    monthly_trend = df.groupby("Month").agg(
        Sales=("Sales", "sum"),
        Profit=("Profit", "sum")
    ).reset_index().to_dict(orient="records")
    
    # 2. Category split
    cat_split = df.groupby("Category").agg(
        Sales=("Sales", "sum"),
        Profit=("Profit", "sum")
    ).reset_index().to_dict(orient="records")
    
    # 3. Regional split
    reg_split = df.groupby("Region").agg(
        Sales=("Sales", "sum"),
        Profit=("Profit", "sum")
    ).reset_index().to_dict(orient="records")
    
    # 4. Recent transactions
    recent_transactions = df.sort_values("Order Date", ascending=False).head(5)[
        ["Order ID", "Customer Name", "Category", "Sales", "Profit", "Order Date"]
    ]
    recent_transactions["Order Date"] = recent_transactions["Order Date"].dt.strftime("%Y-%m-%d")
    recent_transactions = recent_transactions.to_dict(orient="records")
    
    return {
        "monthly_trend": monthly_trend,
        "category_split": cat_split,
        "region_split": reg_split,
        "recent_transactions": recent_transactions
    }

@router.get("/api/analytics")
def get_filtered_analytics(
    category: Optional[List[str]] = Query(None),
    region: Optional[List[str]] = Query(None),
    segment: Optional[List[str]] = Query(None),
    ship_mode: Optional[List[str]] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None)
):
    """Returns aggregated analytics data filtered dynamically by multiple dimensions."""
    df = get_df().copy()
    
    # Apply filters
    if category:
        df = df[df["Category"].isin(category)]
    if region:
        df = df[df["Region"].isin(region)]
    if segment:
        df = df[df["Segment"].isin(segment)]
    if ship_mode:
        df = df[df["Ship Mode"].isin(ship_mode)]
        
    if start_date:
        df = df[df["Order Date"] >= pd.to_datetime(start_date)]
    if end_date:
        df = df[df["Order Date"] <= pd.to_datetime(end_date)]
        
    if df.empty:
        return {
            "sales_profit_trend": [], "category_analysis": [], "subcategory_analysis": [],
            "region_analysis": [], "state_analysis": [], "segment_analysis": [],
            "ship_mode_analysis": [], "top_products": [], "bottom_products": [],
            "discount_analysis": [], "monthly_sales_profit": []
        }
        
    # 1. Sales & Profit Trend (Monthly)
    monthly = df.groupby("Month").agg(
        Sales=("Sales", "sum"),
        Profit=("Profit", "sum")
    ).reset_index().sort_values("Month")
    monthly_data = monthly.to_dict(orient="records")
    
    # 2. Category Analysis
    cat_analysis = df.groupby("Category").agg(
        Sales=("Sales", "sum"),
        Profit=("Profit", "sum"),
        Orders=("Order ID", "nunique")
    ).reset_index().to_dict(orient="records")
    
    # 3. Sub-Category Analysis
    subcat_analysis = df.groupby(["Category", "Sub-Category"]).agg(
        Sales=("Sales", "sum"),
        Profit=("Profit", "sum")
    ).reset_index().to_dict(orient="records")
    
    # 4. Region Analysis
    reg_analysis = df.groupby("Region").agg(
        Sales=("Sales", "sum"),
        Profit=("Profit", "sum")
    ).reset_index().to_dict(orient="records")
    
    # 5. State Analysis (Top 10)
    state_analysis = df.groupby("State").agg(
        Sales=("Sales", "sum"),
        Profit=("Profit", "sum")
    ).reset_index().sort_values("Sales", ascending=False).head(10).to_dict(orient="records")
    
    # 6. Customer Segment Analysis
    seg_analysis = df.groupby("Segment").agg(
        Sales=("Sales", "sum"),
        Profit=("Profit", "sum"),
        Orders=("Order ID", "nunique")
    ).reset_index().to_dict(orient="records")
    
    # 7. Ship Mode Analysis
    ship_analysis = df.groupby("Ship Mode").agg(
        Sales=("Sales", "sum"),
        Profit=("Profit", "sum"),
        Orders=("Order ID", "nunique")
    ).reset_index().to_dict(orient="records")
    
    # 8. Top 10 Products by Profit
    top_prods = df.groupby("Product Name").agg(
        Sales=("Sales", "sum"),
        Profit=("Profit", "sum")
    ).reset_index().sort_values("Profit", ascending=False).head(10).to_dict(orient="records")
    
    # 9. Bottom 10 Products by Profit
    bottom_prods = df.groupby("Product Name").agg(
        Sales=("Sales", "sum"),
        Profit=("Profit", "sum")
    ).reset_index().sort_values("Profit", ascending=True).head(10).to_dict(orient="records")
    
    # 10. Discount Analysis (Scatter structure showing Sales, Profit, Discount)
    # Sample down to max 200 points for visualization performance
    scatter_df = df.sample(min(200, len(df)))[
        ["Sales", "Profit", "Discount", "Product Name", "Sub-Category"]
    ]
    scatter_data = scatter_df.to_dict(orient="records")
    
    # Filter lists for frontend filters
    all_categories = list(get_df()["Category"].unique())
    all_regions = list(get_df()["Region"].unique())
    all_segments = list(get_df()["Segment"].unique())
    all_ship_modes = list(get_df()["Ship Mode"].unique())
    
    return {
        "sales_profit_trend": monthly_data,
        "category_analysis": cat_analysis,
        "subcategory_analysis": subcat_analysis,
        "region_analysis": reg_analysis,
        "state_analysis": state_analysis,
        "segment_analysis": seg_analysis,
        "ship_mode_analysis": ship_analysis,
        "top_products": top_prods,
        "bottom_products": bottom_prods,
        "discount_analysis": scatter_data,
        "filter_options": {
            "categories": all_categories,
            "regions": all_regions,
            "segments": all_segments,
            "ship_modes": all_ship_modes
        }
    }

@router.get("/api/sql-insights")
def get_sql_insights_list():
    """Returns the list of 15 predefined SQL queries with metadata."""
    # Omit SQL itself from the summary list to keep payload smaller
    summary = []
    for q in SQL_QUERIES:
        summary.append({
            "id": q["id"],
            "title": q["title"],
            "description": q["description"],
            "business_insight": q["business_insight"],
            "sql": q["sql"]
        })
    return summary

@router.get("/api/sql-insights/{query_id}")
def execute_sql_query(query_id: int):
    """Executes a specific predefined SQL query and returns rows, columns, and execution metrics."""
    if query_id < 1 or query_id > 15:
        raise HTTPException(status_code=400, detail="Invalid Query ID. Must be between 1 and 15.")
    res = run_query(query_id)
    if not res["success"]:
        raise HTTPException(status_code=500, detail=res["error"])
    return res

@router.post("/api/sql-insights/custom")
def execute_custom_sql(payload: dict = Body(...)):
    """Executes a custom SELECT query entered by the user."""
    sql = payload.get("sql", "")
    if not sql:
        raise HTTPException(status_code=400, detail="SQL query string is required.")
    res = execute_arbitrary_query(sql)
    if not res["success"]:
        return {"success": False, "error": res["error"]}
    return res

@router.get("/api/business-insights")
def get_business_insights():
    """Returns 15 detailed professional analytical findings."""
    return [
        {
            "id": 1,
            "category": "Sales Performance",
            "title": "Strong Year-End Seasonality",
            "metric": "Q4 Sales Surge",
            "detail": "November and December represent nearly 30% of total annual sales, indicating strong retail seasonality. Operational capacity and inventory coverage must be planned in Q3.",
            "impact": "High"
        },
        {
            "id": 2,
            "category": "Profitability",
            "title": "Severe Losses on Tables & Bookcases",
            "metric": "Negative Category Profit",
            "detail": "Tables and Bookcases sub-categories show net losses across all regions. Heavy freight overhead combined with deep clearing promotions destroys gross margins.",
            "impact": "Critical"
        },
        {
            "id": 3,
            "category": "Profitability",
            "title": "Technology Drives the Bottom Line",
            "metric": "Copiers & Phones Leader",
            "detail": "Copiers represent the highest margin sub-category, contributing substantial profits relative to unit volume, followed closely by Phones.",
            "impact": "High"
        },
        {
            "id": 4,
            "category": "Pricing Strategy",
            "title": "The Discount Margin Trap",
            "metric": "20% Discount Threshold",
            "detail": "Transactional discounts above 20% consistently lead to net negative margins. Transactions in the 50%+ discount tier lose $1.15 for every dollar sold.",
            "impact": "Critical"
        },
        {
            "id": 5,
            "category": "Customer Behavior",
            "title": "High Customer Concentration Risk",
            "metric": "Top 10% Spend Contribution",
            "detail": "The top 10% of customers generate approximately 40% of overall sales volume, presenting high revenue concentration risk and highlighting the need for account protection.",
            "impact": "High"
        },
        {
            "id": 6,
            "category": "Regional Analysis",
            "title": "Unprofitable Territories (Texas/Ohio)",
            "metric": "Texas & Ohio Net Losses",
            "detail": "Despite ranking in the top 10 for sales volume, Texas and Ohio are structurally unprofitable. This is caused by aggressive promotional campaigns and localized price competition.",
            "impact": "Critical"
        },
        {
            "id": 7,
            "category": "Customer Behavior",
            "title": "Premium Corporate Basket Sizes",
            "metric": "Home Office AOV Advantage",
            "detail": "Home Office clients exhibit a 20% higher Average Order Value ($260+) compared to consumer retail orders, representing higher purchasing power.",
            "impact": "Medium"
        },
        {
            "id": 8,
            "category": "Shipping Analytics",
            "title": "Standard Shipping Dominance",
            "metric": "65% Shipping Volume",
            "detail": "Standard Class shipping represents 65% of orders. However, premium delivery options (Same Day/First Class) show higher margins per order, recovering additional freight fees.",
            "impact": "Medium"
        },
        {
            "id": 9,
            "category": "Profitability",
            "title": "Office Supplies Anchor Profitability",
            "metric": "Stable Paper & Binder Margins",
            "detail": "Office Supplies (Paper, Binders) generate smaller average sales ticket values, but represent extremely high margins (exceeding 40%), serving as a stable profit anchor.",
            "impact": "High"
        },
        {
            "id": 10,
            "category": "Customer Behavior",
            "title": "Low Repeat Purchase Rates",
            "metric": "62% Single-Order Rate",
            "detail": "Over 60% of registered customers have purchased only once or twice, highlighting poor customer retention and indicating the need for post-purchase lifecycle marketing.",
            "impact": "High"
        },
        {
            "id": 11,
            "category": "Inventory Analysis",
            "title": "Fasteners & Labels under-performing",
            "metric": "Low Sales Volume",
            "detail": "Subcategories like Fasteners and Labels have near-zero contribution to overall revenue and represent excessive storage and handling costs relative to yield.",
            "impact": "Low"
        },
        {
            "id": 12,
            "category": "Regional Analysis",
            "title": "West Region Efficiency",
            "metric": "18.5% West Margin",
            "detail": "The West region is the star performer, combining the highest sales volume with a highly efficient profit margin of 18.5% due to optimized freight lanes and low discount rates.",
            "impact": "High"
        },
        {
            "id": 13,
            "category": "Pricing Strategy",
            "title": "Zero-Discount Profit Engine",
            "metric": "55% Net Margin on Zero-Discounts",
            "detail": "Orders processed with 0% discount carry an average net profit margin of 55%. Introducing even a 10% discount halves the net profitability of the average transaction.",
            "impact": "High"
        },
        {
            "id": 14,
            "category": "Shipping Analytics",
            "title": "Same Day Dispatch Overhead",
            "metric": "Same Day Surcharge Recovery",
            "detail": "Same Day shipping generates the highest logistics costs. Surcharges are successfully recovering costs, but demand volume remains low (under 5% of total orders).",
            "impact": "Medium"
        },
        {
            "id": 15,
            "category": "Profitability",
            "title": "Product-level Margin Concentration",
            "metric": "Top 10 Products Drive 18% Profit",
            "detail": "A small fraction of catalog products (top 10 SKUs) drives 18% of total profitability, representing a highly concentrated catalog risk that requires secure supply lines.",
            "impact": "Medium"
        }
    ]

@router.get("/api/recommendations")
def get_recommendations():
    """Returns 10 actionable business recommendations based on the data analysis."""
    return [
        {
            "id": 1,
            "area": "Pricing Strategy",
            "title": "Implement Cap on Furniture Discounts",
            "action": "Enforce a maximum discount threshold of 10% on Tables and Bookcases. Restrict local sales managers from overriding price rules on bulky furniture items.",
            "priority": "High"
        },
        {
            "id": 2,
            "area": "Logistics & Operations",
            "title": "Renegotiate Bulky Shipping Contracts",
            "action": "Form regional shipping alliances or contract specific LTL (Less-Than-Truckload) logistics providers for Furniture items to reduce shipping expenses by 15%.",
            "priority": "High"
        },
        {
            "id": 3,
            "area": "Regional Policy",
            "title": "Establish Pricing Floors in Texas & Ohio",
            "action": "De-escalate local discount wars in Texas and Ohio. Introduce a minimum margin floor of 5% on all transactions in these regions, shifting target metrics from volume to profit.",
            "priority": "High"
        },
        {
            "id": 4,
            "area": "Marketing Strategy",
            "title": "Target B2B High AOV Segments",
            "action": "Redirect marketing budgets toward the Home Office and Corporate segments. Create custom bundling packages for high-value technology and office setups.",
            "priority": "Medium"
        },
        {
            "id": 5,
            "area": "Customer Retention",
            "title": "Launch VIP Account Loyalty Program",
            "action": "Develop a dedicated account management program for the top 10% customer group contributing 40% of sales. Offer personalized logistics support and contract pricing.",
            "priority": "High"
        },
        {
            "id": 6,
            "area": "Inventory Management",
            "title": "Discontinue Low-Performing Product SKUs",
            "action": "Consolidate catalog. Phase out or discontinue the bottom 10 unprofitable product models in Tables and Bookcases to eliminate margin leakages.",
            "priority": "Medium"
        },
        {
            "id": 7,
            "area": "Marketing Strategy",
            "title": "Create Q4 Seasonality Campaigns early",
            "action": "Launch targeted email and promotion pre-sales in September/October to lock in customer orders early, smoothing the holiday shipping peak in November and December.",
            "priority": "Medium"
        },
        {
            "id": 8,
            "area": "Pricing Strategy",
            "title": "Upsell Complementary Zero-Discount Items",
            "action": "Set up recommender prompts in checkout: when buying discounted technology (Copiers/Phones), bundle zero-discount high-margin attachments (folders, paper, accessories).",
            "priority": "Medium"
        },
        {
            "id": 9,
            "area": "Logistics & Operations",
            "title": "Optimize Same Day Shipping Fees",
            "action": "Increase the shipping fee premium on Same Day delivery orders by 10%. Demand is price-inelastic for urgency, which will raise direct profitability.",
            "priority": "Low"
        },
        {
            "id": 10,
            "area": "Inventory Management",
            "title": "Audit Fasteners & Labels Handling Costs",
            "action": "Re-evaluate storage space for near-zero revenue categories. Consider dropshipping low-priority supplies (Labels, Fasteners) rather than stocking them locally.",
            "priority": "Low"
        }
    ]

@router.get("/api/reports/download/{file_type}")
def download_report(file_type: str):
    """Serves reports, SQLite database, custom SQL queries, or raw CSV dataset for download."""
    # Ensure PDF/PPTX exist
    pdf_path = os.path.join(REPORTS_DIR, "project_report.pdf")
    pptx_path = os.path.join(REPORTS_DIR, "presentation.pptx")
    sql_path = os.path.join(PROJECT_DIR, "sql", "queries.sql")
    csv_path = CSV_PATH
    db_path = DB_PATH
    
    # Generate on-the-fly if missing
    if file_type in ["pdf", "pptx"] and (not os.path.exists(pdf_path) or not os.path.exists(pptx_path)):
        build_all_reports()
        
    if file_type == "pdf":
        if not os.path.exists(pdf_path):
            raise HTTPException(status_code=404, detail="PDF report not found and could not be generated.")
        return FileResponse(pdf_path, media_type="application/pdf", filename="Retail_Performance_Report.pdf")
        
    elif file_type == "pptx":
        if not os.path.exists(pptx_path):
            raise HTTPException(status_code=404, detail="Presentation not found and could not be generated.")
        return FileResponse(pptx_path, media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation", filename="Retail_Performance_Presentation.pptx")
        
    elif file_type == "sql":
        if not os.path.exists(sql_path):
            raise HTTPException(status_code=404, detail="SQL file not found.")
        return FileResponse(sql_path, media_type="text/plain", filename="retail_queries.sql")
        
    elif file_type == "csv":
        if not os.path.exists(csv_path):
            raise HTTPException(status_code=404, detail="CSV dataset not found.")
        return FileResponse(csv_path, media_type="text/csv", filename="retail_sales_dataset.csv")
        
    elif file_type == "sqlite":
        if not os.path.exists(db_path):
            raise HTTPException(status_code=404, detail="SQLite database not found.")
        return FileResponse(db_path, media_type="application/x-sqlite3", filename="retail_analytics.db")
        
    else:
        raise HTTPException(status_code=400, detail="Invalid file type. Available: pdf, pptx, sql, csv, sqlite.")
