import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

const htmlRoutes = {
  "index.html": "/",
  "oferta.html": "/oferta",
  "portfolio.html": "/portfolio",
  "portfolio-case.html": "/portfolio/projekt-01",
  "kalendarz.html": "/kalendarz",
  "blog.html": "/blog",
  "blog-post.html": "/blog/jak-przebiega-wspolpraca",
  "qa.html": "/qa",
  "produkty.html": "/produkty",
  "kontakt.html": "/kontakt",
  "regulamin.html": "/regulamin"
};

const hashRoutes = {
  "#oferta": "/oferta",
  "#portfolio": "/portfolio",
  "#blog": "/blog",
  "#qa": "/qa",
  "#kontakt": "/kontakt",
  "#kalendarz": "/kalendarz",
  "#produkty": "/produkty",
  "#regulamin": "/regulamin"
};

const siteNavLinks = [
  ["Oferta", "/oferta"],
  ["Portfolio", "/portfolio"],
  ["Blog", "/blog"],
  ["Kalendarz", "/kalendarz"],
  ["Q&A", "/qa"],
  ["Produkty", "/produkty"],
  ["Kontakt", "/kontakt"],
  ["Regulamin", "/regulamin"]
];

function siteNavAnchors() {
  return siteNavLinks
    .map(([label, href]) => `<a href="${href}" style="color:#544F45;">${label}</a>`)
    .join("\n      ");
}

function standardTopNav() {
  return `<nav style="position:sticky;top:0;z-index:50;background:rgba(250,247,241,0.94);backdrop-filter:blur(6px);border-bottom:1px solid #E3DCC9;">
  <div style="max-width:1180px;margin:0 auto;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;">
    <a href="/" style="font-family:'Anton',sans-serif;font-size:18px;letter-spacing:0.02em;color:#171512;white-space:nowrap;flex:none;">EWA WIERZBA</a>
    <div style="display:flex;gap:20px;flex-wrap:wrap;font-family:'IBM Plex Mono',monospace;font-size:12.5px;text-transform:uppercase;letter-spacing:0.04em;font-weight:600;">
      ${siteNavAnchors()}
    </div>
  </div>
</nav>`;
}

