/**
 * Transparency Dashboard Interactive Module
 * Powers the PhilGEPS Cost Trend chart (Line/Bar toggle + Entity filter)
 * and the DPWH 6th District interactive Leaflet map (Category filter + live pin details).
 */
(function () {
  'use strict';

  const TREND_SERIES = {
    all: [
      { label: '2018 Q1', val: 42, type: 'Q1', note: 'DPWH Infra Allocation' },
      { label: '2018 Q3', val: 38, type: 'Q3', note: 'Medical & DRRM' },
      { label: '2019 Q1', val: 56, type: 'Q1', note: 'DPWH Infra Allocation' },
      { label: '2019 Q3', val: 48, type: 'Q3', note: 'Medical & DRRM' },
      { label: '2020 Q1', val: 51, type: 'Q1', note: 'DPWH Infra Allocation' },
      { label: '2020 Q3', val: 74, type: 'Q3', note: 'Pandemic & Medical Peak' },
      { label: '2021 Q1', val: 68, type: 'Q1', note: 'DPWH Infra Allocation' },
      { label: '2021 Q3', val: 64, type: 'Q3', note: 'Medical & DRRM' },
      { label: '2022 Q1', val: 79, type: 'Q1', note: 'DPWH Infra Allocation' },
      { label: '2022 Q3', val: 61, type: 'Q3', note: 'Medical & DRRM' },
      { label: '2023 Q1', val: 85, type: 'Q1', note: 'DPWH Infra Allocation' },
      { label: '2023 Q3', val: 72, type: 'Q3', note: 'Medical & DRRM' },
      { label: '2024 Q1', val: 92, type: 'Q1', note: 'DPWH Infra Allocation' },
      { label: '2024 Q3', val: 78, type: 'Q3', note: 'Medical & DRRM' },
      { label: '2025 Q1', val: 96, type: 'Q1', note: 'DPWH Infra Peak' },
      { label: '2025 Q4', val: 82, type: 'Q3', note: 'Year-End Procurement' }
    ],
    lgu: [
      { label: '2018 Q1', val: 28, type: 'Q1', note: 'LGU Infra & Ops' },
      { label: '2018 Q3', val: 24, type: 'Q3', note: 'LGU DRRM' },
      { label: '2019 Q1', val: 36, type: 'Q1', note: 'LGU Infra & Ops' },
      { label: '2019 Q3', val: 30, type: 'Q3', note: 'LGU DRRM' },
      { label: '2020 Q1', val: 32, type: 'Q1', note: 'LGU Infra & Ops' },
      { label: '2020 Q3', val: 46, type: 'Q3', note: 'Relief & DRRM Peak' },
      { label: '2021 Q1', val: 44, type: 'Q1', note: 'LGU Infra & Ops' },
      { label: '2021 Q3', val: 40, type: 'Q3', note: 'LGU DRRM' },
      { label: '2022 Q1', val: 52, type: 'Q1', note: 'LGU Infra & Ops' },
      { label: '2022 Q3', val: 39, type: 'Q3', note: 'LGU DRRM' },
      { label: '2023 Q1', val: 58, type: 'Q1', note: 'LGU Infra & Ops' },
      { label: '2023 Q3', val: 47, type: 'Q3', note: 'LGU DRRM' },
      { label: '2024 Q1', val: 62, type: 'Q1', note: 'LGU Infra & Ops' },
      { label: '2024 Q3', val: 51, type: 'Q3', note: 'LGU DRRM' },
      { label: '2025 Q1', val: 66, type: 'Q1', note: 'LGU Infra Peak' },
      { label: '2025 Q4', val: 54, type: 'Q3', note: 'Year-End Ops' }
    ],
    cfermtc: [
      { label: '2018 Q1', val: 18, type: 'Q1', note: 'Hospital Equipment' },
      { label: '2018 Q3', val: 22, type: 'Q3', note: 'Lab Supplies Peak' },
      { label: '2019 Q1', val: 24, type: 'Q1', note: 'Hospital Equipment' },
      { label: '2019 Q3', val: 29, type: 'Q3', note: 'Lab Supplies Peak' },
      { label: '2020 Q1', val: 34, type: 'Q1', note: 'Hospital Expansion' },
      { label: '2020 Q3', val: 62, type: 'Q3', note: 'Medical Emergency Peak' },
      { label: '2021 Q1', val: 42, type: 'Q1', note: 'Hospital Equipment' },
      { label: '2021 Q3', val: 54, type: 'Q3', note: 'Lab Supplies Peak' },
      { label: '2022 Q1', val: 45, type: 'Q1', note: 'Hospital Equipment' },
      { label: '2022 Q3', val: 49, type: 'Q3', note: 'Lab Supplies Peak' },
      { label: '2023 Q1', val: 48, type: 'Q1', note: 'Hospital Equipment' },
      { label: '2023 Q3', val: 56, type: 'Q3', note: 'Lab Supplies Peak' },
      { label: '2024 Q1', val: 52, type: 'Q1', note: 'Hospital Equipment' },
      { label: '2024 Q3', val: 61, type: 'Q3', note: 'Lab Supplies Peak' },
      { label: '2025 Q1', val: 55, type: 'Q1', note: 'Hospital Equipment' },
      { label: '2025 Q4', val: 64, type: 'Q3', note: 'Medical Procurement' }
    ],
    nia: [
      { label: '2018 Q1', val: 26, type: 'Q1', note: 'Irrigation Canals' },
      { label: '2018 Q3', val: 16, type: 'Q3', note: 'Fleet Maintenance' },
      { label: '2019 Q1', val: 34, type: 'Q1', note: 'Irrigation Canals' },
      { label: '2019 Q3', val: 19, type: 'Q3', note: 'Fleet Maintenance' },
      { label: '2020 Q1', val: 29, type: 'Q1', note: 'Irrigation Canals' },
      { label: '2020 Q3', val: 21, type: 'Q3', note: 'Fleet Maintenance' },
      { label: '2021 Q1', val: 38, type: 'Q1', note: 'Irrigation Canals' },
      { label: '2021 Q3', val: 22, type: 'Q3', note: 'Fleet Maintenance' },
      { label: '2022 Q1', val: 44, type: 'Q1', note: 'Irrigation Canals' },
      { label: '2022 Q3', val: 25, type: 'Q3', note: 'Fleet Maintenance' },
      { label: '2023 Q1', val: 49, type: 'Q1', note: 'Irrigation Canals' },
      { label: '2023 Q3', val: 27, type: 'Q3', note: 'Fleet Maintenance' },
      { label: '2024 Q1', val: 53, type: 'Q1', note: 'Irrigation Canals' },
      { label: '2024 Q3', val: 30, type: 'Q3', note: 'Fleet Maintenance' },
      { label: '2025 Q1', val: 57, type: 'Q1', note: 'Irrigation Peak' },
      { label: '2025 Q4', val: 31, type: 'Q3', note: 'Fleet & Parts' }
    ]
  };

  function initCostTrendChart() {
    const container = document.getElementById('philgeps-trend-chart');
    if (!container) return;

    let currentMode = 'line';
    let currentEntity = 'all';

    function render() {
      const points = TREND_SERIES[currentEntity] || TREND_SERIES.all;
      const w = 540;
      const h = 185;
      const padL = 40;
      const padR = 14;
      const padT = 18;
      const padB = 26;
      const plotW = w - padL - padR;
      const plotH = h - padT - padB;
      const maxVal = 100;

      const coords = points.map((pt, i) => {
        const x = padL + (i / (points.length - 1)) * plotW;
        const y = padT + plotH - (pt.val / maxVal) * plotH;
        return { ...pt, x, y };
      });

      const gridLines = [25, 50, 75, 100]
        .map((v) => {
          const gy = (padT + plotH - (v / maxVal) * plotH).toFixed(1);
          return `
            <line x1="${padL}" y1="${gy}" x2="${w - padR}" y2="${gy}" stroke="#e2e8f0" stroke-dasharray="2,3" stroke-width="1"/>
            <text x="${padL - 6}" y="${(parseFloat(gy) + 3).toFixed(1)}" text-anchor="end" font-size="9.5" fill="#94a3b8" font-family="inherit">₱${v}M</text>
          `;
        })
        .join('');

      const yearLabels = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025']
        .map((yr, idx) => {
          const lx = (padL + ((idx * 2) / (points.length - 1)) * plotW).toFixed(1);
          return `<text x="${lx}" y="${h - 6}" font-size="9.5" fill="#64748b" font-family="inherit">${yr}</text>`;
        })
        .join('');

      let chartGeom = '';
      if (currentMode === 'bar') {
        const barW = Math.max(10, (plotW / points.length) * 0.56);
        chartGeom = coords
          .map((c, idx) => {
            const barH = padT + plotH - c.y;
            const fill = c.type === 'Q1' ? '#0032a0' : '#0ea5e9';
            return `<rect class="trend-pt" data-idx="${idx}" x="${(c.x - barW / 2).toFixed(1)}" y="${c.y.toFixed(1)}" width="${barW.toFixed(1)}" height="${barH.toFixed(1)}" rx="3" fill="${fill}" opacity="0.9" style="cursor:pointer;"/>`;
          })
          .join('');
      } else {
        const linePath = coords
          .map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`)
          .join(' ');
        const areaPath = `${linePath} L${coords[coords.length - 1].x.toFixed(1)},${(padT + plotH).toFixed(1)} L${coords[0].x.toFixed(1)},${(padT + plotH).toFixed(1)} Z`;
        const dots = coords
          .map((c, idx) => {
            const dotColor = c.type === 'Q1' ? '#0032a0' : '#0ea5e9';
            return `<circle class="trend-pt" data-idx="${idx}" cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="3.75" fill="${dotColor}" stroke="#fff" stroke-width="1.5" style="cursor:pointer;"/>`;
          })
          .join('');
        chartGeom = `
          <path d="${areaPath}" fill="url(#philgepsAreaGrad)"/>
          <path d="${linePath}" fill="none" stroke="#0032a0" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
          ${dots}
        `;
      }

      container.innerHTML = `
        <div class="trend-chart-wrap" style="position:relative;">
          <svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Monthly Cost Trend Jan 2018 to Dec 2025" style="width:100%;height:auto;display:block;">
            <defs>
              <linearGradient id="philgepsAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#0032a0" stop-opacity="0.16"/>
                <stop offset="100%" stop-color="#0032a0" stop-opacity="0.01"/>
              </linearGradient>
            </defs>
            ${gridLines}
            ${chartGeom}
            ${yearLabels}
          </svg>
          <div class="trend-tooltip" aria-hidden="true"></div>
        </div>
      `;

      const tooltip = container.querySelector('.trend-tooltip');
      const wrap = container.querySelector('.trend-chart-wrap');
      container.querySelectorAll('.trend-pt').forEach((el) => {
        el.addEventListener('mouseenter', () => {
          const pt = coords[Number(el.dataset.idx)];
          tooltip.textContent = `${pt.label} · ${pt.note}`;
          tooltip.style.left = `${(pt.x / w) * 100}%`;
          tooltip.style.top = `${(pt.y / h) * 100}%`;
          tooltip.classList.add('is-visible');
        });
        el.addEventListener('mouseleave', () => tooltip.classList.remove('is-visible'));
      });
      if (wrap) {
        wrap.addEventListener('mouseleave', () => tooltip.classList.remove('is-visible'));
      }
    }

    document.querySelectorAll('[data-chart-mode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        currentMode = btn.dataset.chartMode;
        document.querySelectorAll('[data-chart-mode]').forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        render();
      });
    });

    document.querySelectorAll('[data-entity-filter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        currentEntity = btn.dataset.entityFilter;
        document.querySelectorAll('[data-entity-filter]').forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        render();
      });
    });

    render();
  }

  function initDpwhMap() {
    const mapEl = document.getElementById('dpwh-project-map');
    const listEl = document.getElementById('dpwh-project-list');
    if (!mapEl) return;

    const projects = [
      {
        id: 'flood-agno',
        name: 'Agno & Lagasit River Flood Control & Dikes',
        category: 'Flood Control',
        status: 'In Progress',
        budget: '₱48.50M',
        location: 'Agno & Lagasit River Basin',
        coords: [15.8885, 120.6185]
      },
      {
        id: 'bldg-tumana',
        name: 'Brgy. Tumana West Multi-Purpose Building',
        category: 'Buildings',
        status: 'Completed',
        budget: '₱9.80M',
        location: 'Brgy. Tumana West, Rosales',
        coords: [15.8998, 120.6422]
      },
      {
        id: 'bldg-poblacion',
        name: 'Poblacion Multi-Purpose Civic Facility',
        category: 'Buildings',
        status: 'In Progress',
        budget: '₱14.20M',
        location: 'Poblacion, Rosales',
        coords: [15.8942, 120.6334]
      },
      {
        id: 'road-macarthur',
        name: 'MacArthur Highway Widening & FMR Concreting',
        category: 'Roadways',
        status: 'Bidding',
        budget: '₱36.00M',
        location: 'MacArthur Hwy Corridor',
        coords: [15.8825, 120.6065]
      }
    ];

    const statusMeta = {
      Completed: { color: '#16a34a', cls: 'is-done' },
      'In Progress': { color: '#0032a0', cls: 'is-active' },
      Bidding: { color: '#d97706', cls: 'is-bid' }
    };

    let map = null;
    let layerGroup = null;
    const markersById = {};
    let activeProjectId = projects[0].id;

    if (typeof L !== 'undefined') {
      mapEl.innerHTML = '';
      map = L.map(mapEl, {
        center: [15.892, 120.627],
        zoom: 13,
        scrollWheelZoom: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(map);

      layerGroup = L.layerGroup().addTo(map);
    }

    function selectProject(projectId, panToMap) {
      activeProjectId = projectId;
      if (listEl) {
        listEl.querySelectorAll('.dpwh-project-card').forEach((card) => {
          card.classList.toggle('is-selected', card.dataset.projectId === projectId);
        });
      }
      const marker = markersById[projectId];
      if (panToMap && map && marker) {
        map.setView(marker.getLatLng(), 14, { animate: true });
        marker.openPopup();
      }
    }

    function renderProjects(categoryFilter) {
      const filtered =
        categoryFilter === 'all'
          ? projects
          : projects.filter((p) => p.category === categoryFilter);

      if (filtered.length && !filtered.some((p) => p.id === activeProjectId)) {
        activeProjectId = filtered[0].id;
      }

      if (listEl) {
        listEl.innerHTML = filtered
          .map((p) => {
            const meta = statusMeta[p.status] || statusMeta['In Progress'];
            const selectedCls = p.id === activeProjectId ? ' is-selected' : '';
            return `
              <button type="button" class="dpwh-project-card${selectedCls}" data-project-id="${p.id}" role="listitem">
                <div class="dpwh-proj-top">
                  <span class="dpwh-proj-cat">${p.category}</span>
                  <span class="dpwh-proj-budget">${p.budget}</span>
                </div>
                <div class="dpwh-proj-name">${p.name}</div>
                <div class="dpwh-proj-bottom">
                  <span class="dpwh-proj-loc"><i class="bi bi-geo-alt" aria-hidden="true"></i>${p.location}</span>
                  <span class="dpwh-status-pill ${meta.cls}"><i class="legend-dot" style="background:${meta.color};"></i>${p.status}</span>
                </div>
              </button>
            `;
          })
          .join('');

        listEl.querySelectorAll('.dpwh-project-card').forEach((card) => {
          card.addEventListener('click', () => {
            selectProject(card.dataset.projectId, true);
          });
        });
      }

      if (map && layerGroup) {
        layerGroup.clearLayers();
        Object.keys(markersById).forEach((k) => delete markersById[k]);

        filtered.forEach((p) => {
          const meta = statusMeta[p.status] || statusMeta['In Progress'];
          const marker = L.circleMarker(p.coords, {
            radius: 8,
            fillColor: meta.color,
            color: '#ffffff',
            weight: 2.5,
            opacity: 1,
            fillOpacity: 0.95
          }).addTo(layerGroup);

          marker.bindPopup(
            `<div style="min-width:195px;font-family:inherit;">
              <strong style="display:block;margin-bottom:4px;color:#0f172a;">${p.name}</strong>
              <div style="font-size:12px;color:#475569;margin-bottom:4px;">${p.category} · ${p.location}</div>
              <div style="font-size:12px;margin-bottom:2px;">
                <span style="display:inline-block;padding:2px 8px;border-radius:999px;background:${meta.color};color:#fff;font-weight:600;">${p.status}</span>
              </div>
              <div style="font-size:12px;color:#0f172a;font-weight:700;margin-top:4px;">DPWH Allocation: ${p.budget}</div>
            </div>`
          );

          marker.on('click', () => selectProject(p.id, false));
          markersById[p.id] = marker;
        });

        if (filtered.length > 1) {
          const bounds = L.latLngBounds(filtered.map((p) => p.coords));
          map.fitBounds(bounds, { padding: [36, 36], maxZoom: 14 });
        } else if (filtered.length === 1) {
          map.setView(filtered[0].coords, 14);
        }
      }
    }

    renderProjects('all');

    document.querySelectorAll('[data-dpwh-filter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.dpwhFilter;
        document.querySelectorAll('[data-dpwh-filter]').forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        renderProjects(cat);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initCostTrendChart();
    initDpwhMap();
  });
})();
