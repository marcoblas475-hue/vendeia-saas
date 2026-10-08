/**
 * ==============================================================================
 * VENDEIA — Backend Oficial con Node.js, Express y Webhooks de Hotmart
 * ==============================================================================
 * 
 * Funcionalidades principales:
 * 1. Servidor Express (Puerto 3000 o process.env.PORT) que sirve el frontend estático.
 * 2. Base de datos persistente en formato JSON ("database.json") para usuarios y membresías PRO.
 * 3. Webhook de Hotmart ("/api/webhook/hotmart") para activar ("PURCHASE_APPROVED", etc.)
 *    y revocar ("PURCHASE_REFUNDED", etc.) licencias automáticamente.
 * 4. Consulta en tiempo real de licencias ("/api/check-license?email=...").
 * 5. Servidor robusto y optimizado para entornos de desarrollo y producción.
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'database.json');

// ==============================================================================
// 1. GESTIÓN Y PERSISTENCIA DE BASE DE DATOS LOCAL (JSON)
// ==============================================================================

/**
 * Inicializa la base de datos JSON si no existe.
 */
function initDatabase() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initialSchema = {
        meta: {
          version: '1.0.0',
          createdAt: new Date().toISOString(),
          description: 'VENDEIA Local Database - Hotmart Licenses & Users'
        },
        users: {},
        events: []
      };
      fs.writeFileSync(DB_PATH, JSON.stringify(initialSchema, null, 2), 'utf-8');
      console.log('✅ Base de datos inicializada con éxito en:', DB_PATH);
    }
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error.message);
  }
}

/**
 * Carga los datos de database.json de forma segura.
 */
function loadDatabase() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      initDatabase();
    }
    const rawData = fs.readFileSync(DB_PATH, 'utf-8');
    const parsed = JSON.parse(rawData);
    if (!parsed.users) parsed.users = [];
    if (!parsed.events) parsed.events = [];
    return parsed;
  } catch (error) {
    console.error('❌ Error al leer database.json. Creando respaldo y restaurando:', error.message);
    return { users: [], events: [] };
  }
}

/**
 * Busca un usuario por correo electrónico soportando formato Array y Objeto.
 */
function findUserByEmail(db, email) {
  if (!db || !db.users || !email) return null;
  const cleanEmail = email.toString().trim().toLowerCase();
  if (Array.isArray(db.users)) {
    return db.users.find(u => (u.email || '').toString().trim().toLowerCase() === cleanEmail) || null;
  }
  return db.users[cleanEmail] || null;
}

/**
 * Inserta o actualiza un usuario soportando formato Array y Objeto.
 */
function upsertUser(db, userData) {
  if (!db) return;
  const cleanEmail = (userData.email || '').toString().trim().toLowerCase();
  if (Array.isArray(db.users)) {
    const index = db.users.findIndex(u => (u.email || '').toString().trim().toLowerCase() === cleanEmail);
    if (index >= 0) {
      db.users[index] = { ...db.users[index], ...userData };
    } else {
      db.users.push(userData);
    }
  } else {
    if (!db.users) db.users = {};
    db.users[cleanEmail] = { ...(db.users[cleanEmail] || {}), ...userData };
  }
}

/**
 * Guarda los datos en database.json con formateo legible y operación atómica.
 */
function saveDatabase(db) {
  try {
    const tempPath = `${DB_PATH}.tmp`;
    const dataString = JSON.stringify(db, null, 2);
    fs.writeFileSync(tempPath, dataString, 'utf-8');
    fs.renameSync(tempPath, DB_PATH);
    return true;
  } catch (error) {
    console.error('❌ Error al guardar en database.json:', error.message);
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
      return true;
    } catch (fallbackError) {
      console.error('❌ Error crítico al escribir en base de datos:', fallbackError.message);
      return false;
    }
  }
}

// Inicializar la base de datos al arrancar
initDatabase();

// ==============================================================================
// 2. MIDDLEWARES GLOBALES
// ==============================================================================

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Registro de peticiones en consola para diagnóstico rápido
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  if (req.path.startsWith('/api')) {
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
  }
  next();
});

// ==============================================================================
// 3. ENDPOINTS DE LA API
// ==============================================================================

/**
 * GET /api/health
 * Diagnóstico del estado del servidor y conteo de licencias.
 */
