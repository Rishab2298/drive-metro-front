import jsPDF from 'jspdf';

// ===== THEME FROM scorecardView.jsx =====
const THEME = {
  bg: [255, 253, 247],        // #FFFDF7 warm cream
  card: [255, 255, 255],      // #FFFFFF
  subtle: [250, 248, 245],    // #FAF8F5
  text: [92, 84, 112],        // #5C5470
  muted: [158, 154, 167],     // #9E9AA7
  border: [235, 232, 226],    // #EBE8E2
  accent: [184, 169, 154],    // #B8A99A
};

const SEVERITY = {
  fantastic: { bg: [243, 239, 248], text: [124, 106, 153], dot: [165, 148, 192] },
  great: { bg: [239, 245, 239], text: [90, 122, 90], dot: [125, 155, 125] },
  fair: { bg: [255, 245, 235], text: [154, 115, 85], dot: [212, 165, 116] },
  poor: { bg: [252, 240, 240], text: [153, 102, 102], dot: [201, 145, 145] },
};

// Shorter metric labels for PDF
const LABELS = {
  ficoScore: 'FICO Score',
  seatbeltOffRate: 'Seatbelt Off',
  speedingEventRate: 'Speeding Events',
  distractionsRate: 'Distractions',
  followingDistanceRate: 'Following Distance',
  signalViolationsRate: 'Signal Violations',
  pawPrintCompliance: 'Paw Print Compliance',
  ppsComplianceRate: 'PPS Compliance',
  deliveryCompletionRate: 'Completion Rate',
  podAcceptanceRate: 'POD Acceptance',
  deliverySuccessBehaviors: 'Delivery Success',
  dnr: 'DNR (Not Received)',
  podRejects: 'POD Rejects',
  psb: 'Pickup Success',
  cdfDpmo: 'CDF DPMO',
  customerEscalationDefect: 'Escalation Defects',
  deliveriesWithNegativeFeedback: 'Negative Feedback',
  rushedInspections: 'Rushed Inspections',
  dvicRushed: 'Rushed DVIC',
};

const METRICS = {
  safety: ['ficoScore', 'ppsComplianceRate', 'pawPrintCompliance', 'distractionsRate', 'speedingEventRate', 'seatbeltOffRate', 'followingDistanceRate', 'signalViolationsRate'],
  delivery: ['deliveryCompletionRate', 'podAcceptanceRate', 'podRejects', 'dnr', 'deliverySuccessBehaviors', 'psb'],
  customer: ['cdfDpmo', 'deliveriesWithNegativeFeedback', 'customerEscalationDefect'],
  dvic: ['rushedInspections', 'dvicRushed'],
};

const getSeverity = (key, value) => {
  const num = parseFloat(value);
  if (isNaN(num)) {
    if (typeof value === 'string') {
      const t = value.toLowerCase();
      if (t === 'fantastic' || t === 'platinum') return 'fantastic';
      if (t === 'great' || t === 'gold') return 'great';
      if (t === 'fair' || t === 'silver') return 'fair';
      if (t === 'poor' || t === 'bronze') return 'poor';
    }
    return null;
  }
  const k = key.toLowerCase();
  if (k.includes('fico')) return num >= 800 ? 'fantastic' : num >= 700 ? 'great' : num >= 600 ? 'fair' : 'poor';
  if (k.includes('rate') || k.includes('compliance') || k.includes('acceptance')) return num >= 98 ? 'fantastic' : num >= 95 ? 'great' : num >= 90 ? 'fair' : 'poor';
  if (k.includes('dpmo')) return num <= 1000 ? 'fantastic' : num <= 1500 ? 'great' : num <= 2500 ? 'fair' : 'poor';
  return null;
};

const formatVal = (key, val) => {
  if (val === null || val === undefined || val === '') return '-';
  const k = key.toLowerCase();
  if (k.includes('rate') || k.includes('compliance') || k.includes('acceptance')) {
    const n = parseFloat(val);
    if (!isNaN(n) && !String(val).includes('%')) return `${n.toFixed(1)}%`;
  }
  if (k.includes('fico')) return `${val}/850`;
  return String(val);
};

const getLabel = (key) => LABELS[key] || key.replace(/([A-Z])/g, ' $1').trim();

const getMetrics = (driver, keys) => keys
  .filter(k => driver[k] !== null && driver[k] !== undefined && driver[k] !== '')
  .map(k => ({ key: k, label: getLabel(k), value: formatVal(k, driver[k]), sev: getSeverity(k, driver[k]) }));

