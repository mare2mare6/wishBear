"use client";

import { THEME, IMAGES } from "@/lib/theme";
import { Logo, ClayButton, TextInput } from "./ui";

export function BirthdayScreen({
  nickname,
  birthday,
  setBirthday,
  onCreate,
  loading,
}: {
  nickname: string;
  birthday: string;
  setBirthday: (v: string) => void;
  onCreate: () => void;
  loading: boolean;
}) {
  return (
    <div className="flex flex-col min-h-full px-6">
      <Logo />
      <div className="mt-10 text-center">
        <h1 className="font-display text-2xl leading-snug" style={{ color: THEME.heading }}>
          {nickname}님의 생일을
          <br />
          알려주세요!
        </h1>
        <p className="mt-3 text-sm" style={{ color: THEME.subText }}>
          당신만의 선물 리스트를 만들어볼까요?
        </p>
      </div>

      <div className="mt-8">
        <TextInput value={birthday} onChange={setBirthday} placeholder="20XX.XX.XX" />
      </div>

      <div className="flex-1 flex items-center justify-center py-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={IMAGES.bear} alt="bear" className="w-56 h-auto" />
      </div>

      <div className="pb-8">
        <ClayButton onClick={onCreate} disabled={loading}>
          {loading ? "방 만드는 중..." : "방 생성하기"}
        </ClayButton>
      </div>
    </div>
  );
}
