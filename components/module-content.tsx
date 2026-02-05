'use client';

import { Search, Download, Plus, Filter } from 'lucide-react';
import { EmployeeForm } from './employee-form';
import { PayrollSection } from './payroll-section';
import { BillingSection } from './billing-section';
import { RequirementsSection } from './requirements-section';
import { RoleManagement } from './role-management';
import { UserManagement } from './user-management';
import { CompanyKYCForm } from './company-kyc';
import { FinancialYearManager } from './financial-year';
import { GenericMaster } from './generic-master';
import { ClientManager } from './client-manager';
import { InvoiceGenerator } from './invoice-generator';
import { AttendanceModule } from './attendance-module';



interface ModuleContentProps {
  activeItem: string;
}

export function ModuleContent({ activeItem }: ModuleContentProps) {
  // --- Billing Modules ---
  if (activeItem === 'client-master') return <ClientManager />;
  if (activeItem === 'generate-invoice') return <InvoiceGenerator />;
  if (activeItem === 'recent-entry') return <BillingSection />;

  // --- Company Modules ---
  if (activeItem === 'company-kyc') return <CompanyKYCForm />;
  if (activeItem === 'financial-year') return <FinancialYearManager />;

  if (activeItem === 'country') return <GenericMaster title="Country Master" dataKey="countries" fields={[{ key: 'name', label: 'Country Name' }, { key: 'code', label: 'Country Code' }]} />;
  if (activeItem === 'state') return <GenericMaster title="State Master" dataKey="states" parentKey="countryId" fields={[{ key: 'name', label: 'State Name' }, { key: 'code', label: 'State Code' }]} />;
  if (activeItem === 'district') return <GenericMaster title="District Master" dataKey="districts" parentKey="stateId" fields={[{ key: 'name', label: 'District Name' }]} />;
  if (activeItem === 'field-area') return <GenericMaster title="Field Area (City) Master" dataKey="cities" parentKey="districtId" fields={[{ key: 'name', label: 'Area Name' }, { key: 'pincode', label: 'Pincode' }]} />;

  // Generic masters for other items
  if (activeItem === 'professional-tax') return <GenericMaster title="Professional Tax Rules" dataKey="professionalTaxes" fields={[{ key: 'slab', label: 'Slab Name' }, { key: 'amount', label: 'Amount' }]} />;
  if (activeItem === 'lwf') return <GenericMaster title="Labor Welfare Fund (LWF)" dataKey="lwfRules" fields={[{ key: 'state', label: 'State' }, { key: 'employeeContribution', label: 'Employee Cont.' }, { key: 'employerContribution', label: 'Employer Cont.' }]} />;
  if (activeItem === 'company-banks') return <GenericMaster title="Company Banks" dataKey="banks" fields={[{ key: 'bankName', label: 'Bank Name' }, { key: 'accountNo', label: 'Account No' }, { key: 'ifsc', label: 'IFSC Code' }]} />;

  // --- Existing Modules ---
  if (activeItem === 'new-employee') {
    return (
      <div className="flex-1 overflow-auto">
        <div className="bg-gradient-to-r from-primary/95 to-primary/80 text-primary-foreground px-8 py-6 border-b border-primary/20">
          <h1 className="text-3xl font-bold">New Employee Registration</h1>
          <p className="text-primary-foreground/90 mt-2">Add a new employee to the system</p>
        </div>
        <div className="p-8 max-w-7xl">
          <EmployeeForm />
        </div>
      </div>
    );
  }

  if (activeItem === 'create-salary' || activeItem === 'salary-process') {
    return <PayrollSection />;
  }

  if (activeItem === 'monthly-attendance') {
    return <AttendanceModule />;
  }

  if (activeItem === 'generate-invoice' || activeItem === 'recent-entry') {
    return <BillingSection />;
  }

  // Requirements & Compliance module
  if (activeItem.includes('client') || activeItem.includes('contract')) {
    return <RequirementsSection />;
  }

  if (activeItem === 'role') {
    return <RoleManagement />;
  }

  if (activeItem === 'users') {
    return <UserManagement />;
  }

  const getModuleTitle = (itemId: string) => {
    const titleMap: Record<string, string> = {
      'monthly-attendance': 'Monthly Attendance',
      'approve-attendance': 'Approve Attendance',
      'report-employee': 'Employee Reports',
      'edit-person-detail': 'Edit Person Details',
    };
    return titleMap[itemId] || 'Module Content';
  };

  return (
    <div className="flex-1 overflow-auto">
      {/* Module Header */}
      <div className="bg-gradient-to-r from-primary/95 to-primary/80 text-primary-foreground px-8 py-6 border-b border-primary/20">
        <h1 className="text-3xl font-bold">{getModuleTitle(activeItem)}</h1>
        <p className="text-primary-foreground/90 mt-2">Manage your {getModuleTitle(activeItem).toLowerCase()}</p>
      </div>

      {/* Content Area */}
      <div className="p-8 max-w-7xl">
        {/* Action Bar */}
        <div className="bg-card rounded-lg border border-border p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Department</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr
                    key={i}
                    className="border-b border-border hover:bg-muted/50 transition-colors animate-fade-in"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <td className="px-6 py-4 text-sm text-foreground font-medium">EMP-{String(i).padStart(5, '0')}</td>
                    <td className="px-6 py-4 text-sm text-foreground">Employee {i}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">Engineering</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${i % 2 === 0
                          ? 'bg-accent/10 text-accent'
                          : 'bg-yellow-100 text-yellow-700'
                          }`}
                      >
                        {i % 2 === 0 ? 'Active' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">Jan {i}, 2024</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button className="text-primary hover:bg-primary/10 px-3 py-1 rounded transition-colors">
                          Edit
                        </button>
                        <button className="text-destructive hover:bg-destructive/10 px-3 py-1 rounded transition-colors">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing 1 to 5 of 245 records</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
              Previous
            </button>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              1
            </button>
            <button className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
              2
            </button>
            <button className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
              3
            </button>
            <button className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
              Next
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-lg">
          <h3 className="font-semibold text-foreground mb-2">💡 Tip</h3>
          <p className="text-sm text-muted-foreground">
            You can use the search and filter options to quickly find the records you need. Use the Export button to download data in CSV format.
          </p>
        </div>
      </div>
    </div>
  );
}
