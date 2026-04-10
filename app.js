const projects = [
  {
    project: "星际之门 I (旗舰站)",
    company: "OpenAI / Oracle / SoftBank",
    location: "德克萨斯州, 阿比林",
    state: "Texas",
    lat: 32.4487,
    lng: -99.7331,
    investment: "$5000亿 (项目总额)",
    capacity: "1.2 GW",
    capacityMW: 1200,
    size: "4,000,000 平方英尺",
    status: "Online",
    expected: "2026年中",
    details: "旗舰级园区。已在甲骨文云上运行，自 2025 年 6 月起交付 GB200 机架。目标总容量 10 GW。",
    region: "北美",
    source: "https://openai.com/index/five-new-stargate-sites/"
  },
  {
    project: "星际之门 — 沙克尔福德",
    company: "OpenAI / Oracle / Vantage",
    location: "德克萨斯州, 沙克尔福德县",
    state: "Texas",
    lat: 32.72,
    lng: -99.35,
    investment: "$250亿",
    capacity: "1.4 GW",
    capacityMW: 1400,
    size: "3,700,000 平方英尺",
    status: "Building",
    expected: "2026年下半年",
    details: "代号 Frontier。承包商为 Kiewit Corporation。2025 年 9 月宣布的五个核心站点之一。",
    region: "北美",
    source: "https://www.equipmentworld.com/market-pulse/article/15816534/data-center-construction-boom-to-grow-in-2026"
  },
  {
    project: "星际之门 — 多纳安娜",
    company: "OpenAI / Oracle",
    location: "新墨西哥州, 多纳安娜县",
    state: "New Mexico",
    lat: 32.35,
    lng: -106.75,
    investment: "未披露",
    capacity: "多吉瓦 (Multi-GW)",
    capacityMW: 1000,
    size: "未披露",
    status: "Building",
    expected: "2027年",
    details: "从 30 多个州的 300 多项提案中选出。是 2025 年 9 月宣布的扩张计划。",
    region: "北美",
    source: "https://openai.com/index/five-new-stargate-sites/"
  },
  {
    project: "星际之门 — 洛兹敦",
    company: "SoftBank / OpenAI",
    location: "俄亥俄州, 洛兹敦",
    state: "Ohio",
    lat: 41.17,
    lng: -80.87,
    investment: "未披露",
    capacity: "750 MW",
    capacityMW: 750,
    size: "未披露",
    status: "Groundbreaking",
    expected: "2026年",
    details: "软银主导。2025 年动工，采用先进数据中心设计，专为下一代 AI 负载打造。",
    region: "北美",
    source: "https://openai.com/index/five-new-stargate-sites/"
  },
  {
    project: "星际之门 — 米拉姆县",
    company: "SoftBank / SB Energy / OpenAI",
    location: "德克萨斯州, 米拉姆县",
    state: "Texas",
    lat: 30.75,
    lng: -96.95,
    investment: "未披露",
    capacity: "750 MW",
    capacityMW: 750,
    size: "未披露",
    status: "Building",
    expected: "2026-2027年",
    details: "由 SB Energy 提供动力。软银与 OpenAI 的战略合作，旨在实现快速算力部署。",
    region: "北美",
    source: "https://openai.com/index/five-new-stargate-sites/"
  },
  {
    project: "星际之门 — 华盛顿港",
    company: "OpenAI / Oracle / Vantage",
    location: "威斯康星州, 华盛顿港",
    state: "Wisconsin",
    lat: 43.39,
    lng: -87.88,
    investment: "$150亿+",
    capacity: "902 MW",
    capacityMW: 902,
    size: "2,500,000 平方英尺",
    status: "Building",
    expected: "2028年",
    details: "Vantage 灯塔园区。100% 匹配零排放能源，包含四座大型单层数据中心。",
    region: "北美",
    source: "https://vantage-dc.com/data-center-locations/north-america/port-washington-wisconsin"
  },
  {
    project: "星际之门 阿联酋",
    company: "OpenAI / G42 / NVIDIA",
    location: "阿布扎比, 阿联酋",
    state: "Abu Dhabi",
    lat: 24.45,
    lng: 54.65,
    investment: "园区级投资",
    capacity: "5 GW (全园区)",
    capacityMW: 5000,
    size: "10 平方英里",
    status: "Planned",
    expected: "2030年前",
    details: "G42 在阿布扎比建设。美阿 AI 加速伙伴关系的一部分，地缘政治意义重大。",
    region: "中东",
    source: "https://mei.edu/report/from-crude-to-compute-building-the-gcc-ai-stack/"
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
let popupCloseTimer = null;

function getStatusStyle(status) {
  return statusStyles[status] || statusStyles.Building;
}

function getRadius(capacityMW) {
  if (capacityMW >= 3000) return 22;
  if (capacityMW >= 1300) return 18;
  if (capacityMW >= 1000) return 16;
  if (capacityMW >= 900) return 14;
  if (capacityMW >= 750) return 12;
  return 10;
}

function buildPopup(project) {
  const style = getStatusStyle(project.status);
  const sourceMarkup = /^https?:\/\//i.test(project.source)
    ? `<a class="popup-source" href="${project.source}" target="_blank" rel="noreferrer noopener">查看来源</a>`
    : `<div class="popup-source plain-source">来源: ${project.source}</div>`;

  return `
    <article class="popup">
      <h3>${project.project}</h3>
      <div class="popup-company">${project.company}</div>
      <div class="popup-grid">
        <strong>地点</strong><span>${project.location}</span>
        <strong>投资额</strong><span>${project.investment}</span>
        <strong>电力规模</strong><span>${project.capacity}</span>
        <strong>面积</strong><span>${project.size}</span>
        <strong>当前状态</strong><span>${style.label}</span>
        <strong>预计完工</strong><span>${project.expected}</span>
        <strong>区域</strong><span>${project.region}</span>
        <strong>经度</strong><span>${project.lng}</span>
        <strong>纬度</strong><span>${project.lat}</span>
      </div>
      <div class="popup-desc">${project.details}</div>
      ${sourceMarkup}
    </article>
  `;
}

function initMap() {
  map = L.map("map", {
    zoomControl: true,
    scrollWheelZoom: true,
    attributionControl: true
  }).setView([32, -20], 2);

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
      closeButton: true,
      autoClose: true,
      closeOnClick: false
    });

    marker.on("mouseover", () => {
      if (popupCloseTimer) {
        clearTimeout(popupCloseTimer);
        popupCloseTimer = null;
      }
      marker.openPopup();
    });

    marker.on("mouseout", () => {
      popupCloseTimer = setTimeout(() => {
        marker.closePopup();
      }, 250);
    });

    marker.on("click", () => marker.openPopup());
    marker.addTo(map);
    markers.push({ project, marker });
  });

  if (markers.length) {
    const group = L.featureGroup(markers.map(item => item.marker));
    map.fitBounds(group.getBounds().pad(0.22));
  }
}

