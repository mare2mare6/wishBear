"use client";

import { THEME } from "@/lib/theme";
import { Toast } from "./ui";

export function PhoneFrame({
  children,
  toast,
}: {
  children: React.ReactNode;
  toast?: string;
}) {
  return (
    <div className="w-full min-h-screen flex items-center justify-center py-6 px-3">
      <div
        className="relative w-full max-w-md min-h-[780px] rounded-[2.5rem] overflow-hidden"
        style={{ background: THEME.bg }}
      >
        {children}
        <Toast message={toast ?? ""} />
      </div>
    </div>
  );
}