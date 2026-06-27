import type { NextConfig } from "next";

// 部署子目录前缀（部署到域名根目录时改为空字符串 ""）。
// 也可用环境变量覆盖：BASE_PATH=/xxx npm run build
const basePath = process.env.BASE_PATH ?? "/project/oBfjZLkg";

const nextConfig: NextConfig = {
  // 纯静态导出：构建产物为静态 HTML/JS/CSS（无需 Node 运行时）
  output: "export",
  // 静态导出下关闭图片优化（无服务端）
  images: { unoptimized: true },
  trailingSlash: true,
  // 子目录部署：让页面路由与静态资源都带上前缀
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
