-- ==========================================================
-- SUGARTOWN HRMS - PRODUCTION POSTGRESQL DATABASE SCHEMA
-- Company: Sugartown Retail Private Limited
-- ==========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ROLES & PERMISSIONS
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(100) UNIQUE NOT NULL,
    module VARCHAR(50) NOT NULL,
    description TEXT
);

CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 2. USERS & AUTHENTICATION
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. COMPANY STRUCTURE: LOCATIONS, DEPARTMENTS, DESIGNATIONS, SHIFTS
CREATE TABLE company_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) DEFAULT 'Sugartown Retail Private Limited',
    cin_number VARCHAR(100) DEFAULT 'U52100MH2020PTC345678',
    gstin VARCHAR(50) DEFAULT '27AAACS1982K1Z9',
    pan VARCHAR(20) DEFAULT 'AAACS1982K',
    pf_code VARCHAR(50) DEFAULT 'MH/BAN/0049281/000',
    esic_code VARCHAR(50) DEFAULT '31000492810000101',
    address TEXT DEFAULT 'Heritage Arcade, Kala Ghoda, Fort, Mumbai 400001',
    contact_email VARCHAR(100) DEFAULT 'contact@sugartown.in',
    contact_phone VARCHAR(50) DEFAULT '+91 22 4982 1100'
);

CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pin_code VARCHAR(20) NOT NULL,
    contact_number VARCHAR(50),
    manager_name VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) UNIQUE NOT NULL,
    cost_centre VARCHAR(50),
    head_name VARCHAR(150),
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE designations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    level VARCHAR(20),
    min_experience_years INT DEFAULT 0
);

CREATE TABLE shifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    grace_period_minutes INT DEFAULT 15,
    min_working_hours NUMERIC(4, 2) DEFAULT 8.0,
    half_day_hours NUMERIC(4, 2) DEFAULT 4.0,
    weekly_off VARCHAR(50)[] DEFAULT ARRAY['Sunday']
);

-- 4. EMPLOYEES & SUB-DETAILS
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    photo_url TEXT,
    gender VARCHAR(20),
    date_of_birth DATE,
    mobile VARCHAR(30) NOT NULL,
    personal_email VARCHAR(255),
    official_email VARCHAR(255) UNIQUE NOT NULL,
    blood_group VARCHAR(10),
    marital_status VARCHAR(20),
    nationality VARCHAR(50) DEFAULT 'Indian',
    department_id UUID REFERENCES departments(id),
    designation_id UUID REFERENCES designations(id),
    reporting_manager_id UUID REFERENCES employees(id),
    location_id UUID REFERENCES locations(id),
    shift_id UUID REFERENCES shifts(id),
    employment_type VARCHAR(50) DEFAULT 'Full-Time',
    date_of_joining DATE NOT NULL,
    probation_period_months INT DEFAULT 3,
    confirmation_date DATE,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employee_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    address_type VARCHAR(20) CHECK (address_type IN ('CURRENT', 'PERMANENT')),
    address_line TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pin_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'India'
);

CREATE TABLE employee_bank_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID UNIQUE REFERENCES employees(id) ON DELETE CASCADE,
    bank_name VARCHAR(150) NOT NULL,
    account_holder_name VARCHAR(150) NOT NULL,
    account_number VARCHAR(100) NOT NULL,
    ifsc_code VARCHAR(30) NOT NULL,
    branch VARCHAR(100)
);

CREATE TABLE employee_statutory_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID UNIQUE REFERENCES employees(id) ON DELETE CASCADE,
    pan_number VARCHAR(20) NOT NULL,
    aadhaar_number VARCHAR(30) NOT NULL,
    uan VARCHAR(50),
    pf_number VARCHAR(100),
    esic_number VARCHAR(100)
);

-- 5. ATTENDANCE & REGULARIZATION
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    shift_id UUID REFERENCES shifts(id),
    check_in TIMESTAMP WITH TIME ZONE,
    check_out TIMESTAMP WITH TIME ZONE,
    working_hours NUMERIC(4, 2) DEFAULT 0,
    status VARCHAR(50) NOT NULL,
    late_by_minutes INT DEFAULT 0,
    early_exit_minutes INT DEFAULT 0,
    overtime_hours NUMERIC(4, 2) DEFAULT 0,
    location_stamp TEXT,
    ip_address VARCHAR(50),
    is_manual BOOLEAN DEFAULT FALSE,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id, date)
);

CREATE TABLE attendance_regularization (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attendance_id UUID REFERENCES attendance(id) ON DELETE SET NULL,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    requested_check_in TIMESTAMP WITH TIME ZONE NOT NULL,
    requested_check_out TIMESTAMP WITH TIME ZONE NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'Pending',
    approver_id UUID REFERENCES employees(id),
    approver_remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. LEAVES & HOLIDAYS
CREATE TABLE leave_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    annual_quota INT DEFAULT 12,
    is_paid BOOLEAN DEFAULT TRUE,
    carry_forward BOOLEAN DEFAULT FALSE,
    max_consecutive_days INT
);

CREATE TABLE leave_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    leave_type_id UUID REFERENCES leave_types(id) ON DELETE CASCADE,
    year INT NOT NULL,
    allocated_days NUMERIC(4, 1) NOT NULL,
    used_days NUMERIC(4, 1) DEFAULT 0,
    pending_days NUMERIC(4, 1) DEFAULT 0,
    UNIQUE(employee_id, leave_type_id, year)
);

