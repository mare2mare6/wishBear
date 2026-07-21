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
      className={`font-display w-full rounded-full font-bold transition-transform active:translate-y-[2px] ${
        small ? "py-3 text-sm" : "py-4 text-base"
      }`}
      style={{
        color: THEME.dark,
        background: THEME.accent,
        boxShadow: `0 4px 0 ${THEME.accentShadow}`,
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
      className={`font-display w-full rounded-full font-bold transition-transform active:translate-y-[2px] ${
        small ? "py-3 text-sm" : "py-4 text-base"
      }`}
      style={{
        color: THEME.heading,
        background: THEME.inputBg,
        boxShadow: `0 3px 0 ${THEME.cardStroke}`,
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
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full text-sm text-white shadow-lg"
      style={{ background: THEME.dark }}
    >
      {message}
    </div>
  );
}

export function ModalOverlay({
  children,
  onClose,
  center,
}: {
  children: React.ReactNode;
  onClose?: () => void;
  center?: boolean;
}) {
  return (
    <div
      className="absolute inset-0 z-40 flex"
      style={{
        background: "rgba(60,45,25,0.35)",
        alignItems: center ? "center" : "stretch",
        justifyContent: "center",
        padding: center ? "24px" : 0,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      {children}
    </div>
  );
}
