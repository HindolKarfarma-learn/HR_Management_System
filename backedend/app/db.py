import os
from dotenv import load_dotenv
load_dotenv()

from sqlalchemy.ext.asyncio import create_async_engine,AsyncSession
from sqlalchemy.orm import sessionmaker,DeclarativeBase
from typing import AsyncGenerator

class Base(DeclarativeBase):
    pass

Database_URL=os.getenv("DB_URL_SQL")
engine=create_async_engine(Database_URL,echo=True)
async_session=sessionmaker(bind=engine,expire_on_commit=False,class_=AsyncSession)

async def get_db()-> AsyncGenerator[AsyncSession,None]:
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()