/**
 * Generate a professional PDF scorecard - single page, 2-column layout
 */
export const generateScorecardPDF = (driver, options = {}) => {
  const { rank, score, isEligible, rankedCount, weekNumber, year, weekStart, dspName } = options;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pw = doc.internal.pageSize.getWidth();  // 210
  const ph = doc.internal.pageSize.getHeight(); // 297
  const m = 14; // margin
  const cw = pw - m * 2; // content width
  let y = m;

  const name = driver.name || [driver.firstName, driver.lastName].filter(Boolean).join(' ') || 'Driver';
  const standing = driver.overallStanding || driver.tier || '-';
  const standSev = getSeverity('tier', standing) || 'great';
  const standCol = SEVERITY[standSev];
  const pkgs = parseInt(driver.packagesDelivered) || 0;

  // Get dspNote from driver object or nested metrics
  const dspNote = driver.dspNote || driver.note || driver.metrics?.dspNote || null;

  // Background
  doc.setFillColor(...THEME.bg);
  doc.rect(0, 0, pw, ph, 'F');

  // ===== HEADER =====
  doc.setFillColor(...THEME.card);
  doc.setDrawColor(...THEME.border);
  doc.roundedRect(m, y, cw, 34, 4, 4, 'FD');

  // Brand
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(...THEME.text);
  doc.text('DiveMetric', m + 8, y + 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...THEME.muted);
  doc.text('Driver Performance Scorecard', m + 8, y + 24);

  // Standing badge (top right)
  const badgeW = 28, badgeH = 11;
  doc.setFillColor(...standCol.bg);
  doc.roundedRect(pw - m - badgeW - 8, y + 6, badgeW, badgeH, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...standCol.text);
  doc.text(standing, pw - m - badgeW / 2 - 8, y + 13, { align: 'center' });

  // Week info
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...THEME.muted);
  doc.text(`Week ${weekNumber || '-'}, ${year || new Date().getFullYear()}`, pw - m - 8, y + 23, { align: 'right' });
  if (weekStart) {
    doc.text(new Date(weekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), pw - m - 8, y + 29, { align: 'right' });
  }

  y += 38;

  // ===== DRIVER INFO =====
  doc.setFillColor(...THEME.card);
  doc.roundedRect(m, y, cw, 30, 4, 4, 'FD');

  // Avatar
  const avatarR = 8;
  const avatarX = m + 12 + avatarR;
  const avatarY = y + 15;
  doc.setFillColor(...standCol.dot);
  doc.circle(avatarX, avatarY, avatarR, 'F');
  const initials = `${driver.firstName?.[0] || ''}${driver.lastName?.[0] || ''}`.toUpperCase() || '?';
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text(initials, avatarX, avatarY + 1.5, { align: 'center' });

  // Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...THEME.text);
  doc.text(name, m + 34, y + 13);

  // ID & Company
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...THEME.muted);
  const subline = [driver.transporterId || driver.employeeId, dspName].filter(Boolean).join('  •  ');
  doc.text(subline || 'N/A', m + 34, y + 22);

  // Packages pill
  doc.setFillColor(...THEME.subtle);
  doc.roundedRect(pw - m - 40, y + 10, 32, 11, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...THEME.text);
  doc.text(`${pkgs.toLocaleString()} pkgs`, pw - m - 24, y + 17.5, { align: 'center' });

  y += 34;

  // ===== SUMMARY CARDS =====
  const boxW = (cw - 8) / 3;
  const boxH = 26;

  const summary = [
    { label: 'RANK', val: isEligible ? `#${rank}` : '-', sub: isEligible ? `of ${rankedCount || '-'}` : 'N/E', sev: isEligible && rank <= 5 ? 'fantastic' : 'great' },
    { label: 'SCORE', val: score ? score.toFixed(1) : '-', sub: 'out of 100', sev: score >= 85 ? 'fantastic' : score >= 70 ? 'great' : score >= 50 ? 'fair' : 'poor' },
    { label: 'STANDING', val: standing, sub: 'Amazon Tier', sev: standSev },
  ];

  summary.forEach((item, i) => {
    const x = m + i * (boxW + 4);
    const col = SEVERITY[item.sev] || SEVERITY.great;

    doc.setFillColor(...col.bg);
    doc.roundedRect(x, y, boxW, boxH, 3, 3, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(...col.text);
    doc.text(item.val, x + boxW / 2, y + 12, { align: 'center' });

    doc.setFontSize(8);
    doc.text(item.label, x + boxW / 2, y + 18, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(item.sub, x + boxW / 2, y + 23, { align: 'center' });
  });

  y += boxH + 4;

  // ===== DSP NOTE =====
  if (dspNote) {
    doc.setFontSize(10);
    const noteLines = doc.splitTextToSize(dspNote, cw - 24);
    const displayLines = noteLines.slice(0, 3);
    const noteH = 20 + displayLines.length * 5;

    doc.setFillColor(...SEVERITY.fantastic.bg);
    doc.setDrawColor(...THEME.border);
    doc.roundedRect(m, y, cw, noteH, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...SEVERITY.fantastic.text);
    doc.text('Note from your DSP', m + 10, y + 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...THEME.text);
    let noteY = y + 18;
    displayLines.forEach((line, i) => {
      const displayText = i === displayLines.length - 1 && noteLines.length > 3 ? line + '...' : line;
      doc.text(displayText, m + 10, noteY);
      noteY += 5;
    });

    y += noteH + 4;
  }

  // ===== 2-COLUMN METRICS =====
  const colW = (cw - 6) / 2;
  const rowH = 9;
  const headerH = 11;

  const renderSection = (section, x, startY) => {
    const metrics = getMetrics(driver, METRICS[section.key]);
    if (metrics.length === 0) return 0;

    const totalH = headerH + metrics.length * rowH + 2;
    const col = SEVERITY[section.sev];

    // Card
    doc.setFillColor(...THEME.card);
    doc.setDrawColor(...THEME.border);
    doc.roundedRect(x, startY, colW, totalH, 3, 3, 'FD');

    // Header
    doc.setFillColor(...col.bg);
    doc.roundedRect(x, startY, colW, headerH, 3, 3, 'F');
    doc.rect(x, startY + headerH - 3, colW, 3, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...col.text);
    doc.text(section.title, x + 6, startY + 8);

    // Metric count
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`(${metrics.length})`, x + colW - 6, startY + 8, { align: 'right' });

    // Rows
    let rowY = startY + headerH + 1;
    metrics.forEach((metric, i) => {
      // Zebra stripe
      if (i % 2 === 0) {
        doc.setFillColor(...THEME.subtle);
        doc.rect(x + 1, rowY, colW - 2, rowH, 'F');
      }

      // Label
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...THEME.text);
      doc.text(metric.label, x + 5, rowY + 6);

      // Value
      const vCol = metric.sev ? SEVERITY[metric.sev] : { text: THEME.text, dot: THEME.muted };
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...vCol.text);
      doc.text(metric.value, x + colW - 12, rowY + 6, { align: 'right' });

      // Dot
      if (metric.sev) {
        doc.setFillColor(...vCol.dot);
        doc.circle(x + colW - 5, rowY + 4.5, 1.5, 'F');
      }

      rowY += rowH;
    });

    return totalH + 4;
  };

  const leftSections = [
    { key: 'safety', title: 'Driving Safety', sev: 'fantastic' },
    { key: 'customer', title: 'Customer Feedback', sev: 'fair' },
  ];
  const rightSections = [
    { key: 'delivery', title: 'Delivery Quality', sev: 'great' },
    { key: 'dvic', title: 'Vehicle Inspection', sev: 'great' },
  ];

  let leftY = y;
  leftSections.forEach(s => { leftY += renderSection(s, m, leftY); });

  let rightY = y;
  rightSections.forEach(s => { rightY += renderSection(s, m + colW + 6, rightY); });

  // ===== FOOTER =====
  doc.setDrawColor(...THEME.border);
  doc.setLineWidth(0.3);
  doc.line(m, ph - 12, pw - m, ph - 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...THEME.muted);
  doc.text('Generated by DiveMetric', m, ph - 7);

  doc.setTextColor(...THEME.accent);
  doc.text(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), pw - m, ph - 7, { align: 'right' });

  return doc;
};

