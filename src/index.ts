import express from 'express';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { db, insertMassiveUrl, getTargetUrl, cleanupExpired } from './db';
import { generateMassiveHash, formatUrl } from './generator';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Limitador de peticiones (Rate Limit) para evitar spam de bots
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 30, // Limita a 30 peticiones por IP cada 15 minutos
  message: { error: 'Demasiadas peticiones desde esta IP. Por favor, intenta de nuevo en 15 minutos.' },
  standardHeaders: true, // Devuelve información en los headers `RateLimit-*`
  legacyHeaders: false, // Deshabilita los headers obsoletos `X-RateLimit-*`
});

// Limpieza diaria de registros de más de 30 días
setInterval(() => {
  cleanupExpired.run();
  console.log('Cleanup: Registros expirados eliminados');
}, 24 * 60 * 60 * 1000);

// API Endpoint para "alargar" la URL (con Rate Limit aplicado)
app.post('/api/lengthen', apiLimiter, (req, res) => {
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
