const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");

menuButton?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    nav.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
  }
});

const currentPage = document.body.dataset.page;
document.querySelector(`[data-nav="${currentPage}"]`)?.classList.add("is-active");

const formatServices = (services) => services.map((service) => `<span>${service}</span>`).join("");

const caseCard = (item) => `
  <article class="case-card-item">
    <a class="case-thumb" href="case.html?case=${item.slug}" aria-label="查看${item.title}">
      <img src="${item.image}" alt="${item.title}範例圖片" loading="lazy" />
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
        <img src="${item.image}" alt="${item.title}範例圖片" />
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
          <a class="button secondary" href="${item.facebook}">原 Facebook 連結占位</a>
        </aside>
        <article class="case-story">
          <span class="section-label">Placeholder copy</span>
          <h2>活動內容占位</h2>
          <p>
            這裡預留給行銷後續改寫正式案例內容。可以放入 Facebook 原貼文摘要、活動背景、客戶需求、汎馬負責的服務範圍、現場亮點與活動成果。
          </p>
          <h2>活動亮點</h2>
          <ul>
            ${item.highlights.map((highlight) => `<li>${highlight}</li>`).join("")}
          </ul>
          <h2>可替換圖片區</h2>
          <div class="image-placeholder-grid">
            <div>封面圖</div>
            <div>現場照片 01</div>
            <div>現場照片 02</div>
            <div>現場照片 03</div>
          </div>
        </article>
      </section>

      <section class="contact-band">
        <div>
          <span class="section-label">Next case</span>
          <h2>想建立更多類似案例？</h2>
          <p>提供照片、貼文連結與客戶資料後，即可依這個模板逐篇替換。</p>
        </div>
        <a class="button primary light" href="contact.html">提供案例資料</a>
      </section>
    `;
  }
}
