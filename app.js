/**
 * Poem catalog — paths relative to index.html (PDFs in ./poems/)
 * Sorted: Week 1–8, then Midterm.
 */
const POEMS = [
  { title: "Alcohol", category: "Week 1", file: "Alcohol - Moses Yang Poetry I Week 1.pdf" },
  { title: "Through The Mud", category: "Week 2", file: "Through The Mud - Moses Yang Poetry I Week 2.pdf" },
  { title: "A Summer Long", category: "Week 3", file: "A Summer Long - Moses Yang Poetry I Week 3.pdf" },
  { title: "A Kiss Between", category: "Week 4", file: "A Kiss Between - Moses Yang Poetry I Week 4.pdf" },
  { title: "Unprogrammable", category: "Week 4", file: "Unprogrammable - Moses Yang Poetry I Week 4.pdf" },
  { title: "Extra Mild", category: "Week 5", file: "Extra Mild - Moses Yang Poetry I Week 5.pdf" },
  { title: "Sweeping", category: "Week 5", file: "Sweeping - Moses Yang Poetry I Week 5.pdf" },
  { title: "Writer's Block", category: "Week 5", file: "Writer's Block - Moses Yang Poetry I Week 5.pdf" },
  { title: "Erasure & Archive", category: "Week 6", file: "Erasure & Archive - Moses Yang Poetry I Week 6.pdf" },
  { title: "Form & Freedom", category: "Week 7", file: "Form & Freedom - Moses Yang Poetry I Week 7.pdf" },
  { title: "My Mountain", category: "Week 7", file: "My Mountain - Moses Yang Poetry I Week 7.pdf" },
  { title: "The Narrows", category: "Week 8", file: "The Narrows - Moses Yang Poetry I Week 8.pdf" },
  {
    title: "Apart from a part / A part of apart",
    category: "Midterm",
    file: "Apart from a part _ A part of apart - Moses Yang Poetry I Midterm.pdf",
  },
  { title: "Hold my hand", category: "Midterm", file: "Hold my hand - Moses Yang Poetry I Midterm.pdf" },
  { title: "Lost at sea", category: "Midterm", file: "Lost at sea - Moses Yang Poetry I Midterm.pdf" },
  {
    title: "The Brown shooting concerns",
    category: "Midterm",
    file: "The Brown shooting concerns - Moses Yang Poetry I Midterm.pdf",
  },
  { title: "Trudging Downstream", category: "Midterm", file: "Trudging Downstream - Moses Yang Poetry I Midterm.pdf" },
  { title: "Dipty-pical Trauma", category: "Week 9", file: "Dipty-pical Trauma - Moses Yang Poetry I Week 9.pdf" },
  { title: "you're a human being", category: "Week 10", file: "you're a human being - Moses Yang Poetry I Week 10.pdf" },
  { title: "Lament From Penelope", category: "Week 11", file: "Lament From Penelope - Moses Yang Poetry I Week 11.pdf"},
  {title: "小馬", category: "Week 11", file: "小馬 - Moses Yang Poetry I Week 11.pdf"},
];

const CATEGORY_ORDER = [
  "All",
  "Week 1",
  "Week 2",
  "Week 3",
  "Week 4",
  "Week 5",
  "Week 6",
  "Week 7",
  "Week 8",
  "Midterm",
  "Week 9",
  "Week 10",
  "Week 11",
];

const galleryView = document.getElementById("gallery-view");
const readerView = document.getElementById("reader-view");
const poemsGrid = document.getElementById("poems-grid");
const filterBar = document.getElementById("filter-bar");
const mainNav = document.getElementById("main-nav");
const navGallery = document.getElementById("nav-gallery");
const readerTitle = document.getElementById("reader-title");
const readerMeta = document.getElementById("reader-meta");
const readerFrame = document.getElementById("reader-frame");
const readerFallback = document.getElementById("reader-fallback");
const pdfLink = document.getElementById("pdf-link");
const btnBack = document.getElementById("btn-back");
const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");

let activeFilter = "All";
let filteredIndices = POEMS.map((_, i) => i);
let currentPoemIndex = 0;

function getFilteredIndices() {
  if (activeFilter === "All") return POEMS.map((_, i) => i);
  return POEMS.map((p, i) => (p.category === activeFilter ? i : null)).filter((i) => i !== null);
}

