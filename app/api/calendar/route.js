import { NextResponse } from "next/server";
import { CALENDAR_MAX_DATE } from "@/lib/calendar-constants";
import { getCalendarRange } from "@/lib/notion/calendar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!start || !end) {
    return NextResponse.json({ error: "Missing start/end" }, { status: 400 });
  }

  if (end > CALENDAR_MAX_DATE) {
    return NextResponse.json({ error: "Out of supported range" }, { status: 400 });
  }

  const data = await getCalendarRange(start, end);
  return NextResponse.json(data);
}
