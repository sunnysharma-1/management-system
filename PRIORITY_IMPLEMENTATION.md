# Priority Implementation Plan - Quick Start Guide

## Week 1: Foundation Functions (Must Do First)

### Task 1.1: Form Validation Functions ⏱️ 1 hour
**File to Create:** `/lib/validation.ts`

```typescript
// Critical validations needed
export const validateEmail = (email: string): string => {
  if (!email) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format';
  return '';
};

export const validatePhone = (phone: string): string => {
  if (!phone) return 'Phone is required';
  if (!/^[0-9\-\+\s()]{10,}$/.test(phone)) return 'Invalid phone format';
  return '';
};

export const validateSalary = (salary: string): string => {
  if (!salary) return 'Salary is required';
  const num = parseFloat(salary);
  if (isNaN(num)) return 'Salary must be a number';
  if (num <= 0) return 'Salary must be greater than 0';
  return '';
};

export const validateDate = (date: string, fieldName: string = 'Date'): string => {
  if (!date) return `${fieldName} is required`;
  const d = new Date(date);
  if (isNaN(d.getTime())) return `Invalid ${fieldName}`;
  return '';
};
```

**Use In:** `components/employee-form.tsx`

```typescript
// Update handleSubmit function
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  const errors: Record<string, string> = {};
  errors.email = validateEmail(formData.email);
  errors.phone = validatePhone(formData.phone);
  errors.salary = validateSalary(formData.salary);
  
  if (Object.values(errors).some(e => e)) {
    // Show errors
    console.log('Validation errors:', errors);
    return;
  }
  
  // Submit form
};
```

---

### Task 1.2: Calculation Functions ⏱️ 1.5 hours
**File to Create:** `/lib/calculations.ts`

```typescript
interface SalaryComponent {
  name: string;
  amount: number;
}

// Core calculations
export const calculateGrossSalary = (components: SalaryComponent[]): number => {
  return components.reduce((sum, comp) => sum + comp.amount, 0);
};

export const calculateDeductions = (components: SalaryComponent[]): number => {
  return components.reduce((sum, comp) => sum + comp.amount, 0);
};

export const calculateNetSalary = (gross: number, deductions: number): number => {
  return Math.max(0, gross - deductions);
};

export const calculatePF = (gross: number): number => {
  // Employee PF = 12% of basic (assuming 40% of gross is basic)
  const basic = gross * 0.4;
  return basic * 0.12;
};

export const calculateTDS = (gross: number): number => {
  // Simplified TDS calculation
  if (gross <= 250000) return 0;
  if (gross <= 500000) return (gross - 250000) * 0.05;
  if (gross <= 1000000) return 12500 + (gross - 500000) * 0.2;
  return 112500 + (gross - 1000000) * 0.3;
};
```

**Use In:** `components/payroll-section.tsx`

```typescript
// Update to show calculated values
const gross = calculateGrossSalary([
  { name: 'Basic', amount: 40000 },
  { name: 'HRA', amount: 10000 },
]);
const pf = calculatePF(gross);
const tds = calculateTDS(gross);
const deductions = pf + tds;
const net = calculateNetSalary(gross, deductions);

// Display in cards
<SummaryCard title="Gross Salary" value={`$${gross.toLocaleString()}`} />
<SummaryCard title="PF Deduction" value={`$${pf.toLocaleString()}`} />
<SummaryCard title="Net Salary" value={`$${net.toLocaleString()}`} />
```

---

### Task 1.3: Data Formatters ⏱️ 1 hour
**File to Create:** `/lib/formatters.ts`

```typescript
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};
```

**Use Throughout:** All components for consistent formatting

```typescript
// Example usage in components
<span>{formatCurrency(invoice.amount)}</span>
<span>{formatDate(employee.joiningDate)}</span>
<span>{formatPercentage(0.942)}</span> {/* Shows 94.2% */}
```

---

### Task 1.4: Export Functions ⏱️ 1.5 hours
**File to Create:** `/lib/export.ts`

```typescript
// CSV Export
export const exportToCSV = (data: any[], filename: string): void => {
  if (data.length === 0) {
    alert('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(h => {
        const value = row[h];
        // Escape quotes and wrap in quotes if contains comma
        return typeof value === 'string' && value.includes(',')
          ? `"${value.replace(/"/g, '""')}"`
          : value;
      }).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
```

**Use In:** Dashboard and table components

```typescript
// Example: Export employees button
<button onClick={() => exportToCSV(employees, 'employees_export')}>
  Export to CSV
</button>
```

---

### Task 1.5: Add Error Handling ⏱️ 1 hour
**Create Error Component:** `/components/error-boundary.tsx`

```typescript
'use client';

