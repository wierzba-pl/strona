import { referenceHtmlResponse } from "@/lib/reference-html";

export function GET() {
  return referenceHtmlResponse("regulamin", "Regulamin.dc.html");
}
