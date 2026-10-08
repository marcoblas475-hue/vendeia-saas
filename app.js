/**
 * VENDEIA / COBRAIA — Asistente de Ventas con IA
 * Versión Autónoma Standalone para Google Chrome (Sin dependencias de Node.js ni localhost).
 * Funciona al abrir directamente index.html con doble clic.
 */

// ==========================================================================
// 1. ALMACENAMIENTO LOCAL (localStorage) Y DATOS INICIALES
// ==========================================================================

const DEFAULT_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Curso Online de Repostería Artesanal',
    description: 'Aprende repostería desde cero y crea tu propio negocio de pasteles creativos desde casa.',
    price: 49,
    currency: 'USD',
    category: 'Cursos & Educación',
    targetAudience: 'Emprendedoras y amantes de la cocina de 22 a 45 años',
    cityCountry: 'Latinoamérica y España',
    features: '30 lecciones en video HD, recetario descargable en PDF, soporte en comunidad privada',
    benefits: 'Aprender técnicas profesionales sin gastar miles de dólares, generar ingresos vendiendo postres',
    problemSolved: 'Frustración por recetas que no salen bien y falta de conocimientos para calcular costos y vender',
    differentiator: 'Enfoque práctico con cálculo real de costos por porción y plantillas de cotización para clientes',
    tone: 'persuasivo',
    platform: 'instagram',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-2',
    name: 'Servicio de Consultoría Fiscal para Freelancers',
    description: 'Planificación fiscal estratégica y presentación de impuestos sin estrés para trabajadores independientes.',
    price: 85,
    currency: 'USD',
    category: 'Servicios Profesionales',
    targetAudience: 'Diseñadores, desarrolladores y redactores remotos que facturan al extranjero',
    cityCountry: 'México y Colombia',
    features: 'Revisión mensual de facturación, optimización de deducciones legales, respuesta en menos de 24h por WhatsApp',
    benefits: 'Tranquilidad total frente a la entidad tributaria y ahorro legítimo en pago de impuestos',
    problemSolved: 'Miedo a sanciones fiscales y desorden con declaraciones periódicas',
    differentiator: 'Especialistas en ingresos digitales internacionales y plataformas remotas',
    tone: 'profesional',
    platform: 'whatsapp',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-3',
    name: 'Café de Especialidad Orgánico de Altura (500g)',
    description: 'Granos selectos cultivados a 1,800 metros, tostado medio artesanal con notas a cacao y caramelo.',
    price: 18,
    currency: 'USD',
    category: 'Alimentos & Gourmet',
    targetAudience: 'Amantes del buen café que trabajan desde casa o aprecian experiencias gastronómicas',
    cityCountry: 'Nacional',
    features: 'Tostado reciente en lote pequeño, origen trazable de pequeños productores, empaque con válvula desgasificadora',
    benefits: 'Sabor limpio y aromático superior al café comercial, sin acidez molesta',
    problemSolved: 'Café comercial quemado y de baja calidad que amarga el inicio del día',
    differentiator: 'Comercio justo directo con familias caficultoras y fecha de tueste visible en cada bolsa',
    tone: 'amigable',
    platform: 'facebook',
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_CLIENTS = [
  {
    id: 'cli-1',
    name: 'Carolina Méndez',
    contact: '+52 55 1234 5678',
    product: 'Curso Online de Repostería Artesanal',
    status: 'Interesado',
    date: '2026-10-06',
    notes: 'Preguntó si las clases son en vivo o grabadas. Quiere emprender para diciembre.'
  },
  {
    id: 'cli-2',
    name: 'Mateo Vargas',
    contact: 'mateo.dev@gmail.com',
    product: 'Servicio de Consultoría Fiscal para Freelancers',
    status: 'En conversación',
    date: '2026-10-05',
    notes: 'Factura para clientes en EE.UU. Quiere plan semestral.'
  },
  {
    id: 'cli-3',
    name: 'Lucía Fernández',
    contact: '+57 310 987 6543',
    product: 'Café de Especialidad Orgánico de Altura (500g)',
    status: 'Cliente',
    date: '2026-10-04',
    notes: 'Compró 3 paquetes. Le encantó la muestra de tueste medio.'
  },
  {
    id: 'cli-4',
    name: 'Roberto Gómez',
    contact: '+54 9 11 4455 6677',
    product: 'Curso Online de Repostería Artesanal',
    status: 'No respondió',
    date: '2026-10-03',
    notes: 'Pidió precio hace 3 días por WhatsApp y no leyó el último mensaje.'
  }
];

// Helpers para localStorage seguro
function getLocal(key, defaultVal) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    console.warn(`Error reading localStorage [${key}]:`, e);
    return defaultVal;
  }
}

function setLocal(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn(`Error saving localStorage [${key}]:`, e);
  }
}
/**
 * Actualiza en tiempo real el elemento #user-profile-count en la interfaz gráfica.
 */
function updateProfileCountUI(user) {
  try {
    const u = user || Storage.getUser();
    const countEl = document.getElementById('user-profile-count');
    if (countEl) {
      const isPro = u.isPro === true || u.plan === 'PRO' || localStorage.getItem('vendeia_is_pro') === 'true';
      const count = parseInt(u.generationsCount, 10) || 0;
      countEl.innerText = isPro ? `${count} / Ilimitadas` : `${count} / ${u.maxGenerationsDaily || 5}`;
    }
  } catch (e) {
    console.error('Error al actualizar contador visual de perfil:', e);
  }
}

// Repositorios
const Storage = {
  getProducts() {
    let prods = getLocal('vendeia_products', null);
    if (!prods || prods.length === 0) {
      prods = DEFAULT_PRODUCTS;
      setLocal('vendeia_products', prods);
    }
    return prods;
  },
  saveProduct(prod) {
    const prods = this.getProducts();
    if (prod.id) {
      const idx = prods.findIndex(p => p.id === prod.id);
      if (idx !== -1) {
        prods[idx] = { ...prods[idx], ...prod };
        setLocal('vendeia_products', prods);
        return prods[idx];
      }
    }
    const newP = { ...prod, id: `prod-${Date.now()}`, createdAt: new Date().toISOString() };
    prods.unshift(newP);
    setLocal('vendeia_products', prods);
    return newP;
  },
  duplicateProduct(id) {
    const prods = this.getProducts();
    const target = prods.find(p => p.id === id);
    if (!target) return null;
    const duplicated = {
      ...target,
      id: `prod-${Date.now()}`,
      name: `${target.name} (Copia)`,
      createdAt: new Date().toISOString()
    };
    prods.unshift(duplicated);
    setLocal('vendeia_products', prods);
    return duplicated;
  },
  deleteProduct(id) {
    const prods = this.getProducts().filter(p => p.id !== id);
    setLocal('vendeia_products', prods);
  },

  getClients() {
    let clients = getLocal('vendeia_clients', null);
    if (!clients || clients.length === 0) {
      clients = DEFAULT_CLIENTS;
      setLocal('vendeia_clients', clients);
    }
    return clients;
  },
  saveClient(cli) {
    const clients = this.getClients();
    if (cli.id) {
      const idx = clients.findIndex(c => c.id === cli.id);
      if (idx !== -1) {
        clients[idx] = { ...clients[idx], ...cli };
        setLocal('vendeia_clients', clients);
        return clients[idx];
      }
    }
    const newC = { ...cli, id: `cli-${Date.now()}` };
    clients.unshift(newC);
    setLocal('vendeia_clients', clients);
    return newC;
  },
  deleteClient(id) {
    const clients = this.getClients().filter(c => c.id !== id);
    setLocal('vendeia_clients', clients);
  },

  getGenerations() {
    return getLocal('vendeia_generations', []);
  },
  saveGeneration(gen) {
    const all = this.getGenerations();
    const idx = all.findIndex(g => g.id === gen.id);
    if (idx !== -1) {
      all[idx] = gen;
    } else {
      all.unshift(gen);
    }
    setLocal('vendeia_generations', all);
  },
  toggleFavorite(id) {
    const all = this.getGenerations();
    const gen = all.find(g => g.id === id);
    if (gen) {
      gen.isFavorite = !gen.isFavorite;
      setLocal('vendeia_generations', all);
      return gen.isFavorite;
    }
    return false;
  },
  deleteGeneration(id) {
    const all = this.getGenerations().filter(g => g.id !== id);
    setLocal('vendeia_generations', all);
  },

  getUser() {
    const isPro = localStorage.getItem('vendeia_is_pro') === 'true';
    const today = new Date().toISOString().split('T')[0];

    const user = getLocal('vendeia_user', {
      name: 'Emprendedor VENDEIA',
      email: 'usuario@vendeia.com',
      plan: isPro ? 'PRO' : 'FREE',
      isPro: isPro,
      generationsCount: 0,
      lastUsageDate: today,
      maxGenerationsDaily: isPro ? 99999 : 5
    });

    // Validar y reiniciar el contador si la fecha guardada no coincide con el día de hoy
    if (!user.lastUsageDate || user.lastUsageDate !== today) {
      user.generationsCount = 0;
      user.lastUsageDate = today;
      setLocal('vendeia_user', user);
    }

    if (isPro) {
      user.plan = 'PRO';
      user.isPro = true;
      user.maxGenerationsDaily = 99999;
    } else {
      user.plan = 'FREE';
      user.isPro = false;
      user.maxGenerationsDaily = 5;
    }
    return user;
  },
  saveUser(user) {
    if (user && typeof user.isPro === 'boolean') {
      localStorage.setItem('vendeia_is_pro', user.isPro ? 'true' : 'false');
    }
    setLocal('vendeia_user', user);
    updateProfileCountUI(user);
  },
  incrementGenerations() {
    const today = new Date().toISOString().split('T')[0];
    const u = this.getUser();

    // Si cambió el día, reiniciar antes de incrementar
    if (u.lastUsageDate !== today) {
      u.generationsCount = 0;
      u.lastUsageDate = today;
    }

    u.generationsCount = (parseInt(u.generationsCount, 10) || 0) + 1;
    this.saveUser(u);
    updateProfileCountUI(u);
    return u.generationsCount;
  }
};

// ==========================================================================
// 2. MOTOR ESTRATÉGICO DE PERSUASIÓN COMERCIAL Y VENTAS
// ==========================================================================

