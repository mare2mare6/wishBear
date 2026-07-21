"use client";

import { useState } from "react";
import { THEME } from "@/lib/theme";
import { Logo, ClayButton, TextInput } from "./ui";

export function GuestNameCard({
  initialName,
  onSubmit,
  onCreateOwn,
}: {
  initialName: string;
  onSubmit: (name: string) => void;
  onCreateOwn: () => void;
}) {
  const [name, setName] = useState(initialName);

  return (
    <div className="flex flex-col min-h-full px-6 justify-center">
      <Logo />
      <div
        className="mt-16 rounded-3xl p-7"
        style={{ background: THEME.white }}
      >
        <h2 className="font-display text-xl text-center" style={{ color: THEME.heading }}>
          이름을 적어주세요!
        </h2>
        <p className="mt-2 text-xs text-center" style={{ color: THEME.subText }}>
          미작성 시 익명으로 처리됩니다.
        </p>

        <div className="mt-6">
          <TextInput value={name} onChange={setName} placeholder="사용자님의 이름을 적어주세요" />
        </div>

        <div className="mt-7">
          <ClayButton onClick={() => onSubmit(name.trim())}>친구 위시 보러가기</ClayButton>
        </div>
        <button onClick={onCreateOwn} className="w-full mt-3 text-sm" style={{ color: THEME.subText }}>
          내 방 만들기
        </button>
      </div>
    </div>
  );
}
