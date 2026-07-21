import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scrapeProduct } from "@/lib/scrape";
import { getOwnerTokenFromRequest } from "@/lib/authz";

/**
 * 링크에서 정보를 "미리" 가져오기만 하고 저장은 하지 않는 엔드포인트.
 * 오너가 등록 화면에서 결과를 보고 직접 수정한 뒤 최종적으로
 * POST /api/rooms/[id]/items 를 호출해서 저장합니다.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ownerToken = getOwnerTokenFromRequest(request);

  const room = await prisma.room.findUnique({ where: { id } });
  if (!room) {
    return NextResponse.json({ error: "방을 찾을 수 없어요." }, { status: 404 });
  }
  if (!ownerToken || ownerToken !== room.ownerToken) {
    return NextResponse.json({ error: "권한이 없어요." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const link = typeof body?.link === "string" ? body.link.trim() : "";
  if (!link) {
    return NextResponse.json({ error: "링크를 입력해주세요." }, { status: 400 });
  }

  const scraped = await scrapeProduct(link);
  return NextResponse.json(scraped);
}