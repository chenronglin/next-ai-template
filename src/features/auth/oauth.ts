import "server-only";

import type { SocialProviders } from "better-auth";

import {
  oauthProviderIds,
  oauthProviderLabels,
  type OAuthProviderStatus,
} from "@/features/auth/oauth-types";
import { env } from "@/lib/env";

export function getOAuthProviderStatuses(): OAuthProviderStatus[] {
  return oauthProviderIds.map((id) => ({
    id,
    label: oauthProviderLabels[id],
    enabled: isOAuthProviderEnabled(id),
  }));
}

export function getSocialProviders(): SocialProviders {
  const providers: SocialProviders = {};

  if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
    // Better Auth 内置 GitHub provider；只有密钥完整时才注册，避免半配置状态在运行时抛错。
    providers.github = {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    };
  }

  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    // Google provider 需要 clientId/clientSecret 都存在，PKCE 细节由 Better Auth 内部处理。
    providers.google = {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    };
  }

  return providers;
}

function isOAuthProviderEnabled(id: OAuthProviderStatus["id"]) {
  if (id === "github") {
    return Boolean(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET);
  }

  return Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
}
