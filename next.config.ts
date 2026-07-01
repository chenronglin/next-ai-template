import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 会把这些包的常规导入优化为按需导入，降低 lucide/radix 这类库在开发和构建时的 barrel import 成本。
  experimental: {
    optimizePackageImports: ["lucide-react", "radix-ui"],
  },
};

export default nextConfig;
