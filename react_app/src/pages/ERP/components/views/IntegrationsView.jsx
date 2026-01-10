import React from 'react';

export const IntegrationsView = ({
    integrations,
    setIntegrations
}) => {

    const handleConnectClick = (integ) => {
        const newStatus = !integ.connected;
        setIntegrations(prev => prev.map(item =>
            item.id === integ.id ? { ...item, connected: newStatus } : item
        ));
        alert(newStatus
            ? `✅ ${integ.name} conectado exitosamente!\n\n${integ.desc}`
            : `❌ ${integ.name} desconectado.`
        );
    };

    return (
        <div className="p-6 space-y-6">

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Integraciones</h2>
                    <p className="text-gray-600 dark:text-gray-400">Conecta tus herramientas.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {integrations.map(integ => {
                    const Icon = integ.icon;
                    return (
                        <div key={integ.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 space-y-4 flex flex-col">

                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${integ.color}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{integ.name}</h3>
                            </div>

                            <p className="text-sm text-gray-500 dark:text-gray-400 flex-1">{integ.desc}</p>

                            <button
                                onClick={() => handleConnectClick(integ)}
                                className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 ${integ.connected
                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30 hover:bg-emerald-100'
                                    : 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-600 hover:bg-indigo-100'
                                    }`}>
                                {integ.connected ? '✓ Conectado' : '+ Conectar'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