const SalesEngine = {
  generate(inputs) {
    const {
      name, description, price, currency, targetAudience,
      cityCountry, features, benefits, problemSolved,
      differentiator, tone, platform
    } = inputs;

    const formattedPrice = `${price} ${currency}`;

    const toneAdjectives = {
      persuasivo: 'una oportunidad que transforma resultados',
      amigable: 'una solución cercana pensada con cariño para ti',
      profesional: 'un estándar de excelencia comprobado',
      energico: 'el salto definitivo que estabas esperando',
      premium: 'una experiencia exclusiva de alto nivel',
      divertido: 'la manera más fresca y genial de lograrlo'
    };
    const toneTag = toneAdjectives[tone] || 'una solución diseñada para ti';

    const benefitList = benefits
      ? benefits.split(',').map(b => b.trim()).filter(Boolean)
      : ['Resultados reales y comprobados', 'Ahorro de tiempo', 'Garantía de satisfacción'];

    // 1. Publicación
    const publication = {
      title: `¿Cansado de lidiar con ${problemSolved || 'este problema'}? Descubre ${name}`,
      hook: `Si eres parte de ${targetAudience || 'nuestra comunidad'} y quieres ${benefitList[0] || 'mejores resultados'}, esto te interesa. 👇`,
      description: `${description}. Creado especialmente para resolver ${problemSolved}, ${name} es ${toneTag}. A diferencia de otras alternativas, ${differentiator || 'ofrecemos atención real y garantizada'}.`,
      benefits: benefitList,
      cta: `📲 Escríbenos un mensaje directo o comenta "INFORMACIÓN" para enviarte todos los detalles y asegurar tu lugar por solo ${formattedPrice}.`,
      hashtags: [
        `#${name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 15)}`,
        '#Emprendimiento',
        '#VentasOnline',
        '#CalidadGarantizada',
        `#${platform.toUpperCase()}`
      ]
    };

    // 2. WhatsApp
    const whatsapp = {
      firstMessage: `¡Hola! 👋 Vi tu interés en *${name}*. Con gusto te comparto la información: está diseñado para ${targetAudience} que buscan ${benefitList[0] || 'soluciones reales'}. ¿Te gustaría que te cuente cómo funciona o tienes alguna duda específica?`,
      interestedReply: `¡Excelente pregunta! Lo que más destacan nuestros clientes es que *${differentiator || 'cumplimos al 100%'}*. Además incluye: ${features.slice(0, 90)}. La inversión es de solo *${formattedPrice}*. ¿Te gustaría apartarlo hoy mismo?`,
      priceReply: `La inversión completa de *${name}* es de *${formattedPrice}*. Te incluye: ${benefitList[0] || 'todo el producto/servicio'} + ${features.slice(0, 60)}. ¿Te gustaría conocer los métodos de pago disponibles?`,
      thinkingReply: `¡Totalmente comprensible! Es importante tomar la mejor decisión. Solo ten en cuenta que para garantizar la calidad con ${targetAudience}, mantenemos cupos limitados. ¿Hay alguna duda puntual sobre ${problemSolved} que pueda aclararte mientras tanto?`,
      followUpReply: `¡Hola de nuevo! 👋 Paso rápido por aquí para saludarte y saber si pudiste revisar la información de *${name}*. Si necesitas resolver algún punto adicional, con gusto estoy aquí para ayudarte.`,
      closingReply: `¡Perfecto! Para confirmar tu pedido de *${name}* por *${formattedPrice}*, solo necesito que me confirmes tu nombre completo y tu método de pago preferido. ¿Te genero el enlace o los datos bancarios ahora mismo?`
    };

    // 3. Estado de WhatsApp
    const whatsappStatus = `✨ Si formas parte de ${targetAudience}: ${name} está disponible hoy. ${benefitList[0] || 'Resultados reales'} por solo ${formattedPrice}. Escríbeme al privado antes de que se agoten los cupos. 💬`;

    // 4. Facebook
    const facebook = `¿Sabías que ${problemSolved}? 💡\n\nMuchos en ${cityCountry || 'nuestra ciudad'} han intentado resolverlo sin éxito, hasta que conocen *${name}*.\n\n✨ ¿Qué obtienes?\n${benefitList.map(b => `• ${b}`).join('\n')}\n\n🏆 Nuestro diferenciador:\n${differentiator}\n\n🏷️ Inversión: ${formattedPrice}\n\n👉 Deja un comentario o haz clic en "Enviar mensaje" para darte atención personalizada hoy mismo.`;

    // 5. Instagram
    const instagram = {
      caption: `No necesitas seguir complicándote con ${problemSolved}. ✨\n\nPresentamos *${name}*: la solución diseñada para ${targetAudience} que buscan ${benefitList[0] || 'calidad superior'}.\n\n📌 Lo que nos hace únicos:\n${differentiator}\n\n💰 Inversión: ${formattedPrice}\n\nDale guardar a este post 📌 y envíanos un DM con la palabra "QUIERO" para coordinar tu entrega o acceso de inmediato.`,
      cta: `Comenta "VENTAS" o toca el enlace en la bio para obtener más información.`,
      hashtags: [
        '#EmprenderConExito',
        '#VentasReales',
        `#${name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`,
        '#Crecimiento',
        '#OfertaEspecial',
        '#AtencionPersonalizada'
      ]
    };

    // 6. TikTok / Reels
    const tiktok = {
      hook: `Si eres de ${targetAudience || 'los que buscan calidad'}, deja de cometer este error con ${problemSolved}... 🛑`,
      script: `El 90% de las personas cree que para resolver ${problemSolved} necesita complicarse la vida. Pero la realidad es que con ${name}, obtienes ${benefitList[0] || 'resultados claros'}. Lo mejor es que ${differentiator}, por tan solo ${formattedPrice}.`,
      scenes: [
        {
          scene: 1,
          visual: 'Primer plano a cámara con expresión intrigada, señalando con el dedo hacia arriba.',
          audio: `(0-3s) "Si eres de ${targetAudience || 'los que buscan calidad'}, tienes que ver esto antes de que sea tarde."`
        },
        {
          scene: 2,
          visual: 'Demostración visual del producto o servicio en acción, mostrando el beneficio principal.',
          audio: `(3-9s) "Muchos sufren por ${problemSolved}, pero con ${name} la diferencia es inmediata porque ${differentiator}."`
        },
        {
          scene: 3,
          visual: 'Transición rápida mostrando el precio y el botón de contacto en el perfil.',
          audio: `(9-15s) "Consíguelo hoy por solo ${formattedPrice}. Toca el link de mi perfil o déjame un comentario."`
        }
      ],
      screenText: `👉 ${name} | Solo ${formattedPrice} | Link en el perfil`,
      cta: 'Sígueme para más consejos y toca el link en la biografía.'
    };

    // 7. Oferta Ética
    const offer = {
      mainOffer: `Adquiere ${name} a su precio oficial de ${formattedPrice}.`,
      benefit: `Acceso completo e inmediato con todos sus beneficios: ${benefits || 'calidad comprobada y atención directa'}.`,
      optionalBonus: `Incluye asesoría inicial para asegurar que resuelvas ${problemSolved} desde el primer día.`,
      urgency: `Atención personalizada limitada a la capacidad operativa semanal del equipo para garantizar la mejor experiencia.`,
      cta: `Haz tu pedido hoy mismo y comienza a disfrutar los resultados.`
    };

    return {
      id: `gen-${Date.now()}`,
      productName: name,
      createdAt: new Date().toISOString(),
      inputs,
      isDemoMode: true,
      isFavorite: false,
      publication,
      whatsapp,
      whatsappStatus,
      facebook,
      instagram,
      tiktok,
      offer
    };
  },

  analyze(inputs) {
    const clarityScore = Math.min(95, Math.max(65, (inputs.description || '').length > 40 ? 88 : 72));
    const audienceScore = (inputs.targetAudience || '').length > 20 ? 92 : 68;
    const valuePropScore = inputs.problemSolved && inputs.benefits ? 90 : 70;
    const benefitsScore = (inputs.benefits || '').length > 30 ? 94 : 75;
    const diffScore = (inputs.differentiator || '').length > 20 ? 89 : 65;
    const priceScore = Number(inputs.price) > 0 ? 87 : 55;
    const messageScore = inputs.features ? 88 : 70;

    const overall = Math.round(
      (clarityScore + audienceScore + valuePropScore + benefitsScore + diffScore + priceScore + messageScore) / 7
    );

    return {
      productName: inputs.name,
      scores: {
        clarity: clarityScore,
        targetAudience: audienceScore,
        valueProp: valuePropScore,
        benefits: benefitsScore,
        differentiation: diffScore,
        pricePerception: priceScore,
        commercialMessage: messageScore
      },
      overallScore: overall,
      priceFeedback: {
        comment: `El precio de ${inputs.price} ${inputs.currency || 'USD'} es coherente con el valor percibido si se enfatizan los beneficios tangibles.`,
        actionableAdvice: `Enmarca el precio comparándolo con el costo de no resolver ${inputs.problemSolved || 'el problema'}, o divídelo en su valor diario/mensual para reducir la fricción psicológica de compra.`
      },
      strengths: [
        `Propuesta orientada a resolver un dolor específico: "${inputs.problemSolved || 'necesidad detectada'}"`,
        `Público objetivo definido (${inputs.targetAudience || 'audiencia clara'}), lo que permite segmentar anuncios y mensajes directos.`,
        `Diferenciador competitivo explícito: "${inputs.differentiator || 'valor distintivo'}"`
      ],
      recommendations: [
        'Cuantifica los beneficios siempre que sea posible (ej. "ahorra 5 horas por semana" en lugar de "ahorra tiempo").',
        'Incluye testimonios o pruebas sociales tan pronto como concretes tus primeras ventas.',
        'Simplifica las opciones de pago en la conversación inicial para evitar que el comprador aplace la decisión.'
      ],
      disclaimer: 'Esta puntuación es un análisis técnico y heurístico de la propuesta de valor y mensaje comercial. No representa garantía de ventas, ya que los resultados comerciales dependen de factores externos del mercado, ejecución y canales.'
    };
  },

  offers(productName, price, cost, objective, currency) {
    const basePrice = Number(price) || 50;
    const premiumPrice = Math.round(basePrice * 1.8);
    const bundlePrice = Math.round(basePrice * 1.25);

    return {
      basic: {
        title: 'Oferta Básica — Acceso Esencial',
        price: `${basePrice} ${currency}`,
        description: 'La solución estándar para clientes que buscan resolver su necesidad principal sin extras.',
        includes: [
          `Entrega completa de ${productName}`,
          'Garantía estándar de satisfacción',
          'Atención por canales regulares'
        ]
      },
      recommended: {
        title: 'Oferta Recomendada — Pack Valor Óptimo',
        price: `${bundlePrice} ${currency}`,
        description: 'La opción más atractiva para el cliente promedio, con mayor margen comercial y alto valor percibido.',
        includes: [
          `Entrega completa de ${productName}`,
          'Guía rápida de implementación o uso óptimo paso a paso',
          'Atención prioritaria y canal directo',
          'Plantilla o recurso complementario exclusivo'
        ],
        bonus: 'Acceso a sesión de orientación o recetario/guía adicional sin costo extra.'
      },
      premium: {
        title: 'Oferta Premium — Experiencia VIP / Total',
        price: `${premiumPrice} ${currency}`,
        description: 'Para quienes buscan la solución definitiva sin escatimar en resultados ni comodidades.',
        includes: [
          'Todo lo incluido en el Pack Recomendado',
          'Acompañamiento 1 a 1 personalizado durante 30 días',
          'Garantía extendida de satisfacción',
          'Acceso preferencial a futuras actualizaciones'
        ],
        bonus: 'Auditoría personalizada directa o kit premium de bienvenida.'
      },
      strategySummary: `Objetivo: "${objective}". Presentar tres alternativas permite el efecto señuelo (Decoy Effect), haciendo que la oferta intermedia sea la preferida por el 70% de los compradores.`
    };
  },

  followup(clientName, productName, situation) {
    switch (situation) {
      case 'No respondió':
        return {
          message: `Hola ${clientName}, espero que estés teniendo una excelente semana. 👋 Solo paso para verificar si pudiste ver la información que te envié sobre *${productName}*. Si estás ocupado(a) no te preocupes, cuando tengas un momento con gusto te aclaro cualquier duda.`,
          advice: 'Tono ligero y sin reclamo. Respeta el tiempo del prospecto y deja la puerta abierta sin presionar.'
        };
      case 'Mostró interés':
        return {
          message: `¡Hola ${clientName}! Me quedé pensando en lo que me comentaste sobre tus objetivos con *${productName}*. ¿Qué te parece si resolvemos un par de detalles clave para que comiences a disfrutarlo cuanto antes?`,
          advice: 'Haz referencia a su motivación inicial y ofrece un siguiente paso concreto y sencillo.'
        };
      case 'Preguntó precio':
        return {
          message: `Hola ${clientName}, ¿cómo estás? Quería saber si tuviste oportunidad de revisar lo que incluye *${productName}*. Muchos clientes tenían la duda de si valía la pena la inversión hasta que comprobaron los resultados. ¿Te gustaría que te muestre un ejemplo práctico?`,
          advice: 'Cuando alguien pregunta precio y se detiene, el problema suele ser la percepción de valor, no el monto.'
        };
      case 'Recibió oferta':
        return {
          message: `¡Hola ${clientName}! Espero que todo vaya muy bien. Quería confirmar si recibiste la propuesta especial de *${productName}* y si los métodos de pago te resultan convenientes. Con gusto te reservo tu lugar si deseas concretarlo hoy.`,
          advice: 'Facilita la acción inmediata eliminando dudas técnicas o de medios de pago.'
        };
      case 'Dijo que lo pensaría':
        return {
          message: `Hola ${clientName}, qué gusto saludarte. Sé que querías pensarlo con calma, así que no quiero interrumpirte. Solo quería preguntarte: ¿hay algún punto de la propuesta que sientas que no se adapta del todo a lo que buscas? Mi prioridad es ayudarte a tomar la mejor decisión.`,
          advice: 'Transforma el "lo voy a pensar" en una conversación honesta para descubrir la objeción real oculta.'
        };
      case 'Compró':
        return {
          message: `¡Hola ${clientName}! Qué alegría tenerte como cliente de *${productName}*. 🙌 Quería saber cómo ha sido tu experiencia hasta el momento y asegurarme de que todo esté funcionando al 100%. ¿Cómo te has sentido con el producto?`,
          advice: 'El seguimiento postventa construye fidelidad, recomendaciones boca a boca y compras recurrentes.'
        };
      default:
        return {
          message: `Hola ${clientName}, espero te encuentres muy bien. Te escribo para dar seguimiento a nuestra conversación sobre *${productName}*. ¿En qué te puedo apoyar hoy?`,
          advice: 'Mantén una presencia amable y profesional.'
        };
    }
  },

  visualConcept(productName, inputs) {
    const prompt = `Professional commercial advertising visual for "${productName}", ${inputs.style || 'studio'} style, optimized for ${inputs.platform || 'Instagram'} (${inputs.format || '1:1'} aspect ratio). Targeted at ${inputs.targetAudience || 'buyers'}. Clean composition, soft studio lighting, high commercial aesthetic, negative space for text overlays "${inputs.desiredText || ''}". Shot on 85mm lens, 8k photorealistic.`;
    return {
      prompt,
      composition: 'Espacio negativo superior y lateral para tipografía publicitaria limpia.',
      colorPalette: 'Contraste moderno de alto impacto adaptado a redes sociales.',
      advice: 'Copia este prompt estructurado en Midjourney, DALL-E 3 o Imagen 3 para obtener el mejor resultado.'
    };
  }
};

