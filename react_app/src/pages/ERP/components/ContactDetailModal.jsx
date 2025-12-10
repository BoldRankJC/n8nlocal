import React, { useState } from 'react';
import {
    X, Mail, Phone, MapPin, Building, Briefcase, Calendar,
    LinkedinIcon, MessageSquare, Tag, DollarSign, TrendingUp,
    FileText, Edit2, Save, ExternalLink, Star, Activity
} from 'lucide-react';

export const ContactDetailModal = ({ contact, onClose, onUpdate, deals = [] }) => {
    const [editedContact, setEditedContact] = useState(contact);
    const [isEditing, setIsEditing] = useState(false);
    const [notes, setNotes] = useState(contact.notes || []);
    const [newNote, setNewNote] = useState('');

    // Filtrar tratos asociados a este contacto
    const contactDeals = deals.filter(deal =>
        deal.client === contact.company || deal.contactEmail === contact.email
    );

    const handleSave = () => {
        onUpdate({ ...editedContact, notes });
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

    const getScoreColor = (score = 0) => {
        if (score >= 80) return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30';
        if (score >= 50) return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30';
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">

                {/* Header con Avatar */}
                <div className="relative bg-gradient-to-br from-indigo-500 to-violet-600 p-8">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="flex items-start gap-6">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-3xl font-bold border-4 border-white/30">
                            {contact.firstName[0]}{contact.lastName[0]}
                        </div>

                        {/* Info básica */}
                        <div className="flex-1 text-white">
                            {isEditing ? (
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={editedContact.firstName}
                                            onChange={(e) => setEditedContact({ ...editedContact, firstName: e.target.value })}
                                            className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/60 w-40"
                                            placeholder="Nombre"
                                        />
                                        <input
                                            type="text"
                                            value={editedContact.lastName}
                                            onChange={(e) => setEditedContact({ ...editedContact, lastName: e.target.value })}
                                            className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/60 w-40"
                                            placeholder="Apellido"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        value={editedContact.position}
                                        onChange={(e) => setEditedContact({ ...editedContact, position: e.target.value })}
                                        className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/60 w-full"
                                        placeholder="Cargo"
                                    />
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-3xl font-bold">{contact.firstName} {contact.lastName}</h2>
                                    <p className="text-white/90 text-lg mt-1">{contact.position}</p>
                                </>
                            )}
                            <div className="flex items-center gap-2 mt-3">
                                <Building className="h-4 w-4 text-white/80" />
                                <span className="text-white/90">{contact.company}</span>
                            </div>

                            {/* Score del contacto */}
                            <div className="mt-4 flex items-center gap-3">
                                <div className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 ${getScoreColor(contact.score || 50)}`}>
                                    <Star className="h-4 w-4" />
                                    Score: {contact.score || 50}/100
                                </div>
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                                    {contact.status || 'Activo'}
                                </span>
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
                                className="px-4 py-2 bg-white hover:bg-white/90 rounded-xl flex items-center gap-2 text-indigo-600 font-medium transition-colors"
                            >
                                <Save className="h-4 w-4" />
                                Guardar
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Información de Contacto */}
                    <div className="bg-gray-50 dark:bg-slate-900/50 p-6 rounded-2xl space-y-4">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                            <Phone className="h-5 w-5 text-indigo-600" />
                            Información de Contacto
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={editedContact.email}
                                        onChange={(e) => setEditedContact({ ...editedContact, email: e.target.value })}
                                        className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-gray-900 dark:text-white">{contact.email}</p>
                                        <a href={`mailto:${contact.email}`} className="text-indigo-600 hover:text-indigo-700">
                                            <Mail className="h-4 w-4" />
                                        </a>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Teléfono</label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={editedContact.phone || ''}
                                        onChange={(e) => setEditedContact({ ...editedContact, phone: e.target.value })}
                                        className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                                        placeholder="+56 9 1234 5678"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-gray-900 dark:text-white">{contact.phone || 'No especificado'}</p>
                                        {contact.phone && (
                                            <a href={`tel:${contact.phone}`} className="text-indigo-600 hover:text-indigo-700">
                                                <Phone className="h-4 w-4" />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">WhatsApp</label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={editedContact.whatsapp || ''}
                                        onChange={(e) => setEditedContact({ ...editedContact, whatsapp: e.target.value })}
                                        className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                                        placeholder="+56 9 1234 5678"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-gray-900 dark:text-white">{contact.whatsapp || 'No especificado'}</p>
                                        {contact.whatsapp && (
                                            <a
                                                href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-green-600 hover:text-green-700"
                                            >
                                                <MessageSquare className="h-4 w-4" />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">LinkedIn</label>
                                {isEditing ? (
                                    <input
                                        type="url"
                                        value={editedContact.linkedin || ''}
                                        onChange={(e) => setEditedContact({ ...editedContact, linkedin: e.target.value })}
                                        className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                                        placeholder="https://linkedin.com/in/..."
                                    />
                                ) : (
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-gray-900 dark:text-white truncate">{contact.linkedin || 'No especificado'}</p>
                                        {contact.linkedin && (
                                            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                                <ExternalLink className="h-4 w-4" />
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
                                        value={editedContact.address || ''}
                                        onChange={(e) => setEditedContact({ ...editedContact, address: e.target.value })}
                                        className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                                        placeholder="Calle, Ciudad, País"
                                    />
                                ) : (
                                    <p className="text-gray-900 dark:text-white mt-1">{contact.address || 'No especificada'}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tratos Asociados */}
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                            <Briefcase className="h-5 w-5 text-indigo-600" />
                            Tratos Asociados ({contactDeals.length})
                        </h3>

                        {contactDeals.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                                No hay tratos asociados a este contacto
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {contactDeals.map(deal => (
                                    <div key={deal.id} className="p-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">{deal.title}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {deal.status} • ${deal.dealValue?.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
                                                {deal.score}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Notas */}
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                            <FileText className="h-5 w-5 text-indigo-600" />
                            Notas Personales
                        </h3>

                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                placeholder="Agregar una nota sobre este contacto..."
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
                            />
                            <button
                                onClick={handleAddNote}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                Agregar
                            </button>
                        </div>

                        <div className="space-y-2">
                            {notes.map(note => (
                                <div key={note.id} className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
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
            </div>
        </div>
    );
};
