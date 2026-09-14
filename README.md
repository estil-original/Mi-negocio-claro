# Mi Negocio Claro

Aplicación web de análisis financiero con conexión segura a OpenAI.

## Variables de entorno
- `OPENAI_API_KEY`: clave secreta de OpenAI. Nunca ponerla en el HTML ni en GitHub.
- `OPENAI_MODEL`: `gpt-5.6-luna` por defecto.
- `PORT`: lo proporciona el hosting; localmente puede ser 3000.

## Ejecutar
```bash
npm install
npm start
```

## Despliegue
Usar un Web Service de Node/Express. En el hosting, configurar `OPENAI_API_KEY` como variable secreta.


## Supabase Auth (staging)
The browser receives only SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY from /api/config. Never place SUPABASE_SECRET_KEY in public/index.html or in the browser.

Required environment variables: SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY.
