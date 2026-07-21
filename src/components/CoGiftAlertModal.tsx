"use client";

import { THEME } from "@/lib/theme";
import { ClayButton, ModalOverlay } from "./ui";

export function CoGiftAlertModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <ModalOverlay center onClose={onClose}>
      <div
        className="w-full rounded-3xl p-7"
        style={{ background: THEME.white }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-xl text-center leading-snug" style={{ color: THEME.heading }}>
          이 상품은 같이
          <br />
          찜 한 상품이에요.
        </h2>
        <p className="mt-3 text-xs text-center" style={{ color: THEME.subText }}>
          가능한 같이 찜한 사람들과 같이 선물해봐요.
        </p>

        <div className="mt-7">
          <ClayButton onClick={onConfirm}>찜하기</ClayButton>
        </div>
        <button onClick={onClose} className="w-full mt-3 text-sm" style={{ color: THEME.subText }}>
          취소
        </button>
      </div>
    </ModalOverlay>
  );
}
