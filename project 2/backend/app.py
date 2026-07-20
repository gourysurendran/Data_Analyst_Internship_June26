import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import router
from backend.database import init_db
from backend.generate_reports import build_all_reports

app = FastAPI(
    title="Retail Business Performance & Profitability Analysis API",
    description="REST API for querying retail analytics KPIs, SQL query results, and downloading generated PDF and PPTX reports.",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify React frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(router)

@app.on_event("startup")
def startup_event():
    """Trigger DB initialization and compile PPTX and PDF reports on application launch."""
    print("Starting Retail Analytics Backend...")
    # Initialize DB (Generates data and loads into SQLite)
    init_db()
    
    # Generate PPTX and PDF reports so they are ready for immediate download
    print("Compiling PPTX and PDF reports...")
    build_all_reports()
    print("Application startup complete.")

@app.get("/")
def read_root():
    return {"message": "Retail Business Performance API is running. View docs at /docs."}

if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
