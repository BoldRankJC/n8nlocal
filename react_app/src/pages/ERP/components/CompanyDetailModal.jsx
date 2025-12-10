import React, { useState, useMemo } from 'react';
import {
    X, Building, MapPin, Globe, Phone, Users, Calendar,
    Briefcase, TrendingUp, DollarSign, Star, Edit2, Save,
    Mail, User, FileText, BarChart3, Award, AlertCircle
} from 'lucide-react';

export const CompanyDetailModal = ({ company, contacts = [], deals = [], onClose, onUpdate }) => {
    const [editedCompany, setEditedCompany] = useState(company);
    const [isEditing, setIsEditing] = useState(false);
    const [notes, setNotes] = useState(company.notes || []);
    const [newNote, setNewNote] = useState('');

    // Filtrar contactos de esta empresa
    const companyContacts = useMemo(() =>
        contacts.filter(c => c.company === company.name),
        [contacts, company.name]
    );

    // Filtrar tratos de esta empresa
    const companyDeals = useMemo(() =>
        deals.filter(d => d.client === company.name),
        [deals, company.name]
    );

    // Calcular estadísticas
    const stats = useMemo(() => {
        const activeDeals = companyDeals.filter(d => d.status !== 'DONE');
        const wonDeals = companyDeals.filter(d => d.status === 'DONE');
        const totalRevenue = wonDeals.reduce((sum, d) => sum + (d.dealValue || 0), 0);
        const pipelineValue = activeDeals.reduce((sum, d) => sum + (d.dealValue || 0), 0);

        return {
            totalContacts: companyContacts.length,
            activeDeals: activeDeals.length,
            wonDeals: wonDeals.length,
            totalRevenue,
            pipelineValue
        };
    }, [companyContacts, companyDeals]);

    const handleSave = () => {
        onUpdate({ ...editedCompany, notes });
        setIsEditing(false);
    };

    const handleAddNote = () => {
        if (!newNote.trim()) return;
        const note = {
            id: Date.now().toString(),
            text: newNote,
            createdAt: new Date().toISOString(),
            createdBy: 'Usuario Actual',
        };
        setNotes([note, ...notes]);
        setNewNote('');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Cliente': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'Prospecto': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'Ex-cliente': return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 p-8">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="flex items-start gap-6">
                        {/* Logo/Inicial */}
                        <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-4xl font-bold border-4 border-white/30">
                            {company.logo || company.name[0]}
                        </div>

                        {/* Info básica */}
                        <div className="flex-1 text-white">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedCompany.name}
                                    onChange={(e) => setEditedCompany({ ...editedCompany, name: e.target.value })}
                                    className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 text-white text-3xl font-bold placeholder-white/60 w-full"
                                />
                            ) : (
                                <h2 className="text-4xl font-bold">{company.name}</h2>
                            )}

                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedCompany.legalName || ''}
                                    onChange={(e) => setEditedCompany({ ...editedCompany, legalName: e.target.value })}
                                    className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-1 text-white text-sm placeholder-white/60 w-full mt-2"
                                    placeholder="Razón Social"
                                />
                            ) : (
                                <p className="text-white/90 text-lg mt-1">{company.legalName || 'Razón Social'}</p>
                            )}

                            <div className="flex items-center gap-3 mt-4">
                                <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${getStatusColor(company.relationshipStatus)}`}>
                                    {company.relationshipStatus}
                                </span>
                                {company.industry && (
                                    <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                                        {company.industry}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Botón de edición */}
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center gap-2 text-white font-medium transition-colors"
                            >
                                <Edit2 className="h-4 w-4" />
                                Editar
                            </button>
                        ) : (
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-white hover:bg-white/90 rounded-xl flex items-center gap-2 text-blue-600 font-medium transition-colors"
                            >
                                <Save className="h-4 w-4" />
                                Guardar
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Columna Izquierda - Info y Contactos */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Información de la Empresa */}
                            <div className="bg-gray-50 dark:bg-slate-900/50 p-6 rounded-2xl space-y-4">
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                                    <Building className="h-5 w-5 text-blue-600" />
                                    Información de la Empresa
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">RUT / Tax ID</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editedCompany.taxId || ''}
                                                onChange={(e) => setEditedCompany({ ...editedCompany, taxId: e.target.value })}
                                                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                                            />
                                        ) : (
                                            <p className="text-gray-900 dark:text-white mt-1">{company.taxId || 'No especificado'}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Teléfono</label>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                value={editedCompany.phone || ''}
                                                onChange={(e) => setEditedCompany({ ...editedCompany, phone: e.target.value })}
                                                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2 mt-1">
                                                <p className="text-gray-900 dark:text-white">{company.phone || 'No especificado'}</p>
                                                {company.phone && (
                                                    <a href={`tel:${company.phone}`} className="text-blue-600">
                                                        <Phone className="h-4 w-4" />
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-span-2">
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Sitio Web</label>
                                        {isEditing ? (
                                            <input
                                                type="url"
                                                value={editedCompany.website || ''}
                                                onChange={(e) => setEditedCompany({ ...editedCompany, website: e.target.value })}
                                                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2 mt-1">
                                                <p className="text-gray-900 dark:text-white truncate">{company.website || 'No especificado'}</p>
                                                {company.website && (
                                                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                                                        <Globe className="h-4 w-4" />
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-span-2">
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Dirección</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editedCompany.address || ''}
                                                onChange={(e) => setEditedCompany({ ...editedCompany, address: e.target.value })}
                                                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                                            />
                                        ) : (
                                            <p className="text-gray-900 dark:text-white mt-1">{company.address || 'No especificada'}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Empleados</label>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                value={editedCompany.employeeCount || ''}
                                                onChange={(e) => setEditedCompany({ ...editedCompany, employeeCount: Number(e.target.value) })}
                                                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                                            />
                                        ) : (
                                            <p className="text-gray-900 dark:text-white mt-1">{company.employeeCount || 'No especificado'}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Año Fundación</label>
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                value={editedCompany.foundedYear || ''}
                                                onChange={(e) => setEditedCompany({ ...editedCompany, foundedYear: Number(e.target.value) })}
                                                className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                                            />
                                        ) : (
                                            <p className="text-gray-900 dark:text-white mt-1">{company.foundedYear || 'No especificado'}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Contactos Asociados */}
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                    <User className="h-5 w-5 text-blue-600" />
                                    Contactos ({stats.totalContacts})
                                </h3>

                                {companyContacts.length === 0 ? (
                                    <p className="text-gray-500 dark:text-gray-400 text-center py-8 bg-gray-50 dark:bg-slate-900/50 rounded-xl">
                                        No hay contactos asociados a esta empresa
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        {companyContacts.map(contact => (
                                            <div key={contact.id} className="p-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold">
                                                        {contact.name[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">{contact.name}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{contact.role}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <a href={`mailto:${contact.email}`} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
                                                        <Mail className="h-4 w-4 text-gray-400" />
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Tratos Asociados */}
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                    <Briefcase className="h-5 w-5 text-blue-600" />
                                    Tratos ({companyDeals.length})
                                </h3>

                                {companyDeals.length === 0 ? (
                                    <p className="text-gray-500 dark:text-gray-400 text-center py-8 bg-gray-50 dark:bg-slate-900/50 rounded-xl">
                                        No hay tratos asociados a esta empresa
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        {companyDeals.map(deal => (
                                            <div key={deal.id} className="p-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl flex items-center justify-between">
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900 dark:text-white">{deal.title}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {deal.status} • ${deal.dealValue?.toLocaleString()}
                                                    </p>
                                                </div>
                                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                                                    {deal.score}%
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Notas */}
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                    Notas
                                </h3>

                                <div className="flex gap-2 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Agregar una nota sobre esta empresa..."
                                        value={newNote}
                                        onChange={(e) => setNewNote(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                                    />
                                    <button
                                        onClick={handleAddNote}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Agregar
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {notes.map(note => (
                                        <div key={note.id} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                            <p className="text-gray-900 dark:text-white">{note.text}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {note.createdBy} • {new Date(note.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                    {notes.length === 0 && (
                                        <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                                            No hay notas aún
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Columna Derecha - Estadísticas */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-blue-600" />
                                Estadísticas
                            </h3>

                            {/* Cards de Stats */}
                            <div className="space-y-3">
                                <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl text-white">
                                    <div className="flex items-center gap-2 mb-1">
                                        <DollarSign className="h-5 w-5" />
                                        <span className="text-sm font-medium opacity-90">Ingresos Totales</span>
                                    </div>
                                    <p className="text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                                    <p className="text-xs opacity-75 mt-1">{stats.wonDeals} tratos ganados</p>
                                </div>

                                <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white">
                                    <div className="flex items-center gap-2 mb-1">
                                        <TrendingUp className="h-5 w-5" />
                                        <span className="text-sm font-medium opacity-90">Pipeline</span>
                                    </div>
                                    <p className="text-3xl font-bold">${stats.pipelineValue.toLocaleString()}</p>
                                    <p className="text-xs opacity-75 mt-1">{stats.activeDeals} tratos activos</p>
                                </div>

                                <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl text-white">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Users className="h-5 w-5" />
                                        <span className="text-sm font-medium opacity-90">Contactos</span>
                                    </div>
                                    <p className="text-3xl font-bold">{stats.totalContacts}</p>
                                    <p className="text-xs opacity-75 mt-1">personas de contacto</p>
                                </div>

                                <div className="p-4 bg-gray-100 dark:bg-slate-900/50 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Award className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Info Adicional</span>
                                    </div>
                                    {company.employeeCount && (
                                        <p className="text-sm text-gray-900 dark:text-white mb-1">
                                            <Users className="h-3 w-3 inline mr-1" />
                                            {company.employeeCount} empleados
                                        </p>
                                    )}
                                    {company.foundedYear && (
                                        <p className="text-sm text-gray-900 dark:text-white mb-1">
                                            <Calendar className="h-3 w-3 inline mr-1" />
                                            Fundada en {company.foundedYear}
                                        </p>
                                    )}
                                    {company.industry && (
                                        <p className="text-sm text-gray-900 dark:text-white">
                                            <Briefcase className="h-3 w-3 inline mr-1" />
                                            {company.industry}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
