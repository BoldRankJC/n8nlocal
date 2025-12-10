export const n8nService = {
    getConfig: () => {
        return { webhookUrl: 'https://n8n.example.com/webhook/test' };
    },
    saveConfig: (config) => {
        console.log('Config saved:', config);
    },
    getConversations: async () => {
        return [
            {
                id: '1',
                user: {
                    name: 'Juan Pérez',
                    avatar: 'JP',
                    status: 'online',
                    phone: '+56 9 1234 5678',
                    email: 'juan@example.com',
                    role: 'Cliente',
                    tags: ['VIP', 'Soporte']
                },
                messages: [
                    { id: 'm1', role: 'user', text: 'Hola, necesito ayuda con mi pedido.', time: '10:00' },
                    { id: 'm2', role: 'agent', text: 'Hola Juan, ¿en qué puedo ayudarte?', time: '10:05' }
                ],
                lastMessage: 'Hola Juan, ¿en qué puedo ayudarte?',
                time: '10:05',
                botActive: true
            }
        ];
    },
    sendMessage: async (chatId, text, phone) => {
        console.log(`Sending message to ${chatId} (${phone}): ${text}`);
        return Promise.resolve({ success: true });
    },
    toggleBot: async (chatId, status) => {
        console.log(`Toggling bot for ${chatId} to ${status}`);
        return Promise.resolve({ success: true });
    }
};
