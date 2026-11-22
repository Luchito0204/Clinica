const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware para servir archivos estáticos y leer JSON
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Endpoint puente (opcional) o simulación de respuesta si el backend Java está apagado
app.get('/api/status', (req, res) => {
    res.json({
        sistema: 'ProyectoClinica',
        frontend: 'Node.js + Express (Activo)',
        backendEsperado: 'http://localhost:8080'
    });
});

app.listen(PORT, () => {
    console.log(`Frontend de ProyectoClinica corriendo en http://localhost:${PORT}`);
});