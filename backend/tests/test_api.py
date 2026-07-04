from datetime import date, timedelta
from fastapi import status

# --- AUTHENTICATION & REGISTRATION TESTS ---

def test_user_registration_and_login(client):
    # 1. Register user
    register_payload = {
        "employee_id": "EMP101",
        "email": "john.doe@example.com",
        "password": "securepassword123",
        "role": "Employee",
        "first_name": "John",
        "last_name": "Doe"
    }
    
    response = client.post("/api/auth/register", json=register_payload)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["employee_id"] == "EMP101"
    assert data["email"] == "john.doe@example.com"
    assert data["role"] == "Employee"
    assert data["is_verified"] is False

    # Try registering again with same details (should fail)
    response = client.post("/api/auth/register", json=register_payload)
    assert response.status_code == status.HTTP_400_BAD_REQUEST

    # 2. Login before verification (should fail due to dependency check on active endpoints)
    login_data = {
        "username": "john.doe@example.com",
        "password": "securepassword123"
    }
    response = client.post("/api/auth/login", data=login_data)
    assert response.status_code == status.HTTP_200_OK
    token = response.json()["access_token"]
    
    # Try accessing protected route (should fail because not verified)
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/employees/me", headers=headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert response.json()["detail"] == "Email address is not verified"

    # 3. Verify user using mock verify
    response = client.post("/api/auth/verify-mock", params={"email": "john.doe@example.com"})
    assert response.status_code == status.HTTP_200_OK
    
    # 4. Access protected route now (should succeed)
    response = client.get("/api/employees/me", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["first_name"] == "John"


# --- PROFILE MANAGEMENT & ROLE ACCESS TESTS ---

def test_profile_and_role_permissions(client):
    # Register and verify normal employee
    client.post("/api/auth/register", json={
        "employee_id": "EMP102", "email": "emp@test.com", "password": "password123", "role": "Employee"
    })
    client.post("/api/auth/verify-mock", params={"email": "emp@test.com"})
    
    # Login employee
    emp_token = client.post("/api/auth/login", data={"username": "emp@test.com", "password": "password123"}).json()["access_token"]
    emp_headers = {"Authorization": f"Bearer {emp_token}"}

    # Register and verify admin
    client.post("/api/auth/register", json={
        "employee_id": "ADM999", "email": "admin@test.com", "password": "adminpassword", "role": "Admin"
    })
    client.post("/api/auth/verify-mock", params={"email": "admin@test.com"})
    
    # Login admin
    admin_token = client.post("/api/auth/login", data={"username": "admin@test.com", "password": "adminpassword"}).json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # 1. Employee updates own profile
    response = client.put("/api/employees/me", json={"phone": "1234567890", "address": "123 Main St"}, headers=emp_headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["phone"] == "1234567890"

    # 2. Employee tries to access admin-only employee listing (should fail)
    response = client.get("/api/employees/", headers=emp_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN

    # 3. Admin accesses employee list (should succeed)
    response = client.get("/api/employees/", headers=admin_headers)
    assert response.status_code == status.HTTP_200_OK
    employees = response.json()
    assert len(employees) == 2  # employee and admin themselves

    # 4. Admin updates employee details (including job title and base salary)
    response = client.put("/api/employees/EMP102", json={
        "job_title": "Software Engineer",
        "department": "Engineering",
        "base_salary": 60000.0
    }, headers=admin_headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["job_title"] == "Software Engineer"
    assert response.json()["base_salary"] == 60000.0


# --- ATTENDANCE MANAGEMENT TESTS ---

def test_attendance_clocking(client):
    # Register, verify and login employee
    client.post("/api/auth/register", json={
        "employee_id": "EMP103", "email": "clock@test.com", "password": "password123"
    })
    client.post("/api/auth/verify-mock", params={"email": "clock@test.com"})
    token = client.post("/api/auth/login", data={"username": "clock@test.com", "password": "password123"}).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Check-in
    response = client.post("/api/attendance/check-in", json={"remarks": "Arrived early"}, headers=headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["status"] == "Present"
    assert response.json()["remarks"] == "Arrived early"

    # 2. Duplicate check-in (should fail)
    response = client.post("/api/attendance/check-in", json={}, headers=headers)
    assert response.status_code == status.HTTP_400_BAD_REQUEST

    # 3. Check-out
    response = client.post("/api/attendance/check-out", json={"remarks": "Leaving for the day"}, headers=headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["check_out"] is not None
    assert "Leaving for the day" in response.json()["remarks"]

    # 4. Duplicate check-out (should fail)
    response = client.post("/api/attendance/check-out", json={}, headers=headers)
    assert response.status_code == status.HTTP_400_BAD_REQUEST


# --- LEAVE APPLICATION & APPROVAL TESTS ---

def test_leave_management(client):
    # Register employee and admin
    client.post("/api/auth/register", json={"employee_id": "EMP104", "email": "leave_emp@test.com", "password": "password"})
    client.post("/api/auth/verify-mock", params={"email": "leave_emp@test.com"})
    emp_token = client.post("/api/auth/login", data={"username": "leave_emp@test.com", "password": "password"}).json()["access_token"]
    emp_headers = {"Authorization": f"Bearer {emp_token}"}

    client.post("/api/auth/register", json={"employee_id": "ADM104", "email": "leave_adm@test.com", "password": "password", "role": "Admin"})
    client.post("/api/auth/verify-mock", params={"email": "leave_adm@test.com"})
    admin_token = client.post("/api/auth/login", data={"username": "leave_adm@test.com", "password": "password"}).json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # 1. Apply for leave
    tomorrow = (date.today() + timedelta(days=1)).isoformat()
    day_after = (date.today() + timedelta(days=2)).isoformat()
    
    leave_payload = {
        "leave_type": "Paid",
        "start_date": tomorrow,
        "end_date": day_after,
        "remarks": "Family trip"
    }
    response = client.post("/api/leaves/apply", json=leave_payload, headers=emp_headers)
    assert response.status_code == status.HTTP_201_CREATED
    assert response.json()["status"] == "Pending"
    leave_id = response.json()["id"]

    # 2. Apply for overlapping leave (should fail)
    response = client.post("/api/leaves/apply", json=leave_payload, headers=emp_headers)
    assert response.status_code == status.HTTP_400_BAD_REQUEST

    # 3. Admin approves leave
    response = client.post(f"/api/leaves/{leave_id}/approve", json={"admin_comment": "Enjoy!"}, headers=admin_headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["status"] == "Approved"

    # 4. Verify attendance is updated automatically to 'Leave' for the date range
    response = client.get("/api/attendance/my-attendance", params={"start_date": tomorrow, "end_date": day_after}, headers=emp_headers)
    assert response.status_code == status.HTTP_200_OK
    records = response.json()
    assert len(records) == 2
    for record in records:
        assert record["status"] == "Leave"
        assert "Approved Leave" in record["remarks"]


# --- PAYROLL PROCESSING TESTS ---

def test_payroll_processing(client):
    # Register, verify employee
    client.post("/api/auth/register", json={"employee_id": "EMP105", "email": "pay@test.com", "password": "password"})
    client.post("/api/auth/verify-mock", params={"email": "pay@test.com"})
    emp_token = client.post("/api/auth/login", data={"username": "pay@test.com", "password": "password"}).json()["access_token"]
    emp_headers = {"Authorization": f"Bearer {emp_token}"}

    # Register, verify admin
    client.post("/api/auth/register", json={"employee_id": "ADM105", "email": "pay_adm@test.com", "password": "password", "role": "Admin"})
    client.post("/api/auth/verify-mock", params={"email": "pay_adm@test.com"})
    admin_token = client.post("/api/auth/login", data={"username": "pay_adm@test.com", "password": "password"}).json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # 1. Update salary structure of employee as Admin
    salary_payload = {
        "base_salary": 5000.0,
        "allowances": 800.0,
        "deductions": 300.0
    }
    response = client.put("/api/payroll/EMP105/salary-structure", json=salary_payload, headers=admin_headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["base_salary"] == 5000.0

    # 2. Process payroll for this month
    this_month = date.today().strftime("%Y-%m")
    response = client.post("/api/payroll/process-monthly", json={"month": this_month}, headers=admin_headers)
    assert response.status_code == status.HTTP_200_OK
    records = response.json()
    # Find employee's payroll record
    emp_record = next(r for r in records if r["base_salary"] == 5000.0)
    assert emp_record["net_salary"] == 5000.0 + 800.0 - 300.0
    assert emp_record["status"] == "Draft"

    # 3. Employee views their payroll details
    response = client.get("/api/payroll/my-payroll", headers=emp_headers)
    assert response.status_code == status.HTTP_200_OK
    payroll_details = response.json()
    assert payroll_details["base_salary"] == 5000.0
    assert payroll_details["history"][0]["month"] == this_month
    assert payroll_details["history"][0]["net_salary"] == 5500.0
