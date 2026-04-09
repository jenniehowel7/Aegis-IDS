from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
import jwt
from datetime import datetime, timedelta
from database import get_db, User

router = APIRouter()
SECRET_KEY = "aegis-secret-key"

class LoginRequest(BaseModel):
    identifier: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    email: str
    role: str
    password: str

def create_token(user):
    payload = {
        "sub": str(user.id),
        "email": user.email,
        "role": user.role,
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

@router.post("/login")
async def login(req: LoginRequest, db: Session = Depends(get_db)):
    # Find user by email or username
    user = db.query(User).filter(
        (User.email == req.identifier) | (User.username == req.identifier)
    ).first()
    
    if not user or user.password != req.password:
        raise HTTPException(401, "Invalid credentials")
    
    return {
        "token": create_token(user),
        "user": {
            "id": str(user.id),
            "username": user.username,
            "email": user.email,
            "role": user.role
        }
    }

@router.post("/register")
async def register(req: RegisterRequest, db: Session = Depends(get_db)):
    # Check if user exists
    existing = db.query(User).filter(
        (User.email == req.email) | (User.username == req.username)
    ).first()
    
    if existing:
        raise HTTPException(400, "Username or email already exists")
    
    # Create new user
    new_user = User(
        username=req.username,
        email=req.email,
        password=req.password,
        role=req.role
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {
        "token": create_token(new_user),
        "user": {
            "id": str(new_user.id),
            "username": new_user.username,
            "email": new_user.email,
            "role": new_user.role
        }
    }