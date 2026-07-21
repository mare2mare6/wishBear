"use client";

import { X, Heart } from "lucide-react";
import { THEME } from "@/lib/theme";
import { ClayButton, GhostButton, ProductImage } from "./ui";
import type { ApiItem } from "@/lib/types";

export function OwnerProductCard({
  item,
  onRemove,
}: {
  item: ApiItem;
  onRemove: (id: string) => void;
}) {
  return (
    <div>
      <div className="relative">
        <ProductImage src={item.imageUrl} alt={item.title} />
        <button
          onClick={() => onRemove(item.id)}
          className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: "rgba(120,105,80,0.55)" }}
          aria-label="상품 삭제"
        >
          <X size={14} color="#fff" />
        </button>
      </div>
      <p className="mt-2 text-sm leading-snug" style={{ color: THEME.dark }}>
        {item.title}
      </p>
      <p className="mt-1 text-sm font-bold" style={{ color: THEME.heading }}>
        {item.price} ₩
      </p>
    </div>
  );
}

export function FriendProductCard({
  item,
  onView,
  onLikeClick,
}: {
  item: ApiItem;
  onView: (item: ApiItem) => void;
  onLikeClick: (item: ApiItem) => void;
}) {
  const isMineAndDone =
    (item.mode === "solo" || item.mode === "co-gift") && item.reservedByMe;

  const likeLabel =
    item.mode === "solo"
      ? "찜 완료"
      : item.mode === "co-gift"
      ? isMineAndDone
        ? "찜 완료"
        : "나도 찜하기"
      : "찜하기";

  const likeDisabled = item.mode === "solo" || isMineAndDone;

  return (
    <div>
      <ProductImage src={item.imageUrl} alt={item.title} />
      <p className="mt-2 text-sm leading-snug" style={{ color: THEME.dark }}>
        {item.title}
      </p>
      <p className="mt-1 text-sm font-bold" style={{ color: THEME.heading }}>
        {item.price} ₩
      </p>

      <div className="mt-2 flex flex-col gap-2">
        <GhostButton small onClick={() => onView(item)}>
          상품 보러가기
        </GhostButton>
        <ClayButton
          small
          disabled={likeDisabled}
          onClick={() => onLikeClick(item)}
          style={
            likeDisabled
              ? { background: "#EFE7D6", color: THEME.subText, boxShadow: "none" }
              : {}
          }
        >
          <span className="inline-flex items-center gap-1 justify-center">
            <Heart size={14} fill={likeDisabled ? "none" : THEME.dark} />
            {likeLabel}
          </span>
        </ClayButton>
      </div>

      {item.mode === "co-gift" && (
        <p className="mt-1.5 text-xs text-center" style={{ color: THEME.subText }}>
          곰돌이님 외 {item.reservedCount}명이 찜했어요!
        </p>
      )}
    </div>
  );
}
