import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOwnerTokenFromRequest } from "@/lib/authz";

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
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  if (!text) {
    return NextResponse.json({ error: "내용을 입력해주세요." }, { status: 400 });
  }

  const ban = await prisma.ban.create({
    data: { roomId: room.id, text },
  });

  return NextResponse.json({ id: ban.id, text: ban.text }, { status: 201 });
}