function renderFilters() {
  filterBar.innerHTML = "";
  for (const cat of CATEGORY_ORDER) {
    if (cat !== "All" && !POEMS.some((p) => p.category === cat)) continue;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "filter-btn" + (cat === activeFilter ? " is-active" : "");
    btn.textContent = cat;
    btn.addEventListener("click", () => {
      activeFilter = cat;
      filteredIndices = getFilteredIndices();
      renderFilters();
      renderGallery();
    });
    filterBar.appendChild(btn);
  }
}

function renderGallery() {
  poemsGrid.innerHTML = "";
  const indices = getFilteredIndices();
  filteredIndices = indices;

  if (indices.length === 0) {
    const p = document.createElement("p");
    p.className = "empty-state";
    p.textContent = "No poems in this section yet.";
    poemsGrid.appendChild(p);
    return;
  }

  for (const idx of indices) {
    const poem = POEMS[idx];
    const card = document.createElement("button");
    card.type = "button";
    card.className = "poem-card";
    card.innerHTML = `<h2 class="poem-card-title"></h2><p class="poem-card-meta"></p>`;
    card.querySelector(".poem-card-title").textContent = poem.title;
    card.querySelector(".poem-card-meta").textContent = poem.category;
    card.addEventListener("click", () => openReader(idx));
    poemsGrid.appendChild(card);
  }
}

function positionInFiltered(globalIndex) {
  return filteredIndices.indexOf(globalIndex);
}

function openReader(globalIndex) {
  if (!filteredIndices.includes(globalIndex)) {
    activeFilter = "All";
    filteredIndices = getFilteredIndices();
    renderFilters();
    renderGallery();
  }

  currentPoemIndex = globalIndex;
  const poem = POEMS[globalIndex];
  const path = "poems/" + encodeURIComponent(poem.file);

  readerTitle.textContent = poem.title;
  readerMeta.textContent = poem.category;
  readerFrame.classList.remove("hidden");
  readerFallback.classList.add("hidden");
  readerFrame.src = path;
  pdfLink.href = path;
  pdfLink.textContent = "Open PDF in a new tab";

  readerFrame.onload = () => {
    readerFallback.classList.add("hidden");
  };
  readerFrame.onerror = () => {
    readerFrame.classList.add("hidden");
    readerFallback.classList.remove("hidden");
  };

  galleryView.classList.add("hidden");
  readerView.classList.remove("hidden");
  mainNav.classList.remove("hidden");
  updatePager();
  window.location.hash = "read-" + globalIndex;
}

function closeReader() {
  readerView.classList.add("hidden");
  galleryView.classList.remove("hidden");
  readerFrame.src = "";
  mainNav.classList.add("hidden");
  if (window.location.hash.startsWith("#read-")) {
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }
}

function updatePager() {
  const pos = positionInFiltered(currentPoemIndex);
  const hasPrev = pos > 0;
  const hasNext = pos >= 0 && pos < filteredIndices.length - 1;
  btnPrev.disabled = !hasPrev;
  btnNext.disabled = !hasNext;
}

function stepReader(delta) {
  const pos = positionInFiltered(currentPoemIndex);
  if (pos < 0) return;
  const nextPos = pos + delta;
  if (nextPos < 0 || nextPos >= filteredIndices.length) return;
  openReader(filteredIndices[nextPos]);
}

function parseHash() {
  const h = window.location.hash.replace(/^#/, "");
  const m = /^read-(\d+)$/.exec(h);
  if (m) {
    const idx = parseInt(m[1], 10);
    if (idx >= 0 && idx < POEMS.length) {
      openReader(idx);
      return true;
    }
  }
  return false;
}

navGallery.addEventListener("click", () => {
  closeReader();
});

btnBack.addEventListener("click", closeReader);
btnPrev.addEventListener("click", () => stepReader(-1));
btnNext.addEventListener("click", () => stepReader(1));

window.addEventListener("hashchange", () => {
  if (!parseHash() && window.location.hash === "") {
    closeReader();
  }
});

renderFilters();
renderGallery();
if (!parseHash()) {
  readerView.classList.add("hidden");
}