// ==========================================================================
// 3. UTILIDADES DE EXPORTACIÓN (Portapapeles, TXT, PDF, WebShare)
// ==========================================================================

function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copiado al portapapeles.', 'success');
    }).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand('copy');
    showToast('Copiado al portapapeles.', 'success');
  } catch (e) {
    showToast('Error al copiar.', 'error');
  }
  document.body.removeChild(ta);
}

function downloadTxt(content, filename) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename.endsWith('.txt') ? filename : `${filename}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast('Archivo TXT descargado.', 'success');
}

function downloadPdf(gen) {
  // Generador de documento PDF limpio para imprimir o guardar como PDF en Chrome
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    showToast('Permite ventanas emergentes para generar el PDF.', 'error');
    return;
  }
  const cleanName = gen.productName.replace(/[^a-zA-Z0-9 ]/g, '');
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>VENDEIA — ${cleanName}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #111827; padding: 40px; }
        .header { background: #2563EB; color: white; padding: 24px; border-radius: 12px; margin-bottom: 24px; }
        .header h1 { margin: 0; font-size: 24px; }
        .header p { margin: 4px 0 0 0; font-size: 13px; opacity: 0.9; }
        .section { margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #E2E8F0; }
        .section-title { color: #2563EB; font-size: 16px; font-weight: bold; margin-bottom: 10px; text-transform: uppercase; }
        .label { font-weight: bold; font-size: 13px; color: #374151; margin-top: 8px; }
        .content { font-size: 13px; color: #4B5563; white-space: pre-line; margin-bottom: 6px; }
        .footer { font-size: 11px; color: #9CA3AF; text-align: center; margin-top: 40px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>VENDEIA — Estrategia de Venta</h1>
        <p>Producto: ${gen.productName} | Fecha: ${new Date(gen.createdAt).toLocaleDateString()}</p>
      </div>

      <div class="section">
        <div class="section-title">1. Publicación Principal</div>
        <div class="label">Título:</div>
        <div class="content">${gen.publication.title}</div>
        <div class="label">Gancho (Hook):</div>
        <div class="content">${gen.publication.hook}</div>
        <div class="label">Descripción:</div>
        <div class="content">${gen.publication.description}</div>
        <div class="label">Llamada a la acción (CTA):</div>
        <div class="content">${gen.publication.cta}</div>
        <div class="label">Hashtags:</div>
        <div class="content">${gen.publication.hashtags.join(' ')}</div>
      </div>

      <div class="section">
        <div class="section-title">2. Guiones para WhatsApp</div>
        <div class="label">Primer Mensaje:</div>
        <div class="content">${gen.whatsapp.firstMessage}</div>
        <div class="label">Respuesta a "¿Cuánto cuesta?":</div>
        <div class="content">${gen.whatsapp.priceReply}</div>
        <div class="label">Manejo de "Lo voy a pensar":</div>
        <div class="content">${gen.whatsapp.thinkingReply}</div>
        <div class="label">Cierre de Venta:</div>
        <div class="content">${gen.whatsapp.closingReply}</div>
      </div>

      <div class="section">
        <div class="section-title">3. Oferta Ética</div>
        <div class="label">Oferta:</div>
        <div class="content">${gen.offer.mainOffer}</div>
        <div class="label">Bonus:</div>
        <div class="content">${gen.offer.optionalBonus}</div>
        <div class="label">Urgencia Real:</div>
        <div class="content">${gen.offer.urgency}</div>
      </div>

      <div class="footer">
        Generado con VENDEIA / COBRAIA — Asistente de Ventas con IA
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  showToast('Generando vista de impresión/PDF...', 'success');
}

function shareOrCopy(title, text) {
  if (navigator.share) {
    navigator.share({ title, text }).catch(e => {
      if (e.name !== 'AbortError') copyText(text);
    });
  } else {
    copyText(text);
  }
}

// ==========================================================================
// 4. TOAST NOTIFICACIONES
// ==========================================================================

function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()" style="opacity: 0.6; padding: 2px;">✕</button>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3500);
}

// ==========================================================================
// 5. GESTIÓN DE TEMA (CLARO / OSCURO)
// ==========================================================================

const Theme = {
  init() {
    const saved = localStorage.getItem('vendeia_theme') || 'light';
    if (saved === 'dark' || (saved === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    this.updateIcon();
  },
  toggle() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('vendeia_theme', isDark ? 'dark' : 'light');
    this.updateIcon();
    showToast(`Modo ${isDark ? 'oscuro' : 'claro'} activado`, 'info');
  },
  updateIcon() {
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) {
      const isDark = document.documentElement.classList.contains('dark');
      btn.innerHTML = isDark ? '☀️' : '🌙';
      btn.title = `Cambiar a modo ${isDark ? 'claro' : 'oscuro'}`;
    }
  }
};

// ==========================================================================
// 6. CONTROLADOR DE VISTAS Y NAVEGACIÓN
// ==========================================================================

let currentView = 'landing';
let currentActiveTab = 'publicacion';
let latestGeneration = null;
let currentEditingGen = null;

function navigateTo(view) {
  currentView = view;
  const views = ['landing', 'dashboard', 'generator', 'products', 'crm', 'offers', 'analyzer', 'images', 'history', 'favorites', 'help'];
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) el.style.display = v === view ? 'block' : 'none';
  });

  // Actualizar botones de navegación activos
  document.querySelectorAll('.nav-btn, .mobile-nav-btn').forEach(btn => {
    const target = btn.getAttribute('data-view');
    btn.classList.toggle('active', target === view);
  });

  // Cerrar menú móvil si está abierto
  const mobileMenu = document.getElementById('mobile-menu-drawer');
  if (mobileMenu) mobileMenu.style.display = 'none';

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Renderizar vistas dependientes de datos
  if (view === 'dashboard') renderDashboard();
  if (view === 'products') renderProducts();
  if (view === 'crm') renderCrm();
  if (view === 'history') renderHistory();
  if (view === 'favorites') renderFavorites();
  if (view === 'generator') updateGeneratorProductSelect();
}

function toggleMobileMenu() {
  const drawer = document.getElementById('mobile-menu-drawer');
  if (drawer) {
    const isShown = drawer.style.display === 'block';
    drawer.style.display = isShown ? 'none' : 'block';
  }
}

// ==========================================================================
// 7. RENDERIZADO Y CONTROL DE CADA SECCIÓN
// ==========================================================================

// --- DASHBOARD ---
function renderDashboard() {
  const products = Storage.getProducts();
  const clients = Storage.getClients();
  const generations = Storage.getGenerations();
  const user = Storage.getUser();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días 👋' : hour < 19 ? 'Buenas tardes 👋' : 'Buenas noches 👋';

  const greetingEl = document.getElementById('dashboard-greeting');
  if (greetingEl) {
    greetingEl.innerHTML = `${greeting} <span style="color: var(--primary-blue);">${user.name.split(' ')[0]}</span>`;
  }

  document.getElementById('metric-products').innerText = products.length;
  document.getElementById('metric-generations').innerText = generations.length;
  document.getElementById('metric-clients').innerText = clients.length;
  document.getElementById('metric-conversations').innerText = clients.filter(c => c.status === 'En conversación' || c.status === 'Interesado').length;
  document.getElementById('metric-offers').innerText = products.length * 3;

  // Recent activity
  const recentList = document.getElementById('dashboard-recent-generations');
  if (recentList) {
    if (generations.length === 0) {
      recentList.innerHTML = '<div style="font-size: 0.8rem; color: var(--text-secondary); text-align: center; padding: 20px;">Aún no hay generaciones. Usa "Crear contenido" para empezar.</div>';
    } else {
      recentList.innerHTML = generations.slice(0, 3).map(g => `
        <div class="copy-block" style="cursor: pointer;" onclick="openHistoryDetail('${g.id}')">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong style="font-size: 0.85rem; color: var(--text-primary);">${g.productName}</strong>
            <span class="badge badge-blue">${g.inputs.platform}</span>
          </div>
          <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${g.publication.title}
          </div>
        </div>
      `).join('');
    }
  }

  // Recent clients
  const recentClients = document.getElementById('dashboard-recent-clients');
  if (recentClients) {
    if (clients.length === 0) {
      recentClients.innerHTML = '<div style="font-size: 0.8rem; color: var(--text-secondary); text-align: center; padding: 20px;">No hay clientes en seguimiento.</div>';
    } else {
      recentClients.innerHTML = clients.slice(0, 3).map(c => `
        <div class="copy-block" style="cursor: pointer;" onclick="navigateTo('crm')">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong style="font-size: 0.85rem; color: var(--text-primary);">${c.name}</strong>
            <span class="badge badge-green">${c.status}</span>
          </div>
          <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 4px;">
            ${c.product} • ${c.contact}
          </div>
        </div>
      `).join('');
    }
  }
}

// --- GENERADOR ---
function updateGeneratorProductSelect() {
  const select = document.getElementById('gen-select-product');
  if (!select) return;
  const products = Storage.getProducts();
  select.innerHTML = '<option value="">-- Cargar desde mis productos guardados --</option>' +
    products.map(p => `<option value="${p.id}">${p.name} (${p.price} ${p.currency})</option>`).join('');
}

function loadSavedProductIntoGenerator(prodId) {
  if (!prodId) return;
  const prod = Storage.getProducts().find(p => p.id === prodId);
  if (!prod) return;
  document.getElementById('gen-name').value = prod.name;
  document.getElementById('gen-desc').value = prod.description;
  document.getElementById('gen-price').value = prod.price;
  document.getElementById('gen-currency').value = prod.currency;
  document.getElementById('gen-audience').value = prod.targetAudience;
  document.getElementById('gen-location').value = prod.cityCountry;
  document.getElementById('gen-features').value = prod.features;
  document.getElementById('gen-benefits').value = prod.benefits;
  document.getElementById('gen-problem').value = prod.problemSolved;
  document.getElementById('gen-diff').value = prod.differentiator;
  document.getElementById('gen-tone').value = prod.tone;
  document.getElementById('gen-platform').value = prod.platform;
  showToast(`Datos cargados: "${prod.name}"`, 'info');
}

function loadTemplate(key) {
  const templates = {
    bakery: {
      name: 'Curso Online de Repostería Creativa',
      desc: 'Aprende pastelería moderna desde cero y crea tu propio negocio de postres caseros con recetas probadas.',
      price: 39,
      currency: 'USD',
      audience: 'Emprendedoras y amantes de la repostería de 20 a 45 años',
      location: 'Latinoamérica y España',
      features: '25 videos paso a paso, recetario digital imprimible, acceso de por vida y grupo de apoyo',
      benefits: 'Crear postres con acabado profesional, aprender a cotizar porciones y obtener ganancias reales',
      problem: 'Miedo a que las recetas se bajen o salgan secas, y no saber cómo calcular costos para cobrar bien',
      diff: 'Módulo exclusivo de cálculo de costos por porción y plantillas de cotización listas para usar',
      tone: 'persuasivo',
      platform: 'instagram'
    },
    services: {
      name: 'Servicio de Diseño de Identidad de Marca',
      desc: 'Diseño integral de marca y papelería comercial para profesionales y negocios que quieren proyectar seriedad.',
      price: 190,
      currency: 'USD',
      audience: 'Dueños de pequeños negocios, terapeutas y consultores independientes',
      location: 'Remoto internacional',
      features: 'Manual de marca completo, kit de redes sociales editables en Canva, logotipo principal y secundario',
      benefits: 'Dejar de parecer un negocio improvisado y generar confianza inmediata en clientes que pagan bien',
      problem: 'Inseguridad por una imagen visual casera que ahuyenta a clientes de alto presupuesto',
      diff: 'Enfoque estratégico orientado a ventas comerciales, no solo diseño decorativo',
      tone: 'profesional',
      platform: 'whatsapp'
    },
    coffee: {
      name: 'Café de Especialidad Tostado Artesanal (500g)',
      desc: 'Café orgánico de estricta altura (1,850 msnm), con notas naturales a chocolate oscuro y avellana.',
      price: 16,
      currency: 'USD',
      audience: 'Aficionados al café y profesionales que trabajan desde casa y disfrutan de un buen descanso',
      location: 'Nacional',
      features: 'Tueste medio reciente, grano 100% arábica, empaque biodegradable con válvula de frescura',
      benefits: 'Despertar con una experiencia de cafetería premium en casa sin acidez amarga',
      problem: 'La decepción del café comercial del supermercado quemado y con sabor plano',
      diff: 'Comprado directamente a cooperativas de pequeños agricultores con fecha exacta de tueste en cada bolsa',
      tone: 'amigable',
      platform: 'facebook'
    }
  };

  const t = templates[key];
  if (!t) return;
  document.getElementById('gen-name').value = t.name;
  document.getElementById('gen-desc').value = t.desc;
  document.getElementById('gen-price').value = t.price;
  document.getElementById('gen-currency').value = t.currency;
  document.getElementById('gen-audience').value = t.audience;
  document.getElementById('gen-location').value = t.location;
  document.getElementById('gen-features').value = t.features;
  document.getElementById('gen-benefits').value = t.benefits;
  document.getElementById('gen-problem').value = t.problem;
  document.getElementById('gen-diff').value = t.diff;
  document.getElementById('gen-tone').value = t.tone;
  document.getElementById('gen-platform').value = t.platform;
  showToast('Plantilla cargada con éxito.', 'info');
}

function handleGenerateForm(e) {
  e.preventDefault();
  const name = document.getElementById('gen-name').value.trim();
  const desc = document.getElementById('gen-desc').value.trim();
  const audience = document.getElementById('gen-audience').value.trim();

  if (!name || !desc || !audience) {
    showToast('Por favor completa los campos obligatorios (*).', 'error');
    return;
  }

  // 1. Verificación del límite de uso diario según el plan
  const user = Storage.getUser();
  const isPro = user.isPro === true || user.plan === 'PRO' || localStorage.getItem('vendeia_is_pro') === 'true';
  const currentUsage = parseInt(user.generationsCount, 10) || 0;
  const maxLimit = parseInt(user.maxGenerationsDaily, 10) || 5;

  if (!isPro && currentUsage >= maxLimit) {
    showToast(`Has alcanzado el límite de ${maxLimit} generaciones diarias del Plan FREE. ¡Mejora al Plan PRO para acceso ilimitado!`, 'error');
    openProModal();
    return;
  }

  const inputs = {
    name,
    description: desc,
    price: document.getElementById('gen-price').value || 49,
    currency: document.getElementById('gen-currency').value || 'USD',
    targetAudience: audience,
    cityCountry: document.getElementById('gen-location').value || '',
    features: document.getElementById('gen-features').value || '',
    benefits: document.getElementById('gen-benefits').value || '',
    problemSolved: document.getElementById('gen-problem').value || '',
    differentiator: document.getElementById('gen-diff').value || '',
    tone: document.getElementById('gen-tone').value,
    platform: document.getElementById('gen-platform').value
  };

  // Loading animation
  const loader = document.getElementById('gen-loader');
  const resultsContainer = document.getElementById('gen-results-dashboard');
  if (loader) loader.style.display = 'block';
  if (resultsContainer) resultsContainer.style.display = 'none';

  let step = 1;
  const stepInterval = setInterval(() => {
    const s1 = document.getElementById('step-1');
    const s2 = document.getElementById('step-2');
    const s3 = document.getElementById('step-3');
    if (step === 1 && s1) s1.style.color = 'var(--primary-blue)';
    if (step === 2 && s2) s2.style.color = 'var(--primary-blue)';
    if (step === 3 && s3) s3.style.color = 'var(--primary-blue)';
    step++;
  }, 400);

  setTimeout(() => {
    clearInterval(stepInterval);
    if (loader) loader.style.display = 'none';

    latestGeneration = SalesEngine.generate(inputs);
    Storage.saveGeneration(latestGeneration);
    
    // Incrementar de forma real el contador de uso diario en localStorage y refrescar la UI
    const updatedCount = Storage.incrementGenerations();

    renderGenerationResult(latestGeneration);
    if (resultsContainer) resultsContainer.style.display = 'block';

    const usageFeedback = isPro ? '⚡ PRO Ilimitado' : `Uso hoy: ${updatedCount} de ${maxLimit}`;
    showToast(`¡Estrategia de ventas generada con éxito! (${usageFeedback})`, 'success');
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
  }, 1300);
}

function renderGenerationResult(gen) {
  document.getElementById('res-product-name').innerText = gen.productName;
  document.getElementById('res-timestamp').innerText = new Date(gen.createdAt).toLocaleTimeString();

  // Actualizar estrella favorito
  updateFavButtonState(gen.isFavorite);

  // Renderizar pestañas
  renderTabContent('publicacion');
}

function updateFavButtonState(isFav) {
  const btn = document.getElementById('btn-toggle-fav');
  if (btn) {
    btn.innerHTML = isFav ? '⭐ Favorito' : '☆ Guardar';
    btn.style.color = isFav ? 'var(--accent-orange)' : 'var(--text-secondary)';
  }
}

function toggleResultFavorite() {
  if (!latestGeneration) return;
  const isFav = Storage.toggleFavorite(latestGeneration.id);
  latestGeneration.isFavorite = isFav;
  updateFavButtonState(isFav);
  showToast(isFav ? 'Añadido a favoritos ⭐' : 'Removido de favoritos', 'info');
}

function switchResultTab(tabName) {
  currentActiveTab = tabName;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
  });
  renderTabContent(tabName);
}

function renderTabContent(tabName) {
  const container = document.getElementById('tab-content-container');
  if (!container || !latestGeneration) return;

  const gen = latestGeneration;

  if (tabName === 'publicacion') {
    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h3 class="card-title">Publicación Principal</h3>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-secondary btn-sm" onclick="enableInlineEdit()">✏️ Editar</button>
          <button class="btn btn-secondary btn-sm" onclick="regenerateCopy()">🔄 Regenerar</button>
          <button class="btn btn-primary btn-sm" onclick="copyPublication()">📋 Copiar</button>
        </div>
      </div>
      <div id="pub-view-mode">
        <div class="copy-block">
          <div class="copy-block-title">Título sugerido</div>
          <div class="copy-block-text" style="font-weight: 700; font-size: 1rem;">${gen.publication.title}</div>
        </div>
        <div class="copy-block">
          <div class="copy-block-title">Gancho (Hook)</div>
          <div class="copy-block-text" style="color: var(--primary-blue); font-weight: 600;">${gen.publication.hook}</div>
        </div>
        <div class="copy-block">
          <div class="copy-block-title">Descripción</div>
          <div class="copy-block-text">${gen.publication.description}</div>
        </div>
        <div class="copy-block">
          <div class="copy-block-title">Beneficios clave</div>
          <ul style="margin-top: 6px;">
            ${gen.publication.benefits.map(b => `<li style="font-size: 0.85rem; margin-bottom: 4px;">• ${b}</li>`).join('')}
          </ul>
        </div>
        <div class="copy-block">
          <div class="copy-block-title">Llamada a la acción (CTA)</div>
          <div class="copy-block-text" style="font-weight: 700; color: var(--accent-green);">${gen.publication.cta}</div>
        </div>
        <div style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 6px;">
          ${gen.publication.hashtags.map(h => `<span class="badge badge-blue">${h}</span>`).join('')}
        </div>
      </div>
      <div id="pub-edit-mode" style="display: none;">
        <div class="form-group">
          <label class="form-label">Título</label>
          <input type="text" id="edit-pub-title" class="form-input" value="${gen.publication.title}">
        </div>
        <div class="form-group">
          <label class="form-label">Gancho</label>
          <input type="text" id="edit-pub-hook" class="form-input" value="${gen.publication.hook}">
        </div>
        <div class="form-group">
          <label class="form-label">Descripción</label>
          <textarea id="edit-pub-desc" class="form-textarea" rows="4">${gen.publication.description}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">CTA</label>
          <input type="text" id="edit-pub-cta" class="form-input" value="${gen.publication.cta}">
        </div>
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
          <button class="btn btn-secondary btn-sm" onclick="cancelInlineEdit()">Cancelar</button>
          <button class="btn btn-success btn-sm" onclick="saveInlineEdit()">💾 Guardar cambios</button>
        </div>
      </div>
    `;
  } else if (tabName === 'whatsapp') {
    const scripts = [
      { title: '1. Primer mensaje de contacto', text: gen.whatsapp.firstMessage },
      { title: '2. Respuesta a cliente interesado', text: gen.whatsapp.interestedReply },
      { title: '3. Respuesta a "¿Cuánto cuesta?"', text: gen.whatsapp.priceReply },
      { title: '4. Respuesta a "Lo voy a pensar"', text: gen.whatsapp.thinkingReply },
      { title: '5. Mensaje de seguimiento oportuno', text: gen.whatsapp.followUpReply },
      { title: '6. Cierre de venta para confirmar pedido', text: gen.whatsapp.closingReply }
    ];

    container.innerHTML = `
      <h3 class="card-title" style="margin-bottom: 12px;">Guiones de Venta para WhatsApp</h3>
      ${scripts.map((s, idx) => `
        <div class="copy-block">
          <div class="copy-block-header">
            <span class="copy-block-title">${s.title}</span>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-secondary btn-sm" onclick="copyText(\`${s.text.replace(/`/g, '\\`')}\`)">📋 Copiar</button>
              <a class="btn btn-success btn-sm" href="https://wa.me/?text=${encodeURIComponent(s.text)}" target="_blank">💬 WhatsApp</a>
            </div>
          </div>
          <div class="copy-block-text">${s.text}</div>
        </div>
      `).join('')}
    `;
  } else if (tabName === 'whatsappStatus') {
    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h3 class="card-title">Texto para Estado de WhatsApp (24 Horas)</h3>
        <button class="btn btn-success btn-sm" onclick="copyText(\`${gen.whatsappStatus.replace(/`/g, '\\`')}\`)">📋 Copiar Estado</button>
      </div>
      <div style="padding: 24px; border-radius: var(--radius-lg); background: linear-gradient(135deg, #16A34A, #0D9488); color: white; font-size: 1.1rem; line-height: 1.6; font-weight: 500;">
        📱 "${gen.whatsappStatus}"
      </div>
    `;
  } else if (tabName === 'facebook') {
    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h3 class="card-title">Publicación para Facebook</h3>
        <button class="btn btn-primary btn-sm" onclick="copyText(\`${gen.facebook.replace(/`/g, '\\`')}\`)">📋 Copiar para FB</button>
      </div>
      <div class="copy-block">
        <div class="copy-block-text">${gen.facebook}</div>
      </div>
    `;
  } else if (tabName === 'instagram') {
    const fullIg = `${gen.instagram.caption}\n\n${gen.instagram.cta}\n\n${gen.instagram.hashtags.join(' ')}`;
    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h3 class="card-title">Caption para Instagram</h3>
        <button class="btn btn-primary btn-sm" onclick="copyText(\`${fullIg.replace(/`/g, '\\`')}\`)">📋 Copiar Caption</button>
      </div>
      <div class="copy-block">
        <div class="copy-block-text">${gen.instagram.caption}</div>
        <div style="margin-top: 12px; font-weight: 600; color: var(--primary-blue); font-size: 0.85rem;">${gen.instagram.cta}</div>
        <div style="margin-top: 8px;">${gen.instagram.hashtags.map(h => `<span class="badge badge-blue" style="margin-right: 4px;">${h}</span>`).join('')}</div>
      </div>
    `;
  } else if (tabName === 'tiktok') {
    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h3 class="card-title">Guion de Video Corto (TikTok / Reels)</h3>
        <button class="btn btn-secondary btn-sm" onclick="copyText(\`${gen.tiktok.script.replace(/`/g, '\\`')}\`)">📋 Copiar Guion</button>
      </div>
      <div class="copy-block">
        <div class="copy-block-title" style="color: var(--secondary-violet);">Hook Inicial (0-3s)</div>
        <div class="copy-block-text" style="font-weight: 700; color: var(--secondary-violet);">${gen.tiktok.hook}</div>
      </div>
      <div class="copy-block">
        <div class="copy-block-title">Guion Narrado</div>
        <div class="copy-block-text">${gen.tiktok.script}</div>
      </div>
      <h4 style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; margin: 16px 0 8px 0; color: var(--text-secondary);">Escenas Sugeridas:</h4>
      ${gen.tiktok.scenes.map(s => `
        <div class="copy-block">
          <div style="font-size: 0.75rem; color: var(--text-secondary);"><strong>Escena ${s.scene} - Visual:</strong> ${s.visual}</div>
          <div style="font-size: 0.85rem; color: var(--text-primary); margin-top: 4px;"><strong>Audio:</strong> ${s.audio}</div>
        </div>
      `).join('')}
      <div class="copy-block">
        <div style="font-size: 0.8rem; color: var(--text-secondary);"><strong>Texto en Pantalla:</strong> ${gen.tiktok.screenText}</div>
        <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px;"><strong>CTA:</strong> ${gen.tiktok.cta}</div>
      </div>
    `;
  } else if (tabName === 'oferta') {
    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h3 class="card-title">Estructura de la Oferta Ética</h3>
        <button class="btn btn-primary btn-sm" onclick="copyText(\`${gen.offer.mainOffer}\n\nBeneficio: ${gen.offer.benefit}\nBonus: ${gen.offer.optionalBonus}\nUrgencia: ${gen.offer.urgency}\nCTA: ${gen.offer.cta}\`)">📋 Copiar Oferta</button>
      </div>
      <div class="copy-block">
        <div class="copy-block-title">Oferta Principal</div>
        <div class="copy-block-text" style="font-weight: 700; font-size: 1rem;">${gen.offer.mainOffer}</div>
      </div>
      <div class="copy-block">
        <div class="copy-block-title">Beneficio Central</div>
        <div class="copy-block-text">${gen.offer.benefit}</div>
      </div>
      <div class="copy-block">
        <div class="copy-block-title">Bonificación (Bonus)</div>
        <div class="copy-block-text">${gen.offer.optionalBonus}</div>
      </div>
      <div class="copy-block" style="border-color: rgba(245, 158, 11, 0.4);">
        <div class="copy-block-title" style="color: var(--accent-orange);">Urgencia Real (Sin engaños)</div>
        <div class="copy-block-text" style="font-weight: 600;">${gen.offer.urgency}</div>
      </div>
      <div class="copy-block">
        <div class="copy-block-title">Llamada a la Acción</div>
        <div class="copy-block-text" style="color: var(--accent-green); font-weight: 700;">${gen.offer.cta}</div>
      </div>
    `;
  }
}

