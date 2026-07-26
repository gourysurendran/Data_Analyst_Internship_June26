import os
import sqlite3
import pandas as pd
import time
from backend.analysis import load_clean_data, DATA_DIR

DB_PATH = os.path.join(DATA_DIR, "retail_analytics.db")

# Define SQL Queries
SQL_QUERIES = [
    {
        "id": 1,
        "title": "Overall KPI Summary",
        "description": "Aggregates key high-level metrics including total sales, total profit, total unique orders, quantity sold, and average discount applied across all transactions.",
        "sql": """SELECT 
    ROUND(SUM(Sales), 2) AS Total_Sales, 
    ROUND(SUM(Profit), 2) AS Total_Profit, 
    COUNT(DISTINCT Order_ID) AS Total_Orders, 
    SUM(Quantity) AS Total_Items_Sold, 
    ROUND(AVG(Discount) * 100, 2) AS Avg_Discount_Pct 
FROM sales_data;""",
        "business_insight": "Provides the overall financial baseline of the retail business. Helps executive leadership understand the general scale and profit efficiency (Profit Margin = Total Profit / Total Sales) at a glance."
    },
    {
        "id": 2,
        "title": "Sales and Profitability by Region",
        "description": "Groups sales performance and bottom-line contributions by geographical regions to understand where the company's customer base is concentrated and which regions are most profitable.",
        "sql": """SELECT 
    Region, 
    ROUND(SUM(Sales), 2) AS Regional_Sales, 
    ROUND(SUM(Profit), 2) AS Regional_Profit, 
    ROUND((SUM(Profit)/SUM(Sales)) * 100, 2) AS Profit_Margin_Pct 
FROM sales_data 
GROUP BY Region 
ORDER BY Regional_Sales DESC;""",
        "business_insight": "Highlights regional discrepancies. For instance, the region with the highest sales volume is not necessarily the most profitable. A lower margin in a high-sales region indicates excessive discounting or high shipping overhead."
    },
    {
        "id": 3,
        "title": "Sales Performance by Category and Sub-Category",
        "description": "Drills down from the primary product categories into specific product sub-categories to assess product line performance.",
        "sql": """SELECT 
    Category, 
    Sub_Category, 
    ROUND(SUM(Sales), 2) AS Total_Sales, 
    ROUND(SUM(Profit), 2) AS Total_Profit, 
    ROUND(AVG(Discount) * 100, 2) AS Avg_Discount_Pct
FROM sales_data 
GROUP BY Category, Sub_Category 
ORDER BY Category, Total_Sales DESC;""",
        "business_insight": "Identifies product-level anomalies. For example, within 'Furniture', 'Tables' and 'Bookcases' might yield negative profit margins despite high sales, calling for immediate pricing or cost structure changes."
    },
    {
        "id": 4,
        "title": "Top 10 Most Profitable Products",
        "description": "Identifies the core products driving the highest net profitability for the business, enabling focused inventory and marketing strategies.",
        "sql": """SELECT 
    Product_ID, 
    Product_Name, 
    Category, 
    Sub_Category, 
    ROUND(SUM(Sales), 2) AS Total_Sales, 
    ROUND(SUM(Profit), 2) AS Total_Profit 
FROM sales_data 
GROUP BY Product_ID, Product_Name, Category, Sub_Category 
ORDER BY Total_Profit DESC 
LIMIT 10;""",
        "business_insight": "Highlights 'star' products. These items are candidates for bundling with slower-moving stock and should always remain in inventory, as they are crucial to the bottom line."
    },
    {
        "id": 5,
        "title": "Bottom 10 (Most Loss-Making) Products",
        "description": "Pinpoints the specific products that are leaking the most margin due to aggressive discounting, low prices, or high shipping costs.",
        "sql": """SELECT 
    Product_ID, 
    Product_Name, 
    Category, 
    Sub_Category, 
    ROUND(SUM(Sales), 2) AS Total_Sales, 
    ROUND(SUM(Profit), 2) AS Total_Profit 
FROM sales_data 
GROUP BY Product_ID, Product_Name, Category, Sub_Category 
ORDER BY Total_Profit ASC 
LIMIT 10;""",
        "business_insight": "These items represent critical business leakages. Business owners should investigate whether these products are sold as loss leaders, or if they need to be discontinued or repriced."
    },
    {
        "id": 6,
        "title": "Top 10 Customers by Total Spend",
        "description": "Ranks customers based on their total cumulative sales contribution, showing their segment and purchase frequency.",
        "sql": """SELECT 
    Customer_ID, 
    Customer_Name, 
    Segment, 
    ROUND(SUM(Sales), 2) AS Total_Spent, 
    ROUND(SUM(Profit), 2) AS Total_Contribution_Profit, 
    COUNT(DISTINCT Order_ID) AS Total_Orders 
FROM sales_data 
GROUP BY Customer_ID, Customer_Name, Segment 
ORDER BY Total_Spent DESC 
LIMIT 10;""",
        "business_insight": "Reveals key VIP accounts. These customers represent significant revenue concentration. Marketing and sales should prioritize loyalty programs or direct account management for this group."
    },
    {
        "id": 7,
        "title": "Monthly Sales and Profit Trends",
        "description": "Calculates aggregated sales and profit by month, showcasing historical seasonality and overall business trajectory.",
        "sql": """SELECT 
    strftime('%Y-%m', Order_Date) AS Month_Year, 
    ROUND(SUM(Sales), 2) AS Monthly_Sales, 
    ROUND(SUM(Profit), 2) AS Monthly_Profit 
FROM sales_data 
GROUP BY Month_Year 
ORDER BY Month_Year ASC;""",
        "business_insight": "Shows strong holiday seasonal trends in November and December. Operations can use this data for demand forecasting, inventory planning, and holiday staffing."
    },
    {
        "id": 8,
        "title": "Performance by Customer Segment",
        "description": "Analyzes behavior, purchasing power, and profitability margins across the three primary market segments: Consumer, Corporate, and Home Office.",
        "sql": """SELECT 
    Segment, 
    COUNT(DISTINCT Customer_ID) AS Customer_Count, 
    COUNT(DISTINCT Order_ID) AS Order_Count, 
    ROUND(SUM(Sales), 2) AS Total_Sales, 
    ROUND(SUM(Profit), 2) AS Total_Profit, 
    ROUND((SUM(Profit)/SUM(Sales)) * 100, 2) AS Margin_Pct 
FROM sales_data 
GROUP BY Segment 
ORDER BY Total_Sales DESC;""",
        "business_insight": "Although Consumer segments drive the largest raw sales volume, Corporate and Home Office segments often show higher stability or average transaction values. Helpful for segment-specific targeting."
    },
    {
        "id": 9,
        "title": "Shipping Mode Performance & Shipping Days",
        "description": "Analyzes the distribution of orders across shipping speeds and calculates the average actual transit time in days.",
        "sql": """SELECT 
    Ship_Mode, 
    COUNT(DISTINCT Order_ID) AS Total_Orders, 
    ROUND(SUM(Sales), 2) AS Total_Sales, 
    ROUND(SUM(Profit), 2) AS Total_Profit, 
    ROUND(AVG(julianday(Ship_Date) - julianday(Order_Date)), 1) AS Avg_Shipping_Days 
FROM sales_data 
GROUP BY Ship_Mode 
ORDER BY Total_Orders DESC;""",
        "business_insight": "Standard shipping is the default. However, premium shipping options ('Same Day' and 'First Class') drive substantial sales. Ensure premium pricing recovers the additional freight costs."
    },
    {
        "id": 10,
        "title": "Bottom 10 Most Unprofitable States",
        "description": "Identifies states where the company is losing the most money, highlighting issues with regional cost structures or excessive discounting.",
        "sql": """SELECT 
    State, 
    Region, 
    ROUND(SUM(Sales), 2) AS Total_Sales, 
    ROUND(SUM(Profit), 2) AS Total_Profit, 
    ROUND((SUM(Profit)/SUM(Sales)) * 100, 2) AS Profit_Margin_Pct 
FROM sales_data 
GROUP BY State, Region 
ORDER BY Total_Profit ASC 
LIMIT 10;""",
        "business_insight": "Exposes highly unprofitable territories. Often, states with large sales volumes like Texas are unprofitable because of local promotional discount rules. Immediate policy intervention is needed."
    },
    {
        "id": 11,
        "title": "Average Order Value (AOV) by Region & Segment",
        "description": "Computes the Average Order Value (AOV) across segments and regions to determine geographical spending depth.",
        "sql": """SELECT 
    Region, 
    Segment, 
    ROUND(SUM(Sales), 2) AS Total_Sales, 
    COUNT(DISTINCT Order_ID) AS Order_Count, 
    ROUND(SUM(Sales) / COUNT(DISTINCT Order_ID), 2) AS Average_Order_Value 
FROM sales_data 
GROUP BY Region, Segment 
ORDER BY Region, Average_Order_Value DESC;""",
        "business_insight": "AOV helps plan cart-value threshold promos (e.g. 'Free Shipping over $150'). If AOV in a region is $200, setting a threshold at $250 can successfully increase sales basket size."
    },
    {
        "id": 12,
        "title": "Impact of Discount Tiers on Margins",
        "description": "Aggregates performance by grouping discounts into four clean business tiers: No Discount, Low (1-20%), Medium (21-50%), and High (51%+).",
        "sql": """SELECT 
    CASE 
        WHEN Discount = 0 THEN '0% No Discount' 
        WHEN Discount <= 0.2 THEN '1% - 20% Low Discount' 
        WHEN Discount <= 0.5 THEN '21% - 50% Med Discount' 
        ELSE '51%+ High Discount' 
    END AS Discount_Tier, 
    COUNT(*) AS Transaction_Count, 
    ROUND(SUM(Sales), 2) AS Total_Sales, 
    ROUND(SUM(Profit), 2) AS Total_Profit, 
    ROUND((SUM(Profit)/SUM(Sales)) * 100, 2) AS Profit_Margin_Pct, 
    ROUND(AVG(Quantity), 1) AS Avg_Quantity_Per_Order 
FROM sales_data 
GROUP BY Discount_Tier 
ORDER BY Discount_Tier;""",
        "business_insight": "Provides concrete proof of the discount trap. While higher discounts sell more items on average per transaction (Quantity), they trigger catastrophic drops in margin, leading to net losses in the 51%+ tier."
    },
    {
        "id": 13,
        "title": "High-Value Transaction Ledger (> $1,000)",
        "description": "Displays individual high-ticket sales order details, letting operations track large individual corporate and consumer purchases.",
        "sql": """SELECT 
    Order_ID, 
    Order_Date, 
    Customer_Name, 
    State, 
    Category, 
    Sub_Category, 
    ROUND(Sales, 2) AS Sales, 
    ROUND(Profit, 2) AS Profit 
FROM sales_data 
WHERE Sales > 1000 
ORDER BY Sales DESC 
LIMIT 15;""",
        "business_insight": "High-value transactions often represent bulk sales of Technology (machines/copiers) or Furniture. Essential for auditing shipment safety and ensuring customer satisfaction."
    },
    {
        "id": 14,
        "title": "Customer Loyalty & Purchase Frequency Analysis",
        "description": "Lists customers who have ordered at least 5 times, helping identify the most loyal repeat buyers.",
        "sql": """SELECT 
    Customer_ID, 
    Customer_Name, 
    Segment, 
    COUNT(DISTINCT Order_ID) AS Order_Count, 
    ROUND(SUM(Sales), 2) AS Total_Sales, 
    ROUND(SUM(Profit), 2) AS Total_Profit 
FROM sales_data 
GROUP BY Customer_ID, Customer_Name, Segment 
HAVING Order_Count >= 5 
ORDER BY Order_Count DESC 
LIMIT 15;""",
        "business_insight": "Repeat customers are the engine of retail health. It costs 5x less to retain a customer than to acquire a new one. This list forms the basis for targeted VIP campaigns."
    },
    {
        "id": 15,
        "title": "Year-Over-Year Sales Growth",
        "description": "Compares absolute annual sales and growth rates using SQL analytical window functions.",
        "sql": """SELECT 
    strftime('%Y', Order_Date) AS Sales_Year, 
    ROUND(SUM(Sales), 2) AS Total_Sales, 
    ROUND(SUM(Profit), 2) AS Total_Profit, 
    ROUND(SUM(Sales) - LAG(SUM(Sales), 1) OVER (ORDER BY strftime('%Y', Order_Date)), 2) AS Sales_YoY_Diff, 
    ROUND(((SUM(Sales) - LAG(SUM(Sales), 1) OVER (ORDER BY strftime('%Y', Order_Date))) / LAG(SUM(Sales), 1) OVER (ORDER BY strftime('%Y', Order_Date))) * 100, 2) AS Sales_YoY_Growth_Pct 
FROM sales_data 
GROUP BY Sales_Year 
ORDER BY Sales_Year;""",
        "business_insight": "Evaluates long-term corporate health. Shows whether growth is compounding. Business owners can check if Sales Growth aligns with Profit Growth (if Sales grow but Profit shrinks, efficiency is falling)."
    }
]

