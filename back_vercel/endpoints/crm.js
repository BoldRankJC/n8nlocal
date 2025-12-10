const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

// --------------------------------------------------------
// --- MOCK/DEFAULT DATA SETUP (Para la primera carga) ---
// --------------------------------------------------------

const DEFAULT_CRM_DATA = {
    // Pipeline (Tasks)
    tasks: [
        {
            id: '1', title: 'Licencia Enterprise Q3', description: 'Negociar renovación de licencia anual para 500 usuarios.',
            status: 'IN_PROGRESS', priority: 'HIGH', assignee: 'AL', dueDate: '25 Feb', tags: ['Ventas', 'Renovación'],
            client: 'TechCorp Global', dealValue: 45000,
            score: 75,
            scoringCriteria: { budget: true, authority: true, need: true, timing: false },
            comments: [{ id: 'c1', user: 'Juan Perez', text: 'El cliente pidió 10% de descuento.', time: 'Hace 2h' }]
        },
        {
            id: '2', title: 'Implementación CRM', description: 'Coordinar reunión de kickoff con el equipo técnico.',
            status: 'TODO', priority: 'MEDIUM', assignee: 'JD', dueDate: '15 Feb', tags: ['Servicios'],
            client: 'Banco Futuro', dealValue: 12500,
            score: 50,
            scoringCriteria: { budget: true, authority: false, need: true, timing: false },
            comments: []
        },
    ],
    // Won Deals
    wonDeals: [
        {
            id: '4', title: 'Suscripción Startup', description: 'Onboarding completado exitosamente.',
            status: 'DONE', priority: 'LOW', assignee: 'AL', dueDate: '10 Feb', tags: ['Onboarding'],
            client: 'Green Energy', dealValue: 2500,
            score: 100,
            scoringCriteria: { budget: true, authority: true, need: true, timing: true },
            comments: []
        },
    ],
    // Contacts
    contacts: [
        { id: 1, name: 'Roberto Gomez', role: 'CTO', company: 'TechCorp Global', email: 'roberto@techcorp.com', status: 'Prospecto', lastContact: 'Ayer', tickets: 0 },
        { id: 2, name: 'Maria Ferrera', role: 'Gerente RRHH', company: 'Banco Futuro', email: 'mferrera@bancofuturo.com', status: 'Prospecto', lastContact: 'Hace 3 días', tickets: 2 },
        { id: 3, name: 'Luis Silva', role: 'CEO', company: 'Innovate SpA', email: 'lsilva@innovate.cl', status: 'Cliente', lastContact: 'Hace 1 semana', tickets: 0 },
        { id: 4, name: 'Ana Torres', role: 'Jefe Operaciones', company: 'Green Energy', email: 'ana@green.com', status: 'Cliente', lastContact: 'Hoy', tickets: 1 },
    ],
    // Automations
    automations: [
        { id: 1, name: 'Bienvenida Nuevo Lead', trigger: 'Nuevo Trato Creado', action: 'Enviar Email de Bienvenida', active: true, icon: 'Mail' },
        { id: 2, name: 'Alerta de Estancamiento', trigger: 'Sin actividad por 5 días', action: 'Notificar al Vendedor', active: true, icon: 'AlertCircle' },
    ],
    // Integrations (Generalmente estáticas/hardcoded o configurables por admin)
    integrations: [
        { id: 1, name: 'Google Workspace', desc: 'Sincroniza emails y calendario.', connected: true, icon: 'Mail', color: 'text-red-500 bg-red-50 dark:bg-red-900/20' },
        { id: 2, name: 'Slack', desc: 'Notificaciones de equipo en tiempo real.', connected: true, icon: 'Slack', color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
        { id: 3, name: 'Zoom', desc: 'Genera links de reuniones automáticamente.', connected: false, icon: 'Phone', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
        { id: 4, name: 'ERP / Nómina', desc: 'Sincroniza datos de facturación.', connected: false, icon: 'Database', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
    ],
};

// Colección centralizada para el estado del CRM (asume un ID fijo 'crm_state')
const CRM_COLLECTION = "crm_state";
const CRM_STATE_ID = "crm_boosted_main";

// --------------------------------------------------------
// --- ENDPOINTS CORE DEL CRM ---
// --------------------------------------------------------

// GET /api/crm - Obtener todo el estado del CRM (Pipeline, Ganados, Contactos, Aut.)
router.get("/", async (req, res) => {
    try {
        const crmState = await req.db.collection(CRM_COLLECTION).findOne({ _id: CRM_STATE_ID });

        if (!crmState) {
            // Inicializar si no existe (importante para el primer uso)
            await req.db.collection(CRM_COLLECTION).insertOne({ _id: CRM_STATE_ID, ...DEFAULT_CRM_DATA });
            return res.json(DEFAULT_CRM_DATA);
        }

        // Devolver el estado actual, excluyendo el _id de MongoDB
        const { _id, ...data } = crmState;
        res.json(data);
    } catch (err) {
        console.error("❌ Error al obtener el estado del CRM:", err);
        res.status(500).json({ error: "Error interno al cargar datos del CRM." });
    }
});

// POST /api/crm - Crear un nuevo trato (Task)
router.post("/", async (req, res) => {
    try {
        const newDeal = {
            id: Date.now().toString(),
            ...req.body,
        };

        const result = await req.db.collection(CRM_COLLECTION).updateOne(
            { _id: CRM_STATE_ID },
            { $push: { tasks: newDeal } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Estado del CRM no encontrado" });
        }

        res.status(201).json({ message: "Trato creado exitosamente", deal: newDeal });
    } catch (err) {
        console.error("❌ Error al crear el trato:", err);
        res.status(500).json({ error: "Error al crear la oportunidad." });
    }
});

// PUT /api/crm/:taskId - Actualizar propiedades de un trato (Pipeline Task)
router.put("/:taskId", async (req, res) => {
    try {
        const { taskId } = req.params;
        const updates = req.body;
        
        // Convertir 'comments' a formato de array para manejar el set correctamente si existe
        if (updates.comments) {
            updates["tasks.$.comments"] = updates.comments;
            delete updates.comments;
        }

        const setUpdates = {};
        for (const key in updates) {
            setUpdates[`tasks.$.${key}`] = updates[key];
        }

        const result = await req.db.collection(CRM_COLLECTION).updateOne(
            { _id: CRM_STATE_ID, "tasks.id": taskId },
            { $set: setUpdates }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Trato no encontrado en el pipeline" });
        }

        res.json({ message: "Trato actualizado exitosamente", modifiedCount: result.modifiedCount });
    } catch (err) {
        console.error("❌ Error al actualizar el trato:", err);
        res.status(500).json({ error: "Error al actualizar el trato." });
    }
});

// PUT /api/crm/won/:taskId - Mover un trato a la lista de Ganados
router.put("/won/:taskId", async (req, res) => {
    try {
        const { taskId } = req.params;
        const crmState = await req.db.collection(CRM_COLLECTION).findOne({ _id: CRM_STATE_ID });
        
        if (!crmState) return res.status(404).json({ error: "Estado del CRM no encontrado" });

        const taskToMove = crmState.tasks.find(t => t.id === taskId);
        if (!taskToMove) return res.status(404).json({ error: "Trato no encontrado en el pipeline" });

        // 1. Eliminar de 'tasks' y 2. Añadir a 'wonDeals'
        const updatedTask = { ...taskToMove, status: 'DONE', score: 100, closedDate: new Date().toISOString() };
        
        const result = await req.db.collection(CRM_COLLECTION).updateOne(
            { _id: CRM_STATE_ID },
            {
                $pull: { tasks: { id: taskId } },
                $push: { wonDeals: updatedTask }
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({ error: "Error al mover el trato (posiblemente ya no estaba en la lista de tareas)." });
        }

        res.json({ message: "Trato movido a clientes ganados exitosamente", deal: updatedTask });
    } catch (err) {
        console.error("❌ Error al mover a ganados:", err);
        res.status(500).json({ error: "Error al mover el trato a ganados." });
    }
});

// --------------------------------------------------------
// --- ENDPOINTS DE AUTOMATION (CRUD) ---
// --------------------------------------------------------

// POST /api/crm/automation - Crear nueva automatización
router.post("/automation", async (req, res) => {
    try {
        const newAutomation = {
            id: Date.now(),
            ...req.body,
            active: true,
        };

        await req.db.collection(CRM_COLLECTION).updateOne(
            { _id: CRM_STATE_ID },
            { $push: { automations: newAutomation } }
        );

        res.status(201).json({ message: "Automatización creada", rule: newAutomation });
    } catch (err) {
        console.error("❌ Error al crear automatización:", err);
        res.status(500).json({ error: "Error al crear la regla." });
    }
});

// PUT /api/crm/automation/:autoId - Actualizar regla de automatización
router.put("/automation/:autoId", async (req, res) => {
    try {
        const { autoId } = req.params;
        const updates = req.body;
        const autoIdNum = Number(autoId);

        const setUpdates = {};
        for (const key in updates) {
            setUpdates[`automations.$.${key}`] = updates[key];
        }
        
        const result = await req.db.collection(CRM_COLLECTION).updateOne(
            { _id: CRM_STATE_ID, "automations.id": autoIdNum },
            { $set: setUpdates }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Regla de automatización no encontrada" });
        }

        res.json({ message: "Regla actualizada", modifiedCount: result.modifiedCount });
    } catch (err) {
        console.error("❌ Error al actualizar automatización:", err);
        res.status(500).json({ error: "Error al actualizar la regla." });
    }
});

// PUT /api/crm/automation/toggle/:autoId - Alternar estado de automatización
router.put("/automation/toggle/:autoId", async (req, res) => {
    try {
        const { autoId } = req.params;
        const autoIdNum = Number(autoId);
        const { active } = req.body;

        const result = await req.db.collection(CRM_COLLECTION).updateOne(
            { _id: CRM_STATE_ID, "automations.id": autoIdNum },
            { $set: { "automations.$.active": active } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Regla de automatización no encontrada" });
        }

        res.json({ message: `Regla ${active ? 'activada' : 'desactivada'}`, modifiedCount: result.modifiedCount });
    } catch (err) {
        console.error("❌ Error al alternar automatización:", err);
        res.status(500).json({ error: "Error al alternar el estado de la regla." });
    }
});


// DELETE /api/crm/automation/:autoId - Eliminar regla de automatización
router.delete("/automation/:autoId", async (req, res) => {
    try {
        const { autoId } = req.params;
        const autoIdNum = Number(autoId);

        const result = await req.db.collection(CRM_COLLECTION).updateOne(
            { _id: CRM_STATE_ID },
            { $pull: { automations: { id: autoIdNum } } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: "Regla de automatización no encontrada" });
        }

        res.json({ message: "Regla de automatización eliminada" });
    } catch (err) {
        console.error("❌ Error al eliminar automatización:", err);
        res.status(500).json({ error: "Error al eliminar la regla." });
    }
});


module.exports = router;