function enableInlineEdit() {
  document.getElementById('pub-view-mode').style.display = 'none';
  document.getElementById('pub-edit-mode').style.display = 'block';
}

function cancelInlineEdit() {
  document.getElementById('pub-view-mode').style.display = 'block';
  document.getElementById('pub-edit-mode').style.display = 'none';
}

function saveInlineEdit() {
  if (!latestGeneration) return;
  latestGeneration.publication.title = document.getElementById('edit-pub-title').value;
  latestGeneration.publication.hook = document.getElementById('edit-pub-hook').value;
  latestGeneration.publication.description = document.getElementById('edit-pub-desc').value;
  latestGeneration.publication.cta = document.getElementById('edit-pub-cta').value;

  Storage.saveGeneration(latestGeneration);
  showToast('Cambios guardados con éxito.', 'success');
  renderTabContent('publicacion');
}

function regenerateCopy() {
  if (!latestGeneration) return;
  const user = Storage.getUser();
  const isPro = user.isPro === true || user.plan === 'PRO' || localStorage.getItem('vendeia_is_pro') === 'true';
  const currentUsage = parseInt(user.generationsCount, 10) || 0;
  const maxLimit = parseInt(user.maxGenerationsDaily, 10) || 5;

  if (!isPro && currentUsage >= maxLimit) {
    showToast(`Has alcanzado el límite diario de ${maxLimit} generaciones del Plan FREE. ¡Mejora a PRO para regenerar sin límites!`, 'error');
    openProModal();
    return;
  }

  const newGen = SalesEngine.generate(latestGeneration.inputs);
  latestGeneration = newGen;
  Storage.saveGeneration(newGen);
  const updatedCount = Storage.incrementGenerations();
  const usageFeedback = isPro ? '⚡ PRO Ilimitado' : `Uso hoy: ${updatedCount} de ${maxLimit}`;
  showToast(`Contenido regenerado con éxito. (${usageFeedback})`, 'success');
  renderGenerationResult(newGen);
}

