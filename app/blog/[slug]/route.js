import { referenceHtmlResponse } from "@/lib/reference-html";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ slug: "jak-przebiega-wspolpraca" }];
}

export function GET() {
  return referenceHtmlResponse("main", "Blog Post.dc.html");
}
