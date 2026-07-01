export const oauthProviderIds = ["github", "google"] as const;

export type OAuthProviderId = (typeof oauthProviderIds)[number];

export type OAuthProviderStatus = {
  id: OAuthProviderId;
  label: string;
  enabled: boolean;
};

// OAuth 展示标签保持为产品事实源，服务端配置和客户端按钮共用，避免两边手写不一致。
export const oauthProviderLabels: Record<OAuthProviderId, string> = {
  github: "GitHub",
  google: "Google",
};
