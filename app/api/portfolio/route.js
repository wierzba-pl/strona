import { NextResponse } from "next/server";
import { getPortfolioCases } from "@/lib/notion/portfolio";
import { notionConfigured } from "@/lib/notion/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const cases = await getPortfolioCases();
  return NextResponse.json({ configured: notionConfigured("portfolio"), cases });
}
