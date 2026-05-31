import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { withBotId } from "botid/next/config";

const nextConfig: NextConfig = {
  // Add any other Next.js config here
  images: {
    qualities: [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withBotId(withNextIntl(nextConfig));
