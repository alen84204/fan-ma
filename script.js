const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");

menuButton?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLButtonElement && event.target.classList.contains("nav-drop-button")) {
    const dropdown = event.target.closest(".nav-dropdown");
    const isOpen = dropdown.classList.toggle("is-open");
    event.target.setAttribute("aria-expanded", String(isOpen));
    document.querySelectorAll(".nav-dropdown").forEach((item) => {
      if (item !== dropdown) {
        item.classList.remove("is-open");
        item.querySelector(".nav-drop-button")?.setAttribute("aria-expanded", "false");
      }
    });
    return;
  }

  if (event.target instanceof HTMLAnchorElement) {
    nav.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
    document.querySelectorAll(".nav-dropdown").forEach((item) => {
      item.classList.remove("is-open");
      item.querySelector(".nav-drop-button")?.setAttribute("aria-expanded", "false");
    });
  }
});

const mobileAction = document.createElement("div");
mobileAction.className = "mobile-action-bar";
mobileAction.innerHTML = `
  <a href="contact.html">立即諮詢</a>
  <a href="https://www.facebook.com/p/%E6%B1%8E%E9%A6%AC%E6%95%B4%E5%90%88%E8%A1%8C%E9%8A%B7-61558782960194/" target="_blank" rel="noreferrer">Facebook 聯絡</a>
`;
document.body.appendChild(mobileAction);

const currentPage = document.body.dataset.page;
document.querySelector(`[data-nav="${currentPage}"]`)?.classList.add("is-active");

const formatServices = (services) => services.map((service) => `<span>${service}</span>`).join("");

const caseCard = (item) => `
  <article class="case-card-item">
    <a class="case-thumb" href="case.html?case=${item.slug}" aria-label="查看${item.title}">
      <img src="${item.image}" alt="${item.title}活動照片" loading="lazy" />
    </a>
    <div class="case-card-body">
      <div class="case-meta">
        <span>${item.category}</span>
        <span>${item.people}</span>
      </div>
      <h3><a href="case.html?case=${item.slug}">${item.title}</a></h3>
      <p>${item.summary}</p>
      <div class="tag-row">${formatServices(item.services)}</div>
    </div>
  </article>
`;

const params = new URLSearchParams(window.location.search);
const selectedCategory = params.get("category") || "全部";
const cases = window.FANMA_CASES || [];
const categories = window.FANMA_CATEGORIES || [];
const galleryImages = [
  "assets/images/planning.jpg",
  "assets/images/conference.jpg",
  "assets/images/media-party.jpg",
];

document.querySelectorAll("[data-category-filters]").forEach((container) => {
  container.innerHTML = categories
    .map((category) => {
      const href = category === "全部" ? "cases.html" : `cases.html?category=${encodeURIComponent(category)}`;
      const active = selectedCategory === category ? "is-active" : "";
      return `<a class="${active}" href="${href}">${category}</a>`;
    })
    .join("");
});

document.querySelectorAll("[data-case-list]").forEach((container) => {
  const limit = Number(container.dataset.limit || 0);
  const filtered = selectedCategory === "全部" ? cases : cases.filter((item) => item.category === selectedCategory);
  const visibleCases = limit ? filtered.slice(0, limit) : filtered;
  container.innerHTML = visibleCases.map(caseCard).join("");
});

const detailRoot = document.querySelector("[data-case-detail]");
if (detailRoot) {
  const slug = params.get("case");
  const item = cases.find((caseItem) => caseItem.slug === slug);

  if (!item) {
    detailRoot.innerHTML = `
      <section class="page-hero">
        <span class="section-label">Case detail</span>
        <h1>找不到案例</h1>
        <p>請回到案例總覽選擇一篇案例，或確認網址是否正確。</p>
        <a class="button secondary" href="cases.html">返回案例總覽</a>
      </section>
    `;
  } else {
    document.title = `${item.title} | 汎馬整合行銷有限公司`;
    detailRoot.innerHTML = `
      <section class="case-hero">
        <img src="${item.image}" alt="${item.title}活動照片" />
        <div class="case-hero-content">
          <span class="section-label">${item.category}</span>
          <h1>${item.title}</h1>
          <p>${item.summary}</p>
          <div class="tag-row">${formatServices(item.services)}</div>
        </div>
      </section>

      <section class="section case-detail-layout">
        <aside class="case-facts">
          <h2>案例欄位</h2>
          <dl>
            <div><dt>客戶</dt><dd>${item.client}</dd></div>
            <div><dt>地點</dt><dd>${item.location}</dd></div>
            <div><dt>人數</dt><dd>${item.people}</dd></div>
            <div><dt>分類</dt><dd>${item.category}</dd></div>
          </dl>
          <a class="button secondary" href="${item.facebook}">活動紀錄連結</a>
        </aside>
        <article class="case-story">
          <span class="section-label">Event story</span>
          <h2>活動概述</h2>
          <p>
            此案例以活動類型、服務項目與執行亮點為主，協助企業窗口快速理解相近活動可如何規劃。實際合作內容會依客戶需求、場地條件與預算調整。
          </p>
          <h2>活動亮點</h2>
          <ul>
            ${item.highlights.map((highlight) => `<li>${highlight}</li>`).join("")}
          </ul>
          <h2>活動照片</h2>
          <div class="image-placeholder-grid image-gallery-grid">
            <img src="${item.image}" alt="${item.title}封面照片" loading="lazy" />
            ${galleryImages.map((image, index) => `<img src="${image}" alt="${item.title}現場照片 ${index + 1}" loading="lazy" />`).join("")}
          </div>
        </article>
      </section>

      <section class="contact-band">
        <div>
          <span class="section-label">Contact</span>
          <h2>想規劃類似活動？</h2>
          <p>提供活動日期、地點、人數與需求方向，汎馬可以協助整理適合的活動方案。</p>
        </div>
        <a class="button primary light" href="contact.html">聯絡汎馬</a>
      </section>
    `;
  }
}
