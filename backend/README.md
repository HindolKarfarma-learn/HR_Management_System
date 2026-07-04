# HRMS FastAPI Backend (MySQL)

This is the backend API for the **Human Resource Management System (HRMS)**. It is built using **FastAPI**, **SQLAlchemy ORM**, and **MySQL** database.

## Features Included
1. **Authentication & Authorization**:
   - Secure sign up & sign in using JWT tokens and bcrypt password hashing.
   - Email verification flow (tokens printed to logs/terminal for ease of testing + Mock verification endpoint).
   - Role-based route access (`Employee` vs `Admin`).
2. **Employee Profile Management**:
   - Get and update personal profile details.
   - Admin controls to view and update any employee details.
3. **Attendance Management**:
   - Clock-in and clock-out with automated timestamps.
   - Historical list view (daily/weekly views).
   - Admin view to monitor everyone's attendance.
4. **Leave Management**:
   - Employees can apply for leaves.
   - Overlap validation checks.
   - Admin can approve/reject leaves with comments.
   - **Automatic Integration**: Approving a leave automatically populates the employee's attendance record with `Leave` status for the date range.
5. **Payroll & Salary Management**:
   - View personal salary structure and payout history.
   - Admin can process draft payroll for all employees for a specific month.
   - Admin can adjust salary structures.

---

## Prerequisites
- **Python 3.10+** installed on your system.
- A running **MySQL** server.
- A database named `hrms_db` (the backend will automatically attempt to create this database on startup if your credentials allow it, otherwise you should create it manually: `CREATE DATABASE hrms_db;`).

---

## Setup & Running Instructions

### 1. Set Up Virtual Environment
Navigate to the root directory `hrms-backend` and run:
```bash
python -m venv venv
```

Activate the virtual environment:
* **Windows (PowerShell)**:
  ```powershell
  .\venv\Scripts\Activate.ps1
  ```
* **Windows (CMD)**:
  ```cmd
  .\venv\Scripts\activate.bat
  ```
* **macOS/Linux**:
  ```bash
  source venv/bin/activate
  ```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Database & Environment Configuration
Check the `.env` file in the root folder. Update the `DATABASE_URL` with your MySQL server credentials:
```env
DATABASE_URL=mysql+pymysql://<username>:<password>@<host>:<port>/hrms_db
```
For example, if using root and no password on localhost:
```env
DATABASE_URL=mysql+pymysql://root:@localhost:3306/hrms_db
```

### 4. Run the Backend Server
```bash
uvicorn app.main:app --reload
```
The server will start on `http://127.0.0.1:8000`.

When `DEBUG=True` and `SEED_DEMO_USERS=True`, startup idempotently creates the frontend demo accounts:

* Admin: `admin@peopleflow.io` / `Admin@123`
* Employee: `employee@peopleflow.io` / `Employee@123`

---

## API Testing & Documentation
Once the server is running, open your browser and navigate to:
* **Swagger UI Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs) (Interactive testing interface)
* **ReDoc Documentation**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### How to test Email Verification:
1. Call `/api/auth/register` with employee details.
2. Check your uvicorn terminal output. You will see a log similar to:
   ```
   [EMAIL SIMULATION] Verification email for user: employee@example.com
   Verification URL: http://localhost:8000/api/auth/verify?token=eyJhbGci...
   ```
3. Copy the URL and make a `GET` request (or open it in a browser) to verify the account.
4. **Alternative**: You can also use the `/api/auth/verify-mock` endpoint. Simply send the registered email via POST, and the account will be instantly verified for testing.
