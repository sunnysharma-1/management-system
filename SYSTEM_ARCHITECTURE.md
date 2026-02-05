# AXIS HRM System - Architecture & Component Diagram

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         AXIS HRM SYSTEM                            │
└─────────────────────────────────────────────────────────────────────┘

                         FRONTEND (100% COMPLETE)
┌─────────────────────────────────────────────────────────────────────┐
│                      app/page.tsx (Main App)                       │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │              State: activeItem (current module)             │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ Sidebar             │ Header            │ Content Area       │ │
│  ├──────────────────────┼───────────────────┼────────────────────┤ │
│  │ • Navigation (89)    │ • User Profile    │ • Dashboard        │ │
│  │ • Menu Items         │ • Notifications   │ • Modules          │ │
│  │ • Expand/Collapse    │ • Settings        │ • Forms            │ │
│  │ • Neon Effects       │ • Logout          │ • Tables           │ │
│  └──────────────────────┴───────────────────┴────────────────────┘ │
│                                                                    │
│  Layout: Sidebar (288px) | Header (64px) | Content (flex)         │
└─────────────────────────────────────────────────────────────────────┘

                    COMPONENT ROUTING (module-content.tsx)
┌─────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  activeItem === 'dashboard'     →  DashboardContent              │
│  activeItem === 'new-employee'  →  EmployeeForm                  │
│  activeItem === 'create-salary' →  PayrollSection                │
│  activeItem === 'generate-invoice' → BillingSection              │
│  activeItem.includes('client')  →  RequirementsSection           │
│  else                           →  Generic Module Display        │
│                                                                    │
└─────────────────────────────────────────────────────────────────────┘

                  FEATURE MODULES (CURRENTLY STATIC)
┌──────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Dashboard (dashboard-content.tsx)                          │   │
│  │ ├─ KPI Cards (4)                                           │   │
│  │ ├─ Recent Activities (Timeline)                            │   │
│  │ ├─ Quick Actions (4 buttons)                               │   │
│  │ └─ System Modules (6 cards)                                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Employee Management (employee-form.tsx)                    │   │
│  │ ├─ Personal Information Section                            │   │
│  │ ├─ Employment Details Section                              │   │
│  │ ├─ Bank Information Section                                │   │
│  │ └─ Submit Button                                           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Payroll Processing (payroll-section.tsx)                  │   │
│  │ ├─ Month Selection                                         │   │
│  │ ├─ Process Button                                          │   │
│  │ ├─ Summary Cards (4)                                       │   │
│  │ ├─ Payroll Table                                           │   │
│  │ └─ Salary Slip Info                                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Billing & Invoicing (billing-section.tsx)                 │   │
│  │ ├─ Invoice List                                            │   │
│  │ ├─ Status Filter                                           │   │
│  │ ├─ Revenue Calculations                                    │   │
│  │ └─ Action Buttons                                          │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Requirements & Compliance (requirements-section.tsx)       │   │
│  │ ├─ Requirements List                                       │   │
│  │ ├─ Progress Bars                                           │   │
│  │ ├─ Status Indicators                                       │   │
│  │ └─ Priority Levels                                         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└──────────────────────────────────────────────────────────────────────┘

                      DATA FLOW & STATE MANAGEMENT
┌──────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  User Click Navigation Item                                       │
│         ↓                                                          │
│  onItemClick(itemId)                                              │
│         ↓                                                          │
│  setActiveItem(itemId)                                            │
│         ↓                                                          │
│  Re-render with new activeItem                                    │
│         ↓                                                          │
│  Module Router (module-content.tsx) selects component             │
│         ↓                                                          │
│  Component Renders (Dashboard, Form, Table, etc.)                │
│                                                                     │
└──────────────────────────────────────────────────────────────────────┘

              STYLING & THEMING (globals.css)
┌──────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  Color Variables (16+)                                            │
│  ├─ Primary: hsl(270, 100%, 55%) [Purple Neon]                   │
│  ├─ Secondary: hsl(180, 100%, 50%) [Cyan Neon]                   │
│  ├─ Background: hsl(260, 20%, 8%) [Deep Navy]                    │
│  ├─ Foreground: hsl(250, 10%, 95%) [Off White]                   │
│  ├─ Cards: hsl(260, 25%, 12%) [Dark Purple]                      │
│  └─ Border: hsl(260, 20%, 20%) [Dark Gray]                       │
│                                                                     │
│  Animation Classes (9)                                            │
│  ├─ animate-slide-down                                            │
│  ├─ animate-slide-up                                              │
│  ├─ animate-fade-in                                               │
│  ├─ animate-pulse-slow                                            │
│  ├─ animate-shimmer                                               │
│  ├─ animate-neon-glow                                             │
│  ├─ animate-neon-border                                           │
│  ├─ animate-cyan-glow                                             │
│  └─ animate-float                                                 │
│                                                                     │
│  Custom Scrollbar                                                 │
│  ├─ Purple gradient thumb                                         │
│  ├─ Smooth hover transitions                                      │
│  └─ Applied to .custom-scrollbar class                            │
│                                                                     │
└──────────────────────────────────────────────────────────────────────┘

               NAVIGATION STRUCTURE (lib/navigation.ts)
