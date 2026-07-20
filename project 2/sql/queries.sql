-- ====================================================================
-- RETAIL BUSINESS PERFORMANCE & PROFITABILITY ANALYSIS
-- Elevate Labs Data Analyst Internship - SQL Queries
-- Database Engine: SQLite
-- ====================================================================

-- 1. OVERALL KPI SUMMARY
-- Aggregates key high-level metrics including sales, profit, orders, and average discount.
SELECT 
    ROUND(SUM(Sales), 2) AS Total_Sales, 
    ROUND(SUM(Profit), 2) AS Total_Profit, 
    COUNT(DISTINCT Order_ID) AS Total_Orders, 
    SUM(Quantity) AS Total_Items_Sold, 
    ROUND(AVG(Discount) * 100, 2) AS Avg_Discount_Pct 
FROM sales_data;


-- 2. SALES AND PROFITABILITY BY REGION
-- Groups sales performance and bottom-line contributions by geographical regions.
SELECT 
    Region, 
    ROUND(SUM(Sales), 2) AS Regional_Sales, 
    ROUND(SUM(Profit), 2) AS Regional_Profit, 
    ROUND((SUM(Profit)/SUM(Sales)) * 100, 2) AS Profit_Margin_Pct 
FROM sales_data 
GROUP BY Region 
ORDER BY Regional_Sales DESC;


-- 3. SALES PERFORMANCE BY CATEGORY AND SUB-CATEGORY
-- Drills down into product sub-categories to assess product line performance.
SELECT 
    Category, 
    Sub_Category, 
    ROUND(SUM(Sales), 2) AS Total_Sales, 
    ROUND(SUM(Profit), 2) AS Total_Profit, 
    ROUND(AVG(Discount) * 100, 2) AS Avg_Discount_Pct
FROM sales_data 
GROUP BY Category, Sub_Category 
ORDER BY Category, Total_Sales DESC;


-- 4. TOP 10 MOST PROFITABLE PRODUCTS
-- Identifies the products driving the highest net profitability.
SELECT 
    Product_ID, 
    Product_Name, 
    Category, 
    Sub_Category, 
    ROUND(SUM(Sales), 2) AS Total_Sales, 
    ROUND(SUM(Profit), 2) AS Total_Profit 
FROM sales_data 
GROUP BY Product_ID, Product_Name, Category, Sub_Category 
ORDER BY Total_Profit DESC 
LIMIT 10;


-- 5. BOTTOM 10 MOST LOSS-MAKING PRODUCTS
-- Pinpoints specific products that are leaking the most margin.
SELECT 
    Product_ID, 
    Product_Name, 
    Category, 
    Sub_Category, 
    ROUND(SUM(Sales), 2) AS Total_Sales, 
    ROUND(SUM(Profit), 2) AS Total_Profit 
FROM sales_data 
GROUP BY Product_ID, Product_Name, Category, Sub_Category 
ORDER BY Total_Profit ASC 
LIMIT 10;


-- 6. TOP 10 CUSTOMERS BY TOTAL SPEND
-- Ranks customers based on their total cumulative sales contribution.
SELECT 
    Customer_ID, 
    Customer_Name, 
    Segment, 
    ROUND(SUM(Sales), 2) AS Total_Spent, 
    ROUND(SUM(Profit), 2) AS Total_Contribution_Profit, 
    COUNT(DISTINCT Order_ID) AS Total_Orders 
FROM sales_data 
GROUP BY Customer_ID, Customer_Name, Segment 
ORDER BY Total_Spent DESC 
LIMIT 10;


-- 7. MONTHLY SALES AND PROFIT TRENDS
-- Calculates monthly aggregated sales and profit to highlight historical seasonality.
SELECT 
    strftime('%Y-%m', Order_Date) AS Month_Year, 
    ROUND(SUM(Sales), 2) AS Monthly_Sales, 
    ROUND(SUM(Profit), 2) AS Monthly_Profit 
FROM sales_data 
GROUP BY Month_Year 
ORDER BY Month_Year ASC;


