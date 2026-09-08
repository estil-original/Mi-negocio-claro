import express from 'express';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = Number(process.env.PORT) || 3000;
const host = '0.0.0.0';
const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const model = process.env.OPENAI_MODEL || 'gpt-5.6-luna';

app.disable('x-powered-by');
app.use(express.json({ limit: '32kb' }));
app.use(express.static(path.join(__dirname, 'public')));

const SYSTEM_PROMPT = `
Eres la analista financiera de Mi Negocio Claro.
Hablas como un analista financiero que se sienta al lado del emprendedor y le explica sus números de manera sencilla, clara y cercana.
No hables como contador ni uses jerga innecesaria. Nunca juzgues al emprendedor.

REGLAS:
1. Explica primero qué está pasando con sus números.
2. Después explica por qué importa.
3. Luego da recomendaciones prácticas y priorizadas.
4. Sé realista: no prometas resultados ni inventes datos.
5. Si falta información importante, dilo y pide solo lo necesario.
6. Para publicidad/marketing considera especialmente tipo de negocio, online o local, ubicación de clientes y presupuesto si está disponible.
7. Usa únicamente los datos entregados; no inventes cifras.
8. Responde siempre en español.
9. Sé breve pero útil: normalmente 3 a 6 párrafos o viñetas.
`;

function text(value, fallback = '') {
  return typeof value === 'string' ? value.trim().slice(0, 1000) : fallback;
}
function num(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

app.get('/health', (_req, res) => {
  res.json({ ok: true, aiConfigured: Boolean(client), model });
});

app.post('/api/ask', async (req, res) => {
  try {
    if (!client) return res.status(503).json({ error: 'La IA todavía no está configurada en el servidor.' });

    const { question, business, country, currency, sales, costs, expenses, profit, margin, goal } = req.body || {};
    if (!text(question) || text(question).length < 2) return res.status(400).json({ error: 'Escribe una pregunta.' });

    const payload = {
      negocio: text(business),
      pais: text(country),
      moneda: text(currency),
      ventas: num(sales),
      costos: num(costs),
      gastos: num(expenses),
      ganancia_estimada: num(profit),
      margen: num(margin),
      meta_ganancia: num(goal),
      pregunta: text(question)
    };

    const response = await client.responses.create({
      model,
      instructions: SYSTEM_PROMPT,
      input: JSON.stringify(payload)
    });

    res.json({ answer: response.output_text || 'No pude generar una respuesta en este momento.' });
  } catch (error) {
    console.error('OpenAI error:', error?.message || error);
    res.status(500).json({ error: 'No pude conectar con la IA en este momento. Revisa la configuración del servidor.' });
  }
});

app.use((_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, host, () => console.log(`Mi Negocio Claro escuchando en ${host}:${port}`));
