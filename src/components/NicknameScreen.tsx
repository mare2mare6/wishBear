"use client";

import { THEME, IMAGES } from "@/lib/theme";
import { Logo, ClayButton, TextInput } from "./ui";

export function NicknameScreen({
  nickname,
  setNickname,
  onNext,
}: {
  nickname: string;
  setNickname: (v: string) => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col min-h-full px-6">
      <Logo />
      <div className="mt-10 text-center">
        <h1 className="font-display text-2xl leading-snug" style={{ color: THEME.heading }}>
          나만의 레지스트리
          <br />방 만들기
        </h1>
        <p className="mt-3 text-sm" style={{ color: THEME.subText }}>
          당신만의 선물 리스트를 만들어볼까요?
        </p>
      </div>

      <div className="mt-8">
        <TextInput value={nickname} onChange={setNickname} placeholder="닉네임 을 입력해주세요" />
      </div>

      <div className="flex-1 flex items-center justify-center py-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={IMAGES.bear} alt="bear" className="w-56 h-auto" />
      </div>

      <div className="pb-8">
        <ClayButton onClick={onNext} disabled={!nickname.trim()}>
          다음
        </ClayButton>
      </div>
    </div>
  );
}
