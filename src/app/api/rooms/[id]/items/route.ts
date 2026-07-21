import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOwnerTokenFromRequest } from "@/lib/authz";
import { serializeItem } from "@/lib/serialize";

/**
 * 최종 저장 엔드포인트. 프론트에서 링크 미리보기(/preview) 결과를
 * 그대로 보내거나, 오너가 제목/가격을 수정한 값을 보내면 그대로 저장합니다.
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
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const price = typeof body?.price === "string" ? body.price.trim() : "";
  const imageUrl = typeof body?.imageUrl === "string" ? body.imageUrl.trim() : "";

  if (!link || !title || !price) {
    return NextResponse.json(
      { error: "링크, 제목, 가격을 모두 입력해주세요." },
      { status: 400 }
    );
  }

  const item = await prisma.item.create({
    data: {
      roomId: room.id,
      title,
      price,
      imageUrl:
        imageUrl || "https://placehold.co/400x400/EFE7D6/C9BBA0?text=Product+Image",
      sourceUrl: link,
    },
    include: { reservations: true },
  });

  return NextResponse.json(serializeItem(item, null), { status: 201 });
}