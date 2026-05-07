/**
 * Frontend translation strings for the driver-facing scorecard view.
 * Add new languages by adding a new key with the same structure as 'en'.
 */
const scorecardTranslations = {
  en: {
    // Loading / error states
    loadingScorecard: 'Loading scorecard...',
    scorecardNotFound: 'Scorecard not found',
    scorecardExpired: 'This scorecard link may have expired or is invalid.',
    goHome: 'Go Home',
    // View tabs
    currentWeek: 'Current Week',
    trailingWeeks: '6-Week Trailing',
    // Quick stats
    rank: 'Rank',
    score: 'Score',
    outOf100: 'out of 100',
    packages: 'Packages',
    delivered: 'delivered',
    // Section headers
    overallPerformance: 'Overall Performance',
    overallStanding: 'Overall Standing',
    drivingSafety: 'Driving Safety',
    deliveryQuality: 'Delivery Quality',
    customerFeedback: 'Customer Feedback',
    vehicleInspection: 'Vehicle Inspection Times (DVIC)',
    driverSafetyEvents: 'Driver Safety Events',
    aiFeedback: 'AI Feedback to Improve',
    // Sub-section labels
    ppsBreakdown: 'PPS Non-Compliance Breakdown',
    podRejectsBreakdown: 'Photo-On-Delivery Rejects',
    negativeFeedbackBreakdown: 'Negative Feedback Breakdown',
    eventsPerHundred: 'Events (Per 100 Deliveries)',
    inspectionTimes: 'Inspection Times',
    // DSP note
    noteFromDsp: 'Note from your DSP',
    viewAttachment: 'View Attachment',
    // Trailing notice
    trailingNoticeTitle: '6-Week Trailing Averages',
    trailingNoticeBody: 'Showing averaged metrics from the past 6 weeks',
    // Severity labels
    severe: 'Severe',
    concerning: 'Concerning',
    good: 'Good',
    optimal: 'Optimal',
    // Acknowledgement
    acknowledgeTitle: 'I acknowledge that I have thoroughly reviewed this scorecard',
    acknowledgeBody:
      'By checking this box, you confirm that you have read and understood all performance metrics and feedback provided in this scorecard.',
    scorecardAcknowledged: 'Scorecard Acknowledged',
    confirmedOn: (dateStr) => `Confirmed on ${dateStr}`,
    // Footer
    tapForDetails: 'Tap any metric for details',
    poweredBy: 'Powered by DiveMetric Analytics',
    // Metric detail modal
    calculation: 'Calculation',
    tipsForImprovement: 'Tips for Improvement',
    close: 'Close',
    // Safety events
    eventsRecorded: (n) => `${n} event${n !== 1 ? 's' : ''} recorded`,
    noEventDetails: 'No event details available',
    // Feedback incidents
    incidents: (n) => `${n} incident${n !== 1 ? 's' : ''}`,
    noFeedbackDetails: 'No feedback details available',
    // Safety event modal labels
    eventLabel: (n) => `Event #${n}`,
    source: 'Source',
    reviewStatus: 'Review Status',
    impact: 'Impact',
    vehicle: 'Vehicle',
    // Tier names (displayed in badges)
    tiers: {
      Platinum: 'Platinum',
      Fantastic: 'Fantastic',
      Gold: 'Gold',
      Great: 'Great',
      Silver: 'Silver',
      Fair: 'Fair',
      Bronze: 'Bronze',
      Poor: 'Poor',
      'N/A': 'N/A',
    },
    // Severity badge map (tier value → severity label)
    severityLabels: {
      poor: 'Severe',
      fair: 'Concerning',
      great: 'Good',
      fantastic: 'Optimal',
    },
  },
  es: {
    loadingScorecard: 'Cargando tarjeta de puntuación...',
    scorecardNotFound: 'Tarjeta de puntuación no encontrada',
    scorecardExpired: 'Este enlace de tarjeta de puntuación puede haber expirado o es inválido.',
    goHome: 'Ir al Inicio',
    currentWeek: 'Semana Actual',
    trailingWeeks: 'Promedio 6 Semanas',
    rank: 'Posición',
    score: 'Puntuación',
    outOf100: 'de 100',
    packages: 'Paquetes',
    delivered: 'entregados',
    overallPerformance: 'Desempeño General',
    overallStanding: 'Calificación General',
    drivingSafety: 'Seguridad Vial',
    deliveryQuality: 'Calidad de Entrega',
    customerFeedback: 'Retroalimentación del Cliente',
    vehicleInspection: 'Tiempos de Inspección del Vehículo (DVIC)',
    driverSafetyEvents: 'Eventos de Seguridad del Conductor',
    aiFeedback: 'Retroalimentación de IA para Mejorar',
    ppsBreakdown: 'Desglose de Incumplimiento PPS',
    podRejectsBreakdown: 'Rechazos de Foto en Entrega',
    negativeFeedbackBreakdown: 'Desglose de Retroalimentación Negativa',
    eventsPerHundred: 'Eventos (Por 100 Entregas)',
    inspectionTimes: 'Tiempos de Inspección',
    noteFromDsp: 'Nota de tu DSP',
    viewAttachment: 'Ver Archivo Adjunto',
    trailingNoticeTitle: 'Promedios de las Últimas 6 Semanas',
    trailingNoticeBody: 'Mostrando métricas promedio de las últimas 6 semanas',
    severe: 'Grave',
    concerning: 'Preocupante',
    good: 'Bueno',
    optimal: 'Óptimo',
    acknowledgeTitle: 'Confirmo haber revisado esta tarjeta de puntuación a fondo',
    acknowledgeBody:
      'Al marcar esta casilla, confirmas que has leído y comprendido todas las métricas de desempeño y comentarios proporcionados en esta tarjeta.',
    scorecardAcknowledged: 'Tarjeta de Puntuación Confirmada',
    confirmedOn: (dateStr) => `Confirmado el ${dateStr}`,
    tapForDetails: 'Toca cualquier métrica para ver detalles',
    poweredBy: 'Desarrollado por DiveMetric Analytics',
    calculation: 'Cálculo',
    tipsForImprovement: 'Consejos para Mejorar',
    close: 'Cerrar',
    eventsRecorded: (n) => `${n} evento${n !== 1 ? 's' : ''} registrado${n !== 1 ? 's' : ''}`,
    noEventDetails: 'No hay detalles de eventos disponibles',
    incidents: (n) => `${n} incidente${n !== 1 ? 's' : ''}`,
    noFeedbackDetails: 'No hay detalles de retroalimentación disponibles',
    eventLabel: (n) => `Evento #${n}`,
    source: 'Fuente',
    reviewStatus: 'Estado de Revisión',
    impact: 'Impacto',
    vehicle: 'Vehículo',
    tiers: {
      Platinum: 'Platino',
      Fantastic: 'Fantástico',
      Gold: 'Oro',
      Great: 'Excelente',
      Silver: 'Plata',
      Fair: 'Regular',
      Bronze: 'Bronce',
      Poor: 'Deficiente',
      'N/A': 'N/D',
    },
    severityLabels: {
      poor: 'Grave',
      fair: 'Preocupante',
      great: 'Bueno',
      fantastic: 'Óptimo',
    },
  },
};

