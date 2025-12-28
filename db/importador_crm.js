const { MongoClient } = require('mongodb');
const fs = require('fs');

async function importarCRMCompleto() {
    const uri = 'mongodb://root:example@localhost:27017/crm?authSource=admin';
    const archivoCRM = 'crm_data.json';

    console.log('🚀 IMPORTACIÓN COMPLETA DE CRM\n');

    const client = new MongoClient(uri);

    try {
        // 1. Conectar
        await client.connect();
        console.log('✅ Conectado a MongoDB');

        const db = client.db('crm');

        // 2. Verificar archivo
        if (!fs.existsSync(archivoCRM)) {
            console.error(`❌ Archivo ${archivoCRM} no encontrado`);
            return;
        }

        console.log(`📂 Leyendo archivo: ${archivoCRM}`);

        // 3. Leer y mostrar estadísticas del archivo
        const jsonData = fs.readFileSync(archivoCRM, 'utf8');
        const datosCRM = JSON.parse(jsonData);

        console.log('\n📊 ESTADÍSTICAS DEL ARCHIVO CRM:');
        console.log('='.repeat(40));
        console.log(`🎯 Tareas: ${datosCRM.tasks?.length || 0}`);
        console.log(`💰 Negocios ganados: ${datosCRM.wonDeals?.length || 0}`);
        console.log(`📞 Contactos: ${datosCRM.contacts?.length || 0}`);
        console.log(`🤖 Automatizaciones: ${datosCRM.automations?.length || 0}`);
        console.log(`🔌 Integraciones: ${datosCRM.integrations?.length || 0}`);

        // 4. Eliminar colección existente si hay
        try {
            await db.collection('crm').drop();
            console.log('\n🗑️  Colección CRM anterior eliminada');
        } catch (err) {
            console.log('\nℹ️  Creando nueva colección CRM');
        }

        // 5. IMPORTAR COMO DOCUMENTO ÚNICO (la estructura original)
        console.log('\n⬆️  Insertando documento completo...');
        const resultado = await db.collection('crm').insertOne(datosCRM);
        console.log(`✅ Documento insertado con ID: ${resultado.insertedId}`);

        // 6. Verificar qué se insertó realmente
        console.log('\n🔍 VERIFICANDO LO INSERTADO:');
        console.log('-'.repeat(30));

        const documentoInsertado = await db.collection('crm').findOne({ _id: resultado.insertedId });

        if (documentoInsertado) {
            console.log(`📄 Campos en el documento:`);
            Object.keys(documentoInsertado).forEach(key => {
                const valor = documentoInsertado[key];
                if (Array.isArray(valor)) {
                    console.log(`   • ${key}: Array[${valor.length}]`);
                } else if (typeof valor === 'object') {
                    console.log(`   • ${key}: Object`);
                } else {
                    console.log(`   • ${key}: ${typeof valor}`);
                }
            });

            // Mostrar algunos datos de ejemplo
            console.log('\n🎯 EJEMPLOS DE DATOS:');

            if (documentoInsertado.tasks && documentoInsertado.tasks.length > 0) {
                console.log(`\n📋 PRIMERA TAREA:`);
                const primeraTarea = documentoInsertado.tasks[0];
                console.log(`   ID: ${primeraTarea.id}`);
                console.log(`   Título: ${primeraTarea.title}`);
                console.log(`   Estado: ${primeraTarea.status}`);
                console.log(`   Cliente: ${primeraTarea.client}`);
                console.log(`   Valor: $${primeraTarea.dealValue}`);
            }

            if (documentoInsertado.contacts && documentoInsertado.contacts.length > 0) {
                console.log(`\n👥 PRIMER CONTACTO:`);
                const primerContacto = documentoInsertado.contacts[0];
                console.log(`   Nombre: ${primerContacto.name}`);
                console.log(`   Empresa: ${primerContacto.company}`);
                console.log(`   Rol: ${primerContacto.role}`);
                console.log(`   Email: ${primerContacto.email}`);
            }
        }

        // 7. Contar documentos totales
        const total = await db.collection('crm').countDocuments();
        console.log(`\n📈 Total documentos en colección 'crm': ${total}`);

        console.log('\n🎉 IMPORTACIÓN CRM COMPLETADA!');

    } catch (error) {
        console.error('\n❌ Error:', error.message);

        // Diagnóstico de errores comunes
        if (error.message.includes('JSON')) {
            console.error('\n📄 Error en el archivo JSON. Verifica:');
            console.error('   1. Que el archivo no esté corrupto');
            console.error('   2. Que tenga formato JSON válido');
            console.error('   3. Que no tenga comas extras al final de arrays/objetos');

            // Mostrar las primeras líneas para debug
            try {
                const lineas = fs.readFileSync(archivoCRM, 'utf8').split('\n');
                console.error('\nPrimeras 5 líneas del archivo:');
                lineas.slice(0, 5).forEach((linea, i) => {
                    console.error(`   ${i + 1}: ${linea}`);
                });
            } catch (e) {
                console.error('No se pudo leer el archivo para diagnóstico');
            }
        }

    } finally {
        await client.close();
        console.log('\n🔌 Conexión cerrada');
    }
}

importarCRMCompleto();