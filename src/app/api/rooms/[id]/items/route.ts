import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scrapeProduct } from "@/lib/scrape";
import { getOwnerTokenFromRequest } from "@/lib/authz";
import { serializeItem } from "@/lib/serialize";

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

  const item = await prisma.item.create({
    data: {
      roomId: room.id,
      title: scraped.title,
      price: scraped.price,
      imageUrl: scraped.imageUrl,
      sourceUrl: scraped.sourceUrl,
    },
    include: { reservations: true },
  });

  return NextResponse.json(serializeItem(item, null), { status: 201 });
}
