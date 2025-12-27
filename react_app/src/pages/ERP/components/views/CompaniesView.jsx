import React from 'react';
import { Plus, Building, DollarSign, Briefcase, Users, Globe } from 'lucide-react';

export const CompaniesView = ({
    companies,
    tasks,
    contacts,
    onNewCompanyClick,
    setSelectedCompany
}) => {
    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Empresas y Cuentas</h2>
                <button
                    onClick={onNewCompanyClick}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Nueva Empresa
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map(company => {
                    const companyDeals = tasks.filter(t => t.client === company.name);
                    const companyContacts = contacts.filter(c => c.company === company.name);
                    const wonDeals = companyDeals.filter(d => d.status === 'DONE');
                    const totalRevenue = wonDeals.reduce((sum, d) => sum + (d.dealValue || 0), 0);
                    const activeDeals = companyDeals.filter(d => d.status !== 'DONE');

                    const getStatusColor = (status) => {
                        switch (status) {
                            case 'Cliente': return 'bg-emerald-500';
                            case 'Prospecto': return 'bg-blue-500';
                            case 'Ex-cliente': return 'bg-gray-500';
                            default: return 'bg-gray-500';
                        }
                    };

                    return (
                        <div
                            key={company.id}
                            onClick={() => setSelectedCompany && setSelectedCompany(company)}
                            className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-500/30 hover:-translate-y-1 transition-all cursor-pointer"
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                    {company.logo}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">{company.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{company.industry}</p>
                                    <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-bold text-white ${getStatusColor(company.relationshipStatus)}`}>
                                        {company.relationshipStatus}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-xl">
                                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs mb-1">
                                        <DollarSign className="h-3 w-3" />
                                        <span>Ingresos</span>
                                    </div>
                                    <p className="font-bold text-gray-900 dark:text-white">${totalRevenue.toLocaleString()}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-xl">
                                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs mb-1">
                                        <Briefcase className="h-3 w-3" />
                                        <span>Tratos</span>
                                    </div>
                                    <p className="font-bold text-gray-900 dark:text-white">{activeDeals.length} activos</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-slate-700">
                                <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    <span>{companyContacts.length} contactos</span>
                                </div>
                                {company.website && (
                                    <div className="flex items-center gap-1">
                                        <Globe className="h-4 w-4" />
                                        <span className="truncate max-w-[100px]">{company.website.replace('https://', '')}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {companies.length === 0 && (
                <div className="text-center py-12 bg-gray-50 dark:bg-slate-900/50 rounded-2xl">
                    <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg">No hay empresas registradas</p>
                    <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                        Agregar primera empresa
                    </button>
                </div>
            )}
        </div>
    );
};
