// --- server.js ---
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// --- Middlewares ---
// Habilita CORS para permitir que tu frontend consulte este servidor.
app.use(cors());
// Sirve los archivos estáticos (HTML, CSS, JS del cliente) desde la carpeta 'public'.
app.use(express.static(path.join(__dirname, 'public')));

// --- Endpoint de la API ---
// La calculadora llamará a esta ruta para obtener los datos actualizados.
app.get('/api/cotizaciones', async (req, res) => {
    console.log('Petición recibida para /api/cotizaciones');
    try {
        // 1. El servidor visita la página del BCRA.
        const { data } = await axios.get('https://www.bcra.gob.ar/', {
            headers: { 'User-Agent': 'Mozilla/5.0' } // Simular un navegador para evitar bloqueos.
        });

        // 2. Cheerio carga el HTML para poder analizarlo.
        const $ = cheerio.load(data);
        
        // 3. Se extraen los textos usando los selectores específicos del sitio del BCRA.
        // Se busca el contenedor del Dólar, y dentro, el párrafo con la clase h3.
        const dolarText = $('div.bg-BCRA-2-A p.h3').first().text().trim();
        // Se busca el contenedor de la UVA, y dentro, el párrafo con la clase h3.
        const uvaText = $('div.bg-BCRA-2-B p.h3').first().text().trim();

        // 4. Se limpian los textos para convertirlos a números válidos.
        // El formato es "1.305,50", se quita el punto de miles y se cambia la coma decimal.
        const parseValue = (text) => parseFloat(text.replace(/\./g, '').replace(',', '.'));

        const valorDolar = parseValue(dolarText);
        const valorUVA = parseValue(uvaText);

        if (isNaN(valorDolar) || isNaN(valorUVA)) {
            throw new Error('No se pudo parsear uno de los valores.');
        }

        // 5. El servidor responde con los datos limpios en formato JSON.
        res.json({
            tipoCambioSugerido: valorDolar,
            valorUVASugerido: valorUVA
        });

    } catch (error) {
        console.error('Error al obtener datos del BCRA:', error.message);
        res.status(500).json({ error: 'No se pudieron obtener los datos actualizados del BCRA.' });
    }
});

// El servidor se pone en marcha.
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log('La calculadora está disponible en esa dirección.');
});