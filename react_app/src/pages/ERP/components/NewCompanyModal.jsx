import React, { useState } from 'react';
import { X, Building, Globe, Phone, MapPin, Users, Calendar, Save, Briefcase } from 'lucide-react';

export const NewCompanyModal = ({ onClose, onCreate }) => {
    const [formData, setFormData] = useState({
        name: '',
        legalName: '',
        taxId: '',
        phone: '',
        website: '',
        address: '',
        city: '',
        region: '',
        country: 'Chile',
        industry: '',
        employeeCount: '',
        foundedYear: '',
        relationshipStatus: 'Prospecto'
    });

    const [errors, setErrors] = useState({});

    const industries = [
        'Tecnología',
        'Finanzas',
        'Consultoría',
        'Manufactura',
        'Retail',
        'Salud',
        'Educación',
        'Construcción',
        'Energía',
        'Transporte',
        'Telecomunicaciones',
        'Otro'
    ];

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
        if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
            newErrors.website = 'URL inválida (debe comenzar con http:// o https://)';
        }
        if (formData.employeeCount && isNaN(formData.employeeCount)) {
            newErrors.employeeCount = 'Debe ser un número';
        }
        if (formData.foundedYear && (isNaN(formData.foundedYear) || formData.foundedYear < 1800 || formData.foundedYear > new Date().getFullYear())) {
            newErrors.foundedYear = 'Año inválido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const newCompany = {
                id: Date.now(),
                name: formData.name,
                legalName: formData.legalName || formData.name,
                taxId: formData.taxId || '',
                phone: formData.phone || '',
                website: formData.website || '',
                address: formData.address || '',
                city: formData.city || '',
                region: formData.region || '',
                country: formData.country,
                industry: formData.industry || '',
                employeeCount: formData.employeeCount ? Number(formData.employeeCount) : null,
                foundedYear: formData.foundedYear ? Number(formData.foundedYear) : null,
                relationshipStatus: formData.relationshipStatus,
                logo: formData.name[0].toUpperCase(),
                notes: [],
                createdAt: new Date().toISOString()
            };
            onCreate(newCompany);
            onClose();
        }
    };

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: null });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-6">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white border-4 border-white/30">
                            <Building className="h-8 w-8" />
                        </div>
                        <div className="text-white">
                            <h2 className="text-3xl font-bold">Nueva Empresa</h2>
                            <p className="text-white/90 mt-1">Agregar nueva empresa/cuenta al CRM</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                        {/* Información Básica */}
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Building className="h-5 w-5 text-blue-600" />
                                Información Básica
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Nombre *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                            className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900 ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                                                }`}
                                            placeholder="TechCorp Global"
                                        />
                                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Razón Social
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.legalName}
                                            onChange={(e) => handleChange('legalName', e.target.value)}
                                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900"
                                            placeholder="TechCorp Global S.A."
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            RUT / Tax ID
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.taxId}
                                            onChange={(e) => handleChange('taxId', e.target.value)}
                                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900"
                                            placeholder="76.123.456-7"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <Briefcase className="h-4 w-4 inline mr-1" />
                                            Industria
                                        </label>
                                        <select
                                            value={formData.industry}
                                            onChange={(e) => handleChange('industry', e.target.value)}
                                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900"
                                        >
                                            <option value="">Seleccionar industria...</option>
                                            {industries.map(ind => (
                                                <option key={ind} value={ind}>{ind}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Estado de Relación
                                    </label>
                                    <select
                                        value={formData.relationshipStatus}
                                        onChange={(e) => handleChange('relationshipStatus', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900"
                                    >
                                        <option value="Prospecto">Prospecto</option>
                                        <option value="Cliente">Cliente</option>
                                        <option value="Ex-cliente">Ex-cliente</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Información de Contacto */}
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Phone className="h-5 w-5 text-blue-600" />
                                Información de Contacto
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <Phone className="h-4 w-4 inline mr-1" />
                                            Teléfono
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => handleChange('phone', e.target.value)}
                                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900"
                                            placeholder="+56 2 2345 6789"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            <Globe className="h-4 w-4 inline mr-1" />
                                            Sitio Web
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.website}
                                            onChange={(e) => handleChange('website', e.target.value)}
                                            className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900 ${errors.website ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                                                }`}
                                            placeholder="https://ejemplo.com"
                                        />
                                        {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <MapPin className="h-4 w-4 inline mr-1" />
                                        Dirección
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => handleChange('address', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900"
                                        placeholder="Av. Apoquindo 3000"
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Ciudad
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.city}
                                            onChange={(e) => handleChange('city', e.target.value)}
                                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900"
                                            placeholder="Santiago"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Región
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.region}
                                            onChange={(e) => handleChange('region', e.target.value)}
                                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900"
                                            placeholder="Metropolitana"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            País
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.country}
                                            onChange={(e) => handleChange('country', e.target.value)}
                                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900"
                                            placeholder="Chile"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Información Adicional */}
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Users className="h-5 w-5 text-blue-600" />
                                Información Adicional
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <Users className="h-4 w-4 inline mr-1" />
                                        Número de Empleados
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.employeeCount}
                                        onChange={(e) => handleChange('employeeCount', e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900 ${errors.employeeCount ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                                            }`}
                                        placeholder="500"
                                        min="1"
                                    />
                                    {errors.employeeCount && <p className="text-red-500 text-xs mt-1">{errors.employeeCount}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        <Calendar className="h-4 w-4 inline mr-1" />
                                        Año de Fundación
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.foundedYear}
                                        onChange={(e) => handleChange('foundedYear', e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-900 ${errors.foundedYear ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                                            }`}
                                        placeholder="2010"
                                        min="1800"
                                        max={new Date().getFullYear()}
                                    />
                                    {errors.foundedYear && <p className="text-red-500 text-xs mt-1">{errors.foundedYear}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 dark:border-slate-600 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                    >
                        <Save className="h-4 w-4" />
                        Crear Empresa
                    </button>
                </div>
            </div>
        </div>
    );
};
