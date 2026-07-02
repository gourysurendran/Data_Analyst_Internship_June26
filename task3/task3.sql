-- Create Database
CREATE DATABASE internship_db;

-- Use Database
USE internship_db;

-- Create Employees Table
CREATE TABLE employees (
    emp_id INT PRIMARY KEY,
    emp_name VARCHAR(100),
    department VARCHAR(50),
    salary DECIMAL(10,2),
    joining_date DATE
);

-- Insert Employee Records
INSERT INTO employees (emp_id, emp_name, department, salary, joining_date)
VALUES
(101, 'Aarav', 'HR', 35000, '2024-01-15'),
(102, 'Diya', 'IT', 55000, '2023-08-10'),
(103, 'Rahul', 'Finance', 48000, '2022-11-05'),
(104, 'Meera', 'Marketing', 42000, '2024-03-20'),
(105, 'Arjun', 'IT', 60000, '2021-06-12');

-- Display Databases
SHOW DATABASES;

-- Display Tables
SHOW TABLES;

-- View Employee Records
SELECT * FROM employees;

-- SELECT
SELECT emp_name FROM employees;

-- WHERE
SELECT * FROM employees
WHERE department = 'IT';

-- ORDER BY
SELECT * FROM employees
ORDER BY salary DESC;

-- GROUP BY
SELECT department, COUNT(*) AS total_employees
FROM employees
GROUP BY department;

-- Create Departments Table
CREATE TABLE departments (
    dept_id INT PRIMARY KEY,
    department VARCHAR(50),
    manager VARCHAR(100)
);

-- Insert Department Records
INSERT INTO departments
VALUES
(1, 'HR', 'Anita'),
(2, 'IT', 'Rahul'),
(3, 'Finance', 'Priya'),
(4, 'Marketing', 'Kiran');

-- View Departments
SELECT * FROM departments;

-- INNER JOIN
SELECT e.emp_name, e.department, d.manager
FROM employees e
INNER JOIN departments d
ON e.department = d.department;

-- LEFT JOIN
SELECT e.emp_name, e.department, d.manager
FROM employees e
LEFT JOIN departments d
ON e.department = d.department;

-- RIGHT JOIN
SELECT e.emp_name, e.department, d.manager
FROM employees e
RIGHT JOIN departments d
ON e.department = d.department;

-- SUM
SELECT SUM(salary) AS total_salary
FROM employees;

-- AVG
SELECT AVG(salary) AS average_salary
FROM employees;

-- Subquery
SELECT *
FROM employees
WHERE salary > (
    SELECT AVG(salary)
    FROM employees
);

-- Create View
CREATE VIEW employee_details AS
SELECT emp_name, department, salary
FROM employees;

SELECT * FROM employee_details;

-- Create Index
CREATE INDEX idx_department
ON employees(department);

SHOW INDEX FROM employees;