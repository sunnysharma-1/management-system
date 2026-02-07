const API_URL = 'http://localhost:5000/api';

export const api = {
    // Get all employees with optional filters
    getEmployees: async (params?: { query?: string; status?: string; dept?: string }) => {
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
        const res = await fetch(`${API_URL}/employees/${code}`, { cache: 'no-store' });
        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error('Failed to fetch employee');
        }
        return res.json();
    },

    // Create new employee
    createEmployee: async (data: any) => {
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
        const res = await fetch(`${API_URL}/employees/${code}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update status');
        return res.json();
    }
};
