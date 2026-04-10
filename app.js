const projects = [
  {
    project: "Stargate I",
    company: "OpenAI / Oracle / SoftBank",
    location: "Abilene, Texas",
    state: "Texas",
    lat: 32.4487,
    lng: -99.7331,
    investment: "$500B program",
    capacity: "1.2 GW",
    capacityMW: 1200,
    size: "4,000,000 sq ft",
    status: "Online",
    expected: "Mid 2026",
    details: "Flagship Stargate campus in Abilene.",
    source: "OpenAI News"
  },
  {
    project: "Stargate Shackelford",
    company: "OpenAI / Oracle / Vantage",
    location: "Shackelford County, Texas",
    state: "Texas",
    lat: 32.72,
    lng: -99.35,
    investment: "$25B",
    capacity: "1.4 GW",
    capacityMW: 1400,
    size: "3,700,000 sq ft",
    status: "Building",
    expected: "H2 2026",
    details: "Frontier campus developed with Vantage.",
    source: "Equipment World"
  },
  {
    project: "Stargate Dona Ana",
    company: "OpenAI / Oracle",
    location: "Dona Ana County, New Mexico",
    state: "New Mexico",
    lat: 32.35,
    lng: -106.75,
    investment: "Undisclosed",
    capacity: "Multi-GW",
    capacityMW: 1000,
    size: "Undisclosed",
    status: "Building",
    expected: "2027",
    details: "Selected as one of the new Stargate expansion sites.",
    source: "OpenAI News"
  },
  {
    project: "Stargate Lordstown",
    company: "SoftBank / OpenAI",
    location: "Lordstown, Ohio",
    state: "Ohio",
    lat: 41.17,
    lng: -80.87,
    investment: "Undisclosed",
    capacity: "750 MW",
    capacityMW: 750,
    size: "Undisclosed",
    status: "Groundbreaking",
    expected: "2026",
    details: "SoftBank-led Stargate site in Ohio.",
    source: "OpenAI News"
  },
  {
    project: "Stargate Milam",
    company: "SoftBank / SB Energy / OpenAI",
    location: "Milam County, Texas",
    state: "Texas",
    lat: 30.75,
    lng: -96.95,
    investment: "Undisclosed",
    capacity: "750 MW",
    capacityMW: 750,
    size: "Undisclosed",
    status: "Building",
    expected: "2026-2027",
    details: "Texas Stargate site backed by SB Energy.",
    source: "OpenAI News"
  },
  {
    project: "Stargate Port Washington",
    company: "OpenAI / Oracle / Vantage",
    location: "Port Washington, Wisconsin",
    state: "Wisconsin",
    lat: 43.39,
    lng: -87.88,
    investment: "$15B+",
    capacity: "902 MW",
    capacityMW: 902,
    size: "2,500,000 sq ft",
    status: "Building",
    expected: "2028",
    details: "Vantage Lighthouse campus in Wisconsin.",
    source: "Vantage DC"
  }
];

const statusStyles = {
  Online: { color: "#0f766e", badge: "badge-online", label: "部分上线" },
  Building: { color: "#2563eb", badge: "badge-building", label: "建设中" },
  Groundbreaking: { color: "#d97706", badge: "badge-ground", label: "已动工" },
  Planned: { color: "#7c3aed", badge: "badge-plan", label: "规划中" }
};

let map;
let markers = [];
let filteredProjects = [...projects];

function getStatusStyle(status) {
  return statusStyles[status] || statusStyles.Building;
}

function getRadius(capacityMW) {
  if (capacityMW >= 1300) return 18;
  if (capacityMW >= 1000) return 16;
  if (capacityMW >= 900) return 14;
  if (capacityMW >= 750) return 12;
  return 10;
}

function buildPopup(project) {
  const style = getStatusStyle(project.status);
  return `
    <article class="popup">
      <h3>${project.project}</h3>
      <div class="popup-company">${project.company}</div>
      <div class="popup-grid">
        <strong>地点</strong><span>${project.location}</span>
        <strong>投资额</strong><span>${project.investment}</span>
        <strong>容量</strong><span>${project.capacity}</span>
        <strong>面积</strong><span>${project.size}</span>
        <strong>状态</strong><span>${style.label}</span>
        <strong>预计时间</strong><span>${project.expected}</span>
      </div>
      <div class="popup-desc">${project.details}</div>
      <div class="popup-source plain-source">来源: ${project.source}</div>
    </article>
  `;
}