export const downloadScorecardPDF = (driver, options = {}) => {
  const doc = generateScorecardPDF(driver, options);
  const n = driver.name || [driver.firstName, driver.lastName].filter(Boolean).join(' ') || 'driver';
  doc.save(`scorecard-${n.replace(/\s+/g, '-').toLowerCase()}-week${options.weekNumber || ''}.pdf`);
};

export const downloadBulkScorecardPDFs = async (drivers, options = {}, rankMap = {}) => {
  for (const d of drivers) {
    const r = rankMap[d.transporterId] || {};
    downloadScorecardPDF(d, { ...options, rank: r.rank, score: r.score, isEligible: r.eligible });
    await new Promise(res => setTimeout(res, 300));
  }
};

/**
 * Generate a combined PDF with all drivers (one page per driver)
 */
export const downloadCombinedPDF = (drivers, options = {}, rankMap = {}) => {
  if (!drivers || drivers.length === 0) return;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  drivers.forEach((driver, index) => {
    if (index > 0) {
      doc.addPage();
    }

    const r = rankMap[driver.transporterId] || {};
    const driverOptions = { ...options, rank: r.rank, score: r.score, isEligible: r.eligible };

    // Generate the scorecard page directly on the doc
    generateScorecardPage(doc, driver, driverOptions);
  });

  const fileName = `scorecards-combined-week${options.weekNumber || ''}-${drivers.length}drivers.pdf`;
  doc.save(fileName);
};

