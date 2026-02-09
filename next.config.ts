import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ac.goit.global', // Додаємо цей хост з помилки
      },
    ],
  },
};

export default nextConfig;