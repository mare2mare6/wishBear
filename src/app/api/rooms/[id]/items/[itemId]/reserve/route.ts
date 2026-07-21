import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeItem } from "@/lib/serialize";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const { id, itemId } = await params;

  const body = await request.json().catch(() => null);
  const guestName =
    typeof body?.guestName === "string" && body.guestName.trim()
      ? body.guestName.trim()
      : "익명";
  const type = body?.type === "together" ? "together" : "solo";

  const item = await prisma.item.findFirst({
    where: { id: itemId, roomId: id },
    include: { reservations: true },
  });

  if (!item) {
    return NextResponse.json({ error: "상품을 찾을 수 없어요." }, { status: 404 });
  }

  const existingSolo = item.reservations.find((r) => r.type === "SOLO");
  const existingTogether = item.reservations.filter((r) => r.type === "TOGETHER");

  if (type === "solo") {
    if (existingSolo || existingTogether.length > 0) {
      return NextResponse.json(
        { error: "이미 다른 분이 찜한 상품이에요." },
        { status: 409 }
      );
    }
    await prisma.reservation.create({
      data: { itemId: item.id, guestName, type: "SOLO" },
    });
  } else {
    if (existingSolo) {
      return NextResponse.json(
        { error: "이미 다른 분이 혼자 찜한 상품이에요." },
        { status: 409 }
      );
    }

    const alreadyJoined = existingTogether.some((r) => r.guestName === guestName);
    if (!alreadyJoined) {
      await prisma.reservation.create({
        data: { itemId: item.id, guestName, type: "TOGETHER" },
      });
    }
  }

  const updated = await prisma.item.findUniqueOrThrow({
    where: { id: item.id },
    include: { reservations: true },
  });

  return NextResponse.json(serializeItem(updated, guestName));
}