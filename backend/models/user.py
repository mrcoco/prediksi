# from sqlalchemy import Column, Integer, String
# from sqlalchemy.orm import mapped_column, Mapped
# from database import Base

# class User(Base):
#     __tablename__ = "users"
    
#     id = Column(Integer, primary_key=True, index=True)
#     username = Column(String, unique=True, index=True)
#     hashed_password: Mapped[str] = mapped_column(String)
    
#     def __repr__(self):
#         return f"<User(id={self.id}, username='{self.username}')>"

from sqlalchemy import Column, Integer, String, Boolean, JSON
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    role = Column(String)
    profile = Column(JSON)
    is_active = Column(Boolean)
    hashed_password = Column(String)

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}')>"