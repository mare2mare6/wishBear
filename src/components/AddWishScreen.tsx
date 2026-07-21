"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { THEME } from "@/lib/theme";
import { Logo, ClayButton, TextInput } from "./ui";

export function AddWishScreen({
  onClose,
  onSubmit,
  loading,
}: {
  onClose: () => void;
  onSubmit: (link: string) => void;
  loading: boolean;
}) {
  const [link, setLink] = useState("");

  return (
    <div className="absolute inset-0 z-40 flex flex-col px-6" style={{ background: THEME.bg }}>
      <div className="flex justify-end pt-6">
        <button onClick={onClose} aria-label="닫기">
          <X size={22} color={THEME.subText} />
        </button>
      </div>
      <Logo />
      <div className="mt-8 text-center">
        <h1 className="font-display text-2xl" style={{ color: THEME.heading }}>
          위시리스트 추가
        </h1>
        <p className="mt-2 text-sm" style={{ color: THEME.subText }}>
          원하는 상품을 등록해보세요!
        </p>
      </div>

      <div className="mt-8">
        <TextInput value={link} onChange={setLink} placeholder="상품의 링크를 적어주세요." />
      </div>

      <div className="flex-1" />

      <div className="pb-10">
        <ClayButton onClick={() => onSubmit(link)} disabled={loading}>
          {loading ? "상품 정보를 불러오는 중..." : "등록"}
        </ClayButton>
      </div>
    </div>
  );
}