def init_db():
    """Initializes SQLite DB and imports data from CSV."""
    df, dups, missing = load_clean_data()
    
    # Rename columns to be database friendly (replace spaces and dashes)
    db_df = df.copy()
    db_df.columns = [c.replace(" ", "_").replace("-", "_") for c in db_df.columns]
    
    # Format Order Date and Ship Date as string YYYY-MM-DD for SQL compatibility
    db_df["Order_Date"] = db_df["Order_Date"].dt.strftime("%Y-%m-%d")
    db_df["Ship_Date"] = db_df["Ship_Date"].dt.strftime("%Y-%m-%d")
    
    conn = sqlite3.connect(DB_PATH)
    try:
        # Load data into table
        db_df.to_sql("sales_data", conn, if_exists="replace", index=False)
        
        # Create an index on Order_Date and Customer_ID for performance
        cursor = conn.cursor()
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_order_date ON sales_data(Order_Date);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_customer_id ON sales_data(Customer_ID);")
        conn.commit()
        print("Database loaded and indexed successfully.")
    except Exception as e:
        print(f"Error loading database: {e}")
    finally:
        conn.close()

def run_query(query_id: int):
    """Runs one of the 15 predefined SQL queries and returns results, columns, and execution time."""
    # Find query
    query_obj = next((q for q in SQL_QUERIES if q["id"] == query_id), None)
    if not query_obj:
        raise ValueError(f"Query ID {query_id} not found.")
        
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    start_time = time.time()
    try:
        cursor.execute(query_obj["sql"])
        columns = [description[0] for description in cursor.description]
        rows = cursor.fetchall()
        execution_time_ms = round((time.time() - start_time) * 1000, 2)
        
        # Convert rows to dicts
        results = [dict(zip(columns, row)) for row in rows]
        
        return {
            "success": True,
            "columns": columns,
            "data": results,
            "execution_time_ms": execution_time_ms,
            "title": query_obj["title"],
            "description": query_obj["description"],
            "business_insight": query_obj["business_insight"],
            "sql": query_obj["sql"]
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "execution_time_ms": round((time.time() - start_time) * 1000, 2)
        }
    finally:
        conn.close()

def execute_arbitrary_query(sql_str: str):
    """Executes arbitrary SQL query (read-only checks)."""
    # Simple security check to restrict queries to SELECT only
    cleaned_sql = sql_str.strip().lower()
    if not cleaned_sql.startswith("select"):
        return {
            "success": False,
            "error": "Only SELECT queries are allowed for security reasons."
        }
        
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    start_time = time.time()
    try:
        cursor.execute(sql_str)
        columns = [description[0] for description in cursor.description]
        rows = cursor.fetchall()
        execution_time_ms = round((time.time() - start_time) * 1000, 2)
        results = [dict(zip(columns, row)) for row in rows]
        
        return {
            "success": True,
            "columns": columns,
            "data": results,
            "execution_time_ms": execution_time_ms
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "execution_time_ms": round((time.time() - start_time) * 1000, 2)
        }
    finally:
        conn.close()

if __name__ == "__main__":
    init_db()
    res = run_query(1)
    print("Test Query 1 Result:", res["data"])
