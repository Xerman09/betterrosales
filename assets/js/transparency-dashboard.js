/**
 * Transparency Dashboard Interactive Module
 * Powers the DPWH 6th District interactive Leaflet map (filtered by verified
 * project categories without synthetic budget or status figures).
 */
(function () {
  'use strict';

  function initDpwhMap() {
    const mapEl = document.getElementById('dpwh-project-map');
    const listEl = document.getElementById('dpwh-project-list');
    if (!mapEl) return;

    const areas = [
      {
        id: 'flood-agno',
        name: 'Agno River & Lagasit River Drainage Systems and Dikes',
        category: 'Flood Control',
        location: 'Agno & Lagasit River Basin, Rosales',
        coords: [15.8885, 120.6185]
      },
      {
        id: 'bldg-tumana',
        name: 'Brgy. Tumana West Multi-Purpose Building',
        category: 'Buildings',
        location: 'Brgy. Tumana West, Rosales',
        coords: [15.8998, 120.6422]
      },
      {
        id: 'bldg-poblacion',
        name: 'Poblacion Multi-Purpose Building',
        category: 'Buildings',
        location: 'Poblacion, Rosales',
        coords: [15.8942, 120.6334]
      },
      {
        id: 'road-macarthur',
        name: 'MacArthur Highway Widening & Farm-to-Market Roads',
        category: 'Roadways',
        location: 'MacArthur Hwy Corridor, Rosales',
        coords: [15.8825, 120.6065]
      }
    ];

    let map = null;
    let layerGroup = null;
    const markersById = {};
    let activeId = areas[0].id;

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

    function selectArea(areaId, panToMap) {
      activeId = areaId;
      if (listEl) {
        listEl.querySelectorAll('.dpwh-project-card').forEach((card) => {
          card.classList.toggle('is-selected', card.dataset.projectId === areaId);
        });
      }
      const marker = markersById[areaId];
      if (panToMap && map && marker) {
        map.setView(marker.getLatLng(), 14, { animate: true });
        marker.openPopup();
      }
    }

    function renderAreas(categoryFilter) {
      const filtered =
        categoryFilter === 'all'
          ? areas
          : areas.filter((a) => a.category === categoryFilter);

      if (filtered.length && !filtered.some((a) => a.id === activeId)) {
        activeId = filtered[0].id;
      }

      if (listEl) {
        listEl.innerHTML = filtered
          .map((a) => {
            const selectedCls = a.id === activeId ? ' is-selected' : '';
            return `
              <button type="button" class="dpwh-project-card${selectedCls}" data-project-id="${a.id}" role="listitem">
                <div class="dpwh-proj-top">
                  <span class="dpwh-proj-cat">${a.category}</span>
                </div>
                <div class="dpwh-proj-name">${a.name}</div>
                <div class="dpwh-proj-bottom">
                  <span class="dpwh-proj-loc"><i class="bi bi-geo-alt" aria-hidden="true"></i>${a.location}</span>
                </div>
              </button>
            `;
          })
          .join('');

        listEl.querySelectorAll('.dpwh-project-card').forEach((card) => {
          card.addEventListener('click', () => {
            selectArea(card.dataset.projectId, true);
          });
        });
      }

      if (map && layerGroup) {
        layerGroup.clearLayers();
        Object.keys(markersById).forEach((k) => delete markersById[k]);

        filtered.forEach((a) => {
          const marker = L.circleMarker(a.coords, {
            radius: 8,
            fillColor: '#0032a0',
            color: '#ffffff',
            weight: 2.5,
            opacity: 1,
            fillOpacity: 0.95
          }).addTo(layerGroup);

          marker.bindPopup(
            `<div style="min-width:195px;font-family:inherit;">
              <strong style="display:block;margin-bottom:4px;color:#0f172a;">${a.name}</strong>
              <div style="font-size:12px;color:#475569;">${a.category} · ${a.location}</div>
            </div>`
          );

          marker.on('click', () => selectArea(a.id, false));
          markersById[a.id] = marker;
        });

        if (filtered.length > 1) {
          const bounds = L.latLngBounds(filtered.map((a) => a.coords));
          map.fitBounds(bounds, { padding: [36, 36], maxZoom: 14 });
        } else if (filtered.length === 1) {
          map.setView(filtered[0].coords, 14);
        }
      }
    }

    renderAreas('all');

    document.querySelectorAll('[data-dpwh-filter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.dpwhFilter;
        document.querySelectorAll('[data-dpwh-filter]').forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        renderAreas(cat);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initDpwhMap();
  });
})();