┌──────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  Dashboard (1 item)                                               │
│  │                                                                 │
│  Master (4 items)                                                 │
│  ├─ Role                                                          │
│  ├─ Rights                                                        │
│  ├─ Users                                                         │
│  └─ Company Deduction                                             │
│  │                                                                 │
│  Company (19 items)                                               │
│  ├─ Financial Year                                                │
│  ├─ Company KYC                                                   │
│  ├─ Country, State, GST State                                     │
│  ├─ District, Field Area                                          │
│  ├─ Professional Tax, LWF                                         │
│  ├─ User Pending Approval                                         │
│  ├─ User Permission Map                                           │
│  ├─ Region, Enclosure                                             │
│  ├─ Client Vertical                                               │
│  ├─ Company Banks                                                 │
│  ├─ Client Services                                               │
│  ├─ ESIC Code, PF Code                                            │
│  └─ Payroll Open Month                                            │
│  │                                                                 │
│  Vendor (3 items)                                                 │
│  ├─ Master Vendor                                                 │
│  ├─ Master Payment                                                │
│  └─ Report Vendor Payment                                         │
│  │                                                                 │
│  Client (15 items)                                                │
│  ├─ State Office, Zone, Shift                                     │
│  ├─ Services, Client Category                                     │
│  ├─ Nature of Services                                            │
│  ├─ Client, Unit                                                  │
│  ├─ Reports (Client, Unit)                                        │
│  ├─ Salary Rate Break Up                                          │
│  ├─ Bill Rate Break Up                                            │
│  ├─ Reports (Bill Rate, Salary Rate)                              │
│  └─ Contract Details                                              │
│  │                                                                 │
│  Employee (20 items)                                              │
│  ├─ Qualification                                                 │
│  ├─ Additional Qualification                                      │
│  ├─ Bank, Employee Grade                                          │
│  ├─ Update Employee Fields                                        │
│  ├─ New Employee                                                  │
│  ├─ Edit Person Detail                                            │
│  ├─ Edit Communication                                            │
│  ├─ Edit Police Verification                                      │
│  ├─ Edit Ex-Service Details                                       │
│  ├─ Edit Gunman Details                                           │
│  ├─ Edit Training                                                 │
│  ├─ Edit Medical                                                  │
│  ├─ Edit Employee Family                                          │
│  ├─ Edit Employee Left                                            │
│  ├─ Employee Rejoin                                               │
│  ├─ Employee Salary Breakdown                                     │
│  ├─ Waiting for Placement                                         │
│  └─ Report Employee                                               │
│  │                                                                 │
│  Admin/Utility (6 items)                                          │
│  Payroll (15 items)                                               │
│  Billing (12 items)                                               │
│  Advance Module (varies)                                          │
│  Bill Report, Utilities, App Report, MIS                          │
│                                                                     │
│  TOTAL: 89 Menu Items                                             │
│                                                                     │
└──────────────────────────────────────────────────────────────────────┘

            COMPONENT DEPENDENCY TREE (What calls what)
┌──────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  page.tsx (Main)                                                  │
│  ├─ imports Sidebar                                               │
│  ├─ imports TopHeader                                             │
│  ├─ imports DashboardContent                                      │
│  └─ imports ModuleContent                                         │
│                                                                     │
│  ModuleContent (Router)                                           │
│  ├─ conditionally imports EmployeeForm                            │
│  ├─ conditionally imports PayrollSection                          │
│  ├─ conditionally imports BillingSection                          │
│  └─ conditionally imports RequirementsSection                     │
│                                                                     │
│  Sidebar                                                          │
│  └─ imports navigation data from lib/navigation.ts                │
│                                                                     │
│  DashboardContent                                                 │
│  ├─ defines KPICard (internal component)                          │
│  ├─ defines ActivityItem (internal component)                     │
│  ├─ defines QuickActionButton (internal component)                │
│  └─ defines ModuleCard (internal component)                       │
│                                                                     │
│  PayrollSection                                                   │
│  └─ defines SummaryCard (internal component)                      │
│                                                                     │
│  BillingSection                                                   │
│  └─ uses invoice array (static)                                   │
│                                                                     │
└──────────────────────────────────────────────────────────────────────┘

              WHAT'S NEEDED NEXT (Missing Functions)
