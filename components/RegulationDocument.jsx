import fs from "node:fs";
import path from "node:path";

function extractRegulationHtml() {
  const file = path.join(process.cwd(), "content", "regulamin.html");
  const html = fs.readFileSync(file, "utf8");
  const toc = html.match(/<ul class="toc-list"[\s\S]*?<\/ul>/)?.[0] || "";
  const content = html.match(/<main class="content">([\s\S]*?)<\/main>/)?.[1] || "";
  const todo =
    '<div class="reg-todo"><strong>TODO przed publikacją:</strong> potwierdzić i uzupełnić §24.7 zgodnie z CODEX-HANDOFF.md. Nie dopisywać treści bez decyzji klientki.</div>';
  return {
    toc,
    content: content.replace('<section class="reg-section" id="par-24">', `${todo}<section class="reg-section" id="par-24">`)
  };
}

export default function RegulationDocument() {
  const { toc, content } = extractRegulationHtml();

  return (
    <div className="reg-layout">
      <aside className="reg-sidebar">
        <div className="doc-meta">
          <span>Dokument prawny</span>
          <span>26 paragrafów</span>
        </div>
        <div dangerouslySetInnerHTML={{ __html: toc }} />
      </aside>
      <main className="reg-content" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
