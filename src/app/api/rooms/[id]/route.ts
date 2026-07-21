import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeItem } from "@/lib/serialize";
import type { ApiRoom } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const guestName = request.nextUrl.searchParams.get("guestName");

  const room = await prisma.room.findUnique({
    where: { id },
    include: {
      items: { include: { reservations: true }, orderBy: { createdAt: "asc" } },
      bans: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!room) {
    return NextResponse.json({ error: "방을 찾을 수 없어요." }, { status: 404 });
  }

  const payload: ApiRoom = {
    id: room.id,
    nickname: room.nickname,
    birthday: room.birthday,
    items: room.items.map((item) => serializeItem(item, guestName)),
    bans: room.bans.map((b) => ({ id: b.id, text: b.text })),
  };

  return NextResponse.json(payload);
}
