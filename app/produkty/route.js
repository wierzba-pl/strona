import { referenceHtmlResponse } from "@/lib/reference-html";

export function GET() {
  return referenceHtmlResponse("produkty", "Produkty.dc.html");
}
