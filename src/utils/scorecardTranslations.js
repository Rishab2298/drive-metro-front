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
