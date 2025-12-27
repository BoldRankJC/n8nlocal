// Mock API / Services for demo purposes
// In a real app these would be imported from a shared services directory or SDK

const api = {
    get: async () => [],
    post: async (url, data) => ({ _id: Date.now().toString(), ...data }),
    put: async (url, data) => ({ ...data }),
    delete: async () => { }
};

export const companyService = {
    getAll: () => api.get('/companies'),
    getById: (id) => api.get(`/companies/${id}`),
    create: (data) => api.post('/companies', data),
    update: (id, data) => api.put(`/companies/${id}`, data),
    delete: (id) => api.delete(`/companies/${id}`)
};

export const contactService = {
    getAll: () => api.get('/contacts'),
    getByCompany: (companyId) => api.get(`/contacts?company=${companyId}`),
    create: (data) => api.post('/contacts', data),
    update: (id, data) => api.put(`/contacts/${id}`, data),
    delete: (id) => api.delete(`/contacts/${id}`)
};

export const dealService = {
    getAll: () => api.get('/deals'),
    getByCompany: (companyId) => api.get(`/deals?company=${companyId}`),
    create: (data) => api.post('/deals', data),
    update: (id, data) => api.put(`/deals/${id}`, data),
    delete: (id) => api.delete(`/deals/${id}`)
};
