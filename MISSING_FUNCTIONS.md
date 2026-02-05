# AXIS HRM System - Missing Functions & To-Do List

## Critical Missing Functions (Must Implement)

### 1. Form Validation Functions ⚠️ CRITICAL

**Location:** Should be in `lib/validation.ts`

```typescript
// Email validation
export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Phone validation
export const validatePhone = (phone: string): boolean => {
  const regex = /^[0-9\-\+\s()]{10,}$/;
  return regex.test(phone);
};

// Salary validation
export const validateSalary = (salary: string | number): boolean => {
  const num = typeof salary === 'string' ? parseFloat(salary) : salary;
  return num > 0 && num < 10000000;
};

// Date validation
export const validateDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

// Bank account validation
export const validateBankAccount = (account: string): boolean => {
  return account.length >= 9 && account.length <= 18;
};
```

**Usage in Employee Form:**
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validateEmail(formData.email)) {
    alert('Invalid email format');
    return;
  }
  if (!validatePhone(formData.phone)) {
    alert('Invalid phone format');
    return;
  }
  // ... continue
};
```

**Implementation Time:** 1 hour
**Priority:** CRITICAL

---

### 2. Calculation Functions ⚠️ CRITICAL

**Location:** Should be in `lib/calculations.ts`

```typescript
// Calculate gross salary from components
export const calculateGrossSalary = (components: SalaryComponent[]): number => {
  return components.reduce((sum, comp) => sum + comp.amount, 0);
};

// Calculate deductions
export const calculateDeductions = (deductions: Deduction[]): number => {
  return deductions.reduce((sum, ded) => sum + ded.amount, 0);
};

// Calculate net salary
export const calculateNetSalary = (gross: number, deductions: number): number => {
  return gross - deductions;
};

// Calculate PF (12%)
export const calculatePF = (gross: number): number => {
  return gross * 0.12;
};

// Calculate ESI (0.75%)
export const calculateESI = (gross: number): boolean => {
  return gross <= 21000; // ESI applicable if gross <= 21000
};

// Calculate tax
export const calculateTax = (gross: number): number => {
  // Indian tax slab
  if (gross <= 250000) return 0;
  if (gross <= 500000) return (gross - 250000) * 0.05;
  if (gross <= 1000000) return 12500 + (gross - 500000) * 0.2;
  return 112500 + (gross - 1000000) * 0.3;
};

// Calculate invoice total
export const calculateInvoiceTotal = (lineItems: LineItem[], taxRate: number = 0): number => {
  const subtotal = lineItems.reduce((sum, item) => sum + (item.rate * item.quantity), 0);
  const tax = subtotal * (taxRate / 100);
  return subtotal + tax;
};