-- 8. PERFORMANCE BY CUSTOMER SEGMENT
-- Analyzes behavior and profitability margins across the Consumer, Corporate, and Home Office segments.
SELECT 
    Segment, 
    COUNT(DISTINCT Customer_ID) AS Customer_Count, 
    COUNT(DISTINCT Order_ID) AS Order_Count, 
    ROUND(SUM(Sales), 2) AS Total_Sales, 
    ROUND(SUM(Profit), 2) AS Total_Profit, 
    ROUND((SUM(Profit)/SUM(Sales)) * 100, 2) AS Margin_Pct 
FROM sales_data 
GROUP BY Segment 
ORDER BY Total_Sales DESC;


-- 9. SHIPPING MODE PERFORMANCE & AVERAGE TRANSIT DAYS
-- Analyzes shipping speeds, volumes, margins, and transit time.
SELECT 
    Ship_Mode, 
    COUNT(DISTINCT Order_ID) AS Total_Orders, 
    ROUND(SUM(Sales), 2) AS Total_Sales, 
    ROUND(SUM(Profit), 2) AS Total_Profit, 
    ROUND(AVG(julianday(Ship_Date) - julianday(Order_Date)), 1) AS Avg_Shipping_Days 
FROM sales_data 
GROUP BY Ship_Mode 
ORDER BY Total_Orders DESC;


-- 10. BOTTOM 10 MOST UNPROFITABLE STATES
-- Identifies states where the company is losing the most money.
SELECT 
    State, 
    Region, 
    ROUND(SUM(Sales), 2) AS Total_Sales, 
    ROUND(SUM(Profit), 2) AS Total_Profit, 
    ROUND((SUM(Profit)/SUM(Sales)) * 100, 2) AS Profit_Margin_Pct 
FROM sales_data 
GROUP BY State, Region 
ORDER BY Total_Profit ASC 
LIMIT 10;


-- 11. AVERAGE ORDER VALUE (AOV) BY REGION & SEGMENT
-- Computes the Average Order Value (Sales per unique Order ID).
SELECT 
    Region, 
    Segment, 
    ROUND(SUM(Sales), 2) AS Total_Sales, 
    COUNT(DISTINCT Order_ID) AS Order_Count, 
    ROUND(SUM(Sales) / COUNT(DISTINCT Order_ID), 2) AS Average_Order_Value 
FROM sales_data 
GROUP BY Region, Segment 
ORDER BY Region, Average_Order_Value DESC;


-- 12. IMPACT OF DISCOUNT TIERS ON MARGINS
-- Groups discounts into business tiers to prove margins are damaged by high discount rates.
SELECT 
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
ORDER BY Discount_Tier;


-- 13. HIGH-VALUE TRANSACTION LEDGER (> $1,000)
-- Lists high-ticket sales order details for operational audits.
SELECT 
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
LIMIT 15;


-- 14. CUSTOMER LOYALTY & PURCHASE FREQUENCY ANALYSIS
-- Lists top repeat buyers with 5 or more orders.
SELECT 
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
LIMIT 15;


-- 15. YEAR-OVER-YEAR SALES GROWTH
-- Evaluates compound sales growth rate over time using SQL window functions.
SELECT 
    strftime('%Y', Order_Date) AS Sales_Year, 
    ROUND(SUM(Sales), 2) AS Total_Sales, 
    ROUND(SUM(Profit), 2) AS Total_Profit, 
    ROUND(SUM(Sales) - LAG(SUM(Sales), 1) OVER (ORDER BY strftime('%Y', Order_Date)), 2) AS Sales_YoY_Diff, 
    ROUND(((SUM(Sales) - LAG(SUM(Sales), 1) OVER (ORDER BY strftime('%Y', Order_Date))) / LAG(SUM(Sales), 1) OVER (ORDER BY strftime('%Y', Order_Date))) * 100, 2) AS Sales_YoY_Growth_Pct 
FROM sales_data 
GROUP BY Sales_Year 
ORDER BY Sales_Year;
