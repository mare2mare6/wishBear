"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { THEME } from "@/lib/theme";
import { Logo, ClayButton, TextInput } from "./ui";

export function AddBanScreen({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (text: string) => void;
}) {
  const [text, setText] = useState("");

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
          밴 목록 추가
        </h1>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: THEME.subText }}>
          싫어하거나 가지고 있는 물품과 물품
          <br />
          종류에 관해 적어보세요!
        </p>
      </div>

      <div className="mt-8">
        <TextInput value={text} onChange={setText} placeholder="물품에 대해 적어주세요" />
      </div>

      <div className="flex-1" />

      <div className="pb-10">
        <ClayButton
          onClick={() => {
            if (text.trim()) onSubmit(text.trim());
          }}
        >
          등록
        </ClayButton>
      </div>
    </div>
  );
}
