"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PhoneFrame } from "@/components/PhoneFrame";
import { OwnerBoard } from "@/components/OwnerBoard";
import { FriendBoard } from "@/components/FriendBoard";
import { GuestNameCard } from "@/components/GuestNameCard";
import { AddWishScreen } from "@/components/AddWishScreen";
import { AddBanScreen } from "@/components/AddBanScreen";
import { LikeTypeModal } from "@/components/LikeTypeModal";
import { CoGiftAlertModal } from "@/components/CoGiftAlertModal";
import { THEME } from "@/lib/theme";
import {
  getRoom,
  previewItem,
  addItem,
  removeItem,
  addBan,
  removeBan,
  reserveItem,
} from "@/lib/api-client";
import { readOwnerToken, readGuestName, saveGuestName } from "@/lib/storage";
import type { ApiRoom, ApiItem } from "@/lib/types";

type ModalType = "addWish" | "addBan" | "likeType" | "coGiftAlert" | null;

export default function BoardPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const roomId = params.id;

  const [ownerToken, setOwnerToken] = useState<string | null>(null);
  const [guestName, setGuestName] = useState("");
  const [previewFriend, setPreviewFriend] = useState(false);

  const [room, setRoom] = useState<ApiRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modal, setModal] = useState<ModalType>(null);
  const [activeItem, setActiveItem] = useState<ApiItem | null>(null);
  const [toast, setToast] = useState("");

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 1600);
  }, []);

  useEffect(() => {
    // localStorage는 서버 렌더링 시 접근 불가하므로 마운트 이후에 읽어옵니다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOwnerToken(readOwnerToken(roomId));
    setGuestName(readGuestName());
  }, [roomId]);

  const refresh = useCallback(
    async (nameForCount?: string) => {
      try {
        const data = await getRoom(roomId, nameForCount ?? guestName ?? undefined);
        setRoom(data);
        setError("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "방을 불러오지 못했어요.");
      } finally {
        setLoading(false);
      }
    },
    [roomId, guestName]
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, guestName]);

  const isOwner = ownerToken !== null;
  const mode: "owner" | "guestName" | "friend" =
    isOwner && !previewFriend ? "owner" : guestName ? "friend" : "guestName";

  const handleAddWishPreview = async (link: string) => {
    if (!ownerToken) throw new Error("권한이 없어요.");
    return previewItem(roomId, ownerToken, link);
  };

  const handleAddWishSubmit = async (data: {
    link: string;
    title: string;
    price: string;
    imageUrl: string;
  }) => {
    if (!ownerToken) throw new Error("권한이 없어요.");
    await addItem(roomId, ownerToken, data);
    await refresh();
    showToast("상품이 등록되었습니다!");
    setModal(null);
  };

  const handleAddBanSubmit = async (text: string) => {
    if (!ownerToken) return;
    try {
      await addBan(roomId, ownerToken, text);
      await refresh();
      setModal(null);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "등록에 실패했어요.");
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!ownerToken) return;
    try {
      await removeItem(roomId, ownerToken, itemId);
      await refresh();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "삭제에 실패했어요.");
    }
  };

  const handleRemoveBan = async (banId: string) => {
    if (!ownerToken) return;
    try {
      await removeBan(roomId, ownerToken, banId);
      await refresh();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "삭제에 실패했어요.");
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/board/${roomId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link).catch(() => {});
    }
    showToast("복사되었습니다!");
  };

  const handleView = (item: ApiItem) => {
    if (item.sourceUrl) window.open(item.sourceUrl, "_blank");
  };

  const handleLikeClick = (item: ApiItem) => {
  if (isOwner) return; // 내 방 미리보기 중에는 내 상품을 찜할 수 없음
  setActiveItem(item);
  if (item.mode === "co-gift" && !item.reservedByMe) {
    setModal("coGiftAlert");
  } else if (item.mode === "none") {
    setModal("likeType");
  }
};

  const handleLikeTypeConfirm = async (choice: "solo" | "together") => {
    if (!activeItem) return;
    try {
      await reserveItem(roomId, activeItem.id, guestName || "익명", choice);
      await refresh();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "찜하기에 실패했어요.");
    } finally {
      setModal(null);
      setActiveItem(null);
    }
  };

  const handleCoGiftConfirm = async () => {
    if (!activeItem) return;
    try {
      await reserveItem(roomId, activeItem.id, guestName || "익명", "together");
      await refresh();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "찜하기에 실패했어요.");
    } finally {
      setModal(null);
      setActiveItem(null);
    }
  };

  const handleGuestNameSubmit = (name: string) => {
    const finalName = name || "익명";
    saveGuestName(finalName);
    setGuestName(finalName);
  };

  const handleCreateOwnOrExitPreview = () => {
    if (isOwner) {
      setPreviewFriend(false);
    } else {
      router.push("/");
    }
  };

  if (loading) {
    return (
      <PhoneFrame>
        <div className="flex items-center justify-center min-h-full">
          <p style={{ color: THEME.subText }}>불러오는 중...</p>
        </div>
      </PhoneFrame>
    );
  }

  if (error && !room) {
    return (
      <PhoneFrame>
        <div className="flex flex-col items-center justify-center min-h-full gap-3 px-6 text-center">
          <p style={{ color: THEME.banHeading }}>{error}</p>
          <button onClick={() => router.push("/")} className="text-sm underline" style={{ color: THEME.subText }}>
            내 방 만들러 가기
          </button>
        </div>
      </PhoneFrame>
    );
  }

  if (!room) return null;

  return (
    <PhoneFrame toast={toast}>
      {mode === "owner" && (
        <OwnerBoard
          nickname={room.nickname}
          items={room.items}
          bans={room.bans}
          onAddWishClick={() => setModal("addWish")}
          onAddBanClick={() => setModal("addBan")}
          onRemoveItem={handleRemoveItem}
          onRemoveBan={handleRemoveBan}
          onCopyLink={handleCopyLink}
          onPreviewFriend={() => setPreviewFriend(true)}
        />
      )}

      {mode === "guestName" && (
        <GuestNameCard
          initialName={guestName}
          onSubmit={handleGuestNameSubmit}
          onCreateOwn={() => router.push("/")}
        />
      )}

      {mode === "friend" && (
      <FriendBoard
          ownerName={room.nickname}
          items={room.items}
          bans={room.bans}
          onView={handleView}
          onLikeClick={handleLikeClick}
          onCreateOwn={handleCreateOwnOrExitPreview}
          isOwnerView={isOwner}
        />
      )}

      {modal === "addWish" && (
        <AddWishScreen
          onClose={() => setModal(null)}
          onPreview={handleAddWishPreview}
          onSubmit={handleAddWishSubmit}
        />
      )}
      {modal === "addBan" && (
        <AddBanScreen onClose={() => setModal(null)} onSubmit={handleAddBanSubmit} />
      )}
      {modal === "likeType" && (
        <LikeTypeModal
          onClose={() => {
            setModal(null);
            setActiveItem(null);
          }}
          onConfirm={handleLikeTypeConfirm}
        />
      )}
      {modal === "coGiftAlert" && (
        <CoGiftAlertModal
          onClose={() => {
            setModal(null);
            setActiveItem(null);
          }}
          onConfirm={handleCoGiftConfirm}
        />
      )}
    </PhoneFrame>
  );
}