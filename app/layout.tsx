import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "知命 · 八字命理排盘",
  description:
    "基于中国传统命理学（子平八字）的排盘与分析工具：四柱、十神、五行旺衰、用神喜忌、大运流年，每一步推演均有理论依据，可解释、可追溯。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#b08d57",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
