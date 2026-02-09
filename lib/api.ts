const API_URL = 'http://localhost:5000/api';

export const api = {
    // Get all employees with optional filters
    getEmployees: async (params?: { query?: string; status?: string; dept?: string; page?: number; limit?: number }) => {
        const url = new URL(`${API_URL}/employees`);
        if (params?.query) url.searchParams.append('query', params.query);
        if (params?.status) url.searchParams.append('status', params.status);
        if (params?.dept) url.searchParams.append('dept', params.dept);
        if (params?.page) url.searchParams.append('page', params.page.toString());
        if (params?.limit) url.searchParams.append('limit', params.limit.toString());

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
    },

    // --- CLIENTS & UNITS ---

    // Get all clients (includes units)
    getClients: async () => {
        const res = await fetch(`${API_URL}/clients`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch clients');
        return res.json();
    },

    // Get single client
    getClient: async (id: string) => {
        const res = await fetch(`${API_URL}/clients/${id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch client');
        return res.json();
    },

    // Create client
    createClient: async (data: any) => {
        const res = await fetch(`${API_URL}/clients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create client');
        return res.json();
    },

    // Update client
    updateClient: async (id: string, data: any) => {
        const res = await fetch(`${API_URL}/clients/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update client');
        return res.json();
    },

    // Add Unit to Client
    addUnit: async (clientId: string, unitData: any) => {
        const res = await fetch(`${API_URL}/clients/${clientId}/units`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(unitData),
        });
        if (!res.ok) throw new Error('Failed to add unit');
        return res.json();
    },

    // Update Unit
    updateUnit: async (clientId: string, unitId: string, unitData: any) => {
        const res = await fetch(`${API_URL}/clients/${clientId}/units/${unitId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(unitData),
        });
        if (!res.ok) throw new Error('Failed to update unit');
        return res.json();
    },

    // --- RATE STRUCTURES ---

    // Get Rates
    getRates: async (params?: { clientId?: string; unitId?: string }) => {
        const url = new URL(`${API_URL}/rates`);
        if (params?.clientId) url.searchParams.append('clientId', params.clientId);
        if (params?.unitId) url.searchParams.append('unitId', params.unitId);

        const res = await fetch(url.toString(), { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch rates');
        return res.json();
    },

    // Get Single Rate
    getRate: async (id: string) => {
        const res = await fetch(`${API_URL}/rates/${id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch rate');
        return res.json();
    },

    // Create Rate
    createRate: async (data: any) => {
        const res = await fetch(`${API_URL}/rates`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create rate');
        return res.json();
    },

    // Update Rate
    updateRate: async (id: string, data: any) => {
        const res = await fetch(`${API_URL}/rates/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update rate');
        return res.json();
    },

    // Delete Rate
    deleteRate: async (id: string) => {
        const res = await fetch(`${API_URL}/rates/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete rate');
        return res.json();
    },

    // --- ADVANCES ---

    // Get Advances
    getAdvances: async (params?: { employeeId?: string; clientId?: string; month?: string }) => {
        const url = new URL(`${API_URL}/advances`);
        if (params?.employeeId) url.searchParams.append('employeeId', params.employeeId);
        if (params?.clientId) url.searchParams.append('clientId', params.clientId);
        if (params?.month) url.searchParams.append('month', params.month);

        const res = await fetch(url.toString(), { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch advances');
        return res.json();
    },

    // Create Advance
    createAdvance: async (data: any) => {
        const res = await fetch(`${API_URL}/advances`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create advance');
        return res.json();
    },

    // Update Advance Status
    updateAdvanceStatus: async (id: string, status: string) => {
        const res = await fetch(`${API_URL}/advances/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        if (!res.ok) throw new Error('Failed to update advance status');
        return res.json();
    },

    // --- BILL RATES ---

    getBillRates: async (params?: { clientId?: string; unitId?: string }) => {
        const url = new URL(`${API_URL}/bill-rates`);
        if (params?.clientId) url.searchParams.append('clientId', params.clientId);
        if (params?.unitId) url.searchParams.append('unitId', params.unitId);

        const res = await fetch(url.toString(), { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch bill rates');
        return res.json();
    },

    getBillRate: async (id: string) => {
        const res = await fetch(`${API_URL}/bill-rates/${id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch bill rate');
        return res.json();
    },

    createBillRate: async (data: any) => {
        const res = await fetch(`${API_URL}/bill-rates`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create bill rate');
        return res.json();
    },

    updateBillRate: async (id: string, data: any) => {
        const res = await fetch(`${API_URL}/bill-rates/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update bill rate');
        return res.json();
    },

    deleteBillRate: async (id: string) => {
        const res = await fetch(`${API_URL}/bill-rates/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete bill rate');
        return res.json();
    },

    // --- INVOICES ---

    getInvoices: async (params?: { clientId?: string; status?: string }) => {
        const url = new URL(`${API_URL}/invoices`);
        if (params?.clientId) url.searchParams.append('clientId', params.clientId);
        if (params?.status) url.searchParams.append('status', params.status);

        const res = await fetch(url.toString(), { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch invoices');
        return res.json();
    },

    createInvoice: async (data: any) => {
        const res = await fetch(`${API_URL}/invoices`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create invoice');
        return res.json();
    },
};