app.get('/api/health', (req, res) => {
  try {
    const db = loadDatabase();
    const userList = Array.isArray(db.users) ? db.users : Object.values(db.users);
    const totalUsers = userList.length;
    const proUsers = userList.filter(u => u && u.isPro === true).length;

    res.json({
      status: 'online',
      service: 'VENDEIA API Engine',
      timestamp: new Date().toISOString(),
      stats: {
        totalUsers,
        proUsers,
        totalEventsLogged: (db.events || []).length
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno en health check', details: error.message });
  }
});

/**
 * GET /api/check-license?email=...
 * Consulta en tiempo real si un usuario posee membresía PRO activa.
 */
app.get('/api/check-license', (req, res) => {
  try {
    const emailParam = req.query.email;

    if (!emailParam || typeof emailParam !== 'string' || !emailParam.trim()) {
      return res.status(400).json({
        success: false,
        error: 'El parámetro "email" es obligatorio para verificar la licencia.'
      });
    }

    const email = emailParam.trim().toLowerCase();
    const db = loadDatabase();
    const user = findUserByEmail(db, email);

    if (user && user.isPro === true) {
      return res.json({
        success: true,
        email: email,
        name: user.name || 'Usuario PRO',
        isPro: true,
        plan: 'PRO',
        status: user.status || 'APPROVED',
        createdAt: user.createdAt,
        purchasedAt: user.purchasedAt || user.updatedAt || user.createdAt,
        message: 'Licencia PRO activa y verificada.'
      });
    }

    return res.json({
      success: true,
      email: email,
      isPro: false,
      plan: 'FREE',
      status: user ? user.status : 'INACTIVE',
      message: 'El usuario no tiene una membresía PRO activa.'
    });
  } catch (error) {
    console.error('❌ Error en /api/check-license:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error interno al consultar la licencia.'
    });
  }
});

/**
 * POST /api/webhook/hotmart
 * Procesa notificaciones automáticas de Hotmart (v1.0 y v2.0):
 * - PURCHASE_APPROVED / PURCHASE_COMPLETE -> Activa isPro = true
 * - PURCHASE_REFUNDED / PURCHASE_CHARGEBACK / PURCHASE_CANCELED -> isPro = false
 */
app.post('/api/webhook/hotmart', (req, res) => {
  try {
    const payload = req.body || {};
    const timestamp = new Date().toISOString();

    // 1. Verificación opcional de Token de Seguridad de Hotmart (Hottok)
    const hotmartTokenConfig = process.env.HOTMART_HOTTOK;
    const incomingToken = req.headers['x-hotmart-hottok'] || payload.hottok;

    if (hotmartTokenConfig && incomingToken && hotmartTokenConfig !== incomingToken) {
      console.warn(`⚠️ Token de Hotmart no válido recibido: ${incomingToken}`);
      return res.status(401).json({ success: false, error: 'Token de seguridad Hotmart inválido.' });
    }

    // 2. Extraer datos del evento (soporta Hotmart Webhook v2.0 y formato estándar/legacy)
    const rawEvent = (payload.event || payload.status || '').toString().trim().toUpperCase();
    
    // Extracción de datos del comprador
    const buyerEmail = (
      payload.data?.buyer?.email ||
      payload.buyer?.email ||
      payload.buyer_email ||
      payload.email ||
      ''
    ).toString().trim().toLowerCase();

    const buyerName = (
      payload.data?.buyer?.name ||
      payload.buyer?.name ||
      payload.first_name ||
      'Comprador'
    ).toString().trim();

    const transactionId = (
      payload.data?.purchase?.transaction ||
      payload.purchase?.transaction ||
      payload.transaction ||
      payload.transaction_ext ||
      `TX-${Date.now()}`
    ).toString().trim();

    const productName = (
      payload.data?.product?.name ||
      payload.product?.name ||
      payload.prod_name ||
      'VENDEIA Plan PRO'
    ).toString().trim();

    console.log(`🔔 Webhook Hotmart recibido: Evento=[${rawEvent}] | Comprador=[${buyerEmail}] | TX=[${transactionId}]`);

    if (!buyerEmail) {
      console.warn('⚠️ Webhook recibido sin dirección de correo electrónico válida.');
      return res.status(400).json({
        success: false,
        error: 'El payload del webhook no contiene un correo electrónico de comprador válido.'
      });
    }

    // 3. Determinar el estado de la licencia PRO según el tipo de evento
    const approvalEvents = [
      'PURCHASE_APPROVED',
      'PURCHASE_COMPLETE',
      'APPROVED',
      'COMPLETE',
      'COMPLETED',
      'SUBSCRIPTION_RENEWAL'
    ];

    const revocationEvents = [
      'PURCHASE_REFUNDED',
      'PURCHASE_CHARGEBACK',
      'PURCHASE_CANCELED',
      'PURCHASE_EXPIRED',
      'REFUNDED',
      'CHARGEBACK',
      'CANCELED',
      'CANCELLED',
      'EXPIRED',
      'DISPUTE'
    ];

    let newProStatus = false;
    let actionTaken = 'UNKNOWN';

    if (approvalEvents.includes(rawEvent)) {
      newProStatus = true;
      actionTaken = 'PRO_ACTIVATED';
    } else if (revocationEvents.includes(rawEvent)) {
      newProStatus = false;
      actionTaken = 'PRO_REVOKED';
    } else {
      // Evento informativo (ej. PURCHASE_OUT_OF_SHOPPING_CART, SWITCH_PLAN, etc.)
      actionTaken = 'EVENT_IGNORED';
    }

    // 4. Actualizar base de datos
    const db = loadDatabase();
    const existingUser = findUserByEmail(db, buyerEmail) || {};

    const updatedUser = {
      email: buyerEmail,
      name: buyerName || existingUser.name || 'Usuario VENDEIA',
      isPro: (actionTaken === 'EVENT_IGNORED') ? (existingUser.isPro || false) : newProStatus,
      status: rawEvent || existingUser.status || 'UNKNOWN',
      productName: productName || existingUser.productName,
      lastTransaction: transactionId || existingUser.lastTransaction,
      purchasedAt: (newProStatus ? timestamp : existingUser.purchasedAt) || timestamp,
      updatedAt: timestamp,
      history: [
        ...(existingUser.history || []),
        {
          event: rawEvent,
          action: actionTaken,
          transaction: transactionId,
          timestamp: timestamp
        }
      ]
    };

    upsertUser(db, updatedUser);

    // Registrar en el log general de eventos (manteniendo un historial máximo de 200 registros)
    db.events.unshift({
      timestamp,
      event: rawEvent,
      email: buyerEmail,
      action: actionTaken,
      transaction: transactionId
    });
    if (db.events.length > 200) {
      db.events = db.events.slice(0, 200);
    }

    const saved = saveDatabase(db);

    if (!saved) {
      throw new Error('Fallo al persistir cambios en database.json');
    }

    console.log(`✨ Licencia actualizada para [${buyerEmail}]: isPro=${updatedUser.isPro} (Acción: ${actionTaken})`);

    return res.status(200).json({
      success: true,
      message: `Webhook procesado con éxito. Estado: ${actionTaken}`,
      email: buyerEmail,
      isPro: updatedUser.isPro,
      status: updatedUser.status
    });
  } catch (error) {
    console.error('❌ Error crítico al procesar webhook de Hotmart:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Error interno al procesar el webhook.',
      details: error.message
    });
  }
});

// ==============================================================================
// 4. SERVIDOR DE ARCHIVOS ESTÁTICOS DEL FRONTEND
// ==============================================================================

// Servir la raíz del proyecto para archivos estáticos (index.html, styles.css, app.js, etc.)
app.use(express.static(__dirname, {
  extensions: ['html'],
  index: 'index.html'
}));

// Fallback para SPA: cualquier ruta GET no-API entrega el index.html principal
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(__dirname, 'index.html'));
  }
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint API no encontrado' });
  }
  next();
});

// ==============================================================================
// 5. MANEJO GLOBAL DE ERRORES
// ==============================================================================

app.use((err, req, res, next) => {
  console.error('💥 Error no controlado en Express:', err.stack || err.message);
  res.status(500).json({
    success: false,
    error: 'Error interno en el servidor Express.',
    message: err.message
  });
});

// ==============================================================================
// 6. ARRANQUE DEL SERVIDOR
// ==============================================================================

const server = app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 SERVIDOR VENDEIA EN LÍNEA: http://localhost:${PORT}`);
  console.log(`📂 Frontend Estático: ${path.join(__dirname, 'index.html')}`);
  console.log(`💾 Base de Datos:     ${DB_PATH}`);
  console.log(`🔔 Webhook Hotmart:   http://localhost:${PORT}/api/webhook/hotmart`);
  console.log(`🔍 Chequeo Licencia:  http://localhost:${PORT}/api/check-license?email=usuario@ejemplo.com`);
  console.log('====================================================');
});

module.exports = { app, server };
