import { NextResponse } from "next/server";
import { getPortfolioCase } from "@/lib/notion/portfolio";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_request, { params }) {
  const item = await getPortfolioCase(params.slug);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item });
}
