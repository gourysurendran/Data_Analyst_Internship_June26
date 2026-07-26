import os
import random
import datetime
import pandas as pd
import numpy as np

# Set random seed for reproducibility
random.seed(42)
np.random.seed(42)

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
CSV_PATH = os.path.join(DATA_DIR, "superstore_sales.csv")

# Define lists for generation
SHIP_MODES = ["Standard Class", "Second Class", "First Class", "Same Day"]
SEGMENTS = ["Consumer", "Corporate", "Home Office"]
REGIONS = {
    "East": ["New York", "Pennsylvania", "Massachusetts", "Delaware", "Maryland", "New Jersey"],
    "West": ["California", "Washington", "Oregon", "Arizona", "Colorado", "Utah"],
    "South": ["Florida", "Georgia", "North Carolina", "Virginia", "Kentucky", "Tennessee"],
    "Central": ["Texas", "Illinois", "Michigan", "Ohio", "Indiana", "Wisconsin"]
}
CITIES = {
    "New York": "New York", "Pennsylvania": "Philadelphia", "Massachusetts": "Boston",
    "Delaware": "Wilmington", "Maryland": "Baltimore", "New Jersey": "Newark",
    "California": "Los Angeles", "Washington": "Seattle", "Oregon": "Portland",
    "Arizona": "Phoenix", "Colorado": "Denver", "Utah": "Salt Lake City",
    "Florida": "Miami", "Georgia": "Atlanta", "North Carolina": "Charlotte",
    "Virginia": "Richmond", "Kentucky": "Henderson", "Tennessee": "Nashville",
    "Texas": "Houston", "Illinois": "Chicago", "Michigan": "Detroit",
    "Ohio": "Columbus", "Indiana": "Indianapolis", "Wisconsin": "Milwaukee"
}

CATEGORIES = {
    "Furniture": {
        "Bookcases": {"price_range": (80, 350), "cogs_pct": 0.75, "ship_cost": 25},
        "Chairs": {"price_range": (50, 450), "cogs_pct": 0.65, "ship_cost": 20},
        "Furnishings": {"price_range": (10, 120), "cogs_pct": 0.50, "ship_cost": 5},
        "Tables": {"price_range": (150, 800), "cogs_pct": 0.85, "ship_cost": 50}
    },
    "Office Supplies": {
        "Appliances": {"price_range": (50, 300), "cogs_pct": 0.55, "ship_cost": 15},
        "Art": {"price_range": (5, 50), "cogs_pct": 0.40, "ship_cost": 2},
        "Binders": {"price_range": (2, 80), "cogs_pct": 0.35, "ship_cost": 3},
        "Envelopes": {"price_range": (5, 30), "cogs_pct": 0.30, "ship_cost": 1},
        "Fasteners": {"price_range": (1, 15), "cogs_pct": 0.30, "ship_cost": 1},
        "Labels": {"price_range": (2, 25), "cogs_pct": 0.30, "ship_cost": 1},
        "Paper": {"price_range": (5, 60), "cogs_pct": 0.35, "ship_cost": 2},
        "Storage": {"price_range": (20, 200), "cogs_pct": 0.50, "ship_cost": 10},
        "Supplies": {"price_range": (10, 100), "cogs_pct": 0.60, "ship_cost": 5}
    },
    "Technology": {
        "Accessories": {"price_range": (20, 150), "cogs_pct": 0.45, "ship_cost": 4},
        "Copiers": {"price_range": (400, 1500), "cogs_pct": 0.40, "ship_cost": 40},
        "Machines": {"price_range": (200, 1200), "cogs_pct": 0.70, "ship_cost": 30},
        "Phones": {"price_range": (100, 900), "cogs_pct": 0.50, "ship_cost": 8}
    }
}

CUSTOMERS = [
    {"id": f"CUST-{i:05d}", "name": name, "segment": random.choice(SEGMENTS)}
    for i, name in enumerate([
        "Claire Gute", "Darrin Van Huff", "Sean O'Donnell", "Brosina Hoffman", "Andrew Allen",
        "Irene Madden", "Harold Pawlan", "Pete Kriz", "Alejandro Grove", "Ola Baker",
        "Joel Eaton", "Ken Lonsdale", "Sandra Flanagan", "Emily Burns", "Eric Hoffmann",
        "Tracy Blumstein", "Valerie Mitchum", "Roy Phan", "Mick Hernandez", "Ken O'Donnell",
        "Ruben Ausman", "Shirley Jackson", "Darren Powers", "Janet Molinari", "David Kendrick",
        "Lena Cacioppo", "Michael Moore", "Georgia Nesselrode", "Theresa Coyne", "Joe Elijah",
        "Patrick O'Donnell", "Justin Ritter", "Eugene Biddle", "Gary Detector", "Katherine Ducich",
        "Harry Marie", "Arthur Grieder", "Guy Armstrong", "Adam Shachtman", "Todd Boyes",
        "Sandra Lemoine", "Arianne Shilo", "Nora Pelletier", "Kelly Andreada", "Zack Olson",
        "Maria Eirich", "Justin Hirsch", "Gary Mitchum", "Dorothy Wardle", "Alan Barnes"
    ])
]