/**
 * Generate a single scorecard page directly on an existing doc
 */
const generateScorecardPage = (doc, driver, options = {}) => {
  const { rank, score, isEligible, rankedCount, weekNumber, year, weekStart, dspName } = options;

  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const m = 14;
  const cw = pw - m * 2;
  let y = m;

  const name = driver.name || [driver.firstName, driver.lastName].filter(Boolean).join(' ') || 'Driver';
  const standing = driver.overallStanding || driver.tier || '-';
  const standSev = getSeverity('tier', standing) || 'great';
  const standCol = SEVERITY[standSev];
  const pkgs = parseInt(driver.packagesDelivered) || 0;

  // Get dspNote from driver object or nested metrics
  const dspNote = driver.dspNote || driver.note || driver.metrics?.dspNote || null;

  // Background
  doc.setFillColor(...THEME.bg);
  doc.rect(0, 0, pw, ph, 'F');

  // Header
  doc.setFillColor(...THEME.card);
  doc.setDrawColor(...THEME.border);
  doc.roundedRect(m, y, cw, 34, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(...THEME.text);
  doc.text('DiveMetric', m + 8, y + 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...THEME.muted);
  doc.text('Driver Performance Scorecard', m + 8, y + 24);

  const badgeW = 28, badgeH = 11;
  doc.setFillColor(...standCol.bg);
  doc.roundedRect(pw - m - badgeW - 8, y + 6, badgeW, badgeH, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...standCol.text);
  doc.text(standing, pw - m - badgeW / 2 - 8, y + 13, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...THEME.muted);
  doc.text(`Week ${weekNumber || '-'}, ${year || new Date().getFullYear()}`, pw - m - 8, y + 23, { align: 'right' });
  if (weekStart) {
    doc.text(new Date(weekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), pw - m - 8, y + 29, { align: 'right' });
  }

  y += 38;

  // Driver Info
  doc.setFillColor(...THEME.card);
  doc.roundedRect(m, y, cw, 30, 4, 4, 'FD');

  const avatarR = 8;
  const avatarX = m + 12 + avatarR;
  const avatarY = y + 15;
  doc.setFillColor(...standCol.dot);
  doc.circle(avatarX, avatarY, avatarR, 'F');
  const initials = `${driver.firstName?.[0] || ''}${driver.lastName?.[0] || ''}`.toUpperCase() || '?';
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text(initials, avatarX, avatarY + 1.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...THEME.text);
  doc.text(name, m + 34, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...THEME.muted);
  const subline = [driver.transporterId || driver.employeeId, dspName].filter(Boolean).join('  •  ');
  doc.text(subline || 'N/A', m + 34, y + 22);

  doc.setFillColor(...THEME.subtle);
  doc.roundedRect(pw - m - 40, y + 10, 32, 11, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...THEME.text);
  doc.text(`${pkgs.toLocaleString()} pkgs`, pw - m - 24, y + 17.5, { align: 'center' });

  y += 34;

  // Summary Cards
  const boxW = (cw - 8) / 3;
  const boxH = 26;

  const summary = [
    { label: 'RANK', val: isEligible ? `#${rank}` : '-', sub: isEligible ? `of ${rankedCount || '-'}` : 'N/E', sev: isEligible && rank <= 5 ? 'fantastic' : 'great' },
    { label: 'SCORE', val: score ? score.toFixed(1) : '-', sub: 'out of 100', sev: score >= 85 ? 'fantastic' : score >= 70 ? 'great' : score >= 50 ? 'fair' : 'poor' },
    { label: 'STANDING', val: standing, sub: 'Amazon Tier', sev: standSev },
  ];

  summary.forEach((item, i) => {
    const x = m + i * (boxW + 4);
    const col = SEVERITY[item.sev] || SEVERITY.great;

    doc.setFillColor(...col.bg);
    doc.roundedRect(x, y, boxW, boxH, 3, 3, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(...col.text);
    doc.text(item.val, x + boxW / 2, y + 12, { align: 'center' });

    doc.setFontSize(8);
    doc.text(item.label, x + boxW / 2, y + 18, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(item.sub, x + boxW / 2, y + 23, { align: 'center' });
  });

  y += boxH + 4;

  // DSP Note
  if (dspNote) {
    doc.setFontSize(10);
    const noteLines = doc.splitTextToSize(dspNote, cw - 24);
    const displayLines = noteLines.slice(0, 3);
    const noteH = 20 + displayLines.length * 5;

    doc.setFillColor(...SEVERITY.fantastic.bg);
    doc.setDrawColor(...THEME.border);
    doc.roundedRect(m, y, cw, noteH, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...SEVERITY.fantastic.text);
    doc.text('Note from your DSP', m + 10, y + 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...THEME.text);
    let noteY = y + 18;
    displayLines.forEach((line, i) => {
      const displayText = i === displayLines.length - 1 && noteLines.length > 3 ? line + '...' : line;
      doc.text(displayText, m + 10, noteY);
      noteY += 5;
    });

    y += noteH + 4;
  }

  // 2-Column Metrics
  const colW = (cw - 6) / 2;
  const rowH = 9;
  const headerH = 11;

  const renderSection = (section, x, startY) => {
    const metrics = getMetrics(driver, METRICS[section.key]);
    if (metrics.length === 0) return 0;

    const totalH = headerH + metrics.length * rowH + 2;
    const col = SEVERITY[section.sev];

    doc.setFillColor(...THEME.card);
    doc.setDrawColor(...THEME.border);
    doc.roundedRect(x, startY, colW, totalH, 3, 3, 'FD');

    doc.setFillColor(...col.bg);
    doc.roundedRect(x, startY, colW, headerH, 3, 3, 'F');
    doc.rect(x, startY + headerH - 3, colW, 3, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...col.text);
    doc.text(section.title, x + 6, startY + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`(${metrics.length})`, x + colW - 6, startY + 8, { align: 'right' });

    let rowY = startY + headerH + 1;
    metrics.forEach((metric, i) => {
      if (i % 2 === 0) {
        doc.setFillColor(...THEME.subtle);
        doc.rect(x + 1, rowY, colW - 2, rowH, 'F');
      }

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...THEME.text);
      doc.text(metric.label, x + 5, rowY + 6);

      const vCol = metric.sev ? SEVERITY[metric.sev] : { text: THEME.text, dot: THEME.muted };
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...vCol.text);
      doc.text(metric.value, x + colW - 12, rowY + 6, { align: 'right' });

      if (metric.sev) {
        doc.setFillColor(...vCol.dot);
        doc.circle(x + colW - 5, rowY + 4.5, 1.5, 'F');
      }

      rowY += rowH;
    });

    return totalH + 4;
  };

  const leftSections = [
    { key: 'safety', title: 'Driving Safety', sev: 'fantastic' },
    { key: 'customer', title: 'Customer Feedback', sev: 'fair' },
  ];
  const rightSections = [
    { key: 'delivery', title: 'Delivery Quality', sev: 'great' },
    { key: 'dvic', title: 'Vehicle Inspection', sev: 'great' },
  ];

  let leftY = y;
  leftSections.forEach(s => { leftY += renderSection(s, m, leftY); });

  let rightY = y;
  rightSections.forEach(s => { rightY += renderSection(s, m + colW + 6, rightY); });

  // Footer
  doc.setDrawColor(...THEME.border);
  doc.setLineWidth(0.3);
  doc.line(m, ph - 12, pw - m, ph - 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...THEME.muted);
  doc.text('Generated by DiveMetric', m, ph - 7);

  doc.setTextColor(...THEME.accent);
  doc.text(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), pw - m, ph - 7, { align: 'right' });
};

export default generateScorecardPDF;
