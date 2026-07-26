import { NextResponse } from "next/server";
import { getBlogPost } from "@/lib/notion/blog";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_request, { params }) {
  const post = await getBlogPost(params.slug);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post });
}