# Add more synthetic customer names to reach ~200 customers
first_names = ["John", "Mary", "Robert", "Patricia", "James", "Jennifer", "William", "Elizabeth", "David", "Barbara", 
               "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy",
               "Daniel", "Lisa", "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley"]
last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
              "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
              "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson"]

for i in range(150):
    name = f"{random.choice(first_names)} {random.choice(last_names)}"
    c_id = f"CUST-{(len(CUSTOMERS) + i):05d}"
    CUSTOMERS.append({"id": c_id, "name": name, "segment": random.choice(SEGMENTS)})

PRODUCTS = []
prod_counters = {}
for category, subcategories in CATEGORIES.items():
    for subcat, details in subcategories.items():
        prefix = f"{category[:3].upper()}-{subcat[:2].upper()}"
        for i in range(1, 16): # 15 products per subcategory
            prod_id = f"{prefix}-{10000000 + i}"
            prod_name = f"{subcat[:-1] if subcat.endswith('s') else subcat} Model-{chr(64+i)}{i}"
            PRODUCTS.append({
                "product_id": prod_id,
                "product_name": prod_name,
                "category": category,
                "sub_category": subcat,
                "price_range": details["price_range"],
                "cogs_pct": details["cogs_pct"],
                "ship_cost": details["ship_cost"]
            })

def generate_dataset(num_records=5500):
    """Generates a highly realistic synthetic retail dataset."""
    os.makedirs(DATA_DIR, exist_ok=True)
    
    start_date = datetime.date(2024, 1, 1)
    end_date = datetime.date(2026, 6, 30)
    delta_days = (end_date - start_date).days
    
    records = []
    
    for i in range(1, num_records + 1):
        row_id = i
        
        # Determine order date based on seasonality (Nov and Dec have higher probability)
        # Choose a random day count
        day_offset = random.randint(0, delta_days)
        order_date = start_date + datetime.timedelta(days=day_offset)
        
        # Seasonality boost: 30% of records are forced to be in Q4 (Nov-Dec)
        month = order_date.month
        if random.random() < 0.25: # Redirect some dates to Q4
            year = order_date.year
            q4_month = random.choice([11, 12])
            q4_day = random.randint(1, 30 if q4_month == 11 else 31)
            order_date = datetime.date(year, q4_month, q4_day)
            month = q4_month

        # Ship Date is order date + 1 to 7 days
        ship_days = random.randint(1, 7)
        # Ship Mode correlates with days
        if ship_days == 1:
            ship_mode = "Same Day"
        elif ship_days <= 3:
            ship_mode = "First Class"
        elif ship_days <= 5:
            ship_mode = "Second Class"
        else:
            ship_mode = "Standard Class"
            
        ship_date = order_date + datetime.timedelta(days=ship_days)
        
        # Customer selection
        customer = random.choice(CUSTOMERS)
        customer_id = customer["id"]
        customer_name = customer["name"]
        segment = customer["segment"]
        
        # Location selection
        region = random.choice(list(REGIONS.keys()))
        state = random.choice(REGIONS[region])
        city = CITIES[state]
        postal_code = f"{random.randint(10000, 99999):05d}"
        
        # Product selection
        product = random.choice(PRODUCTS)
        product_id = product["product_id"]
        product_name = product["product_name"]
        category = product["category"]
        sub_category = product["sub_category"]
        
        # Pricing, Discount and Profit calculations
        base_unit_price = round(random.uniform(product["price_range"][0], product["price_range"][1]), 2)
        quantity = random.randint(1, 10)
        
        # Set realistic discounts
        # Discounts are higher in Central and South regions
        # Particular states (Texas, Ohio, Pennsylvania) have higher discount rates
        # Tables and Bookcases have higher discounts to clear inventory
        discount_roll = random.random()
        if state in ["Texas", "Ohio", "Pennsylvania"]:
            # High probability of deep discounts
            discount = random.choice([0.2, 0.4, 0.6, 0.8]) if discount_roll < 0.6 else 0.0
        elif sub_category in ["Tables", "Bookcases"]:
            discount = random.choice([0.1, 0.2, 0.3, 0.5]) if discount_roll < 0.5 else 0.0
        else:
            discount = random.choice([0.1, 0.2]) if discount_roll < 0.3 else 0.0
            
        sales = round((base_unit_price * quantity) * (1 - discount), 2)
        
        # COGS calculation
        unit_cost = base_unit_price * product["cogs_pct"]
        total_cogs = round(unit_cost * quantity, 2)
        
        # Shipping Cost
        shipping_fee = product["ship_cost"] * quantity
        # Same day is 1.5x ship cost, Standard is 0.8x
        if ship_mode == "Same Day":
            shipping_fee *= 1.5
        elif ship_mode == "Standard Class":
            shipping_fee *= 0.8
        shipping_fee = round(shipping_fee, 2)
        
        # Profit = Sales - COGS - Shipping Fee
        # A deep discount (e.g. 50% or 80%) leads to a major profit loss
        profit = round(sales - total_cogs - shipping_fee, 2)
        
        # Generate Order ID
        order_id = f"CA-{order_date.year}-{random.randint(100000, 999999)}"
        
        records.append({
            "Row ID": row_id,
            "Order ID": order_id,
            "Order Date": order_date.strftime("%Y-%m-%d"),
            "Ship Date": ship_date.strftime("%Y-%m-%d"),
            "Ship Mode": ship_mode,
            "Customer ID": customer_id,
            "Customer Name": customer_name,
            "Segment": segment,
            "Country": "United States",
            "City": city,
            "State": state,
            "Postal Code": postal_code,
            "Region": region,
            "Product ID": product_id,
            "Category": category,
            "Sub-Category": sub_category,
            "Product Name": product_name,
            "Sales": sales,
            "Quantity": quantity,
            "Discount": discount,
            "Profit": profit
        })
        
    df = pd.DataFrame(records)
    
    # Introduce some deliberate data issues for cleaning (like 5 missing postal codes or 2 duplicates)
    # This demonstrates the "Clean data, handle missing values, remove duplicates" requirement.
    df.loc[df.sample(5).index, "Postal Code"] = np.nan
    
    # Add a couple of duplicate rows
    dup_rows = df.sample(3).copy()
    # Modify Row ID to keep unique but make duplicate transactions
    dup_rows["Row ID"] = df["Row ID"].max() + np.arange(1, 4)
    df = pd.concat([df, dup_rows], ignore_index=True)
    
    df.to_csv(CSV_PATH, index=False)
    print(f"Generated {len(df)} transactions in {CSV_PATH}")