function initMap() {
  map = L.map("map", {
    zoomControl: true,
    scrollWheelZoom: true,
    attributionControl: true
  }).setView([38.2, -96], 4);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; OpenStreetMap &copy; CARTO",
    subdomains: "abcd",
    maxZoom: 19
  }).addTo(map);
}

function renderMarkers(data) {
  markers.forEach(item => item.marker.remove());
  markers = [];

  data.forEach(project => {
    const style = getStatusStyle(project.status);
    const marker = L.circleMarker([project.lat, project.lng], {
      radius: getRadius(project.capacityMW),
      color: "#ffffff",
      weight: 2,
      fillColor: style.color,
      fillOpacity: 0.88
    });

    marker.bindPopup(buildPopup(project), {
      maxWidth: 360,
      autoPan: true,
      closeButton: false
    });

    marker.on("mouseover", () => marker.openPopup());
    marker.on("mouseout", () => marker.closePopup());
    marker.on("click", () => marker.openPopup());
    marker.addTo(map);
    markers.push({ project, marker });
  });

  if (markers.length) {
    const group = L.featureGroup(markers.map(item => item.marker));
    map.fitBounds(group.getBounds().pad(0.22));
  }
}

function updateMetrics(data) {
  document.getElementById("metric-total").textContent = String(data.length);
  const totalMW = data.reduce((sum, item) => sum + item.capacityMW, 0);
  document.getElementById("metric-capacity").textContent =
    totalMW >= 1000 ? `${(totalMW / 1000).toFixed(1)} GW` : `${totalMW} MW`;
  const states = new Set(data.map(item => item.state));
  document.getElementById("metric-states").textContent = String(states.size);
}

function renderList(data) {
  const list = document.getElementById("project-list");
  if (!data.length) {
    list.innerHTML = '<div class="empty-state">没有匹配的项目。</div>';
    return;
  }

  list.innerHTML = data.map(project => {
    const style = getStatusStyle(project.status);
    return `
      <article class="project-item" data-project="${project.project}">
        <h3>${project.project}</h3>
        <div class="project-meta">${project.company}</div>
        <div class="project-meta">${project.location} | ${project.capacity}</div>
        <div class="project-desc">${project.details}</div>
        <span class="badge ${style.badge}">${style.label}</span>
      </article>
    `;
  }).join("");

  list.querySelectorAll(".project-item").forEach(card => {
    card.addEventListener("click", () => {
      const project = data.find(item => item.project === card.dataset.project);
      const entry = markers.find(item => item.project.project === project?.project);
      if (!project || !entry) return;
      map.setView([project.lat, project.lng], 7);
      entry.marker.openPopup();
    });
  });
}

function renderTable(data) {
  const table = document.getElementById("table-body");
  table.innerHTML = data.map(project => {
    const style = getStatusStyle(project.status);
    return `
      <tr>
        <td>${project.project}</td>
        <td>${project.company}</td>
        <td>${project.location}</td>
        <td>${project.investment}</td>
        <td>${project.capacity}</td>
        <td>${style.label}</td>
        <td>${project.expected}</td>
      </tr>
    `;
  }).join("");
}

function applyFilters() {
  const keyword = document.getElementById("search-input").value.trim().toLowerCase();
  const status = document.getElementById("status-filter").value;

  filteredProjects = projects.filter(project => {
    const haystack = [
      project.project,
      project.company,
      project.location,
      project.state,
      project.details
    ].join(" ").toLowerCase();
    const matchesKeyword = !keyword || haystack.includes(keyword);
    const matchesStatus = status === "all" || project.status === status;
    return matchesKeyword && matchesStatus;
  });

  renderMarkers(filteredProjects);
  updateMetrics(filteredProjects);
  renderList(filteredProjects);
  renderTable(filteredProjects);
}

document.addEventListener("DOMContentLoaded", () => {
  initMap();
  applyFilters();
  document.getElementById("search-input").addEventListener("input", applyFilters);
  document.getElementById("status-filter").addEventListener("change", applyFilters);
});
