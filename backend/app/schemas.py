from pydantic import BaseModel, ConfigDict, Field
from datetime import date, datetime
from typing import Optional, List

# --- AUTHENTICATION SCHEMAS ---

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class PasswordResetRequest(BaseModel):
    email: str

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)


# --- USER / EMPLOYEE SCHEMAS ---

class UserBase(BaseModel):
    employee_id: str = Field(..., description="Unique Employee ID (e.g. EMP001)")
    email: str = Field(..., description="Corporate or personal email address")
    role: Optional[str] = Field("Employee", description="Role: Employee or Admin")

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, description="Password (min 6 characters)")
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    profile_picture_url: Optional[str] = None

class AdminUserUpdate(UserUpdate):
    employee_id: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    is_verified: Optional[bool] = None
    job_title: Optional[str] = None
    department: Optional[str] = None
    joining_date: Optional[date] = None
    base_salary: Optional[float] = None
    allowances: Optional[float] = None
    deductions: Optional[float] = None

class UserOut(UserBase):
    id: int
    is_verified: bool
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    profile_picture_url: Optional[str] = None
    job_title: Optional[str] = None
    department: Optional[str] = None
    joining_date: Optional[date] = None
    base_salary: float
    allowances: float
    deductions: float

    model_config = ConfigDict(from_attributes=True)


# --- ATTENDANCE SCHEMAS ---

class AttendanceBase(BaseModel):
    date: date
    check_in: Optional[datetime] = None
    check_out: Optional[datetime] = None
    status: str = Field("Present", description="Present, Absent, Half-day, Leave")
    remarks: Optional[str] = None

class AttendanceCreate(BaseModel):
    remarks: Optional[str] = None

class AttendanceOut(AttendanceBase):
    id: int
    employee_id: int
    employee_code: Optional[str] = None
    employee_name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


# --- LEAVE REQUEST SCHEMAS ---

class LeaveRequestBase(BaseModel):
    leave_type: str = Field(..., description="Paid, Sick, Unpaid")
    start_date: date
    end_date: date
    remarks: Optional[str] = None

class LeaveRequestCreate(LeaveRequestBase):
    pass

class LeaveRequestReview(BaseModel):
    admin_comment: Optional[str] = None

class LeaveRequestOut(LeaveRequestBase):
    id: int
    employee_id: int
    status: str = Field("Pending", description="Pending, Approved, Rejected")
    admin_comment: Optional[str] = None
    employee_code: Optional[str] = None
    employee_name: Optional[str] = None
    employee_department: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


# --- PAYROLL SCHEMAS ---

class PayrollRecordBase(BaseModel):
    month: str = Field(..., description="Month in YYYY-MM format")
    base_salary: float
    allowances: float
    deductions: float
    net_salary: float
    status: str = Field("Draft", description="Draft, Paid")

class PayrollRecordOut(PayrollRecordBase):
    id: int
    employee_id: int
    employee_code: Optional[str] = None
    employee_name: Optional[str] = None
    employee_department: Optional[str] = None
    employee_job_title: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class SalaryStructureUpdate(BaseModel):
    base_salary: float
    allowances: float
    deductions: float

class SalaryOverviewOut(BaseModel):
    employee_id: str
    employee_name: str
    department: Optional[str] = None
    job_title: Optional[str] = None
    base_salary: float
    allowances: float
    deductions: float
    net_salary: float

class ProcessPayrollRequest(BaseModel):
    month: str = Field(..., pattern=r"^\d{4}-\d{2}$", description="Month in YYYY-MM format")

class MyPayrollResponse(BaseModel):
    base_salary: float
    allowances: float
    deductions: float
    history: List[PayrollRecordOut]

class LeaveTypeBalance(BaseModel):
    total: int
    used: int

class LeaveBalanceResponse(BaseModel):
    annual: LeaveTypeBalance
    sick: LeaveTypeBalance
    casual: LeaveTypeBalance
