export const authService = {
    login: async (email, password) => {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (email === 'admin@admin.com' && password === '1234') {
            return {
                id: '1',
                name: 'Admin',
                email: 'admin@admin.com',
                role: 'admin'
            };
        }

        throw new Error('Credenciales inválidas');
    }
};
