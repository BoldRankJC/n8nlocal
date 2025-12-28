import React from 'react';
import { Layout, Trophy, Users, TrendingUp, Zap, Puzzle, AlertCircle } from 'lucide-react';

// Hook
import { useCRM } from './hooks/useCRM';

// Views
import PipelineView from './components/views/PipelineView';
import WonDealsView from './components/views/WonDealsView';
import ContactsView from './components/views/ContactsView';
import ReportsView from './components/views/ReportsView';
import AutomationsView from './components/views/AutomationsView';
import IntegrationsView from './components/views/IntegrationsView';

// Modals
import NewDealModal from './components/modals/NewDealModal';
import AutomationFormModal from './components/modals/AutomationFormModal';
import TaskDetailsModal from './components/modals/TaskDetailsModal';
import CelebrationOverlay from './components/modals/CelebrationOverlay';

// Tab configuration
const TABS = [
    { id: 'PIPELINE', label: 'Tablero', icon: Layout },
    { id: 'WON', label: 'Ganados', icon: Trophy },
    { id: 'CONTACTS', label: 'Clientes', icon: Users },
    { id: 'REPORTS', label: 'Reportes', icon: TrendingUp },
    { id: 'AUTOMATION', label: 'Automatización', icon: Zap },
    { id: 'INTEGRATIONS', label: 'Apps', icon: Puzzle },
];

export const CRMView = () => {
    const crm = useCRM();

    // Loading state
    if (crm.loading) {
        return (
            <div className="p-8 text-center text-indigo-500 font-semibold">
                <Zap className="h-6 w-6 inline animate-spin mr-2" />
                Cargando datos del CRM...
            </div>
        );
    }

    // Error state
    if (crm.error) {
        return (
            <div className="p-8 text-center text-rose-500 font-semibold">
                <AlertCircle className="h-6 w-6 inline mr-2" />
                Error: {crm.error}
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-col flex-1 h-full relative transition-all duration-300">

                {/* Main Container */}
                <div className="h-full flex flex-col bg-white dark:bg-slate-900/50 rounded-[1.5rem] shadow-xl shadow-slate-900/50 overflow-hidden">

                    {/* Header Navigation */}
                    <div className="p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md text-slate-200 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-20 shrink-0">
                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                            {TABS.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => crm.setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-[1.5rem] text-sm font-bold transition-all whitespace-nowrap ${crm.activeTab === tab.id
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
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

                    {/* Main Content Area (Scrollable) */}
                    <div className="flex-1 overflow-y-auto">
                        {crm.activeTab === 'PIPELINE' && (
                            <PipelineView
                                stats={crm.stats}
                                searchQuery={crm.searchQuery}
                                setSearchQuery={crm.setSearchQuery}
                                filterPriority={crm.filterPriority}
                                setFilterPriority={crm.setFilterPriority}
                                filteredTasks={crm.filteredTasks}
                                setIsFormOpen={crm.setIsFormOpen}
                                setSelectedTask={crm.setSelectedTask}
                                handleMoveToWon={crm.handleMoveToWon}
                                tasks={crm.tasks}
                            />
                        )}
                        {crm.activeTab === 'WON' && (
                            <WonDealsView
                                wonDeals={crm.wonDeals}
                                showCelebration={crm.showCelebration}
                            />
                        )}
                        {crm.activeTab === 'CONTACTS' && (
                            <ContactsView contacts={crm.contacts} />
                        )}
                        {crm.activeTab === 'REPORTS' && (
                            <ReportsView
                                reportPeriod={crm.reportPeriod}
                                setReportPeriod={crm.setReportPeriod}
                            />
                        )}
                        {crm.activeTab === 'AUTOMATION' && (
                            <AutomationsView
                                automations={crm.automations}
                                openCreateAutoModal={crm.openCreateAutoModal}
                                handleEditAutomation={crm.handleEditAutomation}
                                toggleAutomation={crm.toggleAutomation}
                                handleDeleteAutomation={crm.handleDeleteAutomation}
                            />
                        )}
                        {crm.activeTab === 'INTEGRATIONS' && (
                            <IntegrationsView integrations={crm.integrations} />
                        )}
                    </div>

                    {/* Modals */}
                    <NewDealModal
                        isOpen={crm.isFormOpen}
                        onClose={() => crm.setIsFormOpen(false)}
                        newTask={crm.newTask}
                        setNewTask={crm.setNewTask}
                        onSubmit={crm.handleAddTask}
                    />

                    <AutomationFormModal
                        isOpen={crm.isAutoFormOpen}
                        onClose={() => crm.setIsAutoFormOpen(false)}
                        editingAutoId={crm.editingAutoId}
                        newAutoData={crm.newAutoData}
                        setNewAutoData={crm.setNewAutoData}
                        onSubmit={crm.handleSaveAutomation}
                    />

                    <TaskDetailsModal
                        task={crm.selectedTask}
                        onClose={() => crm.setSelectedTask(null)}
                        updateTaskProperty={crm.updateTaskProperty}
                        handleMoveToWon={crm.handleMoveToWon}
                        newTagInput={crm.newTagInput}
                        setNewTagInput={crm.setNewTagInput}
                        handleAddTag={crm.handleAddTag}
                        removeTag={crm.removeTag}
                        newCommentInput={crm.newCommentInput}
                        setNewCommentInput={crm.setNewCommentInput}
                        handleAddComment={crm.handleAddComment}
                    />

                    <CelebrationOverlay isVisible={crm.showCelebration} />
                </div>
            </div>
        </div>
    );
};

export default CRMView;