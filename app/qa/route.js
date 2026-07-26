import { referenceHtmlResponse } from "@/lib/reference-html";

export function GET() {
  return referenceHtmlResponse("main", "QA.dc.html");
}
