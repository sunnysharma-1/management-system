import { mockEmployees as initialMockData } from './mock-data';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// In-memory store for mock data (resets on refresh in deployed envs usually, but good for session)
let mockData = [...initialMockData];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
    // Get all employees with optional filters
    getEmployees: async (params?: { query?: string; status?: string; dept?: string }) => {
        if (USE_MOCK) {
            await delay(500);
            let filtered = [...mockData];

            if (params?.query) {
                const q = params.query.toLowerCase();
                filtered = filtered.filter(e =>
                    e.firstName?.toLowerCase().includes(q) ||
                    e.lastName?.toLowerCase().includes(q) ||
                    e.employeeId?.toLowerCase().includes(q) ||
                    e.phone?.includes(q)
                );
            }
            if (params?.status && params.status !== 'All') {
                if (params.status === 'Inactive') {
                    filtered = filtered.filter(e => e.status !== 'Active');
                } else {
                    filtered = filtered.filter(e => e.status === params.status);
                }
            }

            return filtered;
        }

        const url = new URL(`${API_URL}/employees`);
        if (params?.query) url.searchParams.append('query', params.query);
        if (params?.status) url.searchParams.append('status', params.status);
        if (params?.dept) url.searchParams.append('dept', params.dept);

        const res = await fetch(url.toString(), { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch employees');
        return res.json();
    },

    // Get single employee by code
    getEmployee: async (code: string) => {
        if (USE_MOCK) {
            await delay(300);
            const emp = mockData.find(e => e.employeeId === code);
            return emp || null;
        }

        const res = await fetch(`${API_URL}/employees/${code}`, { cache: 'no-store' });
        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error('Failed to fetch employee');
        }
        return res.json();
    },

    // Create new employee
    createEmployee: async (data: any) => {
        if (USE_MOCK) {
            await delay(800);
            const newEmp = { ...data, employeeId: data.employeeId || `EMP-${Date.now()}` };
            mockData.push(newEmp);
            return newEmp;
        }

        const res = await fetch(`${API_URL}/employees`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.msg || 'Failed to create employee');
        }
        return res.json();
    },

    // Update employee
    updateEmployee: async (code: string, data: any) => {
        if (USE_MOCK) {
            await delay(500);
            const idx = mockData.findIndex(e => e.employeeId === code);
            if (idx === -1) throw new Error('Employee not found');
            mockData[idx] = { ...mockData[idx], ...data };
            return mockData[idx];
        }

        const res = await fetch(`${API_URL}/employees/${code}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.msg || 'Failed to update employee');
        }
        return res.json();
    },

    // Update status (Left/Rejoin)
    updateStatus: async (code: string, data: { status: string; exitDetails?: any; rejoinDate?: string; reason?: string }) => {
        if (USE_MOCK) {
            await delay(400);
            const idx = mockData.findIndex(e => e.employeeId === code);
            if (idx === -1) throw new Error('Employee not found');

            mockData[idx] = { ...mockData[idx], status: data.status };
            if (data.exitDetails) mockData[idx].exitDetails = data.exitDetails;

            return mockData[idx];
        }

        const res = await fetch(`${API_URL}/employees/${code}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update status');
        return res.json();
    }
};
