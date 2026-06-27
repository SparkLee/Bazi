import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 纯静态导出：构建产物为静态 HTML/JS/CSS（无需 Node 运行时）
  output: "export",
  // 静态导出下关闭图片优化（无服务端）
  images: { unoptimized: true },
  // 资源使用相对路径，便于部署到任意子目录/静态服务器
  trailingSlash: true,
};

export default nextConfig;