def load_clean_data():
    """Loads dataset from CSV, cleans it, handles missing values, and removes duplicates."""
    if not os.path.exists(CSV_PATH):
        generate_dataset()
        
    df = pd.read_csv(CSV_PATH)
    
    # 1. Remove exact duplicate rows (ignoring Row ID)
    cols_to_check = [c for c in df.columns if c != "Row ID"]
    duplicates_count = df.duplicated(subset=cols_to_check).sum()
    if duplicates_count > 0:
        df = df.drop_duplicates(subset=cols_to_check, keep='first')
        
    # 2. Fill missing Postal Codes with a default based on State/City or a generic placeholder
    missing_pc_count = df["Postal Code"].isnull().sum()
    if missing_pc_count > 0:
        # Fill missing values
        df["Postal Code"] = df["Postal Code"].fillna("90001") # Default LA postal code
        
    # 3. Data type conversion
    df["Order Date"] = pd.to_datetime(df["Order Date"])
    df["Ship Date"] = pd.to_datetime(df["Ship Date"])
    df["Sales"] = df["Sales"].astype(float)
    df["Quantity"] = df["Quantity"].astype(int)
    df["Discount"] = df["Discount"].astype(float)
    df["Profit"] = df["Profit"].astype(float)
    
    # 4. Create auxiliary columns
    df["Profit Margin"] = df.apply(lambda r: (r["Profit"] / r["Sales"]) if r["Sales"] > 0 else 0, axis=1)
    df["Year"] = df["Order Date"].dt.year
    df["Month"] = df["Order Date"].dt.strftime("%Y-%m")
    
    return df, duplicates_count, missing_pc_count

if __name__ == "__main__":
    generate_dataset()
    df, dups, missing = load_clean_data()
    print(f"Loaded and cleaned dataset. Duplicates removed: {dups}. Missing postal codes fixed: {missing}.")
    print(f"Total rows: {len(df)}")
    print(f"Total Sales: ${df['Sales'].sum():,.2f}")
    print(f"Total Profit: ${df['Profit'].sum():,.2f}")