/**
 * Returns the translation dictionary for the given language.
 * Falls back to English if the language is not supported.
 */
export const tScorecard = (lang = 'en') =>
  scorecardTranslations[lang] || scorecardTranslations['en'];

/**
 * Spanish labels for metric names from scorecardUtils.js KEY_METRICS / METRIC_DISPLAY_NAMES.
 * Used as a lookup: if lang === 'es' and a label exists here, use it; otherwise keep the English label.
 */
export const METRIC_LABELS_ES = {
  // Safety
  'On-Road Safety Score': 'Puntuación de Seguridad Vial',
  'FICO Score': 'Puntuación FICO',
  'Proper-Park-Sequence Compliance': 'Cumplimiento de Secuencia de Estacionamiento',
  'Paw Print Contact Compliance': 'Cumplimiento de Contacto Huella de Pata',
  Distractions: 'Distracciones',
  Speeding: 'Exceso de Velocidad',
  'Seatbelt Off': 'Cinturón Desabrochado',
  'Follow Distance': 'Distancia de Seguimiento',
  'Sign/Signal Violations': 'Violaciones de Señales',
  'Did Not Apply Parking Brake': 'No Aplicó Freno de Mano',
  'Did Not Shift Gear to Park': 'No Cambió a Estacionamiento',
  // Delivery quality
  'Overall Quality Score': 'Puntuación de Calidad General',
  'Completion Rate': 'Tasa de Completitud',
  'Delivered, Not Received': 'Entregado, No Recibido',
  'Photo-On-Delivery Acceptance': 'Aceptación de Foto en Entrega',
  'Photo-On-Delivery Rejects': 'Rechazos de Foto en Entrega',
  'Delivery Success Behaviors': 'Comportamientos de Entrega Exitosa',
  'Pickup Success Behaviors': 'Comportamientos de Recogida Exitosa',
  // Customer feedback
  'Overall Feedback Score': 'Puntuación General de Retroalimentación',
  'Negative Feedback Rate (CDF DPMO)': 'Tasa de Retroalimentación Negativa (CDF DPMO)',
  'Deliveries w/ Negative Feedback': 'Entregas con Retroalimentación Negativa',
  'Escalation Defects': 'Defectos de Escalación',
  // DVIC
  'Rushed Inspections': 'Inspecciones Apresuradas',
  // Trailing view
  'Overall Performance Score': 'Puntuación de Desempeño General',
  'Overall Standing': 'Calificación General',
  'Total Packages Delivered': 'Total de Paquetes Entregados',
  'Delivery Completion Rate': 'Tasa de Completitud de Entregas',
  'Speeding Events': 'Eventos de Exceso de Velocidad',
  'Seatbelt Off Events': 'Eventos de Cinturón Desabrochado',
  'Distraction Events': 'Eventos de Distracción',
  'Following Distance Events': 'Eventos de Distancia de Seguimiento',
  // POD reject breakdown
  Blurry: 'Borrosa',
  'Human in Photo': 'Persona en Foto',
  'No Package Detected': 'Paquete No Detectado',
  'Package Too Close': 'Paquete Muy Cerca',
  'Photo Too Dark': 'Foto Muy Oscura',
  // Negative feedback categories
  'Mishandled Package': 'Paquete Mal Manejado',
  Unprofessional: 'Falta de Profesionalismo',
  'Did Not Follow Instructions': 'No Siguió Instrucciones',
  'Delivered to Wrong Address': 'Entregado en Dirección Incorrecta',
  'Never Received Delivery': 'Nunca Recibió la Entrega',
  'Received Wrong Item': 'Recibió Artículo Incorrecto',
  // Safety event types
  Distraction: 'Distracción',
  'Sign/Signal Violation': 'Violación de Señal',
  'Following Distance': 'Distancia de Seguimiento',
  Seatbelt: 'Cinturón de Seguridad',
};

