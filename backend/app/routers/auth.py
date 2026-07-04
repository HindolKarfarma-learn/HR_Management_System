from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import logging

from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

logger = logging.getLogger(__name__)

@router.post("/register", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if email is already taken
    existing_user_email = db.query(models.User).filter(models.User.email == user_in.email).first()
    if existing_user_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )

    # Check if employee ID is already taken
    existing_user_emp = db.query(models.User).filter(models.User.employee_id == user_in.employee_id).first()
    if existing_user_emp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this Employee ID already exists."
        )

    # Validate role - default to Employee if not specified, enforce valid role values
    role = user_in.role if user_in.role in ["Employee", "Admin"] else "Employee"

    # Create new User object
    hashed_pwd = auth.hash_password(user_in.password)
    new_user = models.User(
        employee_id=user_in.employee_id,
        email=user_in.email,
        hashed_password=hashed_pwd,
        role=role,
        is_verified=False,
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        base_salary=0.0,
        allowances=0.0,
        deductions=0.0
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Generate verification token
    verification_token = auth.create_verification_token(new_user.email)
    
    # Simulate sending email by printing the verification link to the console
    verification_link = f"http://localhost:8000/api/auth/verify?token={verification_token}"
    print(f"\n[EMAIL SIMULATION] Verification email for user: {new_user.email}")
    print(f"Verification URL: {verification_link}\n")
    logger.info(f"Verification URL generated for {new_user.email}: {verification_link}")

    return new_user


@router.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Authenticate user (OAuth2 Form uses username field for email)
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create Access Token
    access_token = auth.create_access_token(
        data={"sub": user.email, "role": user.role}
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/verify")
def verify_email(token: str, db: Session = Depends(get_db)):
    payload = auth.decode_token(token)
    if not payload or payload.get("type") != "verification":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token"
        )
    
    email = payload.get("sub")
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if user.is_verified:
        return {"message": "Email is already verified"}
    
    user.is_verified = True
    db.commit()
    
    return {"message": "Email verification successful! You can now log in."}


# Convenience mock verify route for frontend hackathon development
@router.post("/verify-mock")
def mock_verify_email(email: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user.is_verified = True
    db.commit()
    
    return {"message": f"User {email} has been verified successfully (MOCK)."}

@router.post("/forgot-password")
def forgot_password(payload: schemas.PasswordResetRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if user:
        token = auth.create_password_reset_token(user.email)
        reset_link = f"http://localhost:5173/reset-password?token={token}"
        logger.info("Password reset URL generated for %s: %s", user.email, reset_link)
        print(f"\n[EMAIL SIMULATION] Password reset URL for {user.email}: {reset_link}\n")
    return {"message": "If an account exists for that email, reset instructions have been sent."}

@router.post("/reset-password")
def reset_password(payload: schemas.PasswordResetConfirm, db: Session = Depends(get_db)):
    token_data = auth.decode_token(payload.token)
    if not token_data or token_data.get("type") != "password_reset":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired password reset token")
    user = db.query(models.User).filter(models.User.email == token_data.get("sub")).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    user.hashed_password = auth.hash_password(payload.new_password)
    db.commit()
    return {"message": "Your password has been reset successfully."}
