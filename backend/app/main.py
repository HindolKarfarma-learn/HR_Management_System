import urllib.parse
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text

from app.config import settings
from app.database import engine, Base, SessionLocal
from app import models
from app.auth import hash_password
from app.routers import auth, employees, attendance, leaves, payroll

def init_db():
    """Ensure the target database exists on the MySQL server, then create tables."""
    try:
        # Parse the database URL to extract the DB name and host info
        parsed_url = urllib.parse.urlparse(settings.DATABASE_URL)
        db_name = parsed_url.path.lstrip('/')
        
        # Construct a connection URL to the server without a database specified
        server_url = f"{parsed_url.scheme}://{parsed_url.netloc}/"
        
        # Connect to MySQL server and execute CREATE DATABASE
        temp_engine = create_engine(server_url)
        with temp_engine.connect() as conn:
            conn.execute(text(f"CREATE DATABASE IF NOT EXISTS {db_name}"))
            # In SQLAlchemy, committing is needed for DDL in some connection modes
            conn.execute(text("COMMIT"))
        temp_engine.dispose()
        print(f"Database '{db_name}' verified/created successfully.")
    except Exception as e:
        print(f"Database verification warning: {e}")
        print("Continuing initialization assuming database already exists...")

    try:
        # Create all tables defined in models
        Base.metadata.create_all(bind=engine)
        print("Database tables initialized successfully.")
    except Exception as e:
        print(f"Error initializing database tables: {e}")
        print("Make sure your MySQL server is running and credentials are correct.")

def seed_demo_users():
    """Create documented demo accounts once in development environments."""
    if not settings.DEBUG or not settings.SEED_DEMO_USERS:
        return
    demo_users = [
        {
            "employee_id": "EMP-1001", "email": "admin@peopleflow.io",
            "password": "Admin@123", "role": "Admin", "first_name": "Aarav",
            "last_name": "Mehta", "department": "People Operations",
            "job_title": "HR Director", "base_salary": 120000.0,
        },
        {
            "employee_id": "EMP-1024", "email": "employee@peopleflow.io",
            "password": "Employee@123", "role": "Employee", "first_name": "Nisha",
            "last_name": "Kapoor", "department": "Product Design",
            "job_title": "Senior Product Designer", "base_salary": 90000.0,
        },
    ]
    db = SessionLocal()
    try:
        for values in demo_users:
            if db.query(models.User).filter(models.User.email == values["email"]).first():
                continue
            password = values.pop("password")
            db.add(models.User(**values, hashed_password=hash_password(password), is_verified=True))
        db.commit()
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    if settings.AUTO_INIT_DB:
        init_db()
        seed_demo_users()
    yield

# Create FastAPI instance
app = FastAPI(
    title="Human Resource Management System (HRMS) API",
    description="Backend API for employee onboarding, profile management, attendance, leave management, and payroll.",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS for frontend compatibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For hackathon, allow all origins. Restrict in production.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router)
app.include_router(employees.router)
app.include_router(attendance.router)
app.include_router(leaves.router)
app.include_router(payroll.router)

@app.get("/", tags=["Root"])
def root():
    return {
        "status": "Online",
        "message": "Welcome to the HRMS API",
        "docs": "/docs",
        "redoc": "/redoc"
    }
