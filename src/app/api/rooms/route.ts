import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeItem } from "@/lib/serialize";
import type { CreateRoomResponse } from "@/lib/types";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const nickname = typeof body?.nickname === "string" ? body.nickname.trim() : "";
  const birthday = typeof body?.birthday === "string" ? body.birthday.trim() : "";

  if (!nickname) {
    return NextResponse.json({ error: "닉네임을 입력해주세요." }, { status: 400 });
  }

  const room = await prisma.room.create({
    data: {
      nickname,
      birthday: birthday || null,
    },
    include: {
      items: { include: { reservations: true } },
      bans: true,
    },
  });

  const response: CreateRoomResponse = {
    ownerToken: room.ownerToken,
    room: {
      id: room.id,
      nickname: room.nickname,
      birthday: room.birthday,
      items: room.items.map((item) => serializeItem(item, null)),
      bans: room.bans.map((b) => ({ id: b.id, text: b.text })),
    },
  };

  return NextResponse.json(response, { status: 201 });
}
