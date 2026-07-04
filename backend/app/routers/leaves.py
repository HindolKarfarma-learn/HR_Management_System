from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import date, timedelta
from typing import List, Optional

from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/api/leaves", tags=["Leave & Time-Off Management"])

@router.post("/apply", response_model=schemas.LeaveRequestOut, status_code=status.HTTP_201_CREATED)
def apply_leave(
    leave_data: schemas.LeaveRequestCreate,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Apply for a leave. Checks for overlapping applications and valid date range."""
    if leave_data.start_date > leave_data.end_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Start date cannot be after end date."
        )

    # Check for overlapping pending or approved leave requests
    overlapping = db.query(models.LeaveRequest).filter(
        models.LeaveRequest.employee_id == current_user.id,
        models.LeaveRequest.status.in_(["Pending", "Approved"]),
        models.LeaveRequest.start_date <= leave_data.end_date,
        models.LeaveRequest.end_date >= leave_data.start_date
    ).first()

    if overlapping:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"You have an overlapping leave request ({overlapping.status}) from {overlapping.start_date} to {overlapping.end_date}."
        )

    new_leave = models.LeaveRequest(
        employee_id=current_user.id,
        leave_type=leave_data.leave_type,
        start_date=leave_data.start_date,
        end_date=leave_data.end_date,
        remarks=leave_data.remarks,
        status="Pending"
    )

    db.add(new_leave)
    db.commit()
    db.refresh(new_leave)
    return new_leave


@router.get("/my-leaves", response_model=List[schemas.LeaveRequestOut])
def get_my_leaves(
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Retrieve the leave requests history for the logged-in employee."""
    return db.query(models.LeaveRequest).filter(
        models.LeaveRequest.employee_id == current_user.id
    ).order_by(models.LeaveRequest.start_date.desc()).all()

@router.get("/balance", response_model=schemas.LeaveBalanceResponse)
def get_leave_balance(
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    year_start = date(date.today().year, 1, 1)
    approved = db.query(models.LeaveRequest).filter(
        models.LeaveRequest.employee_id == current_user.id,
        models.LeaveRequest.status == "Approved",
        models.LeaveRequest.end_date >= year_start
    ).all()
    used = {"annual": 0, "sick": 0, "casual": 0}
    aliases = {
        "paid": "annual", "annual leave": "annual",
        "sick": "sick", "sick leave": "sick",
        "casual": "casual", "casual leave": "casual"
    }
    for request in approved:
        key = aliases.get(request.leave_type.lower())
        if key:
            used[key] += (request.end_date - request.start_date).days + 1
    return {
        "annual": {"total": 18, "used": used["annual"]},
        "sick": {"total": 10, "used": used["sick"]},
        "casual": {"total": 8, "used": used["casual"]}
    }


@router.get("/all-leaves", response_model=List[schemas.LeaveRequestOut])
def get_all_leaves(
    status_filter: Optional[str] = None,
    current_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    """Admin Only: Retrieve leave requests for all employees, optionally filtered by status."""
    query = db.query(models.LeaveRequest)
    if status_filter:
        query = query.filter(models.LeaveRequest.status == status_filter)
        
    return query.order_by(models.LeaveRequest.start_date.desc()).all()


@router.post("/{leave_id}/approve", response_model=schemas.LeaveRequestOut)
def approve_leave(
    leave_id: int,
    review_data: schemas.LeaveRequestReview,
    current_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    """Admin Only: Approve a leave request and record corresponding 'Leave' attendance statuses."""
    leave_req = db.query(models.LeaveRequest).filter(models.LeaveRequest.id == leave_id).first()
    if not leave_req:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Leave request not found."
        )

    if leave_req.status != "Pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot approve a leave request that is already {leave_req.status}."
        )

    leave_req.status = "Approved"
    leave_req.admin_comment = review_data.admin_comment

    # Generate attendance records marked as 'Leave' for each day in the date range
    start_dt = leave_req.start_date
    end_dt = leave_req.end_date
    
    current_dt = start_dt
    while current_dt <= end_dt:
        # Check if an attendance record already exists for this day
        existing_attendance = db.query(models.Attendance).filter(
            models.Attendance.employee_id == leave_req.employee_id,
            models.Attendance.date == current_dt
        ).first()

        if existing_attendance:
            existing_attendance.status = "Leave"
            existing_attendance.remarks = f"Approved Leave ({leave_req.leave_type})"
        else:
            new_attendance = models.Attendance(
                employee_id=leave_req.employee_id,
                date=current_dt,
                status="Leave",
                remarks=f"Approved Leave ({leave_req.leave_type})"
            )
            db.add(new_attendance)
            
        current_dt += timedelta(days=1)

    db.commit()
    db.refresh(leave_req)
    return leave_req


@router.post("/{leave_id}/reject", response_model=schemas.LeaveRequestOut)
def reject_leave(
    leave_id: int,
    review_data: schemas.LeaveRequestReview,
    current_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    """Admin Only: Reject a leave request."""
    leave_req = db.query(models.LeaveRequest).filter(models.LeaveRequest.id == leave_id).first()
    if not leave_req:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Leave request not found."
        )

    if leave_req.status != "Pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot reject a leave request that is already {leave_req.status}."
        )

    leave_req.status = "Rejected"
    leave_req.admin_comment = review_data.admin_comment
    
    db.commit()
    db.refresh(leave_req)
    return leave_req
