from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import date, datetime, timedelta
from typing import List, Optional

from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/api/attendance", tags=["Attendance Management"])

@router.post("/check-in", response_model=schemas.AttendanceOut)
def check_in(
    attendance_data: schemas.AttendanceCreate,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Check in the current employee for today."""
    today = date.today()
    
    # Check if user already has an attendance record for today
    existing_record = db.query(models.Attendance).filter(
        models.Attendance.employee_id == current_user.id,
        models.Attendance.date == today
    ).first()
    
    if existing_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already checked in for today."
        )
        
    new_attendance = models.Attendance(
        employee_id=current_user.id,
        date=today,
        check_in=datetime.now(),
        status="Present",
        remarks=attendance_data.remarks
    )
    
    db.add(new_attendance)
    db.commit()
    db.refresh(new_attendance)
    return new_attendance


@router.post("/check-out", response_model=schemas.AttendanceOut)
def check_out(
    attendance_data: schemas.AttendanceCreate,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Check out the current employee for today."""
    today = date.today()
    
    # Retrieve today's check-in record
    attendance_record = db.query(models.Attendance).filter(
        models.Attendance.employee_id == current_user.id,
        models.Attendance.date == today
    ).first()
    
    if not attendance_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No check-in record found for today. You must check in first."
        )
        
    if attendance_record.check_out:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already checked out for today."
        )
        
    attendance_record.check_out = datetime.now()
    if attendance_data.remarks:
        # Append or overwrite remarks
        attendance_record.remarks = f"{attendance_record.remarks or ''} | {attendance_data.remarks}".strip(" | ")
        
    db.commit()
    db.refresh(attendance_record)
    return attendance_record


@router.get("/my-attendance", response_model=List[schemas.AttendanceOut])
def get_my_attendance(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Retrieve the attendance records for the logged-in employee (default is past 30 days)."""
    if not end_date:
        end_date = date.today()
    if not start_date:
        start_date = end_date - timedelta(days=30)
        
    records = db.query(models.Attendance).filter(
        models.Attendance.employee_id == current_user.id,
        models.Attendance.date >= start_date,
        models.Attendance.date <= end_date
    ).order_by(models.Attendance.date.desc()).all()
    
    return records


@router.get("/all-attendance", response_model=List[schemas.AttendanceOut])
def get_all_attendance(
    date_filter: Optional[date] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    employee_id: Optional[str] = None,
    current_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    """Admin Only: Retrieve attendance records for all employees. Supports filters by single date, range, or employee ID."""
    query = db.query(models.Attendance).join(models.User)
    
    if employee_id:
        query = query.filter(models.User.employee_id == employee_id)
        
    if date_filter:
        query = query.filter(models.Attendance.date == date_filter)
    elif start_date or end_date:
        if not end_date:
            end_date = date.today()
        if not start_date:
            start_date = end_date - timedelta(days=30)
        query = query.filter(
            models.Attendance.date >= start_date,
            models.Attendance.date <= end_date
        )
        
    return query.order_by(models.Attendance.date.desc()).all()