function copyPublication() {
  if (!latestGeneration) return;
  const p = latestGeneration.publication;
  const text = `${p.title}\n\n${p.hook}\n\n${p.description}\n\nBeneficios:\n${p.benefits.map(b => `• ${b}`).join('\n')}\n\n${p.cta}\n\n${p.hashtags.join(' ')}`;
  copyText(text);
}

function copyAllResults() {
  if (!latestGeneration) return;
  const g = latestGeneration;
  const full = `VENDEIA / COBRAIA — ESTRATEGIA COMERCIAL PARA: ${g.productName}\nFecha: ${new Date(g.createdAt).toLocaleString()}\n\n1. PUBLICACIÓN:\n${g.publication.title}\n${g.publication.hook}\n${g.publication.description}\n\nCTA: ${g.publication.cta}\n${g.publication.hashtags.join(' ')}\n\n2. WHATSAPP (APERTURA):\n${g.whatsapp.firstMessage}\n\n3. OFERTA:\n${g.offer.mainOffer}\nBonus: ${g.offer.optionalBonus}`;
  copyText(full);
}

function exportTxt() {
  if (!latestGeneration) return;
  const g = latestGeneration;
  const full = `VENDEIA / COBRAIA — ESTRATEGIA DE VENTA: ${g.productName}\nFecha: ${new Date(g.createdAt).toLocaleString()}\n\n=========================================\n1. PUBLICACIÓN\n=========================================\nTítulo: ${g.publication.title}\nGancho: ${g.publication.hook}\nDescripción: ${g.publication.description}\nBeneficios:\n${g.publication.benefits.map(b => `- ${b}`).join('\n')}\nCTA: ${g.publication.cta}\nHashtags: ${g.publication.hashtags.join(' ')}\n\n=========================================\n2. WHATSAPP\n=========================================\nPrimer Mensaje:\n${g.whatsapp.firstMessage}\n\nRespuesta Interesado:\n${g.whatsapp.interestedReply}\n\nRespuesta Precio:\n${g.whatsapp.priceReply}\n\nObjeción "Lo voy a pensar":\n${g.whatsapp.thinkingReply}\n\nSeguimiento:\n${g.whatsapp.followUpReply}\n\nCierre:\n${g.whatsapp.closingReply}\n\n=========================================\n3. OFERTA ÉTICA\n=========================================\nOferta: ${g.offer.mainOffer}\nBeneficio: ${g.offer.benefit}\nBonus: ${g.offer.optionalBonus}\nUrgencia Real: ${g.offer.urgency}\nCTA: ${g.offer.cta}`;
  downloadTxt(full, `vendeia_${g.productName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`);
}

