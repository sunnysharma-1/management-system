'use client';

import React from "react"

import { useState } from 'react';
import { Save, X } from 'lucide-react';

interface EmployeeFormProps {
  onClose?: () => void;
}

import { useEmployee, Employee } from './providers/employee-context';

export function EmployeeForm({ onClose }: EmployeeFormProps) {
  const { addEmployee } = useEmployee();

  const [formData, setFormData] = useState<Partial<Employee>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    joiningDate: '',
    salary: 0,
    bankAccount: '',
    address: '',
    status: 'Active'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) return;

    const newEmployee: Employee = {
      id: `emp-${Date.now()}`,
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      email: formData.email || '',
      phone: formData.phone || '',
      department: formData.department || '',
      designation: formData.designation || '',
      joiningDate: formData.joiningDate || '',
      salary: Number(formData.salary) || 0,
      bankAccount: formData.bankAccount || '',
      address: formData.address || '',
      status: 'Active'
    };

    addEmployee(newEmployee);
    alert('Employee added successfully!');

    if (onClose) {
      onClose();
    } else {
      // Reset
      setFormData({
        firstName: '', lastName: '', email: '', phone: '',
        department: '', designation: '', joiningDate: '',
        salary: 0, bankAccount: '', address: ''
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-4 pb-4 border-b border-border">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
        </div>

        {/* Employment Information */}
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-4 pb-4 border-b border-border">
            Employment Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              >
                <option value="">Select Department</option>
                <option value="engineering">Engineering</option>
                <option value="hr">Human Resources</option>
                <option value="sales">Sales</option>
                <option value="marketing">Marketing</option>
                <option value="finance">Finance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Designation *</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="Senior Engineer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Joining Date *</label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Monthly Salary *</label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="50000"
              />
            </div>
          </div>
        </div>

        {/* Bank & Address Information */}
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-4 pb-4 border-b border-border">
            Bank & Address Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Bank Account Number *</label>
              <input
                type="text"
                name="bankAccount"
                value={formData.bankAccount}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="1234567890"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
              placeholder="123 Main Street, City, State, ZIP"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 justify-end">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-input rounded-lg font-medium text-foreground hover:bg-muted transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Employee
          </button>
        </div>
      </form>
    </div>
  );
}