function isExternalUrl(value) {
  return /^(https?:|mailto:|tel:|data:|blob:|#|\/)/i.test(value);
}

function rewriteHtmlLink(value) {
  if (hashRoutes[value]) return hashRoutes[value];

  const [pathPart, hashPart = ""] = value.split("#", 2);
  const [filePart, queryPart = ""] = pathPart.split("?", 2);
  const fileName = filePart.split("/").pop();

  if (!htmlRoutes[fileName]) return null;

  if (fileName === "portfolio-case.html" && queryPart) {
    const slug = new URLSearchParams(queryPart).get("slug");
    return slug ? `/portfolio/${slug}${hashPart ? `#${hashPart}` : ""}` : htmlRoutes[fileName];
  }

  if (fileName === "blog-post.html" && queryPart) {
    const slug = new URLSearchParams(queryPart).get("slug");
    return slug ? `/blog/${slug}${hashPart ? `#${hashPart}` : ""}` : htmlRoutes[fileName];
  }

  return `${htmlRoutes[fileName]}${hashPart ? `#${hashPart}` : ""}`;
}

function rewriteAssetUrl(value, basePath) {
  if (isExternalUrl(value)) return value;
  return `/_ref/${basePath}/${value.replace(/^\.?\//, "")}`;
}

function injectTopNavLinks(html) {
  const nextHtml = html.replace(/<nav\b[\s\S]*?<\/nav>/gi, (nav) => {
    return standardTopNav();
  });

  if (/<nav\b/i.test(nextHtml)) return nextHtml;

  return nextHtml.replace(/<body([^>]*)>/i, `<body$1>\n${standardTopNav()}`);
}

function normalizeVideoTags(html) {
  let next = html
    .replace(/<button\b(?=[^>]*toggleSound)[\s\S]*?<\/button>/gi, "")
    .replace(/[\u{1F507}\u{1F50A}]/gu, "");

  next = next.replace(/<video\b([^>]*)>/gi, (_match, attrs) => {
    const cleaned = attrs
      .replace(/\scontrols\b(?:=(["'])[\s\S]*?\1)?/gi, "")
      .replace(/\sautoplay\b(?:=(["'])[\s\S]*?\1)?/gi, "")
      .replace(/\smuted\b(?:=(["'])[\s\S]*?\1)?/gi, "")
      .replace(/\splaysinline\b(?:=(["'])[\s\S]*?\1)?/gi, "")
      .replace(/\swebkit-playsinline\b(?:=(["'])[\s\S]*?\1)?/gi, "");

    return `<video${cleaned} autoplay muted playsinline webkit-playsinline controls>`;
  });

  if (!next.includes("data-ew-video-init")) {
    next = next.replace(
      /<\/body>/i,
      `<script data-ew-video-init>
function ewPrepareVideo(video) {
  if (!video || video.tagName !== "VIDEO") return;
  if (!video.autoplay) video.autoplay = true;
  if (!video.playsInline) video.playsInline = true;
  if (!video.controls) video.controls = true;
  if (!video.hasAttribute("autoplay")) video.setAttribute("autoplay", "");
  if (!video.hasAttribute("playsinline")) video.setAttribute("playsinline", "");
  if (!video.hasAttribute("webkit-playsinline")) video.setAttribute("webkit-playsinline", "");
  if (!video.hasAttribute("controls")) video.setAttribute("controls", "");

  if (video.dataset.soundUnlocked !== "true") {
    if (!video.muted) video.muted = true;
    if (!video.defaultMuted) video.defaultMuted = true;
    if (!video.hasAttribute("muted")) video.setAttribute("muted", "");
  }

  if (video.dataset.ewVideoReady === "true") return;
  video.dataset.ewVideoReady = "true";
  video.addEventListener("click", function () {
    if (video.muted) {
      video.dataset.soundUnlocked = "true";
      video.muted = false;
      video.removeAttribute("muted");
      if (!video.volume) video.volume = 0.8;
    }
  });
  video.addEventListener("volumechange", function () {
    if (!video.muted) video.dataset.soundUnlocked = "true";
  });
}

function ewPrepareAllVideos() {
  document.querySelectorAll("video").forEach(function (video) {
    ewPrepareVideo(video);
    video.play && video.play().catch(function () {});
  });
}

document.addEventListener("DOMContentLoaded", function () {
  ewPrepareAllVideos();
  var tries = 0;
  var timer = setInterval(function () {
    ewPrepareAllVideos();
    tries += 1;
    if (tries > 8) clearInterval(timer);
  }, 250);
});
</script>
</body>`
    );
  }

  return next;
}

function responsiveCss() {
  return `<style data-ew-responsive>
@media (max-width: 900px) {
  html, body { max-width: 100%; overflow-x: hidden !important; }
  body > x-dc, x-dc > div { max-width: 100% !important; overflow-x: hidden !important; }
  img, video { max-width: 100%; }
  img[src*="ink-mark"] { display: none !important; }
  [style*="width: 593px"],
  [style*="width:593px"],
  [style*="width: 844px"],
  [style*="width:844px"],
  [style*="width: 641px"],
  [style*="width:641px"],
  [style*="width: 475px"],
  [style*="width:475px"],
  [style*="width: 439px"],
  [style*="width:439px"],
  [style*="width: 479px"],
  [style*="width:479px"],
  [style*="width: 402px"],
  [style*="width:402px"],
  [style*="width: 375px"],
  [style*="width:375px"] {
    width: 100% !important;
    max-width: 100% !important;
  }
  [style*="translateX(-6%)"],
  [style*="translateX(6%)"],
  [style*="translateX(-8%)"],
  [style*="translateX(8%)"] {
    transform: none !important;
  }
  [style*="grid-template-columns:1.1fr 0.9fr"],
  [style*="grid-template-columns: 1.1fr 0.9fr"],
  [style*="grid-template-columns:0.85fr 1.15fr"],
  [style*="grid-template-columns: 0.85fr 1.15fr"],
  [style*="grid-template-columns:1fr 1fr"],
  [style*="grid-template-columns: 1fr 1fr"],
  [style*="grid-template-columns:repeat(3,1fr)"],
  [style*="grid-template-columns: repeat(3,1fr)"],
  [style*="grid-template-columns:repeat(5,1fr)"],
  [style*="grid-template-columns: repeat(5,1fr)"],
  [style*="grid-template-columns:280px 1fr"],
  [style*="grid-template-columns: 280px 1fr"] {
    grid-template-columns: 1fr !important;
  }
  [style*="display:grid"][style*="gap:56px"],
  [style*="display:grid"][style*="gap: 56px"],
  [style*="display:grid"][style*="gap:44px"],
  [style*="display:grid"][style*="gap: 44px"] {
    gap: 28px !important;
  }
  [style*="position:absolute"][style*="left:"],
  [style*="position: absolute"][style*="left:"],
  [style*="position:absolute"][style*="right:"],
  [style*="position: absolute"][style*="right:"] {
    max-width: 100% !important;
  }
}
@media (max-width: 760px) {
  nav > div,
  .topnav-inner,
  .nav-in,
  .error404-nav-inner {
    align-items: flex-start !important;
    flex-direction: column !important;
    gap: 12px !important;
    padding: 14px 16px !important;
  }
  nav > div > div,
  .topnav-links,
  .links {
    width: 100% !important;
    gap: 12px 18px !important;
  }
  nav a,
  .topnav-links a,
  .links a {
    line-height: 1.35;
  }
  [style*="padding:36px 24px"],
  [style*="padding: 36px 24px"],
  [style*="padding:0 24px"],
  [style*="padding: 0 24px"] {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
  [style*="margin:110px auto"],
  [style*="margin: 110px auto"] {
    margin-top: 70px !important;
  }
  [style*="font-size: 36px"] {
    font-size: 30px !important;
    height: auto !important;
  }
  [style*="height: 830px"],
  [style*="height:830px"],
  [style*="height: 647px"],
  [style*="height:647px"],
  [style*="height: 593px"],
  [style*="height:593px"] {
    height: auto !important;
  }
  [style*="position:absolute"],
  [style*="position: absolute"] {
    position: static !important;
  }
  aside[style*="position:sticky"] {
    display: none !important;
  }
  main,
  [style*="max-width:72ch"],
  [style*="max-width: 72ch"],
  [style*="max-width:62ch"],
  [style*="max-width: 62ch"] {
    max-width: 100% !important;
    min-width: 0 !important;
  }
}
</style>`;
}

function injectResponsiveCss(html) {
  if (html.includes("data-ew-responsive")) return html;
  return html.replace(/<\/head>/i, `${responsiveCss()}\n</head>`);
}

export function decorateHtml(html) {
  return injectResponsiveCss(normalizeVideoTags(injectTopNavLinks(html)));
}

function normalizeCaseKey(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&amp;/g, "&")
    .replace(/[^a-z0-9]+/g, "");
}

function portfolioCaseAliases(item) {
  const aliases = [item.title, item.slug, item.client];

  if (item.slug === "labirynt") aliases.push("Labirynt RestoBar");
  if (item.slug === "madame-de-minou") aliases.push("Madame de Minou");
  if (item.slug === "soulsister") aliases.push("SoulSisters", "Soulsisters");
  if (item.slug === "pawel_bevz") aliases.push("pawel_bevz");
  if (item.slug === "fryzjerpolski") aliases.push("fryzjerpolski");
  if (item.slug === "vipilatt") aliases.push("vipilatt");
  if (item.slug === "temnuy_s") aliases.push("temnuy_s");

  return aliases.filter(Boolean);
}

export function linkPortfolioCtas(html, cases = [], options = {}) {
  const sourceSuffix = options.from ? `?from=${encodeURIComponent(options.from)}` : "";
  const caseLinks = new Map();

  cases.forEach((item) => {
    portfolioCaseAliases(item).forEach((alias) => {
      caseLinks.set(normalizeCaseKey(alias), `/portfolio/${item.slug}${sourceSuffix}`);
    });
  });
  caseLinks.set(normalizeCaseKey("DocMate"), `/portfolio/wesele-3${sourceSuffix}`);

  let linked = html.replace(
    /(<div\b[^>]*>\s*([^<]+?)\s*<\/div>\s*)<a\b([^>]*)>\s*Zobacz wi(?:ę|e)cej\s*→\s*<\/a>/gi,
    (match, labelHtml, rawLabel, attrs) => {
      const key = normalizeCaseKey(rawLabel);
      const href = caseLinks.get(key);

      if (!href) {
        return match;
      }

      const nextAttrs = (attrs.match(/\bhref=/i)
        ? attrs.replace(/\bhref=(["'])[\s\S]*?\1/i, `href="${href}"`)
        : `${attrs} href="${href}"`)
        .replace(/\s+target=(["'])[\s\S]*?\1/gi, "")
        .replace(/\s+rel=(["'])[\s\S]*?\1/gi, "");

      const nextLabel = /docmate/i.test(rawLabel) ? "" : labelHtml;

      return `${nextLabel}<a${nextAttrs}>Zobacz wi\u0119cej \u2192</a>`;
    }
  );

  linked = linked
    .replace(
      /(<div\b[^>]*style=(["'])[^"]*color:)#FAF7F1([^"]*\2>\s*wroclawskibarber\s*<\/div>)/gi,
      "$1#171512$3"
    )
    .replace(
      /(<div\b[^>]*style=(["'])[^"]*color:)#FAF7F1([^"]*\2>\s*temnuy_s\s*<\/div>)/gi,
      "$1#171512$3"
    );

  linked = linked
    .replace(
      /\bhref=(["'])\/portfolio#sesje-projekt-1\1/gi,
      `href="/portfolio/temnuy_s-photo${sourceSuffix}"`
    )
    .replace(
      /\bhref=(["'])\/portfolio#sesje-projekt-2\1/gi,
      `href="/portfolio/individual-3${sourceSuffix}"`
    )
    .replace(
      /\bhref=(["'])\/portfolio#sesje-projekt-3\1/gi,
      `href="/portfolio/individual-2${sourceSuffix}"`
    );

  return linked.replace(
    /<a\b(?=[^>]*\bhref=(["'])\/portfolio#[^"']+\1)[^>]*>\s*Zobacz wi(?:ę|e)cej\s*→\s*<\/a>/gi,
    ""
  );
}

export function getReferenceHtml(basePath, relativeFile) {
  const filePath = path.join(process.cwd(), "public", "_ref", basePath, relativeFile);
  let html = fs.readFileSync(filePath, "utf8");

  html = html.replace(/href=(["'])([^"']+)\1/g, (match, quote, value) => {
    const route = rewriteHtmlLink(value);
    if (!route && isExternalUrl(value)) return match;
    const nextValue = route || rewriteAssetUrl(value, basePath);
    return `href=${quote}${nextValue}${quote}`;
  });

  html = html.replace(/\b(src|poster)=(["'])([^"']+)\2/g, (_match, attr, quote, value) => {
    return `${attr}=${quote}${rewriteAssetUrl(value, basePath)}${quote}`;
  });

  html = html.replace(/url\((["']?)(?!https?:|data:|\/)([^"')]+)\1\)/g, (_match, quote, value) => {
    return `url(${quote}/_ref/${basePath}/${value.replace(/^\.?\//, "")}${quote})`;
  });

  html = decorateHtml(html);

  return html;
}

export function referenceHtmlResponse(basePath, relativeFile) {
  const html = getReferenceHtml(basePath, relativeFile);

  return new NextResponse(html, {
    headers: {
      "content-type": "text/html; charset=utf-8"
    }
  });
}