CREATE TABLE leave_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    leave_type_id UUID REFERENCES leave_types(id),
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    is_half_day BOOLEAN DEFAULT FALSE,
    half_day_type VARCHAR(20),
    number_of_days NUMERIC(4, 1) NOT NULL,
    reason TEXT NOT NULL,
    contact_during_leave VARCHAR(50),
    attachment_url TEXT,
    status VARCHAR(30) DEFAULT 'Pending',
    approver_id UUID REFERENCES employees(id),
    approver_comments TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE holidays (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    date DATE NOT NULL,
    day VARCHAR(20) NOT NULL,
    location VARCHAR(100) DEFAULT 'All',
    type VARCHAR(30) DEFAULT 'Mandatory',
    description TEXT
);

-- 7. SALARY COMPONENTS, PAYROLL & PAYSLIPS
CREATE TABLE salary_components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('EARNING', 'DEDUCTION')),
    is_statutory BOOLEAN DEFAULT FALSE,
    calculation_type VARCHAR(50) DEFAULT 'FLAT',
    default_percentage_or_amount NUMERIC(12, 2) DEFAULT 0,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE employee_salary_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID UNIQUE REFERENCES employees(id) ON DELETE CASCADE,
    annual_ctc NUMERIC(12, 2) NOT NULL,
    monthly_ctc NUMERIC(12, 2) NOT NULL,
    basic_salary NUMERIC(12, 2) NOT NULL,
    hra NUMERIC(12, 2) NOT NULL,
    conveyance NUMERIC(12, 2) DEFAULT 0,
    special_allowance NUMERIC(12, 2) DEFAULT 0,
    medical_allowance NUMERIC(12, 2) DEFAULT 0,
    effective_from DATE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payroll_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    month_year VARCHAR(20) NOT NULL, -- e.g. 2026-09
    total_employees INT NOT NULL,
    gross_salary NUMERIC(14, 2) NOT NULL,
    total_deductions NUMERIC(14, 2) NOT NULL,
    net_salary NUMERIC(14, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'Draft', -- Draft, Calculated, Verified, Approved, Processed, Locked
    locked_by UUID REFERENCES users(id),
    locked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payslips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payroll_run_id UUID REFERENCES payroll_runs(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    payslip_number VARCHAR(100) UNIQUE NOT NULL,
    month_year VARCHAR(20) NOT NULL,
    paid_days NUMERIC(4, 1) NOT NULL,
    lop_days NUMERIC(4, 1) DEFAULT 0,
    gross_earnings NUMERIC(12, 2) NOT NULL,
    total_deductions NUMERIC(12, 2) NOT NULL,
    net_pay NUMERIC(12, 2) NOT NULL,
    net_pay_in_words TEXT NOT NULL,
    breakdown_json JSONB NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. LOANS, ADVANCES & REIMBURSEMENTS
CREATE TABLE employee_loans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    type VARCHAR(30) DEFAULT 'Loan',
    amount NUMERIC(12, 2) NOT NULL,
    emi_amount NUMERIC(12, 2) NOT NULL,
    installments_total INT NOT NULL,
    installments_paid INT DEFAULT 0,
    outstanding_balance NUMERIC(12, 2) NOT NULL,
    start_month VARCHAR(20) NOT NULL,
    status VARCHAR(30) DEFAULT 'Active'
);

CREATE TABLE reimbursements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    expense_date DATE NOT NULL,
    category VARCHAR(50) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    description TEXT NOT NULL,
    receipt_url TEXT,
    status VARCHAR(30) DEFAULT 'Pending',
    approver_id UUID REFERENCES employees(id),
    approver_remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. DOCUMENTS, ANNOUNCEMENTS, POLICIES & EXITS
CREATE TABLE employee_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size VARCHAR(50),
    status VARCHAR(30) DEFAULT 'Pending',
    notes TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    priority VARCHAR(20) DEFAULT 'Normal',
    published_date DATE NOT NULL,
    expiry_date DATE,
    target_department VARCHAR(100) DEFAULT 'All',
    target_location VARCHAR(100) DEFAULT 'All',
    author_name VARCHAR(150),
    attachment_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hr_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    version VARCHAR(20) NOT NULL,
    effective_date DATE NOT NULL,
    description TEXT NOT NULL,
    summary_points JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employee_resignations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID UNIQUE REFERENCES employees(id) ON DELETE CASCADE,
    resignation_date DATE NOT NULL,
    proposed_last_day DATE NOT NULL,
    actual_last_day DATE,
    notice_period_days INT DEFAULT 30,
    reason TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Submitted',
    asset_return_status VARCHAR(30) DEFAULT 'Pending',
    exit_interview_done BOOLEAN DEFAULT FALSE,
    fnf_amount NUMERIC(12, 2) DEFAULT 0,
    relieving_letter_issued BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. AUDIT LOGS & NOTIFICATIONS
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name VARCHAR(150) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    module VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    previous_value TEXT,
    updated_value TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR HIGH-PERFORMANCE HR QUERIES
CREATE INDEX idx_employees_dept ON employees(department_id);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_emp_date ON attendance(employee_id, date);
CREATE INDEX idx_leaves_emp_status ON leave_requests(employee_id, status);
CREATE INDEX idx_payslips_emp_month ON payslips(employee_id, month_year);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);
