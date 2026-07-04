from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

# Create database engine for MySQL. pool_pre_ping checks if connection is alive before using it.
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for DB models
Base = declarative_base()

# DB session dependency to inject into routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
