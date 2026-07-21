"use client";

import { Plus, Copy, X } from "lucide-react";
import { THEME } from "@/lib/theme";
import { Logo, ClayButton } from "./ui";
import { OwnerProductCard } from "./ProductCards";
import type { ApiItem, ApiBan } from "@/lib/types";

export function OwnerBoard({
  nickname,
  items,
  bans,
  onAddWishClick,
  onAddBanClick,
  onRemoveItem,
  onRemoveBan,
  onCopyLink,
  onPreviewFriend,
}: {
  nickname: string;
  items: ApiItem[];
  bans: ApiBan[];
  onAddWishClick: () => void;
  onAddBanClick: () => void;
  onRemoveItem: (id: string) => void;
  onRemoveBan: (id: string) => void;
  onCopyLink: () => void;
  onPreviewFriend: () => void;
}) {
  return (
    <div className="flex flex-col min-h-full px-6 pb-28">
      <Logo />

      <div className="text-center">
        <h1 className="font-display text-2xl" style={{ color: THEME.heading }}>
          {nickname}님의 레지스트리
        </h1>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: THEME.subText }}>
          위시리스트와 밴 상품을 추가하고,
          <br />
          친구들에게 내 레지스트리를 공유하세요!
        </p>
      </div>

      <button
        onClick={onPreviewFriend}
        className="mx-auto mt-3 text-xs underline"
        style={{ color: THEME.subText }}
      >
        친구 화면으로 미리보기
      </button>

      <button
        onClick={onAddWishClick}
        className="mt-6 py-3 rounded-2xl border-2 border-dashed text-sm font-bold"
        style={{ borderColor: THEME.accent, color: THEME.heading }}
      >
        <span className="inline-flex items-center gap-1 justify-center w-full">
          <Plus size={16} /> 위시리스트 상품 추가하기
        </span>
      </button>

      <div className="mt-5 grid grid-cols-2 gap-4">
        {items.map((item) => (
          <OwnerProductCard key={item.id} item={item} onRemove={onRemoveItem} />
        ))}
        {items.length === 0 && (
          <p className="col-span-2 text-center text-xs py-6" style={{ color: THEME.subText }}>
            아직 등록된 위시리스트가 없어요
          </p>
        )}
      </div>

      <div className="mt-8 rounded-3xl p-5" style={{ background: THEME.banBg }}>
        <button
          onClick={onAddBanClick}
          className="w-full py-3 rounded-2xl border-2 border-dashed text-sm font-bold"
          style={{ borderColor: "#EFC3CC", color: THEME.banHeading }}
        >
          <span className="inline-flex items-center gap-1 justify-center w-full">
            <Plus size={16} /> 밴 목록 추가하기
          </span>
        </button>

        <div className="mt-4 flex flex-col gap-2.5">
          {bans.map((ban) => (
            <div
              key={ban.id}
              className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm"
              style={{ background: "#FFFFFF", color: THEME.dark }}
            >
              <span>{ban.text}</span>
              <button onClick={() => onRemoveBan(ban.id)} aria-label="밴 목록 삭제">
                <X size={16} color={THEME.subText} />
              </button>
            </div>
          ))}
          {bans.length === 0 && (
            <p className="text-center text-xs py-2" style={{ color: THEME.subText }}>
              아직 등록된 밴 목록이 없어요
            </p>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 flex justify-center pointer-events-none">
        <div className="w-full max-w-md px-6 pb-6 pointer-events-auto">
          <ClayButton onClick={onCopyLink}>
            <span className="inline-flex items-center gap-2 justify-center">
              <Copy size={16} /> 내 방 링크 복사
            </span>
          </ClayButton>
        </div>
      </div>
    </div>
  );
}
