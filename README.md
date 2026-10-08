# VENDEIA — Asistente de Ventas con IA

**VENDEIA** es una aplicación SaaS profesional diseñada para emprendedores, pequeños negocios, creadores y vendedores independientes. Transforma la descripción de cualquier producto o servicio en una estrategia comercial completa: publicaciones para redes sociales, guiones especializados para WhatsApp, ofertas irresistibles de 3 niveles y seguimiento de clientes con IA.

---

## 🚀 Características Principales

1. **Diseño SaaS Moderno & Premium**
   - Inspirado en la claridad visual de productos como Stripe, Linear y Notion.
   - Paleta de diseño: Fondo `#F8FAFC`, Texto `#111827`, Azul principal `#2563EB`, Violeta secundario `#4F46E5`, Verde `#16A34A`, Naranja `#F59E0B`, Rojo `#DC2626`.
   - Soporte nativo para **Modo Claro y Modo Oscuro** con guardado persistente.
   - 100% responsivo (móvil, tablet, laptop y monitor grande) sin desplazamiento horizontal.

2. **Landing Page Comercial**
   - Hero: *"Vende más con inteligencia artificial."*
   - Subtítulo: *"Describe lo que vendes y VENDEIA crea publicaciones, ofertas, mensajes y contenido listo para ayudarte a conseguir clientes."*
   - Botones *"Crear mi contenido"* y *"Ver cómo funciona"*.
   - Presentación de características, casos de uso, comparativa de planes y CTA final.

3. **Generador Principal ("¿Qué estás vendiendo?")**
   - Formulario completo con: Nombre, Descripción, Precio, Moneda, Público objetivo, Cobertura geográfica, Características, Beneficios, Problema que resuelve, Diferenciador competitivo, Tono y Plataforma.
   - Botones para cargar plantillas de prueba rápida en un clic (Repostería, Servicios, Café artesanal).
   - Selector para cargar datos directamente desde productos guardados en el catálogo.
   - Pantalla de carga profesional con 3 pasos animados del motor de persuasión comercial.

4. **Dashboard de Resultados con Pestañas**
   - 📝 **PUBLICACIÓN:** Título sugerido, gancho (hook), descripción, beneficios con viñetas, llamada a la acción (CTA) y hashtags. Modos de **Copiar**, **Regenerar** y **Edición inline**.
   - 💬 **WHATSAPP:** 6 guiones listos (Primer mensaje, Respuesta a interesado, Respuesta a "¿cuánto cuesta?", Respuesta a "lo voy a pensar", Seguimiento oportuno, Cierre de venta) con botones para copiar y abrir directamente en **WhatsApp Web**.
   - 📱 **ESTADO DE WHATSAPP:** Texto corto, natural y magnético para estados de 24 horas.
   - 📘 **FACEBOOK:** Post adaptado con saltos de línea y emojis optimizados para grupos y páginas.
   - 📸 **INSTAGRAM:** Caption con espaciado limpio, CTA y hashtags segmentados.
   - 🎬 **TIKTOK / REELS:** Hook inicial (0-3 seg), guion narrado, desglose de escenas (visual y audio), texto en pantalla y CTA.
   - 🎁 **OFERTA ÉTICA:** Oferta central, beneficio, bonificación (bonus), urgencia real justificada (sin falsa escasez ni falsas cuentas regresivas) y CTA.

5. **Analizador de Producto ("Analiza mi producto")**
   - Evaluación multidimensional: Claridad, Público objetivo, Propuesta de valor, Beneficios, Diferenciación, Percepción de precio y Calidad del mensaje comercial.
   - Puntuación visual global (0 a 100), consejos sobre el precio real fijado, fortalezas detectadas y recomendaciones accionables.
   - Descargo de responsabilidad explícito: la puntuación es analítica y no garantiza ventas.

6. **Generador de Ofertas Multinivel**
   - Entradas: Producto, Precio, Costo aproximado y Objetivo comercial.
   - Genera 3 niveles estratégicos: **Oferta Básica**, **Oferta Recomendada (Pack de Alto Valor)** y **Oferta Premium (VIP)**.
   - No altera automáticamente el precio real del usuario.

7. **Generador de Conceptos Visuales para Publicidad**
   - Generación de conceptos publicitarios por estilo, formato (1:1, 9:16, 16:9), plataforma y público.
   - Prompts hiper-detallados en inglés y español optimizados para Midjourney, DALL-E 3 e Imagen.
   - Aviso transparente: *"Generación de imágenes pendiente de configuración"*. Cero imágenes simuladas o falsas.

