"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PhoneFrame } from "@/components/PhoneFrame";
import { NicknameScreen } from "@/components/NicknameScreen";
import { BirthdayScreen } from "@/components/BirthdayScreen";
import { createRoom } from "@/lib/api-client";
import { saveOwnerToken } from "@/lib/storage";

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState<"nickname" | "birthday">("nickname");
  const [nickname, setNickname] = useState("");
  const [birthday, setBirthday] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
