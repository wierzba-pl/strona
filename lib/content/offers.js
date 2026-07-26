export const offerSections = [
  {
    id: "social-media",
    number: "01",
    category: "Social media",
    eyebrow: "Kierunek 01",
    title: "Tworzenie treści do social media",
    intro:
      "Robię treści dla marek, które chcą wyglądać dobrze, a nie tylko „coś wrzucić” - internetu i tak jest już pełno tego drugiego.",
    process:
      "Najpierw rozkładamy Twoją markę na czynniki pierwsze - kim jesteś, czym różnisz się od dziesięciu innych robiących „to samo”. Potem robimy z tego plan, nagrywamy w warunkach, które kontroluję, a nie przypadek, a na końcu składam to w materiał, który ma tempo, sens i Twój charakter.",
    close:
      "Ty nie zastanawiasz się, jak ma wyglądać Twoja marka w socialach. Masz gotową wizję, dopasowaną do Ciebie, a nie do algorytmu - choć akurat algorytm też lubi, jak coś wygląda dobrze.",
    packages: [
      {
        name: "Starter",
        note: "Idealny na pierwszą współpracę i pierwsze kroki do regularnego, jakościowego contentu",
        items: ["koncepcja", "nagranie", "montaż + podstawowa grafika"],
        specs: ["Wideo: 5", "Zdjęcia: 20", "Czas sesji: 2 godziny", "Czas oddania: 14 dni roboczych"],
        price: "1000 zł"
      },
      {
        name: "Growth",
        featured: true,
        note: "Idealny pakiet na miesiąc, żeby utrzymać stałą obecność i testować formaty",
        items: ["koncepcja", "nagranie", "montaż + podstawowa grafika"],
        specs: ["Wideo: 9", "Zdjęcia: 35", "Czas sesji: 3 godziny", "Czas oddania: 14 dni roboczych"],
        price: "1500 zł"
      },
      {
        name: "Premium",
        note: "Dla tych, którzy chcą większej częstotliwości publikacji i mieć content przygotowany z wyprzedzeniem",
        items: ["koncepcja", "nagranie", "montaż + podstawowa grafika", "Audyt profilu Instagram", "Projekt feedu na Instagramie"],
        specs: ["Wideo: 12", "Zdjęcia: 45", "Czas sesji: 3-5 godzin", "Czas oddania: 14 dni roboczych"],
        price: "1800 zł"
      },
      {
        name: "Content Intro",
        note: "Jeśli masz kilka lokalizacji, filii albo po prostu chcesz mocno zaznaczyć swoją obecność na rynku",
        items: ["koncepcja", "nagranie", "montaż + podstawowa grafika"],
        specs: ["Wideo: 18", "Zdjęcia: 70", "Czas sesji: 9 godzin (2 sesje/mies.)", "Czas oddania: 14 dni roboczych"],
        price: "2500 zł"
      }
    ],
    individual:
      "Jeśli Twój pomysł wymaga większej produkcji - więcej lokacji, rozbudowanego scenariusza, dłuższych form albo bardziej zaawansowanego montażu - wycena jest indywidualna. Nagrania 200 zł / godzina, montaż 150 zł / godzina. Minimalne zamówienie: 500 zł."
  },
  {
    id: "eventy",
    number: "02",
    category: "Eventy",
    eyebrow: "Kierunek 02",
    title: "Eventy / wydarzenia",
    intro:
      "Robię eventy dla organizatorów, dla których wydarzenie to coś więcej niż logistyka i checklisty.",
    process:
      "Najpierw gadamy o charakterze wydarzenia i o tym, co jest w nim naprawdę ważne. Potem jestem na miejscu - obserwuję, reaguję, łapię detale i emocje, zanim zdążą zniknąć.",
    close:
      "Ty nie martwisz się, czy coś zostało nagrane. Masz pewność, że najważniejsze momenty są uchwycone - a Ty możesz po prostu być na swoim evencie.",
    packages: [],
    individual:
      "Każde wydarzenie jest inne - inny czas, skala, tempo i potrzeby. Pracuję w modelu godzinowym: filmowanie 250 zł / godzina, fotografowanie 200 zł / godzina, montaż 150 zł / godzina, obróbka zdjęć 100 zł / godzina. Minimalne zamówienie: 500 zł."
  },
  {
    id: "sesje-indywidualne",
    number: "03",
    category: "Sesje indywidualne",
    eyebrow: "Kierunek 03",
    title: "Sesje indywidualne",
    intro:
      "To nie jest tylko sesja zdjęciowa. To moment, w którym zaczynasz widzieć siebie inaczej.",
    process:
      "Najpierw rozmawiamy. Jeśli nie masz pomysłu - spokojnie, to nie jest egzamin, pomagam to zbudować od zera. Na samej sesji mówię, co robić, jak się ustawić, gdzie spojrzeć.",
    close:
      "Po sesji selekcjonuję materiał i składam go w spójną całość: kolor, światło, detale, retusz - bez przesady, bez zamieniania Cię w kogoś innego.",
    packages: [
      {
        name: "Basic",
        note: "Na początek. Bez stresu, bez presji, po prostu dobry start",
        specs: ["Zdjęcia: 25 obrobionych (kolor + retusz)", "Czas sesji: 1 godzina", "Czas oddania: 14 dni roboczych"],
        price: "600 zł"
      },
      {
        name: "Look & Details",
        featured: true,
        note: "Więcej czasu, więcej swobody, więcej detali",
        specs: ["Zdjęcia: 45 obrobionych (kolor + retusz)", "Czas sesji: 2 godziny", "Czas oddania: 14 dni roboczych"],
        price: "800 zł"
      },
      {
        name: "Concept & Depth",
        note: "Tu zaczyna się historia, nie tylko zdjęcia",
        specs: ["Zdjęcia: 65 profesjonalnych (kolor + retusz)", "Czas sesji: 3 godziny", "Czas oddania: 14 dni roboczych"],
        price: "1000 zł"
      }
    ],
    individual:
      "Jeśli masz własny pomysł, chcesz więcej lokalizacji, dłuższy czas albo bardziej kreatywną realizację - robimy to indywidualnie. Dopasowuję sesję do Ciebie, nie odwrotnie."
  },
  {
    id: "sluby",
    number: "04",
    category: "Śluby",
    eyebrow: "Kierunek 04",
    title: "Sesje ślubne",
    intro:
      "Nie robię „ładnych ujęć na pokaz” - tego jest już wystarczająco dużo w internecie. Łapię momenty, spojrzenia, napięcie, detale.",
    process:
      "Praca na miejscu z profesjonalnym sprzętem, reportaż, detale, emocje, momenty między momentami. A potem postprodukcja: selekcja materiału, kolor, montaż, tempo, muzyka.",
    close:
      "Składam to w spójną historię, do której chce się wracać - nie tylko raz, a za parę lat też.",
    packages: [
      {
        name: "Foto Wedding Day",
        note: "Dla tych, którzy chcą zatrzymać cały klimat dnia, bez stresu i bez ustawianych momentów",
        items: ["reportaż ślubny", "naturalne ujęcia, emocje, detale", "selekcja i obróbka zdjęć"],
        specs: ["Zdjęcia: 100 po obróbce", "Czas sesji: do 7 godzin", "Czas oddania: 14 dni roboczych"],
        price: "1800 zł"
      },
      {
        name: "Foto Love Story",
        note: "Dla par, które chcą uchwycić siebie - bez pośpiechu i bez presji",
        items: ["sesja dla par", "pomoc w koncepcji i klimacie", "profesjonalny retusz"],
        specs: ["Zdjęcia: 35 z retuszem", "Czas sesji: do 2 godzin", "Czas oddania: 14 dni roboczych"],
        price: "800 zł"
      },
      {
        name: "Wedding Reels Package",
        featured: true,
        note: "Dla tych, którzy chcą zobaczyć swój dzień w dynamicznej, współczesnej formie",
        items: ["główny reels ślubny", "5 highlightów", "montaż + dopasowanie do social media"],
        specs: ["Wideo: główny reels + 5 highlightów", "Czas sesji: do 7 godzin"],
        price: "2250 zł"
      },
      {
        name: "Film ślubny do 3 min",
        note: "Krótka, intensywna forma - esencja dnia",
        specs: ["Wideo: film do 3 min", "Czas sesji: do 7 godzin"],
        price: "2500 zł"
      },
      {
        name: "Film ślubny do 10 min",
        note: "Dla tych, którzy chcą przeżyć ten dzień jeszcze raz, krok po kroku",
        specs: ["Wideo: film do 10 min", "Czas sesji: do 7 godzin"],
        price: "3000 zł"
      }
    ],
    combos: [
      ["Foto Wedding Day + Love Story", "Reportaż + sesja narzeczeńska", "2200 zł"],
      ["Love Story + Wedding Reels", "Sesja + reels ślubny + 5 highlightów", "2650 zł"],
      ["Wedding Reels + Film 3 min", "Reels + film poziomy", "3000 zł"]
    ],
    individual:
      "Każdy ślub jest inny. Przy bardziej rozbudowanych realizacjach wycena ustalana jest indywidualnie - na podstawie czasu pracy i zakresu materiału. Minimalne zamówienie: 500 zł."
  }
];
