from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db, User
from utils.auth import get_current_user

router = APIRouter()

@router.get("/me")
async def get_my_profile(current_user=Depends(get_current_user)):
    """Get the current logged-in user's profile"""
    return current_user

@router.get("/{user_id}")
async def get_profile(user_id: int, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    """Get a specific user's profile"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    return {
        "id": str(user.id),
        "username": user.username,
        "email": user.email,
        "role": user.role
    }

@router.put("/{user_id}")
async def update_profile(user_id: int, data: dict, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    """Update user profile"""
    # Check if user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    
    # Update fields
    if "username" in data:
        user.username = data["username"]
    if "email" in data:
        user.email = data["email"]
    
    db.commit()
    db.refresh(user)
    
    return {
        "id": str(user.id),
        "username": user.username,
        "email": user.email,
        "role": user.role
    }