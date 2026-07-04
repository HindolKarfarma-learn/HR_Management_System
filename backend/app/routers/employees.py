from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/api/employees", tags=["Employee Profiles"])

@router.get("/me", response_model=schemas.UserOut)
def get_my_profile(current_user: models.User = Depends(auth.get_current_active_user)):
    """Retrieve profile of the currently logged-in active user."""
    return current_user


@router.put("/me", response_model=schemas.UserOut)
def update_my_profile(
    profile_data: schemas.UserUpdate,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Allow active employee to update their own contact/profile details."""
    update_data = profile_data.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(current_user, key, value)
        
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/", response_model=List[schemas.UserOut])
def list_employees(
    department: Optional[str] = None,
    role: Optional[str] = None,
    current_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    """Admin Only: Retrieve list of all employees. Supports optional filters."""
    query = db.query(models.User)
    if department:
        query = query.filter(models.User.department == department)
    if role:
        query = query.filter(models.User.role == role)
        
    return query.all()


@router.get("/{employee_id}", response_model=schemas.UserOut)
def get_employee_profile(
    employee_id: str,
    current_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    """Admin Only: Retrieve detailed profile of a specific employee by Employee ID."""
    employee = db.query(models.User).filter(models.User.employee_id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {employee_id} not found."
        )
    return employee


@router.put("/{employee_id}", response_model=schemas.UserOut)
def admin_update_employee(
    employee_id: str,
    admin_update_data: schemas.AdminUserUpdate,
    current_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    """Admin Only: Update any details of a specific employee profile."""
    employee = db.query(models.User).filter(models.User.employee_id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {employee_id} not found."
        )
        
    update_dict = admin_update_data.model_dump(exclude_unset=True)
    
    # Check email uniqueness if email is being updated
    if "email" in update_dict and update_dict["email"] != employee.email:
        existing_email = db.query(models.User).filter(models.User.email == update_dict["email"]).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with this email address already exists."
            )
            
    # Check employee_id uniqueness if employee_id is being updated
    if "employee_id" in update_dict and update_dict["employee_id"] != employee.employee_id:
        existing_emp = db.query(models.User).filter(models.User.employee_id == update_dict["employee_id"]).first()
        if existing_emp:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with this Employee ID already exists."
            )

    for key, value in update_dict.items():
        setattr(employee, key, value)
        
    db.commit()
    db.refresh(employee)
    return employee

@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(
    employee_id: str,
    current_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    employee = db.query(models.User).filter(models.User.employee_id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found.")
    if employee.id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot delete your own administrator account.")
    db.delete(employee)
    db.commit()