8. **CRM Simple de Clientes**
   - Campos: Nombre, Contacto (Teléfono/Email), Producto de interés, Estado (Nuevo, Interesado, En conversación, Oferta enviada, Cliente, No respondió), Fecha y Notas.
   - Buscador en tiempo real y filtro por estado.
   - Acciones de creación, edición, borrado y enlace directo a WhatsApp.

9. **Seguimiento con IA por Situación**
   - Genera mensajes breves, empáticos y no invasivos para: *No respondió*, *Mostró interés*, *Preguntó precio*, *Recibió oferta*, *Dijo que lo pensaría* y *Compró*.
   - Consejo de psicología comercial para cada situación.
   - Compromiso de privacidad: ningún mensaje se envía automáticamente sin consentimiento y revisión del usuario.

10. **Panel Principal (Dashboard)**
    - Saludo adaptativo según la hora: *"Buenos días 👋 / Buenas tardes / Buenas noches"*.
    - Métricas en vivo: Productos creados, Contenidos generados, Clientes registrados, Conversaciones activas y Ofertas preparadas.
    - Accesos rápidos: *"Crear contenido"*, *"Nuevo producto"*, *"Nuevo cliente"*, *"Generar oferta"*.
    - Actividad reciente con acceso directo.

11. **Catálogo de Productos**
    - CRUD completo: Crear, Editar, Duplicar, Eliminar y Buscar.
    - Botón directo: *"Crear contenido para este producto"* (precarga los datos en el generador).

12. **Historial y Favoritos**
    - Registro de todas las generaciones con filtros por texto y fecha.
    - Modal de visualización detallada.
    - Sección *"Mis Favoritos"* para guardar los mejores copys con un clic en la estrella ⭐.

13. **Exportación Real**
    - Copiado al portapapeles con confirmación visual Toast.
    - Descarga de archivo **TXT** formateado.
    - Descarga de **PDF profesional** real generado mediante `jsPDF` con estilos de marca.
    - Compartir nativo mediante la API Web Share (`navigator.share`).

14. **Arquitectura de Monetización (Free vs Pro)**
    - Límites de uso visibles en el perfil.
    - Modal *"PRO — Próximamente"* con comparativa de planes y lista de espera prioritaria.
    - Sin pasarelas de pago simuladas ni cobros ficticios.

15. **Seguridad y Estado de Configuración**
    - Todas las llamadas a IA y servicios externos se realizan desde rutas backend `/api/*`.
    - Cero exposición de claves en el frontend.
    - Modal interactivo de **Estado de Configuración** para auditar en tiempo real qué variables de entorno están activas.

---

## 🛠️ Variables de Entorno

El archivo `.env.example` contiene las variables requeridas por la aplicación:

```env
# 1. Motor de IA (Google Gemini, OpenAI o Anthropic)
AI_API_KEY=

# 2. Base de datos centralizada (PostgreSQL, Supabase, Neon)
DATABASE_URL=

# 3. Autenticación y firmas de sesión (JWT)
AUTH_SECRET=

# 4. Pasarela de Pagos (Stripe / LemonSqueezy)
PAYMENT_PUBLIC_KEY=
PAYMENT_SECRET_KEY=
PAYMENT_WEBHOOK_SECRET=

# 5. Generador de imágenes directo (opcional)
IMAGE_API_KEY=
```

> **Nota:** Si las variables están vacías, VENDEIA funciona de manera predeterminada en **Modo Demostración Controlado** con su motor de plantillas de ventas estratégicas, mostrando claramente los avisos de *"Pendiente de configuración"* según las directrices de seguridad.

---

## 💻 Cómo Ejecutar y Probar VENDEIA

1. **Instalar dependencias** (si no se han instalado):
   ```bash
   npm install
   ```

2. **Modo Desarrollo**:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

3. **Modo Producción**:
   ```bash
   npm run build
   npm start
   ```

---

## 🔍 SEO & Accesibilidad

- Título: `VENDEIA — Asistente de Ventas con IA`
- Descripción: `Crea publicaciones, ofertas, mensajes y contenido de ventas con inteligencia artificial.`
- Soporte para etiquetas Open Graph y Twitter Cards.
- `robots.txt` y `sitemap.xml` optimizados en la raíz pública.
- Favicon SVG moderno (`/favicon.svg`).
