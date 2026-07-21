"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { THEME } from "@/lib/theme";
import { ClayButton, ModalOverlay } from "./ui";

function OptionRow({
  selected,
  label,
  onSelect,
}: {
  selected: boolean;
  label: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full text-left rounded-2xl px-5 py-4 mt-3 flex items-center gap-2 border-2"
      style={{
        borderColor: selected ? THEME.heading : THEME.cardStroke,
        background: selected ? THEME.white : THEME.inputBg,
        color: selected ? THEME.dark : THEME.subText,
      }}
    >
      {selected ? <Check size={18} color={THEME.heading} /> : <span className="w-[18px]" />}
      <span className="text-sm">{label}</span>
    </button>
  );
}

export function LikeTypeModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: (choice: "solo" | "together") => void;
}) {
  const [choice, setChoice] = useState<"solo" | "together">("solo");

  return (
    <ModalOverlay onClose={onClose}>
      <div
        className="w-full rounded-3xl p-7"
        style={{ background: THEME.white }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-xl text-center" style={{ color: THEME.heading }}>
          찜 종류를 골라주세요
        </h2>
        <p className="mt-2 text-xs text-center leading-relaxed" style={{ color: THEME.subText }}>
          혼자 선물할지, 같이 선물할 지
          <br />
          골라보아요!
        </p>

        <OptionRow
          selected={choice === "solo"}
          label="제가 혼자 찜할게요!"
          onSelect={() => setChoice("solo")}
        />
        <OptionRow
          selected={choice === "together"}
          label="다른 사람과 같이 구매하고 싶어요"
          onSelect={() => setChoice("together")}
        />

        <div className="mt-7">
          <ClayButton onClick={() => onConfirm(choice)}>찜하기</ClayButton>
        </div>
        <button onClick={onClose} className="w-full mt-3 text-sm" style={{ color: THEME.subText }}>
          취소
        </button>
      </div>
    </ModalOverlay>
  );
}
