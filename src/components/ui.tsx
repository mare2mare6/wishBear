"use client";

import React from "react";
import { THEME } from "@/lib/theme";

export function Logo() {
  return (
    <div className="pt-8 pb-2 text-center">
      <span
        className="font-display"
        style={{ color: THEME.heading, fontSize: "1.5rem", letterSpacing: "0.02em" }}
      >
        Wish Bear
      </span>
    </div>
  );
}

export function ClayButton({
  children,
  onClick,
  style,
  disabled,
  small,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  disabled?: boolean;
  small?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`font-display w-full rounded-full font-bold ${
        small ? "py-3 text-sm" : "py-4 text-base"
      }`}
      style={{
        color: THEME.dark,
        background: THEME.accent,
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  style,
  small,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`font-display w-full rounded-full font-bold ${
        small ? "py-3 text-sm" : "py-4 text-base"
      }`}
      style={{
        color: THEME.heading,
        background: THEME.inputBg,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-2xl px-5 py-4 text-sm outline-none"
      style={{ background: THEME.inputBg, color: THEME.dark }}
    />
  );
}

export function ProductImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="w-full aspect-square rounded-2xl overflow-hidden"
      style={{ background: THEME.imgPlaceholder }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
}

export function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full text-sm text-white"
      style={{ background: THEME.dark }}
    >
      {message}
    </div>
  );
}

// 팝업/모달은 항상 브라우저 화면(뷰포트) 기준 정중앙에 뜨도록
// absolute가 아닌 fixed로 배치합니다. (스크롤 위치나 폰 프레임 높이에 영향받지 않음)
export function ModalOverlay({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose?: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ background: "rgba(60,45,25,0.35)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}