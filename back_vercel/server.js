require('dotenv').config();
const app = require('./index');

const PORT = process.env.PORT || 3001;

try {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    }).on('error', (err) => {
        console.error("❌ Error al iniciar el servidor:", err);
    });
} catch (err) {
    console.error("❌ Excepción fatal al iniciar servidor:", err);
}
