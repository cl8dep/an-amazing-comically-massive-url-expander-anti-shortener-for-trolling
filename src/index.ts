import express from 'express';
import path from 'path';
import { db, insertMassiveUrl, getTargetUrl, cleanupExpired } from './db';
import { generateMassiveHash, formatUrl } from './generator';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Limpieza diaria de registros de más de 30 días
setInterval(() => {
  cleanupExpired.run();
  console.log('Cleanup: Registros expirados eliminados');
}, 24 * 60 * 60 * 1000);

// API Endpoint para "alargar" la URL
app.post('/api/lengthen', (req, res) => {
  const { url } = req.body;
  
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Debes proporcionar una URL válida' });
  }

  try {
    const targetUrl = formatUrl(url);
    const massiveId = generateMassiveHash();

    insertMassiveUrl.run({
      id: massiveId,
      target_url: targetUrl
    });

    res.json({ id: massiveId, target_url: targetUrl });
  } catch (error) {
    res.status(500).json({ error: 'Error al generar la URL inmensa' });
  }
});

// Endpoint principal para redirigir (El Anti-Acortador en acción)
app.get('/:id', (req, res) => {
  // Ignorar peticiones a archivos estáticos que no existen (favicon, etc)
  if (req.params.id === 'favicon.ico') return res.status(404).end();

  const record = getTargetUrl.get(req.params.id) as { target_url: string } | undefined;
  
  if (!record) {
    return res.status(404).send(`
      <h1 style="font-family: sans-serif; text-align: center; margin-top: 50px;">
        Esta URL gigante no existe o ya caducó (duran 30 días).
      </h1>
    `);
  }
  
  // Redirigir al destino original (302 Found temporal)
  res.redirect(record.target_url);
});

process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Anti-Acortador corriendo en el puerto ${PORT}`);
});
