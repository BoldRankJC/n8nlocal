import React, { useState } from 'react';
import {
    Layout, Trophy, Users, Building, Rocket, Zap, Puzzle, TrendingUp
} from 'lucide-react';

import { BoostedLaunchpad } from './components/views/BoostedLaunchpad';
import { DealDetailModal } from './components/modals/DealDetailModal';
import { ContactDetailModal } from './components/modals/ContactDetailModal';
import { CompanyDetailModal } from './components/modals/CompanyDetailModal';
import { NewContactModal } from './components/modals/NewContactModal';
import { NewCompanyModal } from './components/modals/NewCompanyModal';

// New Components
import { PipelineView } from './components/views/PipelineView';
import { WonDealsView } from './components/views/WonDealsView';
import { ContactsView } from './components/views/ContactsView';
import { CompaniesView } from './components/views/CompaniesView';
import { ReportsView } from './components/views/ReportsView';
import { AutomationsView } from './components/views/AutomationsView';
import { IntegrationsView } from './components/views/IntegrationsView';
import { NewDealModal } from './components/modals/NewDealModal';
import { AutomationFormModal } from './components/modals/AutomationFormModal';
import { TaskDetailsModal } from './components/modals/TaskDetailsModal';

// Logic Hook
import { useERP } from './hooks/useERP';

