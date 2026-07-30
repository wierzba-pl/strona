import { CALENDAR_SLOTS } from "@/lib/calendar-constants";
import { decorateHtml, getReferenceHtml } from "@/lib/reference-html";

const SITE_NAV = `<a href="/oferta">Oferta</a><a href="/portfolio">Portfolio</a><a href="/blog">Blog</a><a href="/kalendarz">Kalendarz</a><a href="/qa">Q&amp;A</a><a href="/produkty">Produkty</a><a href="/kontakt">Kontakt</a><a href="/regulamin">Regulamin</a>`;

export function htmlResponse(html, status = 200) {
  return new Response(decorateHtml(html), {
    status,
    headers: { "content-type": "text/html; charset=utf-8" }
  });
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function tags(categories = []) {
  return categories.map((category) => `<span class="card-tag">${escapeHtml(category)}</span>`).join("");
}

function firstMediaUrl(value = "") {
  const text = String(value).trim();
  const match = text.match(/https?:\/\/[\s\S]*?(?=\s+https?:\/\/|$)/i);
  return (match?.[0] || text).trim();
}

function normalizeMediaUrl(value = "") {
  const first = firstMediaUrl(value);
  if (!first) return "";

  try {
    return new URL(first).href;
  } catch {
    return first.replace(/\s/g, "%20");
  }
}

function isVideoUrl(value = "") {
  return /\.(mp4|webm|mov|m4v)(?:[?#].*)?$/i.test(firstMediaUrl(value));
}

function portfolioCard(item) {
  const cover = escapeHtml(normalizeMediaUrl(item.coverUrl));
  const media = cover
    ? `<img class="case-cover-image" src="${cover}" alt="${escapeHtml(item.title)}" />`
    : `<div class="case-media-empty" aria-hidden="true"></div>`;

  return `<article class="case-card" data-categories="${escapeHtml(item.categories.join("|"))}">
  <a href="/portfolio/${escapeHtml(item.slug)}" class="case-card-link">
    <div class="case-media">${media}</div>
    <div class="case-card-body">
      <div class="case-tags">${tags(item.categories)}</div>
      <h3 class="case-title">${escapeHtml(item.title)}</h3>
    </div>
  </a>
</article>`;
}

export function renderPortfolioPage(cases, categories, configured) {
  let html = getReferenceHtml("portfolio", "portfolio.html");
  html = html.replace(
    /\.case-media::after\{[\s\S]*?\}\s*(?=\.case-card-body)/,
    ""
  );
  const filterStart = html.indexOf('<div class="filters-bar" id="filtersBar">');
  const gridWrapStart = html.indexOf('<div class="grid-wrap">');

  const chips = categories
    .map((category) => `<button class="filter-chip" data-facet="categories" data-value="${escapeHtml(category)}">${escapeHtml(category)}</button>`)
    .join("");

  const filters = `<div class="filters-bar" id="filtersBar">
<div class="filter-group">
  <div class="filter-group-label">Kategoria</div>
  <div class="filter-chips">${chips}</div>
</div>
  <button class="filters-clear" id="clearFilters">Wyczy&#347;&#263; filtry</button>
</div>

`;

  const cards = cases.map(portfolioCard).join("\n");
  const emptyText = cases.length
    ? "Brak projekt&oacute;w dla wybranych filtr&oacute;w."
    : configured
    ? "Brak opublikowanych projekt&oacute;w w Notion."
    : "Brak konfiguracji Notion dla Portfolio. Dodaj NOTION_API_KEY oraz NOTION_PORTFOLIO_DATABASE_ID.";

  const grid = `<div class="case-grid" id="caseGrid">
${cards}
  </div>
  <div class="empty-state ${cases.length ? "" : "visible"}" id="emptyState">${emptyText}</div>`;

  if (filterStart !== -1 && gridWrapStart !== -1) {
    html = html.slice(0, filterStart) + filters + html.slice(gridWrapStart);
  }

  const gridStart = html.indexOf('<div class="case-grid" id="caseGrid">');
  const emptyStart = html.indexOf('<div class="empty-state"', gridStart);

  if (gridStart !== -1 && emptyStart !== -1) {
    const afterEmpty = html.indexOf("</div>", emptyStart) + "</div>".length;
    html = html.slice(0, gridStart) + grid + html.slice(afterEmpty);
  }

  html = html.replace(
    "</style>",
    `.case-media video{width:100%;height:100%;object-fit:cover;display:block;}
  .case-media::after{content:none!important;display:none!important;}
  .case-cover-image{width:100%;height:100%;object-fit:cover;display:block;}
  .case-media-empty{height:100%;background:#0A0A0A;}
</style>`
  );
  html = html.replace(".split(' ').filter(Boolean)", ".split('|').filter(Boolean)");

  return html;
}

function sectionBlocks(blocks = []) {
  const sections = { intro: [] };
  let current = "intro";

  blocks.forEach((block) => {
    if (block.type === "heading_2" && block.text) {
      current = block.text.trim();
      if (!sections[current]) sections[current] = [];
      return;
    }
    if (!sections[current]) sections[current] = [];
    sections[current].push(block);
  });

  return sections;
}

function paragraphs(blocks = []) {
  return blocks
    .filter((block) => block.text)
    .map((block) => `<p>${escapeHtml(block.text)}</p>`)
    .join("");
}

function serviceChips(blocks = []) {
  const services = blocks
    .filter((block) => block.type === "to_do" && block.checked && block.text)
    .map((block) => block.text);
  return services
    .map((service) => `<span class="service-chip">${escapeHtml(service)}</span>`)
    .join("");
}

function gallery(blocks = []) {
  const images = blocks.filter((block) => block.type === "image" && block.url);
  const linkedMedia = blocks.flatMap((block) => extractMediaUrls(block.text));
  const media = [
    ...images.map((image) => ({ type: "image", url: image.url, caption: image.caption || "" })),
    ...linkedMedia
  ];

  if (!media.length) return `<div class="gallery-slot"></div><div class="gallery-slot"></div><div class="gallery-slot"></div>`;

  return media
    .map((item) => {
      if (item.type === "video") {
        return `<video class="gallery-video" src="${escapeHtml(normalizeMediaUrl(item.url))}" loop preload="metadata" playsinline muted controls></video>`;
      }

      return `<img class="gallery-image" src="${escapeHtml(normalizeMediaUrl(item.url))}" alt="${escapeHtml(item.caption || "")}" />`;
    })
    .join("");
}

function extractMediaUrls(text = "") {
  const urls = String(text).match(/https?:\/\/[^\s<>"']+/gi) || [];

  return urls.map((url) => ({
    type: isVideoUrl(url) ? "video" : "image",
    url
  }));
}

function similarCard(item) {
  const cover = escapeHtml(normalizeMediaUrl(item.coverUrl));
  const media = cover
    ? `<img class="similar-cover-image" src="${cover}" alt="${escapeHtml(item.title)}" />`
    : `<div class="similar-cover-empty" aria-hidden="true"></div>`;

  return `<a class="similar-card" href="/portfolio/${escapeHtml(item.slug)}">
      <div class="similar-media">${media}</div>
      <div class="similar-body"><div class="similar-title">${escapeHtml(item.title)}</div></div>
    </a>`;
}

export function renderPortfolioCasePage(item, similar = [], options = {}) {
  const reference = getReferenceHtml("portfolio", "portfolio-case.html");
  const head = reference.match(/<head>[\s\S]*?<\/head>/i)?.[0] || "<head><meta charset=\"utf-8\"></head>";
  const sections = sectionBlocks(item.blocks);
  const intro = sections.intro?.find((block) => block.text)?.text || "";
  const cover = escapeHtml(normalizeMediaUrl(item.coverUrl));
  const heroMedia = cover
    ? `<img class="hero-cover-image" src="${cover}" alt="${escapeHtml(item.title)}" />`
    : `<div class="hero-cover-empty" aria-hidden="true"></div>`;
  const storyRows = [
    ["Zadanie", sections.Zadanie],
    ["Koncepcja", sections.Koncepcja],
    ["Realizacja", sections.Realizacja]
  ]
    .map(([label, blocks]) => {
      const content = paragraphs(blocks);
      return content ? `<div class="story-label">${label}</div><div class="story-content">${content}</div>` : "";
    })
    .join("");
  const services = serviceChips(sections["U\u017cyte us\u0142ugi"]);
  const result = paragraphs(sections.Rezultat);
  const sourceBackLink =
    options.from === "oferta" ? `<a class="back-link" href="/oferta">&#8592; Wr&oacute;&#263; do Oferty</a>` : "";
  const relatedMainCase =
    item.slug === "temnuy_s-photo"
      ? `<section class="case-cta"><h2 class="case-cta-title">Zobacz g&#322;&oacute;wny kejs Temnuy_s</h2><a class="case-cta-button" href="/portfolio/temnuy_s">Przejd&#378; do Temnuy_s &#8594;</a></section>`
      : "";

  return `<!DOCTYPE html>
<html lang="pl">
${head.replace("</style>", `.hero-cover-image,.similar-cover-image{width:100%;height:100%;object-fit:cover;display:block;}
  .hero-cover-empty,.similar-cover-empty{width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#171512;color:#FAF7F1;font-family:'IBM Plex Mono',monospace;font-size:12px;text-align:center;padding:18px;}
  .topnav-links{display:flex;gap:22px;flex-wrap:wrap;font-family:'IBM Plex Mono',monospace;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;}
  .topnav-links a{color:var(--ink-soft);}
  .gallery-image{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:var(--radius);display:block;}
  .gallery-video{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:var(--radius);display:block;background:#0A0A0A;}
</style>`)}
<body>
<nav class="topnav">
  <div class="topnav-inner">
    <a class="topnav-brand" href="/">EWA WIERZBA</a>
    ${sourceBackLink}
    <div class="topnav-links">${SITE_NAV}</div>
  </div>
</nav>

<header class="case-hero">
  <div class="case-tags">${tags(item.categories)}</div>
  <h1>${escapeHtml(item.title)}</h1>
  ${intro ? `<p class="intro">${escapeHtml(intro)}</p>` : ""}
</header>

<div class="hero-media">${heroMedia}</div>

${storyRows ? `<div class="case-story">${storyRows}</div>` : ""}

${services ? `<div class="services-block">
  <div class="services-label">U&#380;yte us&#322;ugi</div>
  <div class="services-list">${services}</div>
</div>` : ""}

<section class="gallery-section">
  <h2 class="gallery-heading">Galeria</h2>
  <div class="gallery-grid">${gallery(sections.Galeria)}</div>
</section>

${result ? `<section class="result-section">
  <div class="result-eyebrow">Rezultat</div>
  <div class="result-text">${result}</div>
</section>` : ""}

<section class="similar-section">
  <div class="similar-heading">Podobne realizacje</div>
  <div class="similar-grid">${similar.map(similarCard).join("")}</div>
</section>

${relatedMainCase}

<section class="case-cta">
  <h2 class="case-cta-title">Chcesz co&#347; podobnego?</h2>
  <a class="case-cta-button" href="/oferta">Zobacz ofert&#281; &#8594;</a>
</section>
</body>
</html>`;
}

export function renderCalendarPage() {
  const slotsJson = JSON.stringify(CALENDAR_SLOTS);

  return `<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box}body{margin:0;background:#FAF7F1;color:#171512;font-family:'IBM Plex Mono',monospace;font-size:15.5px;line-height:1.6;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}
.nav{position:sticky;top:0;z-index:50;background:rgba(250,247,241,.94);backdrop-filter:blur(6px);border-bottom:1px solid #E3DCC9}.nav-in{max-width:1080px;margin:0 auto;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;gap:20px}.brand{font-family:'Anton',sans-serif;font-size:18px;letter-spacing:.02em}.links{display:flex;gap:22px;flex-wrap:wrap;font-size:13px;text-transform:uppercase;letter-spacing:.05em;font-weight:600}.links a{color:#544F45}.links a.active{color:#D4291B}
.hero{max-width:1080px;margin:0 auto;padding:64px 24px 40px;text-align:center}.eyebrow{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#D4291B;margin-bottom:16px}.hero h1{font-family:'Anton',sans-serif;font-weight:400;text-transform:uppercase;font-size:clamp(30px,5.5vw,50px);line-height:1.05;margin:0 0 28px}
.actions{display:flex;flex-wrap:wrap;gap:14px;justify-content:center}.btn{display:inline-flex;align-items:center;gap:8px;padding:14px 26px;border-radius:40px;font-weight:600;font-size:14.5px}.btn.primary{background:#171512;color:#FAF7F1}.btn.secondary{background:#fff;color:#171512;border:1.5px solid #D0C6AC}
.controls{max-width:1080px;margin:0 auto;padding:0 24px 20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px}.month-nav{display:flex;align-items:center;gap:10px}.small-btn,.jump{font-family:'IBM Plex Mono',monospace;font-size:13px;background:#fff;border:1px solid #D0C6AC;border-radius:3px;padding:9px 12px;color:#171512}.month{font-family:'Anton',sans-serif;font-size:16px;text-transform:uppercase;min-width:180px;text-align:center;display:inline-block}
.legend{display:flex;gap:18px;align-items:center;font-size:13px;color:#544F45;flex-wrap:wrap}.dot{width:11px;height:11px;border-radius:3px;display:inline-block;border:1.5px solid}.free .dot{background:#E8F2FF;border-color:#2F6FAE}.reserved .dot{background:#FCE8E6;border-color:#D4291B}.closed .dot{background:#F1EEE7;border-color:#A79E8C}
.wrap{max-width:1080px;margin:0 auto;padding:0 24px 100px}.calendar{background:#fff;border:1px solid #E3DCC9;border-radius:3px;overflow:hidden}.week,.head{display:grid;grid-template-columns:repeat(7,1fr)}.head div{padding:12px 8px;text-align:center;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.03em;color:#544F45;background:#FAF7F1;border-bottom:1px solid #E3DCC9;border-right:1px solid #E3DCC9}.day{min-height:150px;padding:10px;border-bottom:1px solid #E3DCC9;border-right:1px solid #E3DCC9;background:#fff;display:flex;flex-direction:column;gap:8px}.day.out{opacity:.35}.num{font-size:13px;font-weight:600}.slot{display:flex;justify-content:space-between;gap:8px;border:1px solid #E3DCC9;border-radius:3px;padding:5px 6px;font-size:10.5px;background:#FAF7F1}.slot.free{background:#E8F2FF;border-color:#2F6FAE;color:#245C91}.slot.reserved{background:#FCE8E6;border-color:#D4291B;color:#B51F14}.slot.closed{background:#F1EEE7;border-color:#A79E8C;color:#756F61}.note{max-width:1080px;margin:0 auto 20px;padding:0 24px;color:#8D8778;font-size:12px}
@media(max-width:760px){.week,.head{grid-template-columns:1fr}.head{display:none}.day{min-height:auto}.nav-in{align-items:flex-start;flex-direction:column}}
</style>
</head>
<body>
<nav class="nav"><div class="nav-in"><a class="brand" href="/">EWA WIERZBA</a><div class="links">${SITE_NAV}</div></div></nav>
<header class="hero"><div class="eyebrow">Kalendarz</div><h1>Zarezerwuj<br>sw&oacute;j termin</h1><div class="actions"><a class="btn primary" href="https://instagram.com/direct/t/EWA_WIERZBA_USERNAME" target="_blank" rel="noopener">Napisz do mnie na Instagram</a><a class="btn secondary" href="mailto:hello@ewawierzba.pl">Skontaktuj si&#281; przez Gmail</a></div></header>
<div class="controls"><div class="month-nav"><button class="small-btn" id="prev">&#8592; Poprzedni</button><span class="month" id="monthLabel"></span><button class="small-btn" id="next">Nast&#281;pny &#8594;</button></div><select class="jump" id="jump"></select><div class="legend"><span class="free"><span class="dot"></span> Free</span><span class="reserved"><span class="dot"></span> RESERVED</span><span class="closed"><span class="dot"></span> Zaj&#281;te</span></div></div>
<p class="note">Ka&#380;dy dzie&#324; jest podzielony na trzy przedzia&#322;y: 10:00-13:00, 13:00-16:00, 16:00-21:00.</p>
<div class="wrap"><div class="calendar"><div class="head"><div>Pon</div><div>Wt</div><div>&#346;r</div><div>Czw</div><div>Pt</div><div>Sob</div><div>Nd</div></div><div id="calendar"></div></div></div>
<script>
const SLOTS=${slotsJson};
const MONTHS=["stycze\\u0144","luty","marzec","kwiecie\\u0144","maj","czerwiec","lipiec","sierpie\\u0144","wrzesie\\u0144","pa\\u017adziernik","listopad","grudzie\\u0144"];
const min=new Date(2026,6,1), max=new Date(2027,11,1);
let view=new Date();
if(view<min)view=new Date(min); if(view>max)view=new Date(max);
view=new Date(view.getFullYear(),view.getMonth(),1);
function iso(d){const y=d.getFullYear();const m=String(d.getMonth()+1).padStart(2,"0");const day=String(d.getDate()).padStart(2,"0");return y+"-"+m+"-"+day}
function add(d,n){const x=new Date(d);x.setDate(x.getDate()+n);return x}
function monday(d){const x=new Date(d);const day=x.getDay();x.setDate(x.getDate()+(day===0?-6:1-day));return x}
function monthEnd(d){return new Date(d.getFullYear(),d.getMonth()+1,0)}
function statusLabel(s){return s==="reserved"?"RESERVED":s==="closed"?"Zaj&#281;te":"Free"}
function fillJump(){const jump=document.getElementById("jump");jump.innerHTML="";let c=new Date(min);while(c<=max){const opt=document.createElement("option");opt.value=c.getFullYear()+"-"+c.getMonth();opt.textContent=MONTHS[c.getMonth()]+" "+c.getFullYear();jump.appendChild(opt);c=new Date(c.getFullYear(),c.getMonth()+1,1)}}
async function render(){document.getElementById("monthLabel").textContent=MONTHS[view.getMonth()]+" "+view.getFullYear();document.getElementById("jump").value=view.getFullYear()+"-"+view.getMonth();const start=monday(view);const end=add(monday(monthEnd(view)),6);const res=await fetch("/kalendarz?calendar=1&start="+iso(start)+"&end="+iso(end));const data=await res.json();const map=new Map((data.slots||[]).map(s=>[s.date+"|"+s.slot,s.status]));let html="";let cur=new Date(start);while(cur<=end){html+='<div class="week">';for(let i=0;i<7;i++){const date=iso(cur);const out=cur.getMonth()!==view.getMonth();html+='<div class="day '+(out?'out':'')+'"><span class="num">'+cur.getDate()+"</span>"+SLOTS.map(slot=>{const st=map.get(date+"|"+slot)||"free";return '<div class="slot '+st+'"><span>'+slot+'</span><span>'+statusLabel(st)+'</span></div>'}).join("")+"</div>";cur=add(cur,1)}html+="</div>"}document.getElementById("calendar").innerHTML=html}
document.getElementById("prev").onclick=()=>{view=new Date(view.getFullYear(),view.getMonth()-1,1);if(view<min)view=new Date(min);render()};
document.getElementById("next").onclick=()=>{view=new Date(view.getFullYear(),view.getMonth()+1,1);if(view>max)view=new Date(max);render()};
document.getElementById("jump").onchange=e=>{const [y,m]=e.target.value.split("-").map(Number);view=new Date(y,m,1);render()};
fillJump();render();
</script>
</body>
</html>`;
}
