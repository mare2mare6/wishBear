import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wish Bear",
  description: "나만의 레지스트리 방을 만들고 친구들과 위시리스트를 공유하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}

