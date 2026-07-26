# HANDOFF DLA CODEX — ewawierzba.pl
## Struktura, funkcjonalność, architektura danych

> Klientka przygotowuje osobno wizualny design dla każdej strony. Ten dokument opisuje strukturę, funkcjonalność i architekturę danych — design (kolory, fonty, CSS) dostarczają pliki `style_*.html` opisane w sekcji 9.

---

## 1. Stack techniczny

| Warstwa | Rozwiązanie |
|---|---|
| Framework | Next.js (App Router) |
| Hosting | Vercel |
| CMS (Blog, Portfolio) | Notion (przez Notion API, server-side) |
| Kalendarz dostępności | Notion (osobna baza), server-side proxy w Next.js |
| Wideo | Cloudflare R2 |
| Płatności (przyszłość) | Stripe / Przelewy24 |

Pełny plan wdrożenia: `instrukciya-sait.md`.

---

## 2. Sitemap i routing

```
/                     Głowna
/oferta               Oferta
/portfolio            Portfolio (lista)
/portfolio/[slug]     Portfolio (pojedynczy kejs) — route dynamiczny, dane z Notion
/kalendarz            Kalendarz dostępności
/blog                 Blog (lista)
/blog/[slug]          Blog (pojedynczy artykuł) — route dynamiczny, dane z Notion
/qa                   Q&A
/produkty             Produkty (placeholder)
/kontakt              Kontakt
/regulamin            Regulamin
```

---

## 3. KONWENCJA NAZW PLIKÓW DESIGNU

Każda strona ma odpowiadający jej plik wizualny nazwany:

```
style_(nazwa-strony).html
```

np. `style_glowna.html`, `style_oferta.html`, `style_portfolio.html`, `style_portfolio-case.html`, `style_kalendarz.html`, `style_blog.html`, `style_blog-post.html`, `style_qa.html`, `style_produkty.html`, `style_kontakt.html`, `style_regulamin.html`.

Te pliki to wyłącznie referencja wizualna/strukturalna (statyczny HTML/CSS, czasem z danymi placeholder) — Codex przepisuje z nich design (kolory, typografia, spacing, komponenty) na komponenty Next.js, podłączając realne dane opisane w tym dokumencie. Nie kopiować 1:1 jako gotowy produkt — zwłaszcza logikę pobierania danych, która w plikach `style_*` jest tylko zasymulowana (patrz SEED/placeholdery w kodzie).

---

## 4. Strony — funkcjonalność i struktura danych

### 4.1 Głowna (`/`)
Strona statyczna, content hardcoded. Struktura sekcji: Hero → O mnie → Kolaż zdjęć → „Co wnoszę do projektu" (3 punkty) → blok kontrastowy (treść do potwierdzenia z klientką) → „Tworzę wideo" → „Chcesz, żeby to robiło wrażenie" → showcase wideo → finalny fotoblok + tagline → CTA końcowe.

### 4.2 Oferta (`/oferta`)
4 kierunki usług (Social media / Eventy / Sesje indywidualne / Śluby), każdy w jednym powtarzalnym komponencie:

```
eyebrow + tytuł → intro → callout „Jak to wygląda" → [linia zamykająca]
→ pakiety (karty w gridzie, NIE tabela) → [pakiety kombo — tylko śluby]
→ blok „indywidualna wycena" → rząd 3 wideo-przykładów z tego kierunku
```

Rząd wideo pod każdą sekcją — kluczowa specyfikacja:
- 3 sloty wideo na kierunek, pobrane z bazy Portfolio w Notion (filtrowane po polu Kategoria = nazwa kierunku, np. „Eventy")
- Każde wideo ma odtwarzacz z wymogami opisanymi w sekcji 5
- Pod każdym wideo przycisk „Zobacz więcej" — prowadzi do `/portfolio/[slug]` tego konkretnego kejsu w Notion, z którego pochodzi wideo. Slug pobierany bezpośrednio z rekordu Portfolio (pole „Slug"), nie generowany ręcznie.

Link do Regulaminu widoczny na początku strony (w hero), nie na końcu.

### 4.3 Portfolio — lista (`/portfolio`)
Siatka kejsów z filtrowaniem po kategorii. Kategorie filtra wyliczane dynamicznie z unikalnych wartości pola Kategoria (multi-select) występujących we wszystkich kejsach w Notion — nie hardkodować listy. Nowa kategoria dodana w Notion ma sama pojawić się jako chip filtra.

