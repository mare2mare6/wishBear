"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PhoneFrame } from "@/components/PhoneFrame";
import { NicknameScreen } from "@/components/NicknameScreen";
import { BirthdayScreen } from "@/components/BirthdayScreen";
import { createRoom } from "@/lib/api-client";
import { saveOwnerToken, readMyRoomId, readOwnerToken } from "@/lib/storage";
import { THEME } from "@/lib/theme";

export default function Home() {
  const router = useRouter();
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [step, setStep] = useState<"nickname" | "birthday">("nickname");
  const [nickname, setNickname] = useState("");
  const [birthday, setBirthday] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // 이 기기에서 이미 만든 방이 있으면(=ownerToken이 저장돼 있으면) 그 방으로 바로 이동
    const myRoomId = readMyRoomId();
    if (myRoomId && readOwnerToken(myRoomId)) {
      router.replace(`/board/${myRoomId}`);
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCheckingExisting(false);
  }, [router]);

  const handleCreate = async () => {
    setLoading(true);
    setError("");
    try {
      const { room, ownerToken } = await createRoom(nickname.trim(), birthday.trim());
      saveOwnerToken(room.id, ownerToken);
      router.push(`/board/${room.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "방을 만들지 못했어요.");
      setLoading(false);
    }
  };

  if (checkingExisting) {
    return (
      <PhoneFrame>
        <div className="flex items-center justify-center min-h-full">
          <p style={{ color: THEME.subText }}>불러오는 중...</p>
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      {step === "nickname" && (
        <NicknameScreen
          nickname={nickname}
          setNickname={setNickname}
          onNext={() => setStep("birthday")}
        />
      )}
      {step === "birthday" && (
        <BirthdayScreen
          nickname={nickname}
          birthday={birthday}
          setBirthday={setBirthday}
          onCreate={handleCreate}
          loading={loading}
        />
      )}
      {error && (
        <p className="absolute bottom-24 left-0 right-0 text-center text-xs text-red-500">
          {error}
        </p>
      )}
    </PhoneFrame>
  );
}