// Calculate attendance percentage
export const calculateAttendance = (presentDays: number, totalDays: number): number => {
  return (presentDays / totalDays) * 100;
};
```

**Usage in Payroll:**
```typescript
const gross = calculateGrossSalary(salaryComponents);
const pf = calculatePF(gross);
const tax = calculateTax(gross);
const deductions = calculateDeductions([...pfDeduction, ...otherDeductions]);
const net = calculateNetSalary(gross, deductions);
```

**Implementation Time:** 1.5 hours
**Priority:** CRITICAL

---

### 3. API Integration Functions ⚠️ CRITICAL

**Location:** Should be in `lib/api.ts`

```typescript
// Fetch employees
export const fetchEmployees = async (
  filters?: { department?: string; status?: string }
): Promise<Employee[]> => {
  try {
    const query = new URLSearchParams(filters || {});
    const response = await fetch(`/api/employees?${query}`);
    if (!response.ok) throw new Error('Failed to fetch employees');
    return response.json();
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

// Create employee
export const createEmployee = async (data: EmployeeFormData): Promise<Employee> => {
  try {
    const response = await fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create employee');
    return response.json();
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
};

// Update employee
export const updateEmployee = async (id: string, data: Partial<Employee>): Promise<Employee> => {
  try {
    const response = await fetch(`/api/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update employee');
    return response.json();
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
};

// Delete employee
export const deleteEmployee = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`/api/employees/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete employee');
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
};

// Payroll operations
export const processPayroll = async (month: string): Promise<PayrollResult> => {
  try {
    const response = await fetch('/api/payroll/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ month }),
    });
    if (!response.ok) throw new Error('Failed to process payroll');
    return response.json();
  } catch (error) {
    console.error('Error processing payroll:', error);
    throw error;
  }
};

// Invoice operations
export const createInvoice = async (data: InvoiceFormData): Promise<Invoice> => {
  try {
    const response = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create invoice');
    return response.json();
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
};
```

**Implementation Time:** 2 hours
**Priority:** CRITICAL (blocked by backend)

---

### 4. Export/Download Functions ⚠️ HIGH

**Location:** Should be in `lib/export.ts`

```typescript
// Export to CSV
export const exportToCSV = (data: any[], filename: string): void => {
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => JSON.stringify(row[header])).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
};

// Export to Excel
export const exportToExcel = (data: any[], filename: string): void => {
  // Would need 'xlsx' library
  // Implementation depends on library
};

// Export to PDF
export const exportToPDF = (
  htmlContent: string,
  filename: string,
  orientation: 'portrait' | 'landscape' = 'portrait'
): void => {
  // Would need 'html2pdf' or 'jsPDF' library
  // Implementation depends on library
};

// Generate salary slip PDF
export const generateSalarySlipPDF = (
  employee: Employee,
  payrollRecord: PayrollRecord
): void => {
  // Generate professional salary slip PDF
};

// Generate invoice PDF
export const generateInvoicePDF = (invoice: Invoice): void => {
  // Generate professional invoice PDF
};
```

**Dependencies Needed:**
- `npm install xlsx` (for Excel)
- `npm install html2pdf` or `npm install jspdf` (for PDF)

**Implementation Time:** 2 hours
**Priority:** HIGH

---

### 5. Authentication Functions 🔐 CRITICAL

**Location:** Should be in `lib/auth.ts`

```typescript
// Login function
export const login = async (email: string, password: string): Promise<AuthToken> => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    const token = await response.json();
    localStorage.setItem('authToken', token.accessToken);
    return token;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Logout function
export const logout = (): void => {
  localStorage.removeItem('authToken');
  // Redirect to login
};

// Get current user
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// Check permission
export const hasPermission = (permission: string): boolean => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.permissions?.includes(permission) || false;
};
```

**Implementation Time:** 2 hours
**Priority:** CRITICAL (blocked by backend)

---

### 6. Data Format Functions ⚠️ MEDIUM

**Location:** Should be in `lib/formatters.ts`

```typescript
// Format currency
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

// Format date
export const formatDate = (date: string | Date, format: string = 'DD/MM/YYYY'): string => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', String(year));
};

// Format phone number
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
};

// Format percentage
export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
```

**Implementation Time:** 1.5 hours
**Priority:** MEDIUM

---

## Missing Handlers & Event Functions

### 7. Table Actions Handlers 📋 MEDIUM

```typescript
// In employee-form.tsx or new employee-list.tsx
export const handleEdit = (employeeId: string) => {
  // Navigate to edit page
  // or open modal with form
};

export const handleDelete = (employeeId: string) => {
  // Show confirmation
  // Delete from database
};

export const handleExport = (employees: Employee[]) => {
  // Export to CSV/Excel
};

export const handleSort = (column: string) => {
  // Sort table by column
};

export const handleFilter = (filters: FilterOptions) => {
  // Filter table data
};

export const handleSearch = (query: string) => {
  // Search employees by name/email
};
```

**Implementation Time:** 2 hours
**Priority:** HIGH

---

### 8. Approval Workflow Handlers 🔄 MEDIUM

```typescript
// In payroll-section.tsx
export const handleApprovePayroll = (payrollId: string) => {
  // Submit approval
  // Update status
  // Send notification
};

export const handleRejectPayroll = (payrollId: string, reason: string) => {
  // Reject with reason
  // Notify HR
};

export const handleReviewPayroll = (payrollId: string) => {
  // Mark as reviewed
  // Add comments
};
```

**Implementation Time:** 1.5 hours
**Priority:** HIGH

---

## Summary of Missing Pieces

| Component | Status | Type | Priority | Est. Time |
|-----------|--------|------|----------|-----------|
| Form Validation | ❌ Missing | Function | CRITICAL | 1h |
| Calculations | ❌ Missing | Function | CRITICAL | 1.5h |
| API Integration | ❌ Missing | Function | CRITICAL | 2h |
| Export Functions | ❌ Missing | Function | HIGH | 2h |
| Authentication | ❌ Missing | Function | CRITICAL | 2h |
| Formatters | ❌ Missing | Function | MEDIUM | 1.5h |
| Table Handlers | ❌ Missing | Handler | HIGH | 2h |
| Workflow Handlers | ❌ Missing | Handler | HIGH | 1.5h |
| Error Boundaries | ❌ Missing | Component | MEDIUM | 1.5h |
| Loading States | ❌ Missing | Component | MEDIUM | 1.5h |
| Toast Notifications | ❌ Missing | Component | MEDIUM | 1.5h |
| Modals/Dialogs | ❌ Missing | Component | MEDIUM | 2h |

**Total Implementation Time:** ~21 hours

---

## Next Actions

### Immediate (Must Do)
1. ✅ Create `lib/validation.ts` with form validators
2. ✅ Create `lib/calculations.ts` with payroll calculators
3. ✅ Create `lib/formatters.ts` with formatters
4. ⏳ Create `lib/api.ts` (blocked until backend is ready)
5. ⏳ Create `lib/auth.ts` (blocked until auth backend is ready)

### Short Term (This Week)
6. ✅ Add validation to employee form
7. ✅ Add calculations to payroll
8. ✅ Add export functionality
9. ✅ Add table action handlers
10. ✅ Add error handling

### Medium Term (Next Week)
11. ⏳ API Integration
12. ⏳ Authentication
13. ⏳ Approval workflows
14. ⏳ Advanced features

---

**Note:** Some functions are blocked by backend API readiness. These are marked with ⏳.