┌──────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  Phase 2: Foundation Functions (Week 1)                           │
│  ├─ lib/validation.ts → Form validation                           │
│  ├─ lib/calculations.ts → Payroll math                            │
│  ├─ lib/formatters.ts → Data formatting                           │
│  ├─ lib/export.ts → PDF/CSV export                                │
│  └─ components/error-boundary.tsx → Error handling                │
│                                                                     │
│  Phase 3: API Layer (Week 2)                                      │
│  ├─ lib/api-client.ts → API communication                         │
│  ├─ lib/auth.ts → Authentication                                  │
│  └─ Route Handlers → Backend endpoints                            │
│                                                                     │
│  Phase 4: Backend (Week 2-3)                                      │
│  ├─ Database Schema → Supabase/Neon                               │
│  ├─ Auth Endpoints → Login/Register                               │
│  ├─ Employee CRUD → Create/Read/Update/Delete                     │
│  ├─ Payroll APIs → Processing, Slips                              │
│  └─ Billing APIs → Invoice, Payment                               │
│                                                                     │
│  Phase 5: Integration (Week 3)                                    │
│  └─ Connect all frontend to backend                               │
│                                                                     │
│  Phase 6: Advanced (Week 4+)                                      │
│  ├─ Approvals & Workflows                                         │
│  ├─ Reports & Analytics                                           │
│  ├─ Automation                                                    │
│  └─ Performance Tuning                                            │
│                                                                     │
└──────────────────────────────────────────────────────────────────────┘

                    FILE SIZE ANALYSIS
┌──────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  sidebar.tsx .................. 3 KB  (102 lines)   ✅ Good       │
│  dashboard-content.tsx ........ 7 KB  (216 lines)   ✅ Good       │
│  employee-form.tsx ............ 6 KB  (230 lines)   ✅ Good       │
│  payroll-section.tsx .......... 5 KB  (199 lines)   ✅ Good       │
│  billing-section.tsx .......... 7 KB  (214 lines)   ✅ Good       │
│  requirements-section.tsx ..... 8 KB  (249 lines)   ✅ Good       │
│  module-content.tsx ........... 5 KB  (149 lines)   ✅ Good       │
│  top-header.tsx ............... 2 KB   (71 lines)   ✅ Good       │
│  globals.css .................. 8 KB  (245 lines)   ✅ Good       │
│  navigation.ts ................ 5 KB  (183 lines)   ✅ Good       │
│  mock-data.ts ................. 8 KB  (296 lines)   ✅ Good       │
│                                                                     │
│  TOTAL ........................ 63 KB                              │
│                                                                     │
│  Performance: A+ (Very efficient)                                  │
│  Load Time: < 1 second (estimated)                                │
│  Bundle Size: Minimal                                             │
│                                                                     │
└──────────────────────────────────────────────────────────────────────┘

                   RESPONSIVE BREAKPOINTS
┌──────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  Mobile (< 768px)                                                 │
│  ├─ Sidebar: Collapsible/drawer                                   │
│  ├─ Header: Full width, compact icons                             │
│  ├─ Content: Single column                                        │
│  └─ Forms: Stacked inputs                                         │
│                                                                     │
│  Tablet (768px - 1024px)                                          │
│  ├─ Sidebar: Visible but narrower                                 │
│  ├─ Header: Normal layout                                         │
│  ├─ Content: 2 columns                                            │
│  └─ Forms: 2 column grid                                          │
│                                                                     │
│  Desktop (> 1024px)                                               │
│  ├─ Sidebar: Full width (288px)                                   │
│  ├─ Header: Full width                                            │
│  ├─ Content: 3-4 columns                                          │
│  └─ Forms: Multi-column layout                                    │
│                                                                     │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Data Models (What Gets Stored)

### Employee
```typescript
{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: string;
  salary: number;
  bankAccount: string;
  address: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

### Payroll
```typescript
{
  id: string;
  employeeId: string;
  month: string;
  grossSalary: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  pf: number;
  tax: number;
  netSalary: number;
  status: 'Draft' | 'Processing' | 'Approved' | 'Processed';
  approvedBy: string;
  createdAt: timestamp;
}
```

### Invoice
```typescript
{
  id: string;
  clientId: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  date: string;
  dueDate: string;
  items: LineItem[];
  tax: number;
  total: number;
  createdAt: timestamp;
  paidAt?: timestamp;
}
```

### Requirement/Compliance
```typescript
{
  id: string;
  title: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  dueDate: string;
  progress: number;
  department: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

---

## Function Call Hierarchy (What Needs to be Added)

```
User Action
    ↓
Event Handler (onClick, onSubmit)
    ↓
┌─────────────────────────────────────┐
│ Validation Functions                │
│ • validateEmail()                   │
│ • validatePhone()                   │
│ • validateSalary()                  │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ API Client Functions                │
│ • apiClient.createEmployee()        │
│ • apiClient.processPayroll()        │
│ • apiClient.createInvoice()         │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Calculation Functions               │
│ • calculateNetSalary()              │
│ • calculateTDS()                    │
│ • calculateInvoiceTotal()           │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Formatter Functions                 │
│ • formatCurrency()                  │
│ • formatDate()                      │
│ • formatPhone()                     │
└─────────────────────────────────────┘
    ↓
Display Result to User
```

---

## Performance Optimization Areas

```
✅ DONE
├─ CSS minification
├─ Component code splitting ready
├─ Image optimization ready
├─ No external CDN dependencies
└─ Efficient rendering

⏳ TODO
├─ React Query for caching
├─ Service worker implementation
├─ Gzip compression
├─ Database query optimization
└─ API response caching
```

---

This architecture provides a solid foundation for a scalable HRM system!
