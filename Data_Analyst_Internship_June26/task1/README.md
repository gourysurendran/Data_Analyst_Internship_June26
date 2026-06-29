# Task 1: Data Cleaning and Preprocessing

## Objective

The objective of this task is to clean and preprocess the **Customer Personality Analysis** dataset by identifying and handling missing values, checking for duplicate records, standardizing column names, converting date formats, and ensuring appropriate data types using Python and Pandas.

---

## Dataset

* **Dataset Name:** Customer Personality Analysis
* **Source:** Kaggle
* **Original File:** `marketing_campaign.csv`
* **Cleaned File:** `marketing_campaign_cleaned.csv`

---

## Tools Used

* Python
* Pandas
* Visual Studio Code (VS Code)
* Jupyter Notebook

---

## Data Cleaning Steps

The following preprocessing steps were performed:

1. Loaded the dataset using Pandas.
2. Read the dataset using the correct tab (`\t`) separator.
3. Inspected the dataset using `head()`, `shape()`, and `info()`.
4. Identified missing values using `isnull().sum()`.
5. Filled missing values in the **income** column using the median.
6. Checked for duplicate records (no duplicate rows were found).
7. Converted all column names to lowercase.
8. Inspected categorical columns (`education` and `marital_status`).
9. Converted the `dt_customer` column to `datetime` format.
10. Verified data types after preprocessing.
11. Confirmed that no missing values remained.
12. Saved the cleaned dataset as `marketing_campaign_cleaned.csv`.

---

## Project Structure

```text
Task_1/
├── marketing_campaign.csv
├── marketing_campaign_cleaned.csv
├── data_cleaning.ipynb
└── README.md
```

---

## Output

The cleaned dataset is ready for further data analysis and machine learning tasks. It contains:

* No missing values
* No duplicate records
* Standardized column names
* Correct date format
* Appropriate data types

---

## Learning Outcomes

Through this task, I learned how to:

* Load datasets using Pandas
* Explore and inspect datasets
* Handle missing values
* Check for duplicate records
* Standardize column names
* Convert date columns into datetime format
* Verify data quality after preprocessing
* Save a cleaned dataset for future analysis
