"use client";

import { ChevronRight } from "lucide-react";
import { THEME } from "@/lib/theme";
import { Logo, ClayButton } from "./ui";
import { FriendProductCard } from "./ProductCards";
import type { ApiItem, ApiBan } from "@/lib/types";

export function FriendBoard({
  ownerName,
  items,
  bans,
  onView,
  onLikeClick,
  onCreateOwn,
  isOwnerView,
}: {
  ownerName: string;
  items: ApiItem[];
  bans: ApiBan[];
  onView: (item: ApiItem) => void;
  onLikeClick: (item: ApiItem) => void;
  onCreateOwn: () => void;
  isOwnerView?: boolean;
}) {
  return (
    <div className="flex flex-col min-h-full px-6 pb-10">
      <Logo />
      <div className="text-center mt-2">
        <h1 className="font-display text-2xl" style={{ color: THEME.heading }}>
          {ownerName}님의 레지스트리
        </h1>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: THEME.subText }}>
          사용자가 원하는 선물을 살펴보고,
          <br />
          선물해보세요!
        </p>
        {isOwnerView && (
          <p className="mt-2 text-xs" style={{ color: THEME.subText }}>
            내 레지스트리 미리보기예요. 내 상품은 찜할 수 없어요.
          </p>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {items.map((item) => (
          <FriendProductCard
            key={item.id}
            item={item}
            onView={onView}
            onLikeClick={onLikeClick}
            isOwnerView={isOwnerView}
          />
        ))}
        {items.length === 0 && (
          <p className="col-span-2 text-center text-xs py-6" style={{ color: THEME.subText }}>
            아직 등록된 위시리스트가 없어요
          </p>
        )}
      </div>

      <div className="mt-8 rounded-3xl p-5" style={{ background: THEME.banBg }}>
        <h3 className="font-display text-center text-lg" style={{ color: THEME.banHeading }}>
          사용자의 밴 리스트
        </h3>
        <p className="mt-1 text-center text-xs" style={{ color: THEME.subText }}>
          아래와 같은 선물은 싫어요!
        </p>

        <div className="mt-4 flex flex-col gap-2.5">
          {bans.map((ban) => (
            <div
              key={ban.id}
              className="rounded-2xl px-4 py-3 text-sm text-center"
              style={{ background: "#FFFFFF", color: THEME.dark }}
            >
              {ban.text}
            </div>
          ))}
          {bans.length === 0 && (
            <p className="text-center text-xs py-2" style={{ color: THEME.subText }}>
              등록된 밴 목록이 없어요
            </p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <ClayButton onClick={onCreateOwn}>
          <span className="inline-flex items-center gap-1 justify-center">
            내 방 만들기 <ChevronRight size={18} />
          </span>
        </ClayButton>
      </div>
    </div>
  );
}