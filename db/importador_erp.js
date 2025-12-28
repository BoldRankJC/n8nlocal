const { MongoClient } = require('mongodb');

async function verificarDatos() {
    const uri = 'mongodb://root:example@localhost:27017/crm?authSource=admin';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('crm');

        console.log('🔍 VERIFICANDO DATOS EN MONGODB\n');

        // Verificar ambas colecciones
        const colecciones = await db.listCollections().toArray();

        console.log('📊 ESTADO ACTUAL:');
        console.log('='.repeat(50));

        for (const col of colecciones) {
            const collection = db.collection(col.name);
            const count = await collection.countDocuments();

            console.log(`\n📂 COLECCIÓN: ${col.name.toUpperCase()}`);
            console.log(`   📄 Total documentos: ${count}`);

            if (count > 0) {
                const sample = await collection.findOne();

                if (col.name === 'crm' && sample) {
                    console.log(`   🎯 Tareas: ${sample.tasks?.length || 0}`);
                    console.log(`   💰 Negocios ganados: ${sample.wonDeals?.length || 0}`);
                    console.log(`   📞 Contactos: ${sample.contacts?.length || 0}`);
                } else if (col.name === 'erp' && sample) {
                    console.log(`   🏢 Sistema: ${sample.sistema || 'N/A'}`);
                    console.log(`   🔢 Versión: ${sample.version || 'N/A'}`);
                    console.log(`   👥 Clientes: ${sample.clientes?.length || 0}`);
                    console.log(`   📦 Productos: ${sample.productos?.length || 0}`);
                    console.log(`   ⚙️  Módulos: ${sample.modulos?.length || 0}`);
                }
            }
        }

        console.log('\n✅ Verificación completada');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.close();
    }
}

verificarDatos();