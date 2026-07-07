-- Display all records
SELECT *
FROM online_sales;

-- Monthly Revenue and Order Volume
SELECT
    strftime('%Y', order_date) AS Year,
    strftime('%m', order_date) AS Month,
    SUM(amount) AS Total_Revenue,
    COUNT(DISTINCT order_id) AS Order_Volume
FROM online_sales
GROUP BY Year, Month
ORDER BY Year, Month;

-- Top 3 Months by Sales
SELECT
    strftime('%Y', order_date) AS Year,
    strftime('%m', order_date) AS Month,
    SUM(amount) AS Total_Revenue
FROM online_sales
GROUP BY Year, Month
ORDER BY Total_Revenue DESC
LIMIT 3;

-- Monthly Order Volume
SELECT
    strftime('%Y', order_date) AS Year,
    strftime('%m', order_date) AS Month,
    COUNT(DISTINCT order_id) AS Order_Volume
FROM online_sales
GROUP BY Year, Month
ORDER BY Year, Month;

-- Revenue by Product
SELECT
    product_id,
    SUM(amount) AS Total_Revenue
FROM online_sales
GROUP BY product_id
ORDER BY Total_Revenue DESC;

-- Average Monthly Revenue
SELECT
    strftime('%Y', order_date) AS Year,
    strftime('%m', order_date) AS Month,
    AVG(amount) AS Average_Revenue
FROM online_sales
GROUP BY Year, Month
ORDER BY Year, Month;