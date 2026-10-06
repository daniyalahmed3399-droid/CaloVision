/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ["172.16.10.155"],
  images: {
    // Quality values <Image quality={...}> may use (Next 16 only allows
    // values listed here).
    qualities: [75, 90],
  },
};

export default nextConfig;