function bindPopupHoverPersistence() {
  map.on("popupopen", event => {
    const popupEl = event.popup.getElement();
    if (!popupEl) return;

    popupEl.addEventListener("mouseenter", () => {
      if (popupCloseTimer) {
        clearTimeout(popupCloseTimer);
        popupCloseTimer = null;
      }
    });

    popupEl.addEventListener("mouseleave", () => {
      popupCloseTimer = setTimeout(() => {
        map.closePopup(event.popup);
      }, 150);
    });
  });
}

function updateMetrics(data) {
  document.getElementById("metric-total").textContent = String(data.length);
  const totalMW = data.reduce((sum, item) => sum + item.capacityMW, 0);
  document.getElementById("metric-capacity").textContent =
    totalMW >= 1000 ? `${(totalMW / 1000).toFixed(1)} GW` : `${totalMW} MW`;
  const regions = new Set(data.map(item => item.region));
  document.getElementById("metric-states").textContent = String(regions.size);
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
    const sourceCell = /^https?:\/\//i.test(project.source)
      ? `<a href="${project.source}" target="_blank" rel="noreferrer noopener">查看来源</a>`
      : project.source;

    return `
      <tr>
        <td>${project.project}</td>
        <td>${project.company}</td>
        <td>${project.location}</td>
        <td>${project.investment}</td>
        <td>${project.capacity}</td>
        <td>${project.size}</td>
        <td>${style.label}</td>
        <td>${project.expected}</td>
        <td>${project.details}</td>
        <td>${project.region}</td>
        <td>${sourceCell}</td>
        <td>${project.lng}</td>
        <td>${project.lat}</td>
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
      project.details,
      project.region
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
  bindPopupHoverPersistence();
  applyFilters();
  document.getElementById("search-input").addEventListener("input", applyFilters);
  document.getElementById("status-filter").addEventListener("change", applyFilters);
});