function exportPdf() {
  if (!latestGeneration) return;
  downloadPdf(latestGeneration);
}

// --- PRODUCTOS ---
function renderProducts() {
  const container = document.getElementById('products-grid');
  if (!container) return;
  const search = (document.getElementById('products-search')?.value || '').toLowerCase();
  const products = Storage.getProducts().filter(p =>
    p.name.toLowerCase().includes(search) ||
    p.description.toLowerCase().includes(search) ||
    p.category.toLowerCase().includes(search)
  );

  if (products.length === 0) {
    container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">No se encontraron productos.</div>';
    return;
  }

  container.innerHTML = products.map(p => `
    <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span class="badge badge-blue">${p.category}</span>
          <span style="font-weight: 800; color: var(--primary-blue); font-size: 1rem;">${p.price} ${p.currency}</span>
        </div>
        <h3 class="card-title" style="margin-bottom: 6px;">${p.name}</h3>
        <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 12px;">${p.description}</p>
        <div style="font-size: 0.75rem; color: var(--text-muted); border-top: 1px solid var(--border-color); padding-top: 8px;">
          <div><strong>Público:</strong> ${p.targetAudience}</div>
          <div style="margin-top: 2px;"><strong>Beneficio:</strong> ${p.benefits}</div>
        </div>
      </div>
      <div style="margin-top: 16px; border-top: 1px solid var(--border-color); padding-top: 12px; display: flex; flex-direction: column; gap: 8px;">
        <button class="btn btn-primary btn-sm" onclick="useProductInGenerator('${p.id}')">✨ Crear contenido para este producto</button>
        <div style="display: flex; gap: 6px;">
          <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="openEditProductModal('${p.id}')">✏️ Editar</button>
          <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="duplicateProduct('${p.id}')">📑 Duplicar</button>
          <button class="btn btn-secondary btn-sm" style="color: var(--accent-red);" onclick="deleteProduct('${p.id}')">🗑️</button>
        </div>
      </div>
    </div>
  `).join('');
}

function useProductInGenerator(id) {
  loadSavedProductIntoGenerator(id);
  navigateTo('generator');
}

function duplicateProduct(id) {
  const d = Storage.duplicateProduct(id);
  if (d) {
    showToast(`Producto duplicado: "${d.name}"`, 'success');
    renderProducts();
  }
}

function deleteProduct(id) {
  if (confirm('¿Eliminar este producto del catálogo?')) {
    Storage.deleteProduct(id);
    showToast('Producto eliminado.', 'info');
    renderProducts();
  }
}

// --- CRM (CLIENTES) ---
function renderCrm() {
  const container = document.getElementById('crm-clients-list');
  if (!container) return;

  const search = (document.getElementById('crm-search')?.value || '').toLowerCase();
  const statusFilter = document.getElementById('crm-status-filter')?.value || 'todos';

  const clients = Storage.getClients().filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search) ||
      c.contact.toLowerCase().includes(search) ||
      c.product.toLowerCase().includes(search) ||
      c.notes.toLowerCase().includes(search);
    const matchesStatus = statusFilter === 'todos' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (clients.length === 0) {
    container.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-secondary);">No se encontraron clientes con los filtros seleccionados.</div>';
    return;
  }

  const badgeMap = {
    'Nuevo': 'badge-blue',
    'Interesado': 'badge-blue',
    'En conversación': 'badge-orange',
    'Oferta enviada': 'badge-orange',
    'Cliente': 'badge-green',
    'No respondió': 'badge-red'
  };

  container.innerHTML = clients.map(c => `
    <div class="card" style="padding: 16px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 10px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <strong style="font-size: 1rem; color: var(--text-primary);">${c.name}</strong>
            <span class="badge ${badgeMap[c.status] || 'badge-blue'}">${c.status}</span>
          </div>
          <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px;">
            📞 ${c.contact} • 🏷️ ${c.product} • 📅 ${c.date}
          </div>
        </div>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          <button class="btn btn-primary btn-sm" onclick="openFollowupModal('${c.id}')">✨ Seguimiento IA</button>
          <a class="btn btn-success btn-sm" href="https://wa.me/${c.contact.replace(/\\D/g, '')}" target="_blank">💬 WhatsApp</a>
          <button class="btn btn-secondary btn-sm" onclick="openEditClientModal('${c.id}')">✏️</button>
          <button class="btn btn-secondary btn-sm" style="color: var(--accent-red);" onclick="deleteClient('${c.id}')">🗑️</button>
        </div>
      </div>
      ${c.notes ? `<div style="font-size: 0.8rem; color: var(--text-secondary); background: var(--bg-surface-subtle); padding: 8px 12px; border-radius: var(--radius-sm); font-style: italic;">"${c.notes}"</div>` : ''}
    </div>
  `).join('');
}

function deleteClient(id) {
  if (confirm('¿Eliminar este cliente del CRM?')) {
    Storage.deleteClient(id);
    showToast('Cliente eliminado.', 'info');
    renderCrm();
  }
}

// --- HISTORIAL ---
function renderHistory() {
  const container = document.getElementById('history-list');
  if (!container) return;
  const search = (document.getElementById('history-search')?.value || '').toLowerCase();
  const list = Storage.getGenerations().filter(g =>
    g.productName.toLowerCase().includes(search) ||
    g.publication.title.toLowerCase().includes(search) ||
    g.inputs.platform.toLowerCase().includes(search)
  );

  if (list.length === 0) {
    container.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-secondary);">No hay registros en el historial.</div>';
    return;
  }

  container.innerHTML = list.map(g => `
    <div class="card" style="padding: 16px; margin-bottom: 12px; cursor: pointer;" onclick="openHistoryDetail('${g.id}')">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <strong style="font-size: 1rem; color: var(--text-primary);">${g.productName}</strong>
        <span class="badge badge-blue">${g.inputs.platform}</span>
      </div>
      <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px;">${g.publication.title}</div>
      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--text-muted);">
        <span>📅 ${new Date(g.createdAt).toLocaleString()}</span>
        <div onclick="event.stopPropagation();">
          <button class="btn btn-secondary btn-sm" onclick="downloadPdfById('${g.id}')">📄 PDF</button>
          <button class="btn btn-secondary btn-sm" style="color: var(--accent-red);" onclick="deleteGenById('${g.id}')">🗑️</button>
        </div>
      </div>
    </div>
  `).join('');
}

function openHistoryDetail(id) {
  const gen = Storage.getGenerations().find(g => g.id === id);
  if (!gen) return;
  latestGeneration = gen;
  navigateTo('generator');
  showToast(`Cargada generación de "${gen.productName}"`, 'info');
}

function downloadPdfById(id) {
  const gen = Storage.getGenerations().find(g => g.id === id);
  if (gen) downloadPdf(gen);
}

function deleteGenById(id) {
  if (confirm('¿Eliminar esta generación del historial?')) {
    Storage.deleteGeneration(id);
    showToast('Generación eliminada.', 'info');
    renderHistory();
  }
}

// --- FAVORITOS ---
function renderFavorites() {
  const container = document.getElementById('favorites-list');
  if (!container) return;
  const list = Storage.getGenerations().filter(g => g.isFavorite);

  if (list.length === 0) {
    container.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-secondary);">No tienes copys marcados como favoritos ⭐.</div>';
    return;
  }

  container.innerHTML = list.map(g => `
    <div class="card" style="margin-bottom: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <h3 class="card-title">${g.productName}</h3>
        <button class="btn btn-secondary btn-sm" onclick="removeFavorite('${g.id}')">⭐ Quitar</button>
      </div>
      <div class="copy-block">
        <div class="copy-block-title">Publicación</div>
        <div class="copy-block-text">${g.publication.title}\n\n${g.publication.description}</div>
      </div>
      <div class="copy-block">
        <div class="copy-block-title">WhatsApp</div>
        <div class="copy-block-text">${g.whatsapp.firstMessage}</div>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px;">
        <button class="btn btn-secondary btn-sm" onclick="downloadPdfById('${g.id}')">📄 PDF</button>
        <button class="btn btn-primary btn-sm" onclick="copyText(\`${g.publication.title}\n\n${g.publication.description}\n\n${g.publication.cta}\`)">📋 Copiar</button>
      </div>
    </div>
  `).join('');
}

function removeFavorite(id) {
  Storage.toggleFavorite(id);
  showToast('Removido de favoritos.', 'info');
  renderFavorites();
}

// --- ANALIZADOR DE PRODUCTO ---
function handleAnalyzeForm(e) {
  e.preventDefault();
  const name = document.getElementById('ana-name').value;
  const desc = document.getElementById('ana-desc').value;
  const price = document.getElementById('ana-price').value || 49;
  const currency = document.getElementById('ana-currency').value || 'USD';
  const targetAudience = document.getElementById('ana-audience').value;
  const problemSolved = document.getElementById('ana-problem').value;
  const differentiator = document.getElementById('ana-diff').value;
  const benefits = document.getElementById('ana-benefits').value;

  const analysis = SalesEngine.analyze({
    name, description: desc, price, currency, targetAudience, problemSolved, differentiator, benefits
  });

  const resContainer = document.getElementById('ana-results-container');
  if (resContainer) {
    resContainer.style.display = 'block';
    document.getElementById('ana-overall-score').innerText = analysis.overallScore;
    document.getElementById('ana-product-title').innerText = analysis.productName;

    // Barra de dimensiones
    const dims = [
      { name: 'Claridad de la oferta', score: analysis.scores.clarity },
      { name: 'Público objetivo', score: analysis.scores.targetAudience },
      { name: 'Propuesta de valor', score: analysis.scores.valueProp },
      { name: 'Beneficios tangibles', score: analysis.scores.benefits },
      { name: 'Diferenciación', score: analysis.scores.differentiation },
      { name: 'Percepción del precio', score: analysis.scores.pricePerception },
      { name: 'Mensaje comercial', score: analysis.scores.commercialMessage }
    ];

    document.getElementById('ana-dimensions-bars').innerHTML = dims.map(d => `
      <div style="margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 600; margin-bottom: 4px;">
          <span>${d.name}</span>
          <span>${d.score}%</span>
        </div>
        <div style="width: 100%; height: 8px; background: var(--bg-surface-subtle); border-radius: 9999px; overflow: hidden;">
          <div style="width: ${d.score}%; height: 100%; background: ${d.score >= 85 ? 'var(--accent-green)' : d.score >= 70 ? 'var(--primary-blue)' : 'var(--accent-orange)'}; border-radius: 9999px;"></div>
        </div>
      </div>
    `).join('');

    document.getElementById('ana-price-comment').innerText = analysis.priceFeedback.comment;
    document.getElementById('ana-price-advice').innerText = analysis.priceFeedback.actionableAdvice;

    document.getElementById('ana-strengths-list').innerHTML = analysis.strengths.map(s => `<li style="font-size: 0.8rem; margin-bottom: 4px;">• ${s}</li>`).join('');
    document.getElementById('ana-recommendations-list').innerHTML = analysis.recommendations.map(r => `<li style="font-size: 0.8rem; margin-bottom: 4px;">• ${r}</li>`).join('');

    resContainer.scrollIntoView({ behavior: 'smooth' });
    showToast('Análisis de propuesta completado.', 'success');
  }
}

