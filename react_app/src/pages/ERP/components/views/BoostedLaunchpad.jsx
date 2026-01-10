import React, { useState, useEffect, useMemo } from 'react';
import {
    CheckCircle2, Rocket, RotateCcw,
    Gauge, Brain, Palette, Settings, Briefcase,
    Trophy, Plus, Folder, Trash2, X, ChevronRight, Layout, Edit3, Lock
} from 'lucide-react';

const ICON_MAP = {
    'Gauge': Gauge,
    'Brain': Brain,
    'Palette': Palette,
    'Settings': Settings,
    'Briefcase': Briefcase,
    'Rocket': Rocket,
    'RotateCcw': RotateCcw
};

const INITIAL_PHASES_TEMPLATE = [
    {
        id: 'p1',
        title: 'Fase 1: Optimización',
        icon: 'Gauge',
        color: 'text-blue-500',
        borderColor: 'border-blue-500',
        bg: 'bg-blue-500/10',
        description: 'Prepara el terreno para el máximo rendimiento.',
        tasks: [
            { id: 'p1-1', text: 'Auditoría de velocidad del sitio (PageSpeed > 90)', completed: false },
            { id: 'p1-2', text: 'Revisión de SEO On-Page (Meta tags, H1, Alt text)', completed: false },
            { id: 'p1-3', text: 'Configuración de Pixel de Meta/Facebook', completed: false },
            { id: 'p1-4', text: 'Configuración de Google Analytics 4 (Eventos clave)', completed: false },
            { id: 'p1-5', text: 'Verificación de formularios y CTAs', completed: false },
        ]
    },
    {
        id: 'p2',
        title: 'Fase 2: Inteligencia',
        icon: 'Brain',
        color: 'text-purple-500',
        borderColor: 'border-purple-500',
        bg: 'bg-purple-500/10',
        description: 'Conoce a tu audiencia y a tu competencia.',
        tasks: [
            { id: 'p2-1', text: 'Definición del Avatar de Cliente Ideal (ICP)', completed: false },
            { id: 'p2-2', text: 'Análisis de competidores (Ads & Funnels)', completed: false },
            { id: 'p2-3', text: 'Selección de palabras clave (Keywords)', completed: false },
            { id: 'p2-4', text: 'Mapa de empatía y copy angles', completed: false },
            { id: 'p2-5', text: 'Estrategia de Retargeting definida', completed: false },
        ]
    },
    {
        id: 'p3',
        title: 'Fase 3: Activos',
        icon: 'Palette',
        color: 'text-pink-500',
        borderColor: 'border-pink-500',
        bg: 'bg-pink-500/10',
        description: 'Crea los materiales visuales y escritos.',
        tasks: [
            { id: 'p3-1', text: 'Creativos de anuncios (Imágenes/Videos) en formatos 1:1, 9:16', completed: false },
            { id: 'p3-2', text: 'Copywriting para anuncios (3 variaciones)', completed: false },
            { id: 'p3-3', text: 'Landing Page diseñada y maquetada', completed: false },
            { id: 'p3-4', text: 'Emails de secuencia de nutrición redactados', completed: false },
            { id: 'p3-5', text: 'Lead Magnet o Oferta Irresistible finalizada', completed: false },
        ]
    },
    {
        id: 'p4',
        title: 'Fase 4: Configuración',
        icon: 'Settings',
        color: 'text-amber-500',
        borderColor: 'border-amber-500',
        bg: 'bg-amber-500/10',
        description: 'Conecta los cables y asegura el funcionamiento.',
        tasks: [
            { id: 'p4-1', text: 'Setup de campañas en Ads Manager', completed: false },
            { id: 'p4-2', text: 'Integración de CRM con herramientas de anuncios', completed: false },
            { id: 'p4-3', text: 'Test de pasarela de pago (si aplica)', completed: false },
            { id: 'p4-4', text: 'Verificación de dominios y seguridad (SSL)', completed: false },
            { id: 'p4-5', text: 'Configuración de respuestas automáticas (Email/WhatsApp)', completed: false },
        ]
    },
    {
        id: 'p5',
        title: 'Fase 5: Protocolo de Ventas',
        icon: 'Briefcase',
        color: 'text-emerald-500',
        borderColor: 'border-emerald-500',
        bg: 'bg-emerald-500/10',
        description: 'Listos para recibir y cerrar leads.',
        tasks: [
            { id: 'p5-1', text: 'Script de ventas alineado a la oferta', completed: false },
            { id: 'p5-2', text: 'Entrenamiento del equipo de ventas (Briefing)', completed: false },
            { id: 'p5-3', text: 'Calendario de citas configurado', completed: false },
            { id: 'p5-4', text: 'Plan de seguimiento de prospectos (Follow-up)', completed: false },
            { id: 'p5-5', text: 'Simulación de proceso de compra (End-to-End Test)', completed: false },
        ]
    }
];