import { Component, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <div>
            <p className="font-semibold text-destructive">Something went wrong</p>
            <p className="text-sm text-destructive/70">{this.state.error?.message}</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Use In:** `app/page.tsx`

```typescript
<ErrorBoundary>
  <main className="flex h-screen">
    {/* your app content */}
  </main>
</ErrorBoundary>
```

---

## Week 2: Integration Layer

### Task 2.1: API Client Setup ⏱️ 1.5 hours
**File to Create:** `/lib/api-client.ts`

```typescript
class APIClient {
  private baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  private token = '';

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Employee endpoints
  getEmployees() {
    return this.request('/employees');
  }

  createEmployee(data: any) {
    return this.request('/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Payroll endpoints
  processPayroll(month: string) {
    return this.request('/payroll/process', {
      method: 'POST',
      body: JSON.stringify({ month }),
    });
  }

  // Invoice endpoints
  createInvoice(data: any) {
    return this.request('/invoices', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new APIClient();
```

---

### Task 2.2: Update Employee Form ⏱️ 1.5 hours
**Update:** `components/employee-form.tsx`

```typescript
import { apiClient } from '@/lib/api-client';
import { validateEmail, validatePhone } from '@/lib/validation';

export function EmployeeForm() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({...});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const newErrors: Record<string, string> = {};
    newErrors.email = validateEmail(formData.email);
    newErrors.phone = validatePhone(formData.phone);
    
    if (Object.values(newErrors).some(e => e)) {
      setErrors(newErrors);
      return;
    }

    // Submit
    setLoading(true);
    try {
      await apiClient.createEmployee(formData);
      alert('Employee created successfully!');
      // Reset form
      setFormData({...initialState});
      setErrors({});
    } catch (error) {
      alert('Error creating employee: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Show errors */}
      {Object.values(errors).some(e => e) && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
          {Object.entries(errors).map(([key, error]) => error && (
            <p key={key} className="text-destructive text-sm">{error}</p>
          ))}
        </div>
      )}

      {/* Form fields with error messages */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Email *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg ${
            errors.email ? 'border-destructive' : 'border-input'
          }`}
          disabled={loading}
        />
        {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground px-6 py-2 rounded-lg"
      >
        {loading ? 'Saving...' : 'Save Employee'}
      </button>
    </form>
  );
}
```

---

## Quick Implementation Checklist

### Week 1 Tasks
- [ ] Create `/lib/validation.ts` (1h)
- [ ] Create `/lib/calculations.ts` (1.5h)
- [ ] Create `/lib/formatters.ts` (1h)
- [ ] Create `/lib/export.ts` (1.5h)
- [ ] Create error boundary (1h)
- [ ] Update employee form with validation (1h)
- [ ] Test all functions (1h)

**Week 1 Total:** ~8 hours

### Week 2 Tasks
- [ ] Create `/lib/api-client.ts` (1.5h)
- [ ] Set up backend endpoints (need backend dev)
- [ ] Update all forms with API calls (3h)
- [ ] Test API integration (1h)
- [ ] Deploy to staging (0.5h)

**Week 2 Total:** ~6 hours + backend work

---

## Testing These Changes

### Test Validation
```typescript
// In any component
import { validateEmail } from '@/lib/validation';

console.log(validateEmail('test@example.com')); // ""
console.log(validateEmail('invalid')); // "Invalid email format"
```

### Test Calculations
```typescript
import { calculateNetSalary } from '@/lib/calculations';

const net = calculateNetSalary(100000, 15000);
console.log(net); // 85000
```

### Test Export
```typescript
import { exportToCSV } from '@/lib/export';

const employees = [
  { name: 'John', email: 'john@example.com', salary: 50000 },
  { name: 'Jane', email: 'jane@example.com', salary: 60000 },
];

exportToCSV(employees, 'employees'); // Downloads CSV
```

---

## Success Criteria

After Week 1:
- ✅ All forms have validation
- ✅ All calculations work correctly
- ✅ Data formats consistently
- ✅ Export functionality works
- ✅ Error handling in place

After Week 2:
- ✅ API client ready
- ✅ Forms submit to backend
- ✅ Data persists in database
- ✅ User can CRUD employees
- ✅ System is production-ready

---

## Files to Create (Copy & Paste Ready)

1. `/lib/validation.ts` - 80 lines
2. `/lib/calculations.ts` - 65 lines
3. `/lib/formatters.ts` - 40 lines
4. `/lib/export.ts` - 50 lines
5. `/components/error-boundary.tsx` - 40 lines
6. `/lib/api-client.ts` - 60 lines

**Total:** ~335 lines of production-ready code

---

## Common Pitfalls to Avoid

1. ❌ Don't skip validation - users make mistakes
2. ❌ Don't hardcode calculations - use functions
3. ❌ Don't forget error handling - things break
4. ❌ Don't test manually only - automate tests
5. ❌ Don't push to prod without staging test

---

## Next Actions

1. ✅ Review this document
2. ✅ Create the 6 files listed above
3. ✅ Update existing components with new functions
4. ✅ Test each function individually
5. ✅ Test forms end-to-end
6. ⏳ Coordinate with backend team on API
7. ⏳ Deploy to staging

**Ready to implement? Start with Task 1.1 validation functions!**