// --- GENERADOR DE OFERTAS ---
function handleOffersForm(e) {
  e.preventDefault();
  const name = document.getElementById('off-name').value;
  const price = document.getElementById('off-price').value || 50;
  const cost = document.getElementById('off-cost').value || 10;
  const currency = document.getElementById('off-currency').value || 'USD';
  const objective = document.getElementById('off-objective').value;

  const result = SalesEngine.offers(name, price, cost, objective, currency);

  const container = document.getElementById('off-results-container');
  if (container) {
    container.style.display = 'block';
    document.getElementById('off-strategy-summary').innerText = result.strategySummary;

    document.getElementById('off-tier-basic').innerHTML = `
      <span class="badge badge-blue">Nivel 1</span>
      <h4 style="font-weight: 800; font-size: 1.1rem; margin-top: 6px;">${result.basic.title}</h4>
      <div style="font-size: 1.75rem; font-weight: 900; margin: 10px 0;">${result.basic.price}</div>
      <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 12px;">${result.basic.description}</p>
      <ul style="font-size: 0.8rem; margin-bottom: 16px;">
        ${result.basic.includes.map(i => `<li style="margin-bottom: 4px;">✓ ${i}</li>`).join('')}
      </ul>
      <button class="btn btn-secondary btn-sm" style="width: 100%;" onclick="copyText('${result.basic.title}\nPrecio: ${result.basic.price}\n${result.basic.description}')">📋 Copiar Oferta Básica</button>
    `;

    document.getElementById('off-tier-recommended').innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span class="badge badge-blue">Nivel 2</span>
        <span class="badge badge-green">Opción Recomendada</span>
      </div>
      <h4 style="font-weight: 800; font-size: 1.1rem; margin-top: 6px;">${result.recommended.title}</h4>
      <div style="font-size: 1.75rem; font-weight: 900; color: var(--primary-blue); margin: 10px 0;">${result.recommended.price}</div>
      <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 10px;">${result.recommended.description}</p>
      <div style="background: var(--accent-orange-subtle); color: var(--accent-orange); font-size: 0.75rem; padding: 6px 10px; border-radius: var(--radius-sm); font-weight: bold; margin-bottom: 12px;">
        🎁 Bonus: ${result.recommended.bonus}
      </div>
      <ul style="font-size: 0.8rem; margin-bottom: 16px;">
        ${result.recommended.includes.map(i => `<li style="margin-bottom: 4px;">✓ ${i}</li>`).join('')}
      </ul>
      <button class="btn btn-primary btn-sm" style="width: 100%;" onclick="copyText('${result.recommended.title}\nPrecio: ${result.recommended.price}\nBonus: ${result.recommended.bonus}\n${result.recommended.description}')">📋 Copiar Oferta Recomendada</button>
    `;

    document.getElementById('off-tier-premium').innerHTML = `
      <span class="badge badge-orange">Nivel 3 VIP</span>
      <h4 style="font-weight: 800; font-size: 1.1rem; margin-top: 6px;">${result.premium.title}</h4>
      <div style="font-size: 1.75rem; font-weight: 900; margin: 10px 0;">${result.premium.price}</div>
      <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 10px;">${result.premium.description}</p>
      <div style="background: var(--secondary-violet-subtle); color: var(--secondary-violet); font-size: 0.75rem; padding: 6px 10px; border-radius: var(--radius-sm); font-weight: bold; margin-bottom: 12px;">
        ⭐ VIP: ${result.premium.bonus}
      </div>
      <ul style="font-size: 0.8rem; margin-bottom: 16px;">
        ${result.premium.includes.map(i => `<li style="margin-bottom: 4px;">✓ ${i}</li>`).join('')}
      </ul>
      <button class="btn btn-secondary btn-sm" style="width: 100%;" onclick="copyText('${result.premium.title}\nPrecio: ${result.premium.price}\nBonus: ${result.premium.bonus}\n${result.premium.description}')">📋 Copiar Oferta Premium</button>
    `;

    container.scrollIntoView({ behavior: 'smooth' });
    showToast('Ofertas de 3 niveles generadas.', 'success');
  }
}

// --- GENERADOR DE IMÁGENES ---
function handleVisualForm(e) {
  e.preventDefault();
  const name = document.getElementById('vis-name').value;
  const style = document.getElementById('vis-style').value;
  const format = document.getElementById('vis-format').value;
  const platform = document.getElementById('vis-platform').value;
  const targetAudience = document.getElementById('vis-audience').value;
  const desiredText = document.getElementById('vis-text').value;

  const concept = SalesEngine.visualConcept(name, { style, format, platform, targetAudience, desiredText });

  const container = document.getElementById('vis-results-container');
  if (container) {
    container.style.display = 'block';
    document.getElementById('vis-prompt-text').innerText = concept.prompt;
    document.getElementById('vis-composition-text').innerText = concept.composition;
    document.getElementById('vis-palette-text').innerText = concept.colorPalette;
    document.getElementById('vis-advice-text').innerText = concept.advice;

    container.scrollIntoView({ behavior: 'smooth' });
    showToast('Concepto visual y prompt estructurado generados.', 'success');
  }
}

// --- MODALES (CLIENTE, SEGUIMIENTO, PRO, CONFIG, AUTH) ---

function openNewClientModal() {
  document.getElementById('modal-client-title').innerText = 'Nuevo Cliente';
  document.getElementById('modal-client-id').value = '';
  document.getElementById('modal-client-name').value = '';
  document.getElementById('modal-client-contact').value = '';
  document.getElementById('modal-client-product').value = Storage.getProducts()[0]?.name || 'General';
  document.getElementById('modal-client-status').value = 'Nuevo';
  document.getElementById('modal-client-notes').value = '';
  document.getElementById('modal-client').style.display = 'flex';
}

function openEditClientModal(id) {
  const cli = Storage.getClients().find(c => c.id === id);
  if (!cli) return;
  document.getElementById('modal-client-title').innerText = 'Editar Cliente';
  document.getElementById('modal-client-id').value = cli.id;
  document.getElementById('modal-client-name').value = cli.name;
  document.getElementById('modal-client-contact').value = cli.contact;
  document.getElementById('modal-client-product').value = cli.product;
  document.getElementById('modal-client-status').value = cli.status;
  document.getElementById('modal-client-notes').value = cli.notes;
  document.getElementById('modal-client').style.display = 'flex';
}

function handleSaveClientModal(e) {
  e.preventDefault();
  const id = document.getElementById('modal-client-id').value;
  const name = document.getElementById('modal-client-name').value.trim();
  const contact = document.getElementById('modal-client-contact').value.trim();
  const product = document.getElementById('modal-client-product').value.trim();
  const status = document.getElementById('modal-client-status').value;
  const notes = document.getElementById('modal-client-notes').value.trim();

  if (!name) {
    showToast('El nombre es obligatorio.', 'error');
    return;
  }

  Storage.saveClient({
    id: id || undefined,
    name, contact, product, status, notes,
    date: new Date().toISOString().split('T')[0]
  });

  document.getElementById('modal-client').style.display = 'none';
  showToast(id ? 'Cliente actualizado.' : 'Cliente añadido al CRM.', 'success');
  renderCrm();
}

let activeFollowupClient = null;

function openFollowupModal(id) {
  const cli = Storage.getClients().find(c => c.id === id);
  if (!cli) return;
  activeFollowupClient = cli;
  document.getElementById('modal-followup-client-name').innerText = cli.name;
  document.getElementById('modal-followup-product').innerText = cli.product;
  document.getElementById('followup-situation-select').value = 'No respondió';
  generateFollowupMessage();
  document.getElementById('modal-followup').style.display = 'flex';
}

function generateFollowupMessage() {
  if (!activeFollowupClient) return;
  const situation = document.getElementById('followup-situation-select').value;
  const res = SalesEngine.followup(activeFollowupClient.name, activeFollowupClient.product, situation);

  document.getElementById('followup-message-text').innerText = res.message;
  document.getElementById('followup-advice-text').innerText = res.advice;

  const cleanPhone = activeFollowupClient.contact.replace(/\D/g, '');
  const waBtn = document.getElementById('followup-whatsapp-btn');
  if (waBtn) {
    waBtn.href = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(res.message)}`;
  }
}

function copyFollowupText() {
  const text = document.getElementById('followup-message-text').innerText;
  copyText(text);
}

// Modal Productos
function openNewProductModal() {
  document.getElementById('modal-product-title').innerText = 'Nuevo Producto';
  document.getElementById('modal-product-id').value = '';
  document.getElementById('modal-prod-name').value = '';
  document.getElementById('modal-prod-desc').value = '';
  document.getElementById('modal-prod-price').value = '49';
  document.getElementById('modal-prod-currency').value = 'USD';
  document.getElementById('modal-prod-category').value = 'General';
  document.getElementById('modal-prod-audience').value = '';
  document.getElementById('modal-prod-benefits').value = '';
  document.getElementById('modal-product').style.display = 'flex';
}

function openEditProductModal(id) {
  const p = Storage.getProducts().find(prod => prod.id === id);
  if (!p) return;
  document.getElementById('modal-product-title').innerText = 'Editar Producto';
  document.getElementById('modal-product-id').value = p.id;
  document.getElementById('modal-prod-name').value = p.name;
  document.getElementById('modal-prod-desc').value = p.description;
  document.getElementById('modal-prod-price').value = p.price;
  document.getElementById('modal-prod-currency').value = p.currency;
  document.getElementById('modal-prod-category').value = p.category;
  document.getElementById('modal-prod-audience').value = p.targetAudience;
  document.getElementById('modal-prod-benefits').value = p.benefits;
  document.getElementById('modal-product').style.display = 'flex';
}

function handleSaveProductModal(e) {
  e.preventDefault();
  const id = document.getElementById('modal-product-id').value;
  const name = document.getElementById('modal-prod-name').value.trim();
  const desc = document.getElementById('modal-prod-desc').value.trim();
  const price = Number(document.getElementById('modal-prod-price').value) || 0;
  const currency = document.getElementById('modal-prod-currency').value;
  const category = document.getElementById('modal-prod-category').value.trim() || 'General';
  const targetAudience = document.getElementById('modal-prod-audience').value.trim();
  const benefits = document.getElementById('modal-prod-benefits').value.trim();

  if (!name || !desc) {
    showToast('Nombre y descripción son obligatorios.', 'error');
    return;
  }

  Storage.saveProduct({
    id: id || undefined,
    name, description: desc, price, currency, category, targetAudience, benefits,
    cityCountry: 'Latinoamérica',
    features: '',
    problemSolved: '',
    differentiator: '',
    tone: 'persuasivo',
    platform: 'instagram'
  });

  document.getElementById('modal-product').style.display = 'none';
  showToast(id ? 'Producto actualizado.' : 'Producto creado en el catálogo.', 'success');
  renderProducts();
}

// Modal PRO
function openProModal() {
  const user = Storage.getUser();
  if (user && user.email) {
    checkUserProLicense(user.email, { notifyOnSuccess: false });
  }
  document.getElementById('modal-pro').style.display = 'flex';
}