const ERPView = () => {
    // --- HOOK ---
    const erp = useERP();

    // --- UI STATE ---
    const [activeTab, setActiveTab] = useState('PIPELINE');
    const [selectedDeal, setSelectedDeal] = useState(null);
    const [selectedContact, setSelectedContact] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [isNewContactModalOpen, setIsNewContactModalOpen] = useState(false);
    const [isNewCompanyModalOpen, setIsNewCompanyModalOpen] = useState(false);

    // Auto-Form UI State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isAutoFormOpen, setIsAutoFormOpen] = useState(false);
    const [editingAutoId, setEditingAutoId] = useState(null);
    const [newAutoData, setNewAutoData] = useState({ name: '', trigger: '', action: '' });

    // Task Modal UI State
    const [selectedTask, setSelectedTask] = useState(null);

    // --- VIEW HANDLERS (Bridging UI and Data) ---

    const handleCreateDealWrapper = async (data) => {
        const success = await erp.handleAddTask(data);
        if (success) setIsFormOpen(false);
    }

    const handleMoveToWonWrapper = (taskId) => {
        erp.handleMoveToWon(taskId, () => {
            setSelectedTask(null);
            if (activeTab === 'PIPELINE') setActiveTab('WON');
        });
    };

    const handleDeleteDealWrapper = async (id) => {
        const success = await erp.handleDeleteDeal(id);
        if (success) setSelectedDeal(null);
    }

    // Automation UI Handlers
    const handleEditAutomationUI = (id) => {
        const auto = erp.automations.find(a => a.id === id);
        if (auto) {
            setNewAutoData({ name: auto.name, trigger: auto.trigger, action: auto.action });
            setEditingAutoId(id);
            setIsAutoFormOpen(true);
        }
    };

    const openCreateAutoModal = () => {
        setNewAutoData({ name: '', trigger: '', action: '' });
        setEditingAutoId(null);
        setIsAutoFormOpen(true);
    };

    const handleSaveAutomationWrapper = (data) => {
        erp.handleSaveAutomation(data, editingAutoId);
        setEditingAutoId(null);
        setIsAutoFormOpen(false);
    };


    return (
        <div className="flex flex-col h-full w-full">
            <div className="h-full flex flex-col bg-gray-50 dark:bg-slate-900">
                {/* Header Navigation */}
                <div className="p-4 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-5">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {[
                            { id: 'PIPELINE', label: 'Tablero', icon: Layout },
                            { id: 'WON', label: 'Ganados', icon: Trophy },
                            { id: 'CONTACTS', label: 'Clientes', icon: Users },
                            { id: 'COMPANIES', label: 'Empresas', icon: Building },
                            { id: 'REPORTS', label: 'Reportes', icon: TrendingUp },
                            { id: 'LAUNCHPAD', label: 'Launchpad', icon: Rocket },
                            { id: 'AUTOMATION', label: 'Automatización', icon: Zap },
                            { id: 'INTEGRATIONS', label: 'Apps', icon: Puzzle },
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-[1.5rem] text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                                        ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900 shadow-md'
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto">
                    {activeTab === 'PIPELINE' && (
                        <PipelineView
                            tasks={erp.tasks}
                            stats={erp.stats}
                            onMoveToWon={handleMoveToWonWrapper}
                            onNewDealClick={() => setIsFormOpen(true)}
                            onTaskClick={setSelectedTask}
                        />
                    )}
                    {activeTab === 'WON' && (
                        <WonDealsView
                            wonDeals={erp.wonDeals}
                            showCelebration={erp.showCelebration}
                        />
                    )}
                    {activeTab === 'CONTACTS' && (
                        <ContactsView
                            contacts={erp.contacts}
                            onNewContactClick={() => setIsNewContactModalOpen(true)}
                            setSelectedContact={setSelectedContact}
                        />
                    )}
                    {activeTab === 'COMPANIES' && (
                        <CompaniesView
                            companies={erp.companies}
                            tasks={erp.tasks}
                            contacts={erp.contacts}
                            onNewCompanyClick={() => setIsNewCompanyModalOpen(true)}
                            setSelectedCompany={setSelectedCompany}
                        />
                    )}
                    {activeTab === 'REPORTS' && <ReportsView />}
                    {activeTab === 'LAUNCHPAD' && <BoostedLaunchpad />}
                    {activeTab === 'AUTOMATION' && (
                        <AutomationsView
                            automations={erp.automations}
                            onEditAutomation={handleEditAutomationUI}
                            onDeleteAutomation={erp.handleDeleteAutomation}
                            onToggleAutomation={erp.toggleAutomation}
                            onNewAutomationClick={openCreateAutoModal}
                        />
                    )}
                    {activeTab === 'INTEGRATIONS' && (
                        <IntegrationsView
                            integrations={erp.integrations}
                            setIntegrations={erp.setIntegrations}
                        />
                    )}
                </div>

                {/* Modals */}
                <NewDealModal
                    isOpen={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    onCreate={handleCreateDealWrapper}
                />

                <AutomationFormModal
                    isOpen={isAutoFormOpen}
                    onClose={() => setIsAutoFormOpen(false)}
                    onSave={handleSaveAutomationWrapper}
                    initialData={newAutoData}
                    isEditing={!!editingAutoId}
                />

                <TaskDetailsModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onUpdate={erp.handleUpdateTask}
                    onMoveToWon={handleMoveToWonWrapper}
                />

                {/* Celebration Overlay */}
                {erp.showCelebration && (
                    <div className="fixed inset-0 bg-emerald-500/30 backdrop-blur-md flex items-center justify-center z-[60]">
                        <div className="text-center p-10 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-4 border-emerald-500 animate-pulse">
                            <Trophy className="h-16 w-16 text-emerald-500 mx-auto mb-4 animate-bounce" />
                            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2">¡Trato Cerrado!</h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400">Archivando en clientes ganados...</p>
                        </div>
                    </div>
                )}

                {/* Detail Modals */}
                {selectedDeal && (
                    <DealDetailModal
                        deal={selectedDeal}
                        onClose={() => setSelectedDeal(null)}
                        onUpdate={erp.handleUpdateDeal}
                        onDelete={handleDeleteDealWrapper}
                    />
                )}

                {selectedContact && (
                    <ContactDetailModal
                        contact={selectedContact}
                        deals={erp.tasks}
                        onClose={() => setSelectedContact(null)}
                        onUpdate={erp.handleUpdateContact}
                    />
                )}

                {selectedCompany && (
                    <CompanyDetailModal
                        company={selectedCompany}
                        contacts={erp.contacts}
                        deals={erp.tasks}
                        onClose={() => setSelectedCompany(null)}
                        onUpdate={erp.handleUpdateCompany}
                    />
                )}

                {isNewContactModalOpen && (
                    <NewContactModal
                        companies={erp.companies}
                        onClose={() => setIsNewContactModalOpen(false)}
                        onCreate={erp.handleCreateContact}
                    />
                )}

                {isNewCompanyModalOpen && (
                    <NewCompanyModal
                        onClose={() => setIsNewCompanyModalOpen(false)}
                        onCreate={erp.handleCreateCompany}
                    />
                )}
            </div>
        </div>
    );
};
export default ERPView;