/**
 * Spanish translations for METRIC_EXPLANATIONS (from scorecardUtils.js).
 * Keyed identically to METRIC_EXPLANATIONS so the same lookup logic works.
 * MetricDetailModal checks lang === 'es' and falls back to English if a key is missing.
 */
export const METRIC_EXPLANATIONS_ES = {
  ficoScore: {
    title: 'Puntuación de Seguridad FICO',
    desc: 'Puntuación de comportamiento al volante del 0 al 850 basada en telemetría. La aceleración brusca repetida, el frenado repentino, los giros cerrados, las distracciones con el celular y el exceso de velocidad reducen tu puntuación.',
    calc: 'Basado en el análisis de la actividad de conducción. Más alta es mejor. Meta: 800+ para Fantástico',
    tips: ['Acelera y frena de forma más suave y gradual', 'Conduce con precaución en las curvas', 'Mantén la vista en el camino y reduce las distracciones'],
  },
  seatbeltOffRate: {
    title: 'Eventos de Cinturón Desabrochado',
    desc: 'Número de veces por cada 100 viajes en que no usaste el cinturón de seguridad. Se registra un evento cuando el vehículo supera 10 km/h y el cinturón no está abrochado.',
    calc: '(Instancias sin cinturón ÷ Rutas) mostrado como eventos por 100 viajes. Meta: 0',
    tips: ['Abróchat siempre el cinturón antes de arrancar', 'Mantén el cinturón puesto entre paradas'],
  },
  speedingEventRate: {
    title: 'Eventos de Exceso de Velocidad (por 100 Viajes)',
    desc: 'Suma de todos los eventos de exceso de velocidad dividida entre el total de viajes, mostrada como eventos por 100 viajes. Una instancia se registra cuando superas el límite de velocidad en 16+ km/h durante aproximadamente una cuadra.',
    calc: '(Total de eventos de exceso ÷ Total de viajes) × 100. Meta: 0 eventos',
    tips: ['Respeta los límites de velocidad para tu seguridad y la de los demás', 'Presta atención a los cambios de límite de velocidad', 'Reduce la velocidad en zonas residenciales y escolares'],
  },
  distractionsRate: {
    title: 'Eventos de Distracción',
    desc: 'Número de eventos de distracción por 100 viajes. Se capturan tres tipos mediante video: mirar hacia abajo, mirar el teléfono o hablar por teléfono mientras se conduce.',
    calc: '(Eventos de distracción ÷ Viajes) × 100. Meta: 0 eventos',
    tips: ['Mantén la atención en la carretera', 'Activa el modo No Molestar', 'Detente si necesitas usar el teléfono'],
  },
  followingDistanceRate: {
    title: 'Eventos de Distancia de Seguimiento',
    desc: 'Número de eventos de seguimiento demasiado cercano por 100 viajes. Se registra un evento cuando tienes 0.6 segundos o menos de distancia con el vehículo de adelante.',
    calc: '(Eventos de distancia corta ÷ Viajes) × 100. Meta: 0 eventos',
    tips: ['Mantén al menos 3-4 segundos de distancia', 'Aumenta la distancia en condiciones adversas', 'Anticipa las frenadas repentinas'],
  },
  signalViolationsRate: {
    title: 'Violaciones de Señales de Tránsito',
    desc: 'Mide el cumplimiento de señales de tránsito. Incluye violaciones de señales de alto, giros en U ilegales y semáforos en rojo. Las violaciones de luz roja cuentan 10 veces más por su peligrosidad.',
    calc: '(Violaciones ÷ Viajes) × 100, luces rojas con peso 10x. Meta: 0',
    tips: ['Detente completamente en todas las señales de alto', 'Nunca pases un semáforo en rojo', 'Verifica las señales de "No girar en U"'],
  },
  ppsComplianceRate: {
    title: 'Cumplimiento de Secuencia de Estacionamiento (PPS)',
    desc: 'Mide la secuencia correcta de estacionamiento para evitar que el vehículo se mueva: PRIMERO aplica el freno de mano, LUEGO cambia a Estacionamiento. Ambos deben hacerse en ese orden para contar como cumplimiento.',
    calc: '(Paradas conformes ÷ Total de paradas) × 100. Meta: 100%',
    tips: ['Aplica SIEMPRE el freno de mano PRIMERO', 'Luego cambia a Estacionamiento (P)', 'En pendientes, gira las ruedas hacia la banqueta (bajada) o hacia la calle (subida)'],
  },
  ppsDidNotApplyParkingBrake: {
    title: 'No Aplicó Freno de Mano',
    desc: 'Número de paradas en las que no se aplicó el freno de mano. El freno de mano siempre debe activarse PRIMERO, antes de cambiar a Estacionamiento.',
    calc: 'Paradas sin freno de mano ÷ Total de paradas evaluadas. Meta: 0',
    tips: ['Activa siempre el freno de mano antes de cambiar a Estacionamiento', 'Hazlo un hábito en cada parada', 'Verifica que el freno esté completamente activado'],
  },
  ppsDidNotShiftGearToPark: {
    title: 'No Cambió a Estacionamiento (P)',
    desc: 'Número de paradas en las que no se puso la palanca en Estacionamiento. Después de aplicar el freno de mano, siempre coloca la palanca en Estacionamiento antes de bajar.',
    calc: 'Paradas sin cambio a Estacionamiento ÷ Total de paradas evaluadas. Meta: 0',
    tips: ['Cambia siempre a Estacionamiento después de aplicar el freno de mano', 'Nunca bajes del vehículo sin poner la palanca en Estacionamiento', 'Sigue la secuencia: Freno → Estacionamiento → Bajar'],
  },
  pawPrintComplianceRate: {
    title: 'Cumplimiento de Alerta de Huella (Paw Print)',
    desc: 'Antes de dejar tu vehículo, revisa siempre las notas de la parada en la app de entregas. Si ves la alerta de huella de pata o cualquier nota que mencione un perro, trata el lugar como un riesgo potencial de mascotas. Cuando aparezca la alerta, envía un mensaje al cliente para avisarle que llegas.',
    calc: 'Mensajes enviados ÷ Paradas con alerta de huella. Meta: 100%',
    tips: ['Revisa las notas de la app para ver el ícono de huella', 'Envía siempre un mensaje cuando aparezca la alerta', 'Busca perros antes de entrar a la propiedad'],
  },
  deliveryCompletionRate: {
    title: 'Tasa de Completitud de Entregas (DCR)',
    desc: 'Porcentaje de paquetes despachados que se entregaron exitosamente (sin devolver). Se excluyen factores incontrolables como perros, seguridad, clima o cierres de vías.',
    calc: '(Entregados ÷ Despachados) × 100. Meta: ~99% para Fantástico',
    tips: ['Intenta entregar todos los paquetes', 'Lee con atención las notas del cliente', 'Llama a soporte si tienes dificultades'],
  },
  dnr: {
    title: 'Entregado, No Recibido (DNR)',
    desc: 'Paquetes marcados como entregados pero que el cliente reportó no haber recibido. Solo cuenta situaciones controlables: múltiples paquetes en una misma parada, entregado a más de 50 m del geopin o sin foto de entrega.',
    calc: 'Conteo de paquetes DNR. Meta: 0',
    tips: ['Entrega exactamente en la ubicación del geopin', 'Toma siempre una foto clara de la entrega', 'No entregues paquetes de varios clientes al mismo tiempo'],
  },
  podAcceptanceRate: {
    title: 'Aceptación de Foto en Entrega (POD)',
    desc: 'Porcentaje de fotos que fueron útiles y se mostraron a los clientes. Las fotos deben mostrar claramente dónde está el paquete. Volver a tomar una foto no cuenta en tu contra.',
    calc: '(Fotos aceptadas ÷ Oportunidades de POD) × 100. Meta: 98%+',
    tips: ['Aléjate 1-1.5 m del paquete al tomar la foto', 'Asegura buena iluminación', 'Asegúrate de que el paquete sea claramente visible'],
  },
  podRejects: {
    title: 'Rechazos de Foto en Entrega',
    desc: 'Conteo de fotos rechazadas. Razones: borrosa, persona en la foto, paquete no detectado, paquete demasiado cerca, foto muy oscura.',
    calc: 'Total de fotos POD rechazadas. Meta: 0',
    tips: ['Toma fotos claras y bien iluminadas', 'No incluyas personas en el encuadre', 'Muestra claramente la ubicación del paquete'],
  },
  deliverySuccessBehaviors: {
    title: 'Comportamientos de Entrega Exitosa (DSB)',
    desc: 'Métrica DPMO para paquetes DNR donde no seguiste las mejores prácticas: entregas simultáneas, entregado a más de 50 m del punto, uso incorrecto del escáner o sin foto de entrega.',
    calc: '(Incidencias ÷ Entregas) × 1,000,000. Meta: ≤250 para Fantástico',
    tips: ['Entrega a un cliente a la vez', 'Mantente dentro de los 50 m del punto de entrega', 'Toma siempre fotos de entrega'],
  },
  psb: {
    title: 'Comportamientos de Recogida Exitosa (PSB)',
    desc: 'Métrica DPMO para incidencias en recogidas. Mide completar todas las recogidas a tiempo y estar dentro de 500 m al registrar excepciones.',
    calc: '(Incidencias en recogidas ÷ Total de recogidas) × 1,000,000. Meta: lo más bajo posible',
    tips: ['Completa las recogidas dentro de la ventana de tiempo', 'Está en el lugar al registrar excepciones'],
  },
  cdfDpmo: {
    title: 'Tasa de Retroalimentación Negativa (CDF DPMO)',
    desc: 'Retroalimentación de Entrega al Cliente — Defectos Por Millón de Oportunidades. Ejemplo: 1,500 DPMO = 1,500 retroalimentaciones negativas por millón de entregas. Amazon filtra las retroalimentaciones incontrolables.',
    calc: '(Retroalimentación negativa ÷ Entregas) × 1,000,000. Meta: ≤1,160 para Fantástico',
    tips: ['Lee siempre las notas del cliente antes de entregar', 'Sigue las instrucciones al pie de la letra', 'Sé cortés con los clientes'],
  },
  feedbackTier: {
    title: 'Puntuación General de Retroalimentación',
    desc: 'Nivel de retroalimentación del cliente basado en la puntuación CDF DPMO. Niveles: Fantástico (≤1,160), Excelente, Regular, Deficiente.',
    calc: 'Basado en la puntuación CDF DPMO. Meta: nivel Fantástico',
    tips: ['Lee las notas del cliente antes de cada entrega', 'Sé cortés con los clientes', 'Sigue todas las instrucciones'],
  },
  customerEscalationDefect: {
    title: 'Defectos de Escalación',
    desc: 'Incidentes durante la entrega: comportamiento no profesional, violaciones de políticas, daños a la propiedad, problemas de seguridad. Se procesan con 2 semanas de retraso por investigación. Mayor gravedad = 3x de peso.',
    calc: 'Conteo ponderado de incidentes. Meta: 0 para Fantástico',
    tips: ['Sé profesional en todo momento', 'Sigue todas las instrucciones', 'Maneja los paquetes con cuidado'],
  },
  rushedInspections: {
    title: 'Inspecciones Apresuradas (DVIC)',
    desc: 'Inspecciones vehiculares completadas demasiado rápido. Vehículos estándar: mínimo 90 segundos. Furgonetas tipo Step Van: mínimo 5 minutos. Menos de 10 segundos es crítico.',
    calc: 'Conteo de inspecciones apresuradas. Meta: 0',
    tips: ['Tómate al menos 90 segundos para vehículos estándar', 'Tómate al menos 5 minutos para Step Vans', 'Sigue la lista de verificación DVIC completa'],
  },
  qualityTier: {
    title: 'Puntuación de Calidad General',
    desc: 'Nivel de calidad basado en la Tasa de Completitud, Aceptación de Foto en Entrega y Comportamientos de Entrega Exitosa combinados.',
    calc: 'Compuesto de puntuaciones DCR, POD y DSB. Meta: Platino/Fantástico',
    tips: ['Completa todas las entregas', 'Toma fotos de entrega de calidad', 'Sigue las mejores prácticas de entrega'],
  },
  mishandledPackage: {
    title: 'Paquete Mal Manejado',
    desc: 'El cliente reportó que el conductor manejó mal su paquete durante la entrega. Esto puede incluir lanzar, dejar caer o dañar el paquete de cualquier otra forma.',
    calc: 'Conteo de reportes del cliente para esta categoría. Meta: 0',
    tips: ['Maneja todos los paquetes con cuidado', 'Nunca lances paquetes', 'Coloca los paquetes suavemente en el lugar de entrega'],
  },
  unprofessional: {
    title: 'Comportamiento No Profesional',
    desc: 'El cliente reportó un comportamiento no profesional del conductor. Esto puede incluir falta de cortesía, conducta inapropiada o conducción peligrosa observada por el cliente.',
    calc: 'Conteo de reportes del cliente para esta categoría. Meta: 0',
    tips: ['Sé siempre cortés y profesional', 'Viste de manera adecuada', 'Respeta las leyes de tránsito incluso ante los clientes'],
  },
  didNotFollowInstructions: {
    title: 'No Siguió Instrucciones',
    desc: 'El cliente reportó que no se siguieron las instrucciones de entrega. Esto incluye ignorar notas sobre dónde dejar los paquetes o cómo realizar la entrega.',
    calc: 'Conteo de reportes del cliente para esta categoría. Meta: 0',
    tips: ['Lee siempre las notas del cliente antes de entregar', 'Sigue todas las instrucciones especiales', 'Si las instrucciones no son claras, contacta a soporte'],
  },
  deliveredToWrongAddress: {
    title: 'Entregado en Dirección Incorrecta',
    desc: 'El cliente reportó que su paquete fue entregado en una dirección incorrecta, como una casa vecina, número de unidad equivocado o calle diferente.',
    calc: 'Conteo de reportes del cliente para esta categoría. Meta: 0',
    tips: ['Verifica la dirección antes de dejar el paquete', 'Revisa los números de unidad con cuidado', 'Usa el GPS para confirmar la ubicación'],
  },
  neverReceived: {
    title: 'Nunca Recibió la Entrega',
    desc: 'El cliente reportó que nunca recibió el paquete que fue marcado como entregado. Es posible que el paquete no esté en el lugar mostrado en la foto de entrega.',
    calc: 'Conteo de reportes del cliente para esta categoría. Meta: 0',
    tips: ['Toma fotos claras que muestren la ubicación exacta', 'Coloca los paquetes en lugares seguros y visibles', 'Evita dejar paquetes expuestos al mal tiempo'],
  },
  receivedWrongItem: {
    title: 'Recibió Artículo Incorrecto',
    desc: 'El cliente reportó haber recibido el paquete de otra persona. Esto ocurre cuando los paquetes se confunden o se entregan al cliente equivocado.',
    calc: 'Conteo de reportes del cliente para esta categoría. Meta: 0',
    tips: ['Verifica el ID de rastreo antes de cada entrega', 'No entregues paquetes de varios clientes al mismo tiempo', 'Confirma que el paquete corresponde a la dirección de entrega'],
  },
};