function handleJoinWaitlist(e) {
  e.preventDefault();
  const email = document.getElementById('waitlist-email').value.trim();
  if (!email || !email.includes('@')) {
    showToast('Introduce un correo válido.', 'error');
    return;
  }
  document.getElementById('waitlist-form-container').innerHTML = `
    <div style="text-align: center; padding: 16px; background: var(--accent-green-subtle); border-radius: var(--radius-md); color: var(--accent-green);">
      <div style="font-size: 1.5rem; margin-bottom: 4px;">✓</div>
      <strong>¡Estás en la lista prioritaria para PRO!</strong>
      <p style="font-size: 0.75rem; margin-top: 4px; color: var(--text-secondary);">Te avisaremos con un 50% de descuento cuando se active la pasarela oficial.</p>
    </div>
  `;
  showToast('¡Registrado con éxito en la lista prioritaria!', 'success');
}

// Modal Config
function openConfigModal() {
  document.getElementById('modal-config').style.display = 'flex';
}

// Modal Auth / Perfil
function openAuthModal() {
  const user = Storage.getUser();
  document.getElementById('user-profile-name').value = user.name;
  document.getElementById('user-profile-email').value = user.email;
  const isPro = user.isPro === true || user.plan === 'PRO' || localStorage.getItem('vendeia_is_pro') === 'true';
  const planEl = document.getElementById('user-profile-plan');
  if (planEl) {
    planEl.innerText = isPro ? 'PRO (Ilimitado)' : 'FREE';
    planEl.style.color = isPro ? 'var(--accent-green)' : 'var(--primary-blue)';
  }
  updateProfileCountUI(user);
  document.getElementById('modal-auth').style.display = 'flex';
}

function handleSaveUserProfile(e) {
  e.preventDefault();
  const name = document.getElementById('user-profile-name').value.trim();
  const email = document.getElementById('user-profile-email').value.trim();
  const u = Storage.getUser();
  u.name = name || 'Usuario';
  u.email = email;
  Storage.saveUser(u);

  document.getElementById('header-user-name').innerText = u.name;
  document.getElementById('modal-auth').style.display = 'none';
  showToast('Perfil actualizado correctamente.', 'success');

  if (email && email.includes('@')) {
    checkUserProLicense(email, { notifyOnSuccess: true });
  }
}

// FAQ Accordion
function toggleFaq(idx) {
  const ans = document.getElementById(`faq-ans-${idx}`);
  if (ans) {
    const isVisible = ans.style.display === 'block';
    ans.style.display = isVisible ? 'none' : 'block';
  }
}

// Contacto
function handleContactSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('contact-email').value;
  const msg = document.getElementById('contact-msg').value;
  if (!email || !msg) {
    showToast('Por favor completa los campos.', 'error');
    return;
  }
  document.getElementById('contact-form-box').innerHTML = `
    <div style="text-align: center; padding: 24px; background: var(--accent-green-subtle); color: var(--accent-green); border-radius: var(--radius-md);">
      <div style="font-size: 2rem; margin-bottom: 6px;">✓</div>
      <strong>¡Mensaje recibido con éxito!</strong>
      <p style="font-size: 0.8rem; margin-top: 4px; color: var(--text-secondary);">Te responderemos en <strong>${email}</strong> a la brevedad.</p>
    </div>
  `;
  showToast('Mensaje de contacto enviado.', 'success');
}

// ==========================================================================
// 8. VERIFICACIÓN Y SINCRONIZACIÓN DE LICENCIA PRO CON BACKEND / HOTMART
// ==========================================================================

/**
 * Actualiza la interfaz visual para reflejar el estado PRO o FREE en toda la app.
 * @param {boolean} isPro - true si el usuario posee membresía PRO activa.
 */
function updatePlanUI(isPro) {
  try {
    const user = Storage.getUser();

    // 1. Botón del Plan en el Header (Escritorio)
    const headerPlanBtn = document.getElementById('header-plan-btn') || document.querySelector('.plan-badge-btn');
    if (headerPlanBtn) {
      if (isPro) {
        headerPlanBtn.innerHTML = `
          <span style="background: linear-gradient(135deg, #16A34A, #2563EB); color: #fff; padding: 2px 8px; border-radius: 9999px; font-weight: 800; font-size: 11px; display: inline-flex; align-items: center; gap: 4px;">
            ⚡ PRO ACTIVO
          </span>
        `;
        headerPlanBtn.title = 'Membresía PRO activa con acceso ilimitado';
      } else {
        headerPlanBtn.innerHTML = `
          <span id="header-plan-badge">✨ Plan FREE</span>
          <span id="header-plan-action" style="color: var(--primary-blue); text-decoration: underline; font-size: 10px;">Mejorar</span>
        `;
        headerPlanBtn.title = 'Mejorar al Plan PRO';
      }
    }

    // 2. Botón del Plan en el Menú Móvil
    const mobilePlanBtn = document.getElementById('mobile-plan-btn');
    if (mobilePlanBtn) {
      if (isPro) {
        mobilePlanBtn.innerHTML = '⚡ Plan PRO Activo (Ilimitado)';
        mobilePlanBtn.className = 'btn btn-primary btn-sm';
      } else {
        mobilePlanBtn.innerHTML = '✨ Plan FREE (Mejorar)';
        mobilePlanBtn.className = 'btn btn-secondary btn-sm';
      }
    }

    // 3. Modal de Perfil (#modal-auth)
    const profilePlan = document.getElementById('user-profile-plan');
    if (profilePlan) {
      profilePlan.innerText = isPro ? 'PRO (Ilimitado)' : 'FREE';
      profilePlan.style.color = isPro ? 'var(--accent-green)' : 'var(--primary-blue)';
    }

    const profileCount = document.getElementById('user-profile-count');
    if (profileCount) {
      profileCount.innerText = isPro
        ? `${user.generationsCount || 0} / Ilimitadas`
        : `${user.generationsCount || 0} / ${user.maxGenerationsDaily || 5}`;
    }

    // 4. Modal PRO (#modal-pro): Banner de confirmación si ya es PRO
    const modalProDialog = document.querySelector('#modal-pro .modal-dialog');
    const existingBanner = document.getElementById('pro-active-banner');
    if (isPro) {
      if (!existingBanner && modalProDialog) {
        const banner = document.createElement('div');
        banner.id = 'pro-active-banner';
        banner.style.cssText = 'background: var(--accent-green-subtle); color: var(--accent-green); padding: 12px; border-radius: var(--radius-md); text-align: center; font-weight: 700; margin-bottom: 16px; font-size: 0.85rem; border: 1px solid var(--accent-green);';
        banner.innerHTML = '🎉 ¡Tu membresía PRO está activa! Cuentas con generaciones ilimitadas, catálogo ampliado y soporte prioritario.';
        const grid = modalProDialog.querySelector('div[style*="grid-template-columns"]');
        if (grid) {
          modalProDialog.insertBefore(banner, grid);
        }
      }
    } else {
      if (existingBanner) existingBanner.remove();
    }
  } catch (error) {
    console.error('Error al actualizar interfaz del plan:', error);
  }
}

/**
 * Consulta en tiempo real al backend si el usuario tiene membresía PRO activa.
 * @param {string} email - Correo a verificar.
 * @param {object} options - { silent: boolean, notifyOnSuccess: boolean }
 * @returns {Promise<boolean>}
 */
async function checkUserProLicense(email, options = {}) {
  try {
    if (!email || typeof email !== 'string' || !email.trim()) {
      return false;
    }

    const cleanEmail = email.trim().toLowerCase();

    // Determinar la URL base (sirve tanto bajo servidor HTTP como abriendo localmente file://)
    const baseUrl = window.location.protocol.startsWith('http')
      ? ''
      : 'http://localhost:3000';

    const endpoint = `${baseUrl}/api/check-license?email=${encodeURIComponent(cleanEmail)}`;
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Servidor respondió con código ${response.status}`);
    }

    const data = await response.json();

    if (data && data.success) {
      const isPro = data.isPro === true;
      const wasPro = localStorage.getItem('vendeia_is_pro') === 'true';

      // 1. Persistir en localStorage
      localStorage.setItem('vendeia_is_pro', isPro ? 'true' : 'false');
      localStorage.setItem('vendeia_user_email', cleanEmail);

      // 2. Sincronizar objeto de usuario en Storage
      const user = Storage.getUser();
      user.email = cleanEmail;
      user.isPro = isPro;
      user.plan = isPro ? 'PRO' : 'FREE';
      user.maxGenerationsDaily = isPro ? 99999 : 5;
      Storage.saveUser(user);

      // 3. Reflejar en la interfaz gráfica
      updatePlanUI(isPro);

      // 4. Notificar al usuario si la licencia se activó o si fue solicitado explícitamente
      if (isPro && (!wasPro || options.notifyOnSuccess)) {
        showToast(`🚀 ¡Bienvenido al Plan PRO, ${user.name || 'Emprendedor'}! Tu membresía está 100% activa.`, 'success');
      } else if (!isPro && wasPro) {
        showToast('Tu membresía PRO ha sido actualizada a Plan FREE.', 'info');
      }

      return isPro;
    }

    return false;
  } catch (error) {
    // Si no hay conexión al backend (modo local puro o servidor apagado), usar caché seguro de localStorage
    const cachedPro = localStorage.getItem('vendeia_is_pro') === 'true';
    updatePlanUI(cachedPro);
    return cachedPro;
  }
}

/**
 * Captura parámetros de URL al retornar desde pasarela de Hotmart (ej: ?email=... o ?buyer_email=...)
 */
function handleUrlParameters() {
  try {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email') || params.get('buyer_email') || params.get('correo');
    const nameParam = params.get('name') || params.get('buyer_name') || params.get('nombre');

    if (emailParam && emailParam.trim()) {
      const cleanEmail = emailParam.trim().toLowerCase();
      console.log('🔗 Retorno de Hotmart detectado con correo:', cleanEmail);

      const user = Storage.getUser();
      user.email = cleanEmail;
      if (nameParam && nameParam.trim()) {
        user.name = decodeURIComponent(nameParam.trim());
      }
      Storage.saveUser(user);

      const headerUser = document.getElementById('header-user-name');
      if (headerUser) headerUser.innerText = user.name;

      // Consultar al servidor inmediatamente y mostrar notificación de bienvenida
      checkUserProLicense(cleanEmail, { notifyOnSuccess: true });

      // Limpiar parámetros de la URL sin recargar la página para una experiencia limpia
      if (window.history && window.history.replaceState) {
        const cleanUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }
  } catch (error) {
    console.error('Error al procesar parámetros de URL:', error);
  }
}

// ==========================================================================
// 9. INICIALIZACIÓN
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  Theme.init();

  const user = Storage.getUser();
  const isProCached = localStorage.getItem('vendeia_is_pro') === 'true';
  updatePlanUI(isProCached);
  updateProfileCountUI(user);

  const headerUser = document.getElementById('header-user-name');
  if (headerUser) headerUser.innerText = user.name;

  // Escuchar cierre de modales con escape o backdrop
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  });

  // Navegar a landing inicial
  navigateTo('landing');

  // 1. Prioridad: Verificar si viene con parámetros de Hotmart en la URL
  handleUrlParameters();

  // 2. Si no venía parámetro en URL, verificar con el correo guardado en localStorage/perfil
  const storedEmail = localStorage.getItem('vendeia_user_email') || user.email;
  if (storedEmail && storedEmail.includes('@') && !window.location.search.includes('email=')) {
    checkUserProLicense(storedEmail, { notifyOnSuccess: false });
  }
});
