import React, { useState } from 'react';
import { X, User, Mail, Phone, Building, Briefcase, MessageSquare, Linkedin, Save } from 'lucide-react';

export const NewContactModal = ({ companies = [], onClose, onCreate }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        whatsapp: '',
        linkedin: '',
        position: '',
        company: '',
        address: '',
        notes: ''
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es requerido';
        if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es requerido';
        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }
        if (!formData.company.trim()) newErrors.company = 'La empresa es requerida';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const newContact = {
                id: Date.now(),
                name: `${formData.firstName} ${formData.lastName}`,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone || '',
                whatsapp: formData.whatsapp || '',
                linkedin: formData.linkedin || '',
                position: formData.position || '',
                company: formData.company,
                address: formData.address || '',
                status: 'Prospecto',
                score: 50,
                notes: formData.notes ? [
                    {
                        id: Date.now().toString(),
                        text: formData.notes,
                        createdAt: new Date().toISOString(),
                        createdBy: 'Usuario Actual'
                    }
                ] : [],
                createdAt: new Date().toISOString()
            };
            onCreate(newContact);
            onClose();
        }
    };

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        // Limpiar error del campo cuando el usuario empieza a escribir
        if (errors[field]) {
            setErrors({ ...errors, [field]: null });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-6">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white border-4 border-white/30">
                            <User className="h-8 w-8" />
                        </div>
                        <div className="text-white">
                            <h2 className="text-3xl font-bold">Nuevo Contacto</h2>
                            <p className="text-white/90 mt-1">Agregar nueva persona de contacto</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-4">
                        {/* Nombre y Apellido */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Nombre *
                                </label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => handleChange('firstName', e.target.value)}
                                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-slate-900 ${errors.firstName ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                                        }`}
                                    placeholder="Juan"
                                />
                                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Apellido *
                                </label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => handleChange('lastName', e.target.value)}
                                    className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-slate-900 ${errors.lastName ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                                        }`}
                                    placeholder="Pérez"
                                />
                                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <Mail className="h-4 w-4 inline mr-1" />
                                Email *
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-slate-900 ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                                    }`}
                                placeholder="juan@empresa.com"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        {/* Teléfono y WhatsApp */}
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
                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-slate-900"
                                    placeholder="+56 9 1234 5678"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <MessageSquare className="h-4 w-4 inline mr-1" />
                                    WhatsApp
                                </label>
                                <input
                                    type="tel"
                                    value={formData.whatsapp}
                                    onChange={(e) => handleChange('whatsapp', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-slate-900"
                                    placeholder="+56 9 1234 5678"
                                />
                            </div>
                        </div>

                        {/* Cargo y Empresa */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <Briefcase className="h-4 w-4 inline mr-1" />
                                    Cargo
                                </label>
                                <input
                                    type="text"
                                    value={formData.position}
                                    onChange={(e) => handleChange('position', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-slate-900"
                                    placeholder="Gerente de Ventas"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <Building className="h-4 w-4 inline mr-1" />
                                    Empresa *
                                </label>
                                {companies.length > 0 ? (
                                    <select
                                        value={formData.company}
                                        onChange={(e) => handleChange('company', e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-slate-900 ${errors.company ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                                            }`}
                                    >
                                        <option value="">Seleccionar empresa...</option>
                                        {companies.map(company => (
                                            <option key={company.id} value={company.name}>{company.name}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        value={formData.company}
                                        onChange={(e) => handleChange('company', e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-slate-900 ${errors.company ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                                            }`}
                                        placeholder="Nombre de la empresa"
                                    />
                                )}
                                {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
                            </div>
                        </div>

                        {/* LinkedIn */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <Linkedin className="h-4 w-4 inline mr-1" />
                                LinkedIn
                            </label>
                            <input
                                type="url"
                                value={formData.linkedin}
                                onChange={(e) => handleChange('linkedin', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-slate-900"
                                placeholder="https://linkedin.com/in/..."
                            />
                        </div>

                        {/* Dirección */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Dirección
                            </label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-slate-900"
                                placeholder="Calle, Ciudad, País"
                            />
                        </div>

                        {/* Notas */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Notas Iniciales
                            </label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => handleChange('notes', e.target.value)}
                                rows="3"
                                className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-slate-900"
                                placeholder="Información adicional sobre el contacto..."
                            />
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
                        className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                    >
                        <Save className="h-4 w-4" />
                        Crear Contacto
                    </button>
                </div>
            </div>
        </div>
    );
};
