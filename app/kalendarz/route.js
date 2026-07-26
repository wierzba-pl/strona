import { htmlResponse, renderCalendarPage } from "@/lib/dynamic-pages";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export function GET() {
  return htmlResponse(renderCalendarPage());
}
