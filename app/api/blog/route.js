import { NextResponse } from "next/server";
import { getBlogPosts } from "@/lib/notion/blog";
import { notionConfigured } from "@/lib/notion/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const posts = await getBlogPosts();
  return NextResponse.json({ configured: notionConfigured("blog"), posts });
}
