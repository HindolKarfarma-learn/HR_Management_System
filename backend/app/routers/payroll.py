from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app import models, schemas, auth

router = APIRouter(prefix="/api/payroll", tags=["Payroll & Salary Management"])

@router.get("/my-payroll", response_model=schemas.MyPayrollResponse)
def get_my_payroll(
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Retrieve current employee's salary structure and historical monthly payouts."""
    history = db.query(models.PayrollRecord).filter(
        models.PayrollRecord.employee_id == current_user.id
    ).order_by(models.PayrollRecord.month.desc()).all()

    return schemas.MyPayrollResponse(
        base_salary=current_user.base_salary,
        allowances=current_user.allowances,
        deductions=current_user.deductions,
        history=history
    )


@router.get("/all-payroll", response_model=List[schemas.PayrollRecordOut])
def get_all_payroll(
    month: Optional[str] = None,
    employee_id: Optional[str] = None,
    current_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    """Admin Only: View payroll records for all employees. Can filter by month and employee ID."""
    query = db.query(models.PayrollRecord).join(models.User)
    
    if month:
        query = query.filter(models.PayrollRecord.month == month)
    if employee_id:
        query = query.filter(models.User.employee_id == employee_id)
        
    return query.order_by(models.PayrollRecord.month.desc(), models.User.employee_id.asc()).all()


@router.put("/{employee_id}/salary-structure", response_model=schemas.UserOut)
def update_salary_structure(
    employee_id: str,
    salary_data: schemas.SalaryStructureUpdate,
    current_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    """Admin Only: Update the base salary, allowances, and deductions of a specific employee."""
    employee = db.query(models.User).filter(models.User.employee_id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID {employee_id} not found."
        )

    employee.base_salary = salary_data.base_salary
    employee.allowances = salary_data.allowances
    employee.deductions = salary_data.deductions

    db.commit()
    db.refresh(employee)
    return employee


@router.post("/process-monthly", response_model=List[schemas.PayrollRecordOut])
def process_monthly_payroll(
    req: schemas.ProcessPayrollRequest,
    current_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    """Admin Only: Process and generate draft payroll records for all active employees for a given month."""
    # Retrieve all users
    employees = db.query(models.User).all()
    created_records = []

    for emp in employees:
        # Check if record already exists for this employee for this month
        existing_record = db.query(models.PayrollRecord).filter(
            models.PayrollRecord.employee_id == emp.id,
            models.PayrollRecord.month == req.month
        ).first()

        net_sal = emp.base_salary + emp.allowances - emp.deductions
        if net_sal < 0:
            net_sal = 0.0

        if existing_record:
            # Update the existing record if it is in Draft status
            if existing_record.status == "Draft":
                existing_record.base_salary = emp.base_salary
                existing_record.allowances = emp.allowances
                existing_record.deductions = emp.deductions
                existing_record.net_salary = net_sal
                created_records.append(existing_record)
        else:
            new_record = models.PayrollRecord(
                employee_id=emp.id,
                month=req.month,
                base_salary=emp.base_salary,
                allowances=emp.allowances,
                deductions=emp.deductions,
                net_salary=net_sal,
                status="Draft"
            )
            db.add(new_record)
            created_records.append(new_record)

    db.commit()
    
    # Refresh all processed records
    for record in created_records:
        db.refresh(record)
        
    return created_records
