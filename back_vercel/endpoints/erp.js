const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

// --------------------------------------------------------
// --- MOCK/DEFAULT DATA SETUP (Para la primera carga) ---
// --------------------------------------------------------

const DEFAULT_ERP_DATA = {
    // Pipeline (Tasks)
    tasks: [
        {
            id: '1', title: 'Implementación ERP Inicial', description: 'Configuración inicial del sistema ERP.',
            status: 'IN_PROGRESS', priority: 'HIGH', assignee: 'Admin', dueDate: '30 Mar', tags: ['Configuración'],
            client: 'Interno', dealValue: 0,
            score: 0,
            comments: []
        }
    ],
    // Won Deals (Proyectos completados en contexto ERP?? O simplemente mantenemos estructura)
    wonDeals: [],
    // Contacts
    contacts: [],
    // Automations
    automations: [
        { id: 1, name: 'Alerta de Inventario', trigger: 'Stock bajo 10', action: 'Notificar Compras', active: true, icon: 'AlertCircle' },
    ],
    // Integrations
    integrations: [
        { id: 1, name: 'Google Workspace', desc: 'Sincroniza emails y calendario.', connected: true, icon: 'Mail', color: 'text-red-500 bg-red-50 dark:bg-red-900/20' },
    ],
};

// Colección centralizada para el estado del ERP
const ERP_COLLECTION = "erp_state";
const ERP_STATE_ID = "erp_boosted_main";

// --------------------------------------------------------
// --- ENDPOINTS CORE DEL ERP ---
// --------------------------------------------------------

// GET /api/erp - Obtener todo el estado del ERP
router.get("/", async (req, res) => {
    try {
        const erpState = await req.db.collection(ERP_COLLECTION).findOne({ _id: ERP_STATE_ID });

        if (!erpState) {
            // Inicializar si no existe
            await req.db.collection(ERP_COLLECTION).insertOne({ _id: ERP_STATE_ID, ...DEFAULT_ERP_DATA });
            return res.json(DEFAULT_ERP_DATA);
        }

        const { _id, ...data } = erpState;
        res.json(data);
    } catch (err) {
        console.error("❌ Error al obtener el estado del ERP:", err);
        res.status(500).json({ error: "Error interno al cargar datos del ERP." });
    }
});

// POST /api/erp - Crear un nuevo trato/tarea
router.post("/", async (req, res) => {
    try {
        const newDeal = {
            id: Date.now().toString(),
            ...req.body,
        };

        const result = await req.db.collection(ERP_COLLECTION).updateOne(
            { _id: ERP_STATE_ID },
            { $push: { tasks: newDeal } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Estado del ERP no encontrado" });
        }

        res.status(201).json({ message: "Item creado exitosamente", deal: newDeal });
    } catch (err) {
        console.error("❌ Error al crear item en ERP:", err);
        res.status(500).json({ error: "Error al crear el item." });
    }
});

// PUT /api/erp/:taskId - Actualizar propiedades
router.put("/:taskId", async (req, res) => {
    try {
        const { taskId } = req.params;
        const updates = req.body;

        if (updates.comments) {
            updates["tasks.$.comments"] = updates.comments;
            delete updates.comments;
        }

        const setUpdates = {};
        for (const key in updates) {
            setUpdates[`tasks.$.${key}`] = updates[key];
        }

        const result = await req.db.collection(ERP_COLLECTION).updateOne(
            { _id: ERP_STATE_ID, "tasks.id": taskId },
            { $set: setUpdates }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Item no encontrado" });
        }

        res.json({ message: "Item actualizado exitosamente", modifiedCount: result.modifiedCount });
    } catch (err) {
        console.error("❌ Error al actualizar item:", err);
        res.status(500).json({ error: "Error al actualizar el item." });
    }
});

// PUT /api/erp/won/:taskId - Mover a completado/ganado
router.put("/won/:taskId", async (req, res) => {
    try {
        const { taskId } = req.params;
        const erpState = await req.db.collection(ERP_COLLECTION).findOne({ _id: ERP_STATE_ID });

        if (!erpState) return res.status(404).json({ error: "Estado del ERP no encontrado" });

        const taskToMove = erpState.tasks.find(t => t.id === taskId);
        if (!taskToMove) return res.status(404).json({ error: "Item no encontrado en tasks" });

        const updatedTask = { ...taskToMove, status: 'DONE', score: 100, closedDate: new Date().toISOString() };

        const result = await req.db.collection(ERP_COLLECTION).updateOne(
            { _id: ERP_STATE_ID },
            {
                $pull: { tasks: { id: taskId } },
                $push: { wonDeals: updatedTask }
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({ error: "Error al mover el item." });
        }

        res.json({ message: "Item movido exitosamente", deal: updatedTask });
    } catch (err) {
        console.error("❌ Error al mover item:", err);
        res.status(500).json({ error: "Error al mover el item." });
    }
});

// --------------------------------------------------------
// --- ENDPOINTS DE AUTOMATION (CRUD) ---
// --------------------------------------------------------

router.post("/automation", async (req, res) => {
    try {
        const newAutomation = {
            id: Date.now(),
            ...req.body,
            active: true,
        };

        await req.db.collection(ERP_COLLECTION).updateOne(
            { _id: ERP_STATE_ID },
            { $push: { automations: newAutomation } }
        );

        res.status(201).json({ message: "Automatización creada", rule: newAutomation });
    } catch (err) {
        console.error("❌ Error al crear automatización:", err);
        res.status(500).json({ error: "Error al crear la regla." });
    }
});

router.put("/automation/:autoId", async (req, res) => {
    try {
        const { autoId } = req.params;
        const updates = req.body;
        const autoIdNum = Number(autoId);

        const setUpdates = {};
        for (const key in updates) {
            setUpdates[`automations.$.${key}`] = updates[key];
        }

        const result = await req.db.collection(ERP_COLLECTION).updateOne(
            { _id: ERP_STATE_ID, "automations.id": autoIdNum },
            { $set: setUpdates }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Regla no encontrada" });
        }

        res.json({ message: "Regla actualizada", modifiedCount: result.modifiedCount });
    } catch (err) {
        console.error("❌ Error al actualizar automatización:", err);
        res.status(500).json({ error: "Error al actualizar la regla." });
    }
});

router.put("/automation/toggle/:autoId", async (req, res) => {
    try {
        const { autoId } = req.params;
        const autoIdNum = Number(autoId);
        const { active } = req.body;

        const result = await req.db.collection(ERP_COLLECTION).updateOne(
            { _id: ERP_STATE_ID, "automations.id": autoIdNum },
            { $set: { "automations.$.active": active } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Regla no encontrada" });
        }

        res.json({ message: `Regla ${active ? 'activada' : 'desactivada'}`, modifiedCount: result.modifiedCount });
    } catch (err) {
        console.error("❌ Error al alternar automatización:", err);
        res.status(500).json({ error: "Error al alternar el estado de la regla." });
    }
});

router.delete("/automation/:autoId", async (req, res) => {
    try {
        const { autoId } = req.params;
        const autoIdNum = Number(autoId);

        const result = await req.db.collection(ERP_COLLECTION).updateOne(
            { _id: ERP_STATE_ID },
            { $pull: { automations: { id: autoIdNum } } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: "Regla no encontrada" });
        }

        res.json({ message: "Regla eliminada" });
    } catch (err) {
        console.error("❌ Error al eliminar automatización:", err);
        res.status(500).json({ error: "Error al eliminar la regla." });
    }
});

module.exports = router;
