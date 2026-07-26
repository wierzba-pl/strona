import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://ewawierzba.pl"),
  title: {
    default: "Ewa Wierzba - wideo, foto i content",
    template: "%s - Ewa Wierzba"
  },
  description:
    "Strategiczne wideo, fotografia i content dla marek, eventów, sesji indywidualnych i ślubów.",
  openGraph: {
    title: "Ewa Wierzba - wideo, foto i content",
    description:
      "Strategiczne wideo, fotografia i content dla marek, eventów, sesji indywidualnych i ślubów.",
    url: "https://ewawierzba.pl",
    siteName: "Ewa Wierzba",
    locale: "pl_PL",
    type: "website"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
