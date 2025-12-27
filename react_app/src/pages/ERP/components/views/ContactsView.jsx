import React from 'react';
import { Plus, Database, AlertCircle, Check, Mail, MoreHorizontal } from 'lucide-react';

export const ContactsView = ({
    contacts,
    onNewContactClick,
    setSelectedContact
}) => {
    return (
        <div className="p-4 md:p-6 space-y-6">

            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Directorio de Contactos</h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onNewContactClick}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Nuevo Contacto
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                        <Database className="h-4 w-4" />
                        Exportar CSV
                    </button>
                </div>
            </div>

            <div className="w-full overflow-x-auto bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                    <thead className="bg-gray-50 dark:bg-slate-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Empresa</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Soporte</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                        {contacts.map(contact => (
                            <tr
                                key={contact.id}
                                onClick={() => setSelectedContact && setSelectedContact({
                                    firstName: contact.name.split(' ')[0],
                                    lastName: contact.name.split(' ').slice(1).join(' '),
                                    email: contact.email,
                                    company: contact.company,
                                    position: contact.role,
                                    status: contact.status,
                                    score: Math.floor(Math.random() * 50) + 50,
                                    notes: []
                                })}
                                className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-bold flex items-center justify-center">
                                            {contact.name.charAt(0)}{contact.name.split(' ')[1]?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{contact.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{contact.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{contact.company}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{contact.role}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${contact.status === 'Cliente'
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                        }`}>
                                        {contact.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {contact.tickets > 0 ? (
                                        <span className="flex items-center gap-1 text-sm font-medium text-rose-500">
                                            <AlertCircle className="h-4 w-4" />
                                            {contact.tickets} Tickets
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-sm text-emerald-500">
                                            <Check className="h-4 w-4" />
                                            Al día
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.location.href = `mailto:${contact.email}?subject=Contacto desde CRM Boosted`
                                        }}
                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors"
                                        title="Enviar email"
                                    >
                                        <Mail className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            alert(`Acciones para ${contact.name}:\n\n- Ver historial completo\n- Asignar tarea\n- Crear nota\n- Programar llamada\n- Ver documentos\n- Eliminar contacto`)
                                        }}
                                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700/50 ml-2 transition-colors"
                                        title="Más opciones"
                                    >
                                        <MoreHorizontal className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