Każda karta ma miniaturę wideo z tym samym odtwarzaczem co w sekcji 5 (nie statyczny obrazek — wideo od razu widoczne i grające bezgłośnie w karcie) + przycisk „Zobacz więcej" prowadzący do `/portfolio/[slug]`.

### 4.4 Portfolio — pojedynczy kejs (`/portfolio/[slug]`)
Dynamiczny route generowany po polu Slug z Notion. Struktura pól — patrz sekcja 6.2.

### 4.5 Kalendarz (`/kalendarz`)
Siatka 7 dni × 4 sloty czasowe (10:00-13:00 / 13:00-16:00 / 16:00-19:00 / 19:00-21:00). Pokazuje wyłącznie Wolne / Zajęte — nigdy kto zarezerwował ani notatki (patrz sekcja 6.1 — te pola istnieją w Notion, ale nie mogą trafić do frontendu). Nawigacja tydzień/miesiąc, zakres do końca 2027. Architektura bezpieczeństwa: server-side Route Handler mapuje surowe dane Notion na uproszczony status, zanim cokolwiek trafi do przeglądarki.

### 4.6 Blog — lista i pojedynczy artykuł (`/blog`, `/blog/[slug]`)
Ta sama logika co Portfolio — lista z Notion, dynamiczny route po Slug. Artykuł może mieć interaktywne checklisty (checkboxy, bez zapisu stanu na razie). Sekcja „Powiązane" na końcu — linki do Q&A / kejsu z portfolio / usługi z oferty.

### 4.7 Q&A, Produkty, Kontakt, Regulamin
Bez zmian względem poprzedniej wersji dokumentu — statyczny content, patrz pliki `style_qa.html`, `style_produkty.html`, `style_kontakt.html`, `style_regulamin.html`.

---

## 5. WYMOGI DLA ODTWARZACZA WIDEO (dotyczy wszystkich wideo na stronie)

To dotyczy każdego wideo na stronie — w Ofercie (rząd 3 przykładów), w Portfolio (miniatury kart), na stronie kejsu, na Głownej.

1. Autoplay od razu, ale bez dźwięku (muted). Wideo zaczyna się odtwarzać samo, kiedy wejdzie w widok (albo od razu przy załadowaniu sekcji — do ustalenia z klientką które zachowanie, ale domyślnie: muted autoplay).
2. Dźwięk włącza się dopiero po kliknięciu przez użytkownika. Kliknięcie w wideo (albo w dedykowaną ikonę głośnika) odblokowuje dźwięk — to musi być inicjowane gestem użytkownika, bo przeglądarki i tak blokują autoplay z dźwiękiem bez interakcji.
3. To ma być pełnoprawny odtwarzacz, nie tylko `autoplay` na `<video>` bez kontrolek:
   - pauza / wznowienie
   - pasek postępu / przewijanie
   - widoczna kontrolka głośności/mute po odsłonięciu (np. po najechaniu myszką albo zawsze widoczna w rogu)
   - pełny ekran (opcjonalnie, ale mile widziane)

Implementacja (wskazówka dla Codex): natywny `<video>` z customowymi kontrolkami (nie domyślny `controls` atrybut, bo trzeba nad nim mieć kontrolę dla logiki muted→unmuted) albo lekka biblioteka (np. Plyr, Vidstack) osadzona nad Cloudflare Stream/R2 źródłem. Zachowanie „muted autoplay → klik → dźwięk" da się zrobić czystym JS: `video.muted = true` na starcie, listener na `click`/`play button` który robi `video.muted = false`.

---

## 6. BAZY DANYCH W NOTION — pełna schema i jak je czytać

Wszystkie trzy bazy leżą w workspace „Strona", pod stroną-hubem „🗂️ Bazy danych — Strona WWW". Klientka edytuje je ręcznie; strona ma czytać z nich przez Notion API (server-side, klucz w zmiennych środowiskowych, nigdy w kodzie klienckim).

WAŻNE dla Codex: ja (Claude) łączę się z Notion przez własny, osobisty konektor MCP — to nie jest to samo połączenie, którego użyje produkcyjna strona. Żeby Next.js mógł czytać te bazy, klientka musi:
1. Stworzyć Notion internal integration (Notion → Settings → Connections → Develop or manage integrations → New integration), skopiować „Internal Integration Secret".
2. W Notion, na stronie-hubie „🗂️ Bazy danych — Strona WWW", kliknąć „..." → „Connections" → dodać tę integrację (to nadaje jej dostęp do wszystkich 3 baz wewnątrz, bo są jej podstronami).
3. Ten sekret trafia do Vercel jako zmienna środowiskowa `NOTION_API_KEY`, nigdy do repo.

