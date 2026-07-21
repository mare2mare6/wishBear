import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOwnerTokenFromRequest } from "@/lib/authz";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const { id, itemId } = await params;
  const ownerToken = getOwnerTokenFromRequest(request);

  const room = await prisma.room.findUnique({ where: { id } });
  if (!room) {
    return NextResponse.json({ error: "방을 찾을 수 없어요." }, { status: 404 });
  }
  if (!ownerToken || ownerToken !== room.ownerToken) {
    return NextResponse.json({ error: "권한이 없어요." }, { status: 403 });
  }

  await prisma.item.deleteMany({ where: { id: itemId, roomId: room.id } });

  return NextResponse.json({ ok: true });
}
