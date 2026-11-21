/**
 * Transparency Dashboard Interactive Module
 * Renders the PhilGEPS Monthly Cost Trend SVG chart and the DPWH 6th District
 * interactive Leaflet project map on the homepage.
 */
(function () {
  'use strict';

  function initCostTrendChart() {
    const container = document.getElementById('philgeps-trend-chart');
    if (!container) return;

    // Representative quarterly/annual trend points (Jan 2018 – Dec 2025) highlighting Q1/Q3 peaks
    const points = [
      { label: '2018 Q1', val: 42, note: 'Q1 DPWH Infra' },
      { label: '2018 Q3', val: 38, note: 'Q3 Medical/DRRM' },
      { label: '2019 Q1', val: 56, note: 'Q1 DPWH Infra' },
      { label: '2019 Q3', val: 48, note: 'Q3 Medical/DRRM' },
      { label: '2020 Q1', val: 51, note: 'Q1 DPWH Infra' },
      { label: '2020 Q3', val: 74, note: 'Q3 Pandemic/Medical' },
      { label: '2021 Q1', val: 68, note: 'Q1 DPWH Infra' },
      { label: '2021 Q3', val: 64, note: 'Q3 Medical/DRRM' },
      { label: '2022 Q1', val: 79, note: 'Q1 DPWH Infra' },
      { label: '2022 Q3', val: 61, note: 'Q3 Medical/DRRM' },
      { label: '2023 Q1', val: 85, note: 'Q1 DPWH Infra' },
      { label: '2023 Q3', val: 72, note: 'Q3 Medical/DRRM' },
      { label: '2024 Q1', val: 92, note: 'Q1 DPWH Infra' },
      { label: '2024 Q3', val: 78, note: 'Q3 Medical/DRRM' },
      { label: '2025 Q1', val: 96, note: 'Q1 DPWH Infra' },
      { label: '2025 Q4', val: 82, note: 'Q4 Year-End' }
    ];

    const w = 520;
    const h = 150;
    const padL = 28;
    const padR = 14;
    const padT = 16;
    const padB = 26;
    const plotW = w - padL - padR;
    const plotH = h - padT - padB;
    const maxVal = 100;

    const coords = points.map((pt, i) => {
      const x = padL + (i / (points.length - 1)) * plotW;
      const y = padT + plotH - (pt.val / maxVal) * plotH;
      return { ...pt, x, y };
    });

    const linePath = coords
      .map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`)
      .join(' ');
    const areaPath = `${linePath} L${coords[coords.length - 1].x.toFixed(1)},${(padT + plotH).toFixed(1)} L${coords[0].x.toFixed(1)},${(padT + plotH).toFixed(1)} Z`;

    const gridLines = [25, 50, 75, 100]
      .map((v) => {
        const gy = (padT + plotH - (v / maxVal) * plotH).toFixed(1);
        return `<line x1="${padL}" y1="${gy}" x2="${w - padR}" y2="${gy}" stroke="#e2e8f0" stroke-dasharray="3,3" stroke-width="1"/>`;
      })
      .join('');

    const yearLabels = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025']
      .map((yr, idx) => {
        const lx = (padL + ((idx * 2) / (points.length - 1)) * plotW).toFixed(1);
        return `<text x="${lx}" y="${h - 6}" font-size="10" fill="#64748b" font-family="inherit">${yr}</text>`;
      })
      .join('');

    const dots = coords
      .map(
        (c) =>
          `<circle cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="3.5" fill="#0032a0" stroke="#fff" stroke-width="1.5"><title>${c.label}: ${c.note}</title></circle>`
      )
      .join('');

    container.innerHTML = `
      <svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Monthly Cost Trend Jan 2018 to Dec 2025" style="width:100%;height:auto;display:block;">
        <defs>
          <linearGradient id="philgepsAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0032a0" stop-opacity="0.22"/>
            <stop offset="100%" stop-color="#0032a0" stop-opacity="0.01"/>
          </linearGradient>
        </defs>
        ${gridLines}
        <path d="${areaPath}" fill="url(#philgepsAreaGrad)"/>
        <path d="${linePath}" fill="none" stroke="#0032a0" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        ${dots}
        ${yearLabels}
      </svg>
    `;
  }

  function initDpwhMap() {
    const mapEl = document.getElementById('dpwh-project-map');
    if (!mapEl || typeof L === 'undefined') return;

    // Clear JS-required placeholder text before initializing Leaflet
    mapEl.innerHTML = '';

    const map = L.map(mapEl, {
      center: [15.8942, 120.6334],
      zoom: 13,
      scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(map);

    const projects = [
      {
        name: 'Agno & Lagasit River Flood Control & Dikes',
        category: 'Flood Control',
        status: 'In Progress',
        budget: '₱ 48.50M',
        coords: [15.8885, 120.6185]
      },
      {
        name: 'Brgy. Tumana West Multi-Purpose Building',
        category: 'Buildings',
        status: 'Completed',
        budget: '₱ 9.80M',
        coords: [15.8998, 120.6422]
      },
      {
        name: 'Poblacion Multi-Purpose Civic Facility',
        category: 'Buildings',
        status: 'In Progress',
        budget: '₱ 14.20M',
        coords: [15.8942, 120.6334]
      },
      {
        name: 'MacArthur Highway Widening & FMR Concreting',
        category: 'Roadways',
        status: 'Bidding',
        budget: '₱ 36.00M',
        coords: [15.8825, 120.6065]
      }
    ];

    const statusColors = {
      Completed: '#16a34a',
      'In Progress': '#0032a0',
      Bidding: '#d97706'
    };

    projects.forEach((p) => {
      const color = statusColors[p.status] || '#0032a0';
      const marker = L.circleMarker(p.coords, {
        radius: 8,
        fillColor: color,
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.92
      }).addTo(map);

      marker.bindPopup(
        `<div style="min-width:190px;font-family:inherit;">
          <strong style="display:block;margin-bottom:4px;color:#0f172a;">${p.name}</strong>
          <div style="font-size:12px;color:#475569;margin-bottom:4px;">Category: ${p.category}</div>
          <div style="font-size:12px;margin-bottom:2px;">
            <span style="display:inline-block;padding:2px 8px;border-radius:999px;background:${color};color:#fff;font-weight:600;">${p.status}</span>
          </div>
          <div style="font-size:12px;color:#0f172a;font-weight:700;margin-top:4px;">DPWH Allocation: ${p.budget}</div>
        </div>`
      );
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initCostTrendChart();
    initDpwhMap();
  });
})();