### 6.1 📅 Kalendarz

| Właściwość | Typ | Opis |
|---|---|---|
| Termin | title | Etykieta typu „20.07 10:00-13:00" |
| Data | date | Data dnia (np. 2026-07-20) |
| Slot czasowy | select | Jedna z 4 wartości: 10:00-13:00, 13:00-16:00, 16:00-19:00, 19:00-21:00 |
| Status | select | Wolne / Zarezerwowane / Niedostępne |
| Zarezerwowane przez | rich_text | Kod/nazwa klienta — NIGDY nie wysyłać do frontendu |
| Kontakt klienta | rich_text | Telefon/e-mail — NIGDY nie wysyłać do frontendu |
| Notatki | rich_text | Uwagi wewnętrzne (może zawierać np. „+ dopłata 100 zł" — to akurat może być publiczne, bo dotyczy ceny, nie tożsamości klienta; sprawdzić treść notatki przed pokazaniem) |

Konwencja bardzo ważna: baza zawiera jeden rekord na każdą kombinację dzień+slot w danym okresie — łącznie z rekordami o statusie „Niedostępne". To znaczy: brak rekordu ≠ „wolne". Jeśli Next.js zapyta o dzień/slot i nie znajdzie rekordu, to znaczy że dane po prostu nie zostały jeszcze wprowadzone do Notion (np. przyszły miesiąc, którego klientka jeszcze nie zaplanowała) — taki przypadek trzeba potraktować jako „brak danych", pokazać np. jako Niedostępne domyślnie, i nie zgadywać.

Jak czytać: zapytanie do bazy filtrowane po zakresie Data, zwraca listę rekordów; endpoint API mapuje Status na wolne/zajete (Zarezerwowane i Niedostępne oba mapują się na zajete z perspektywy klienta — patrz wcześniejsze ustalenia o prywatności), odrzuca pola Zarezerwowane przez/Kontakt klienta przed wysłaniem do przeglądarki.

### 6.2 🎬 Portfolio

| Właściwość | Typ | Opis |
|---|---|---|
| Tytuł | title | Nazwa kejsu/projektu (np. „Evesta") |
| Slug | rich_text | Adres URL kejsu — to jest klucz łączący kartę w gridzie, media-sloty w Ofercie i stronę /portfolio/[slug] |
| Klient | rich_text | Nazwa klienta |
| Kategoria | multi_select | Jedna lub więcej z: Gastronomia, Nieruchomości, Beauty, Eventy, Śluby, Sesje indywidualne — lista rozszerzalna, filtr na /portfolio i dobór wideo na /oferta mają czytać tę listę dynamicznie, nie hardkodować |
| Wideo (link) | url | Link do pliku wideo w Cloudflare R2 — to źródło `<video src>` dla odtwarzacza opisanego w sekcji 5 |
| Status | select | Szkic / Opublikowany — na stronie pokazywać tylko rekordy ze statusem Opublikowany |
| Data realizacji | date | Opcjonalna, do sortowania |

Treść strony (page content, nie properties): każdy kejs ma w treści strony sekcje w formacie Markdown: krótki wstęp (kursywa na górze) → „## Zadanie" → „## Koncepcja" → „## Realizacja" → „## Użyte usługi" (checklista: Strategy/Shooting/Editing/Motion Design) → „## Galeria" (linki do zdjęć, każdy w osobnej linii — Notion sam je renderuje jako obrazki) → „## Rezultat". Next.js parsuje treść strony (Notion API zwraca ją jako blocks) i renderuje te same sekcje na /portfolio/[slug].

Jak czytać:
- Lista na /portfolio: zapytanie do bazy WHERE Status = 'Opublikowany', użyć Tytuł, Slug, Kategoria, Wideo (link) do karty.
- Pojedynczy kejs /portfolio/[slug]: zapytanie WHERE Slug = {slug z URL}, pobrać properties + pełną treść strony (blocks).
- Media-sloty na /oferta: zapytanie WHERE Status = 'Opublikowany' AND Kategoria zawiera {nazwa kierunku}, wziąć do 3 rekordy (np. najnowsze po Data realizacji).
- „Podobne realizacje" na stronie kejsu: zapytanie po tej samej Kategoria co bieżący kejs, wykluczając bieżący Slug, limit 3-6.

### 6.3 ✍️ Blog

| Właściwość | Typ | Opis |
|---|---|---|
| Tytuł | title | Tytuł artykułu |
| Slug | rich_text | Adres URL artykułu |
| Status | select | Szkic / Opublikowany |
| Kategoria | multi_select | Proces współpracy, Porady, Za kulisami, Ogłoszenia — rozszerzalna jak w Portfolio |
| Okładka | files | Obraz okładki |
| Excerpt | rich_text | Krótki opis 1-2 zdania, widoczny na liście |
| Data publikacji | date | Do sortowania |

Treść strony = pełny artykuł, pisany bezpośrednio w Notion (nagłówki ## = sekcje, wklejone linki do zdjęć na osobnej linii = automatyczne obrazki). Next.js renderuje blocks 1:1.

Jak czytać: analogicznie do Portfolio — lista WHERE Status = 'Opublikowany' sortowana po Data publikacji malejąco, pojedynczy artykuł WHERE Slug = {slug}.

### 6.4 Wzajemne powiązania między bazami

```
Portfolio.Kategoria  ──dopasowanie tekstowe──>  Oferta (sekcja kierunku o tej samej nazwie)
                                                  → zasila rząd 3 wideo pod każdym kierunkiem

Portfolio.Slug        ──klucz URL──>  /portfolio/[slug]
                                       ← linkowane z: kart w gridzie /portfolio,
                                         przycisków „Zobacz więcej" pod wideo w /oferta,
                                         bloku „Podobne realizacje" (przez wspólną Kategoria)

Blog.Slug              ──klucz URL──>  /blog/[slug]
                                        ← linkowane z: kart w gridzie /blog,
                                          sekcji „Powiązane" na stronach kejsów (ręcznie/tagowo)

Kalendarz.Data + Slot czasowy  ──klucz złożony──>  komórka siatki na /kalendarz
```

Nie ma formalnych relacji (Notion RELATION property) między bazami — powiązania są przez dopasowanie wartości tekstowych (nazwa kategorii, slug). To celowo proste rozwiązanie: klientka nie musi ręcznie linkować rekordów, wystarczy że wpisze tę samą kategorię.

---

## 7. Komponenty wielokrotnego użytku (React, niezależnie od designu)

- VideoPlayer — wspólny komponent na cały odtwarzacz z sekcji 5 (muted autoplay → klik → dźwięk, pełne kontrolki), używany w Ofercie, Portfolio (lista i kejs), Głownej
- TopNav, PackageCard, FilterChips, CaseCard/PostCard, Accordion, WeekCalendarGrid — bez zmian względem poprzedniej wersji dokumentu

---

## 8. Rzeczy do potwierdzenia przed publikacją

- [ ] Link Instagram — placeholder do zamiany na realny handle
- [ ] Adres e-mail — potwierdzić docelowy adres
- [ ] Regulamin §24.7 — uzupełnić urwane zdanie
- [ ] Blok kontrastowy na Głownej („Bolda diary" / „50 000 PLN") — potwierdzić treść
- [ ] Realne wideo we wszystkich kejsach Portfolio — obecnie pole „Wideo (link)" jest puste, trzeba wgrać pliki do Cloudflare R2 i wkleić linki
- [ ] Utworzenie Notion internal integration i podłączenie jej do bazy (patrz sekcja 6, punkty 1-3) — bez tego Next.js nie ma dostępu do danych

---

## 9. Pliki referencyjne w projekcie

| Plik | Zawartość |
|---|---|
| instrukciya-sait.md | Pełny plan wdrożenia krok po kroku (fazy 0–9) |
| glowna-tekst-referencyjny.md | Transkrypcja tekstu z pierwotnego makietu Głownej |
| oferta-tekst-referencyjny.md | Pełny tekst oferty + notatki projektowe |
| regulamin-tekst-website.md | Oczyszczony tekst regulaminu do publikacji |
| style_*.html (jedenaście plików, po jednym na stronę) | Referencje wizualne/strukturalne — patrz sekcja 3. Obecne pliki w projekcie mają jeszcze stare nazwy (index.html, oferta.html itd.) — przy najbliższej aktualizacji designu klientka dostarczy je już z prefiksem style_ |