const TEMPLATE_PROJECT_ID = 'template-standard-guide';
const TEMPLATE_PROJECT = {
    id: TEMPLATE_PROJECT_ID,
    name: '📍 Guía Estándar (Ejemplo)',
    phases: INITIAL_PHASES_TEMPLATE,
    isLocked: true,
    createdAt: 0 // Always first
};

export const BoostedLaunchpad = () => {
    // --- STATE ---
    const [projects, setProjects] = useState([]);
    const [activeProjectId, setActiveProjectId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [loaded, setLoaded] = useState(false);

    // UI State for editing
    const [newTaskInput, setNewTaskInput] = useState('');
    const [activePhaseForInput, setActivePhaseForInput] = useState(null);
    const [editingProjectNameId, setEditingProjectNameId] = useState(null);
    const [tempProjectName, setTempProjectName] = useState('');

    // UI State for Phase Creation
    const [isCreatorOpen, setIsCreatorOpen] = useState(false);
    const [newPhaseData, setNewPhaseData] = useState({
        title: '',
        description: '',
        icon: 'Rocket',
        color: 'blue'
    });

    const COLOR_PALETTE = {
        blue: { color: 'text-blue-500', borderColor: 'border-blue-500', bg: 'bg-blue-500/10', solid: 'bg-blue-500' },
        purple: { color: 'text-purple-500', borderColor: 'border-purple-500', bg: 'bg-purple-500/10', solid: 'bg-purple-500' },
        pink: { color: 'text-pink-500', borderColor: 'border-pink-500', bg: 'bg-pink-500/10', solid: 'bg-pink-500' },
        amber: { color: 'text-amber-500', borderColor: 'border-amber-500', bg: 'bg-amber-500/10', solid: 'bg-amber-500' },
        emerald: { color: 'text-emerald-500', borderColor: 'border-emerald-500', bg: 'bg-emerald-500/10', solid: 'bg-emerald-500' },
        red: { color: 'text-red-500', borderColor: 'border-red-500', bg: 'bg-red-500/10', solid: 'bg-red-500' },
        cyan: { color: 'text-cyan-500', borderColor: 'border-cyan-500', bg: 'bg-cyan-500/10', solid: 'bg-cyan-500' },
    };

    // --- MIGRATION & INIT ---
    useEffect(() => {
        const savedData = localStorage.getItem('boosted_launchpad_data');

        let loadedProjects = [];

        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);

                // Helper to fix icons
                const normalizePhases = (phases) => {
                    if (!phases) return [];
                    return phases.map((p, i) => ({
                        ...p,
                        icon: (typeof p.icon === 'string' && ICON_MAP[p.icon]) ? p.icon : 'Gauge'
                    }));
                };

                // DATA MIGRATION CHECK
                if (Array.isArray(parsed) && parsed[0]?.tasks) {
                    // Legacy single project
                    loadedProjects = [{
                        id: 'migrated-legacy',
                        name: 'Proyecto Migrado',
                        createdAt: Date.now(),
                        phases: normalizePhases(parsed)
                    }];
                } else if (Array.isArray(parsed) && parsed[0]?.phases !== undefined) {
                    // New structure
                    loadedProjects = parsed.map(proj => ({
                        ...proj,
                        phases: normalizePhases(proj.phases)
                    }));
                }
            } catch (e) {
                console.error("Error loading data", e);
            }
        }

        // Filter out any old template references to ensure we always load the fresh one code-defined
        const userProjects = loadedProjects.filter(p => !p.isLocked && p.id !== TEMPLATE_PROJECT_ID);

        // If no user projects, add an empty one
        if (userProjects.length === 0) {
            userProjects.push(createNewProjectObject('Mi Primer Proyecto', true));
        }

        // Always prepend the template
        const finalProjects = [TEMPLATE_PROJECT, ...userProjects];

        setProjects(finalProjects);

        // Set active project safely
        if (!activeProjectId) {
            setActiveProjectId(finalProjects[1]?.id || finalProjects[0].id); // Try to open user project first
        }

        setLoaded(true);
    }, []);

    const createNewProjectObject = (name, isEmpty = true) => ({
        id: 'proj-' + Date.now(),
        name: name,
        createdAt: Date.now(),
        phases: isEmpty ? [] : JSON.parse(JSON.stringify(INITIAL_PHASES_TEMPLATE)),
        isLocked: false
    });

    // --- PERSISTENCE ---
    useEffect(() => {
        if (loaded) {
            // Save ONLY user projects to avoid duplicating/saving text of the template permanently
            const projectsToSave = projects.filter(p => !p.isLocked);
            localStorage.setItem('boosted_launchpad_data', JSON.stringify(projectsToSave));
        }
    }, [projects, loaded]);

    // --- UX SIDE EFFECTS ---
    useEffect(() => {
        setNewTaskInput('');
        setActivePhaseForInput(null);
        setIsCreatorOpen(false);
    }, [activeProjectId]);

    // --- COMPUTED ---
    const activeProject = useMemo(() =>
        projects.find(p => p.id === activeProjectId) || projects[0]
        , [projects, activeProjectId]);

    const stats = useMemo(() => {
        if (!activeProject) return { total: 0, completed: 0, percent: 0 };
        let total = 0;
        let completed = 0;

        if (!activeProject.phases) return { total: 0, completed: 0, percent: 0 };

        activeProject.phases.forEach(p => {
            p.tasks.forEach(t => {
                total++;
                if (t.completed) completed++;
            });
        });
        const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
        return { total, completed, percent };
    }, [activeProject]);

    // --- ACTIONS ---

    const handleCreateProject = () => {
        const name = prompt('Nombre del nuevo proyecto:', 'Nuevo Lanzamiento');
        if (name) {
            const newProj = createNewProjectObject(name, true);
            setProjects([...projects, newProj]);
            setActiveProjectId(newProj.id);
        }
    };

    const handleDeleteProject = (e, projId) => {
        e.stopPropagation();
        const project = projects.find(p => p.id === projId);
        if (project?.isLocked) return;

        if (projects.filter(p => !p.isLocked).length <= 1) {
            alert("Debes tener al menos un proyecto propio activo.");
            return;
        }

        if (confirm('¿Eliminar este proyecto y todo su progreso?')) {
            const newProjects = projects.filter(p => p.id !== projId);
            setProjects(newProjects);
            if (activeProjectId === projId) {
                setActiveProjectId(newProjects[newProjects.length - 1].id);
            }
        }
    };

    const handleRenameProject = (projId, newName) => {
        setProjects(projects.map(p => p.id === projId ? { ...p, name: newName } : p));
        setEditingProjectNameId(null);
    };

    const handleAddPhase = () => {
        if (activeProject.isLocked) return;
        if (!newPhaseData.title.trim()) return;

        const styles = COLOR_PALETTE[newPhaseData.color];
        const newPhase = {
            id: 'ph-' + Date.now(),
            title: newPhaseData.title,
            description: newPhaseData.description || 'Sin descripción',
            icon: newPhaseData.icon,
            ...styles,
            tasks: []
        };
        const updatedProjects = projects.map(proj => {
            if (proj.id !== activeProject.id) return proj;
            return { ...proj, phases: [...(proj.phases || []), newPhase] };
        });
        setProjects(updatedProjects);
        setIsCreatorOpen(false);
        setNewPhaseData({ title: '', description: '', icon: 'Rocket', color: 'blue' });
    };

    const handleDeletePhase = (e, phaseId) => {
        e.stopPropagation();
        if (activeProject.isLocked) return;
        if (!confirm("¿Eliminar esta fase y todas sus tareas?")) return;

        const updatedProjects = projects.map(proj => {
            if (proj.id !== activeProject.id) return proj;
            return { ...proj, phases: proj.phases.filter(p => p.id !== phaseId) };
        });
        setProjects(updatedProjects);
    };

    const toggleTask = (phaseId, taskId) => {
        if (!activeProject || activeProject.isLocked) return;

        const updatedProjects = projects.map(proj => {
            if (proj.id !== activeProject.id) return proj;
            return {
                ...proj,
                phases: proj.phases.map(p => {
                    if (p.id !== phaseId) return p;
                    return {
                        ...p,
                        tasks: p.tasks.map(t => {
                            if (t.id !== taskId) return t;
                            return { ...t, completed: !t.completed };
                        })
                    };
                })
            };
        });
        setProjects(updatedProjects);
    };

    const handleAddTask = (phaseId) => {
        if (activeProject.isLocked) return;
        if (!newTaskInput.trim()) return;

        const updatedProjects = projects.map(proj => {
            if (proj.id !== activeProject.id) return proj;
            return {
                ...proj,
                phases: proj.phases.map(p => {
                    if (p.id !== phaseId) return p;
                    return {
                        ...p,
                        tasks: [...p.tasks, {
                            id: 'custom-' + Date.now(),
                            text: newTaskInput,
                            completed: false
                        }]
                    };
                })
            };
        });
        setProjects(updatedProjects);
        setNewTaskInput('');
        setActivePhaseForInput(null);
    };

    const handleDeleteTask = (e, phaseId, taskId) => {
        e.stopPropagation();
        if (activeProject.isLocked) return;
        if (!confirm('¿Eliminar esta tarea?')) return;

        const updatedProjects = projects.map(proj => {
            if (proj.id !== activeProject.id) return proj;
            return {
                ...proj,
                phases: proj.phases.map(p => {
                    if (p.id !== phaseId) return p;
                    return { ...p, tasks: p.tasks.filter(t => t.id !== taskId) };
                })
            };
        });
        setProjects(updatedProjects);
    };

    const getPhaseProgress = (phase) => {
        const total = phase.tasks.length;
        const comp = phase.tasks.filter(t => t.completed).length;
        return total === 0 ? 0 : Math.round((comp / total) * 100);
    };

    if (!loaded || !activeProject) return <div className="p-8 text-center text-gray-500">Cargando...</div>;

    const isLocked = activeProject.isLocked;

    return (
        <div className="flex h-[calc(100vh-140px)] bg-gray-50/50 dark:bg-slate-900/50">
            {/* --- SIDEBAR --- */}
            <div className={`
                flex-shrink-0 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 transition-all duration-300 flex flex-col
                ${isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}
            `}>
                <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                    <h2 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                        <Folder className="h-4 w-4" /> Proyectos
                    </h2>
                    <button onClick={handleCreateProject} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-indigo-600 dark:text-indigo-400" title="Nuevo Proyecto">
                        <Plus className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {projects.map(proj => (
                        <div
                            key={proj.id}
                            onClick={() => setActiveProjectId(proj.id)}
                            className={`
                                group flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer text-sm font-medium transition-all
                                ${activeProjectId === proj.id
                                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700/50'
                                }
                            `}
                        >
                            <div className="flex items-center gap-2 truncate">
                                {proj.isLocked ? <Lock className="h-3 w-3 text-amber-500" /> : <Folder className={`h-4 w-4 ${activeProjectId === proj.id ? 'fill-current' : ''}`} />}
                                {editingProjectNameId === proj.id ? (
                                    <input
                                        autoFocus
                                        className="bg-transparent border-b border-indigo-500 focus:outline-none w-full"
                                        value={tempProjectName}
                                        onChange={(e) => setTempProjectName(e.target.value)}
                                        onBlur={() => handleRenameProject(proj.id, tempProjectName)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleRenameProject(proj.id, tempProjectName)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                ) : (
                                    <span className={`truncate ${proj.isLocked ? 'text-gray-500 italic' : ''}`}>{proj.name}</span>
                                )}
                            </div>

                            {!proj.isLocked && (
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingProjectNameId(proj.id);
                                            setTempProjectName(proj.name);
                                        }}
                                        className="p-1 hover:text-indigo-500"
                                    >
                                        <Edit3 className="h-3 w-3" />
                                    </button>
                                    <button
                                        onClick={(e) => handleDeleteProject(e, proj.id)}
                                        className="p-1 hover:text-red-500"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="flex-1 flex flex-col overflow-hidden relative">

                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className={`
                        absolute top-4 left-4 z-40 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200 dark:border-slate-700 text-gray-500 hover:text-indigo-600 transition-all
                        ${isSidebarOpen ? 'hidden' : 'block'}
                    `}
                >
                    <Layout className="h-5 w-5" />
                </button>

                {/* Sticky Stats Header */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 z-5">
                    <div className="flex items-center gap-4">
                        {isSidebarOpen && (
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="mr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                <ChevronRight className="h-5 w-5 rotate-180" />
                            </button>
                        )}
                        <Rocket className={`h-8 w-8 ${stats.percent === 100 ? 'text-emerald-500 animate-bounce' : 'text-indigo-600'}`} />
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                {activeProject.name}
                                {stats.percent === 100 && <Trophy className="h-6 w-6 text-yellow-500" />}
                                {isLocked && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full border border-amber-200 flex items-center gap-1"><Lock className="h-3 w-3" /> Solo Lectura</span>}
                            </h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {stats.completed} de {stats.total} tareas completadas
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 w-full md:w-auto">
                        <div className="flex-1 md:w-64 max-w-md">
                            <div className="flex justify-between text-xs mb-1 font-bold text-gray-500 dark:text-gray-400">
                                <span>Progreso Global</span>
                                <span>{stats.percent}%</span>
                            </div>
                            <div className="w-full h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-1000 ease-out rounded-full ${stats.percent === 100 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
                                    style={{ width: `${stats.percent}%` }}
                                >
                                    {stats.percent > 0 && <div className="w-full h-full animate-pulse bg-white/20"></div>}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleCreateProject}
                            className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all hover:-translate-y-0.5"
                        >
                            <Plus className="h-4 w-4" /> Nuevo Proyecto
                        </button>
                    </div>
                </div>

                {/* Phases Grid */}
                <div
                    key={activeProject.id}
                    className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-700 animate-fade-in"
                >
                    {activeProject.phases.length === 0 && !isCreatorOpen && !isLocked && (
                        <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                            <Rocket className="h-16 w-16 text-gray-300 dark:text-slate-600 mb-4" />
                            <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300">Este proyecto está vacío</h3>
                            <p className="text-gray-500 max-w-sm mx-auto mb-6">Comienza creando tu primera fase para organizar tus tareas.</p>
                            <button
                                onClick={() => setIsCreatorOpen(true)}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:-translate-y-1"
                            >
                                Crear Primera Fase
                            </button>
                        </div>
                    )}

                    {activeProject.phases.map((phase) => {
                        const progress = getPhaseProgress(phase);
                        const isComplete = progress === 100;
                        const PhaseIcon = ICON_MAP[phase.icon] || Gauge;

                        return (
                            <div
                                key={phase.id}
                                className={`
                                    relative overflow-visible rounded-2xl border transition-all duration-300
                                    ${isComplete
                                        ? 'bg-white dark:bg-slate-800 border-emerald-500 dark:border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                                        : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md'
                                    }
                                    ${isLocked ? 'opacity-90' : ''}
                                `}
                            >
                                {isComplete && <div className="absolute -top-3 -right-3 z-10"><Trophy className="h-8 w-8 text-yellow-500 drop-shadow-lg rotate-12" /></div>}

                                {!isLocked && (
                                    <button
                                        onClick={(e) => handleDeletePhase(e, phase.id)}
                                        className="absolute top-4 right-4 text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors z-20"
                                        title="Eliminar fase"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}

                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row gap-8">
                                        <div className="lg:w-1/3 flex flex-col gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-4 rounded-2xl ${isComplete ? 'bg-emerald-100 text-emerald-600' : phase.bg + ' ' + phase.color}`}>
                                                    <PhaseIcon className="h-8 w-8" />
                                                </div>
                                                <div>
                                                    <h3 className={`font-bold text-xl ${isComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
                                                        {phase.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{phase.description}</p>
                                                </div>
                                            </div>

                                            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-700/50">
                                                <div className="flex justify-between items-end mb-2">
                                                    <span className="text-xs font-bold uppercase text-gray-400">Completado</span>
                                                    <span className={`text-2xl font-black ${isComplete ? 'text-emerald-600' : 'text-gray-700 dark:text-gray-200'}`}>
                                                        {progress}%
                                                    </span>
                                                </div>
                                                <div className="w-full h-2.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-700 ${isComplete ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="lg:w-2/3 lg:border-l lg:border-gray-100 dark:lg:border-slate-700 lg:pl-8 space-y-3">
                                            {phase.tasks.map(task => (
                                                <div
                                                    key={task.id}
                                                    className={`
                                                        group relative flex items-start gap-4 p-3 rounded-xl transition-colors
                                                        ${!isLocked ? 'hover:bg-gray-50 dark:hover:bg-slate-700/30' : ''}
                                                    `}
                                                >
                                                    <div
                                                        onClick={() => toggleTask(phase.id, task.id)}
                                                        className={`
                                                            mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                                                            ${task.completed
                                                                ? 'border-emerald-500 bg-emerald-500 text-white'
                                                                : 'border-gray-300 dark:border-slate-500 text-transparent'
                                                            }
                                                            ${!isLocked ? 'cursor-pointer hover:border-indigo-400' : 'cursor-not-allowed opacity-50'}
                                                        `}
                                                    >
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                    </div>

                                                    <span
                                                        onClick={() => toggleTask(phase.id, task.id)}
                                                        className={`
                                                            flex-1 text-sm font-medium transition-colors
                                                            ${task.completed
                                                                ? 'text-gray-400 line-through decoration-gray-300'
                                                                : 'text-gray-700 dark:text-gray-200'
                                                            }
                                                            ${!isLocked ? 'cursor-pointer' : 'cursor-default'}
                                                        `}
                                                    >
                                                        {task.text}
                                                    </span>

                                                    {!isLocked && (
                                                        <button
                                                            onClick={(e) => handleDeleteTask(e, phase.id, task.id)}
                                                            className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all"
                                                            title="Eliminar tarea"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}

                                            {!isLocked && (
                                                activePhaseForInput === phase.id ? (
                                                    <div className="flex items-center gap-2 mt-2 pl-9 animate-fade-in-down">
                                                        <input
                                                            autoFocus
                                                            type="text"
                                                            placeholder="Escribe la nueva tarea..."
                                                            className="flex-1 px-4 py-2 bg-gray-50 dark:bg-slate-700/50 border border-indigo-200 dark:border-indigo-500/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                            value={newTaskInput}
                                                            onChange={(e) => setNewTaskInput(e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleAddTask(phase.id)}
                                                            onBlur={() => {
                                                                if (!newTaskInput) setActivePhaseForInput(null);
                                                            }}
                                                        />
                                                        <button
                                                            onMouseDown={() => handleAddTask(phase.id)}
                                                            className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setActivePhaseForInput(phase.id)}
                                                        className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-indigo-600 mt-2 pl-9 transition-colors group"
                                                    >
                                                        <Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                                        Agregar Tarea
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* PHASE CREATOR UI */}
                    {!isLocked && (
                        isCreatorOpen ? (
                            <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-indigo-200 dark:border-slate-600 p-6 animate-fade-in shadow-xl mb-12">
                                <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4 border-b border-gray-100 dark:border-slate-700 pb-2">Nueva Fase</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Título</label>
                                            <input
                                                autoFocus
                                                type="text"
                                                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400"
                                                placeholder="Ej: Fase 1: Planificación"
                                                value={newPhaseData.title}
                                                onChange={(e) => setNewPhaseData({ ...newPhaseData, title: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descripción</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400"
                                                placeholder="Breve descripción del objetivo..."
                                                value={newPhaseData.description}
                                                onChange={(e) => setNewPhaseData({ ...newPhaseData, description: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Color</label>
                                            <div className="flex gap-2 flex-wrap">
                                                {Object.keys(COLOR_PALETTE).map(colorKey => (
                                                    <button
                                                        key={colorKey}
                                                        onClick={() => setNewPhaseData({ ...newPhaseData, color: colorKey })}
                                                        className={`
                                                        w-8 h-8 rounded-full border-2 transition-all
                                                        ${COLOR_PALETTE[colorKey].solid}
                                                        ${newPhaseData.color === colorKey ? 'border-white dark:border-slate-800 scale-110 shadow-md ring-2 ring-offset-2 ring-gray-400 dark:ring-slate-500' : 'border-transparent hover:scale-105 opacity-70 hover:opacity-100'}
                                                    `}
                                                        title={colorKey}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Icono</label>
                                        <div className="grid grid-cols-5 gap-2">
                                            {Object.keys(ICON_MAP).map(iconKey => {
                                                const Icon = ICON_MAP[iconKey];
                                                return (
                                                    <button
                                                        key={iconKey}
                                                        onClick={() => setNewPhaseData({ ...newPhaseData, icon: iconKey })}
                                                        className={`
                                                        p-3 rounded-xl flex items-center justify-center transition-all
                                                        ${newPhaseData.icon === iconKey
                                                                ? 'bg-indigo-100 text-indigo-600 ring-2 ring-indigo-500 ring-offset-2'
                                                                : 'bg-gray-50 dark:bg-slate-700 text-gray-500 hover:bg-gray-100 hover:text-indigo-500'
                                                            }
                                                    `}
                                                        title={iconKey}
                                                    >
                                                        <Icon className="h-6 w-6" />
                                                    </button>
                                                )
                                            })}
                                        </div>

                                        <div className="flex items-center gap-3 mt-8 justify-end">
                                            <button
                                                onClick={() => setIsCreatorOpen(false)}
                                                className="px-4 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-sm font-medium"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={handleAddPhase}
                                                disabled={!newPhaseData.title.trim()}
                                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-all"
                                            >
                                                Crear Fase
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsCreatorOpen(true)}
                                className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl text-gray-400 font-bold hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus className="h-5 w-5" /> Agregar Nueva Fase
                            </button>
                        )
                    )}

                    {/* Footer Spacing */}
                    <div className="h-20"></div>
                </div>
            </div>
        </div>
    );
};
