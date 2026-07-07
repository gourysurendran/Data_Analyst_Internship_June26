# Data Analyst Internship – Elevate Labs

Welcome to my **Data Analyst Internship** repository at **Elevate Labs**.

This repository contains the tasks, datasets, notebooks, dashboards, SQL scripts, reports, and documentation completed during my internship. It will be updated regularly as I complete new tasks throughout the internship.

## Repository Structure

```text
Data_Analyst_Internship_June26/
├── README.md
├── task1/
│   ├── README.md
│   ├── cleaning_summary.md
│   ├── data_cleaning.ipynb
│   ├── marketing_campaign.csv
│   └── marketing_campaign_cleaned.csv
├── task2/
│   ├── README.md
│   ├── insights.md
│   ├── SampleSuperstore.csv
│   ├── Task2_PowerBI.pbix
│   ├── Dashboard Screenshot.png
│   └── Dashboard.pdf (optional)
├── task3/
│   ├── README.md
│   ├── task3.sql
│   └── screenshots/
├── task4/
│   ├── README.md
│   ├── insights.md
│   ├── Task4_PowerBI.pbix
│   ├── Sample-Superstore.csv
│   ├── Dashboard_Screenshot.png
│   └── Dashboard_Summary.pptx
├── task5/
│   ├── README.md
│   ├── insights.md
│   ├── eda.ipynb
│   ├── Titanic.csv
│   └── EDA_Report.pdf
├── task6/
│   ├── README.md
│   ├── insights.md
│   ├── task6.sql
│   ├── task6.db
│   ├── online_sales.csv
│   └── out/
│       ├── monthly_sales_results.png
│       ├── top3_months_sales.png
│       ├── monthly_order_volume.png
│       ├── product_revenue_results.png
│       └── average_revenue_results.png
└── ...
```

## Completed Tasks

### Task 1: Data Cleaning and Preprocessing

**Objective:**
Clean and preprocess the Customer Personality Analysis dataset using Python and Pandas.

**Work Completed:**
- Loaded the dataset into Pandas.
- Handled missing values in the `income` column using the median.
- Checked for duplicate records.
- Standardized column names.
- Converted the `dt_customer` column to datetime format.
- Verified data types.
- Saved the cleaned dataset for further analysis.

---

### Task 2: Data Visualization and Storytelling

**Objective:**
Create an interactive Power BI dashboard to visualize sales data and present meaningful business insights.

**Work Completed:**
- Imported the Superstore dataset into Power BI.
- Created KPI cards for Total Sales, Total Profit, and Total Quantity.
- Developed visualizations for Sales by Category, Sales by Region, Sales by Segment, and Profit by Category.
- Designed an interactive dashboard with clear business insights.
- Saved the Power BI project and dashboard report.

---

### Task 3: SQL for Data Analysis

**Objective:**
Use SQL queries to extract, manipulate, and analyze data from a relational database.

**Work Completed:**
- Created a database and tables.
- Inserted sample records into the database.
- Executed SQL queries using SELECT, WHERE, ORDER BY, and GROUP BY.
- Performed JOIN operations.
- Used aggregate functions such as SUM() and AVG().
- Implemented views and indexes.
- Captured query outputs and documented the SQL scripts.

---

### Task 4: Dashboard Design

**Objective:**
Design an interactive Power BI dashboard to analyze Superstore sales data and present meaningful business insights.

**Work Completed:**
- Imported the Superstore dataset into Power BI.
- Created KPI cards for Total Sales, Total Profit, and Total Quantity.
- Built a Sales Trend (Order Date) line chart for time-series analysis.
- Developed visualizations for Sales by Category, Sales by Region, Sales by Segment, and Profit by Category.
- Added an interactive Region slicer for filtering dashboard data.
- Designed a professional dashboard layout with interactive visuals.
- Documented business insights and prepared a PowerPoint summary.

---

### Task 5: Exploratory Data Analysis (EDA)

**Objective:**
Perform Exploratory Data Analysis (EDA) on the Titanic dataset to identify patterns, trends, relationships, and insights using statistical methods and visualizations.

**Work Completed:**
- Loaded the Titanic dataset using Pandas.
- Explored the dataset using `head()`, `info()`, `describe()`, and `value_counts()`.
- Created visualizations including Histogram, Boxplot, Scatter Plot, Correlation Heatmap, and Pairplot.
- Analyzed missing values, distributions, correlations, and outliers.
- Documented observations for each visualization.
- Summarized key findings in a PDF report and supporting documentation.

---

### Task 6: Sales Trend Analysis Using Aggregations

**Objective:**
Analyze monthly revenue and order volume using SQL aggregation functions on an online sales dataset.

**Work Completed:**
- Imported the online sales dataset into SQLite.
- Displayed all records from the sales table.
- Calculated monthly revenue using the `SUM()` aggregate function.
- Calculated monthly order volume using `COUNT(DISTINCT order_id)`.
- Identified the top three months by total revenue.
- Analyzed product-wise revenue using aggregation.
- Calculated average monthly revenue.
- Used `GROUP BY`, `ORDER BY`, `LIMIT`, and aggregate functions to generate business insights.
- Captured query outputs and documented the SQL analysis.

## Tools & Technologies

- Python
- Pandas
- Matplotlib
- Seaborn
- Jupyter Notebook
- Microsoft Power BI
- MySQL Workbench
- SQLite
- SQL
- Visual Studio Code
- Git
- GitHub

## About

This repository documents my learning journey during the **Data Analyst Internship at Elevate Labs**. Each task demonstrates practical skills in **data cleaning, exploratory data analysis, data visualization, dashboard design, SQL-based data analysis, sales trend analysis, and business insight generation**. The repository will continue to grow as I complete additional internship tasks.
