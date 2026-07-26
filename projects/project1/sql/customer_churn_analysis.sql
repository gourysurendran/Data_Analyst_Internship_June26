-- =====================================================
-- Customer Churn Analysis for Telecom Industry
-- SQL Queries
-- =====================================================


-- Query 1: Total Customers

SELECT COUNT(*) AS Total_Customers
FROM customer_churn;


-- Query 2: Total Churned Customers

SELECT COUNT(*) AS Churned_Customers
FROM customer_churn
WHERE Churn = 'Yes';


-- Query 3: Customer Churn Rate

SELECT
ROUND(
    (SUM(CASE WHEN Churn='Yes' THEN 1 ELSE 0 END) * 100.0) / COUNT(*),
2) AS Churn_Rate_Percentage
FROM customer_churn;


-- Query 4: Customers by Contract Type

SELECT
    Contract,
    COUNT(*) AS Total_Customers
FROM customer_churn
GROUP BY Contract
ORDER BY Total_Customers DESC;


-- Query 5: Churn by Contract Type

SELECT
    Contract,
    COUNT(*) AS Churned_Customers
FROM customer_churn
WHERE Churn='Yes'
GROUP BY Contract
ORDER BY Churned_Customers DESC;