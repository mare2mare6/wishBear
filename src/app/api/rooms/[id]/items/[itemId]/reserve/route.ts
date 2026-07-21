import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeItem } from "@/lib/serialize";

// 데모용 소셜프루프 시드 이름. 한 상품에 처음으로 "같이 구매"를 선택하면
// 이 두 명이 먼저 찜한 것으로 같이 등록되어, 와이어프레임의
// "곰돌이님 외 3명이 찜했어요!" 문구(본인 포함 3명)를 그대로 재현합니다.
// 실서비스로 발전시킬 때는 이 시드 로직을 제거하고 실제 참여자만 카운트하면 됩니다.
const SOCIAL_PROOF_SEED_NAMES = ["테디", "쿠키"];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const { id, itemId } = await params;

  const body = await request.json().catch(() => null);
  const guestName =
    typeof body?.guestName === "string" && body.guestName.trim()
      ? body.guestName.trim()
      : "곰돌이";
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
      const isFirstJoin = existingTogether.length === 0;
      const seedData = isFirstJoin
        ? SOCIAL_PROOF_SEED_NAMES.map((name) => ({
            itemId: item.id,
            guestName: name,
            type: "TOGETHER" as const,
          }))
        : [];

      await prisma.reservation.createMany({
        data: [
          ...seedData,
          { itemId: item.id, guestName, type: "TOGETHER" as const },
        ],
      });
    }
  }

  const updated = await prisma.item.findUniqueOrThrow({
    where: { id: item.id },
    include: { reservations: true },
  });

  return NextResponse.json(serializeItem(updated, guestName));
}
