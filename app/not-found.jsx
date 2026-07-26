import Link from "next/link";

export default function NotFound() {
  return (
    <div className="error404-shell">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @font-face{font-family:'ScriptAccent404';src:url('/_ref/404/uploads/CoveredByYourGrace-Regular.ttf') format('truetype');font-weight:400;font-style:normal;}
            @keyframes error404-wobble{0%,100%{transform:rotate(-3deg);}50%{transform:rotate(3deg);}}
            .error404-shell{background:#FAF7F1;color:#171512;min-height:100vh;display:flex;flex-direction:column;font-family:'IBM Plex Mono',monospace;font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased;}
            .error404-nav{position:sticky;top:0;z-index:50;background:rgba(250,247,241,0.94);backdrop-filter:blur(6px);border-bottom:1px solid #E3DCC9;}
            .error404-nav-inner{max-width:1180px;margin:0 auto;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;gap:20px;}
            .error404-brand{font-family:'Anton',sans-serif;font-size:18px;letter-spacing:0.02em;color:#171512;white-space:nowrap;flex:none;}
            .error404-links{display:flex;gap:22px;flex-wrap:wrap;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;}
            .error404-links a{color:#544F45;}
            .error404-main{flex:1;display:flex;align-items:center;justify-content:center;padding:64px 24px;text-align:center;}
            .error404-card{max-width:600px;}
            .error404-code{font-family:'Anton',sans-serif;font-size:clamp(90px,18vw,180px);line-height:0.9;color:#D4291B;margin:0 0 8px;display:inline-block;transform:rotate(-3deg);animation:error404-wobble 3s ease-in-out infinite;}
            .error404-title{font-family:'Anton',sans-serif;font-weight:400;text-transform:uppercase;font-size:clamp(24px,4vw,36px);line-height:1.1;margin:0 0 18px;}
            .error404-script{font-family:'ScriptAccent404',cursive;color:#D4291B;font-weight:400;text-transform:none;font-size:1.15em;display:inline-block;transform:rotate(-2deg);}
            .error404-text{color:#544F45;font-size:16.5px;margin:0 0 8px;}
            .error404-actions{display:flex;flex-wrap:wrap;gap:14px;justify-content:center;margin-top:36px;}
            .error404-primary,.error404-secondary{display:inline-block;padding:14px 28px;border-radius:40px;font-weight:600;font-size:14.5px;}
            .error404-primary{background:#171512;color:#FAF7F1;}
            .error404-secondary{background:#fff;color:#171512;border:1.5px solid #D0C6AC;}
            .error404-footer{text-align:center;padding:28px 24px;font-family:'IBM Plex Mono',monospace;font-size:12px;color:#8D8778;border-top:1px solid #E3DCC9;}
          `
        }}
      />
      <nav className="error404-nav">
        <div className="error404-nav-inner">
          <Link className="error404-brand" href="/">
            EWA WIERZBA
          </Link>
          <div className="error404-links">
            <Link href="/oferta">Oferta</Link>
            <Link href="/portfolio">Portfolio</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/kalendarz">Kalendarz</Link>
            <Link href="/qa">Q&amp;A</Link>
            <Link href="/produkty">Produkty</Link>
            <Link href="/kontakt">Kontakt</Link>
            <Link href="/regulamin">Regulamin</Link>
          </div>
        </div>
      </nav>
      <main className="error404-main">
        <div className="error404-card">
          <div className="error404-code">404</div>
          <h1 className="error404-title">
            Ups. Ta strona
            <br />
            wysz&#322;a na <span className="error404-script">papierosa</span> i nie wr&#243;ci&#322;a.
          </h1>
          <p className="error404-text">Mo&#380;e &#378;le skr&#281;ci&#322;e&#347;/a&#347; na rondzie internetu.</p>
          <p className="error404-text">
            A mo&#380;e ta strona po prostu jeszcze nie istnieje &mdash; jak m&#243;j porz&#261;dek na biurku.
          </p>
          <div className="error404-actions">
            <Link className="error404-primary" href="/">
              Wr&#243;&#263; na stron&#281; g&#322;&#243;wn&#261; &#8594;
            </Link>
            <Link className="error404-secondary" href="/kontakt">
              Albo po prostu napisz
            </Link>
          </div>
        </div>
      </main>
      <footer className="error404-footer">B&#322;&#261;d 404 &mdash; strona nieznaleziona (ale humor zosta&#322;).</footer>
    </div>
  );
}
