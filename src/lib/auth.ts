const AUTH_STORAGE_KEY = "auth";
const TOKEN_STORAGE_KEY = "token";

type UnknownRecord = Record<string, unknown>;

export interface AuthFeature {
  id?: string | number;
  name: string;
  description?: string | null;
  frontendUrl?: string | null;
  icon?: string | null;
  menuName?: string | null;
  category?: string | null;
  createdBy?: string | null;
  createdDate?: string | null;
  lastUpdatedBy?: string | null;
  lastUpdatedDate?: string | null;
  applicationRoles?: unknown[];
  action: "create" | "read" | "update" | "delete" | "other";
  sidebarLabel: string;
}

export interface SidebarMenuItem {
  key: string;
  label: string;
  href?: string;
  icon?: string;
  feature: AuthFeature;
}

export interface SidebarMenuGroup {
  key: string;
  label: string;
  items: SidebarMenuItem[];
}

export interface AuthUser {
  username?: string;
  role?: string;
  loginMethod?: string;
  userConfig?: unknown;
  features: AuthFeature[];
  featureGroups: SidebarMenuGroup[];
  [key: string]: unknown;
}

export interface AuthSession {
  token: string;
  refreshToken?: string;
  user?: AuthUser;
}

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null;

const getRecord = (value: UnknownRecord, key: string): UnknownRecord | undefined => {
  const nestedValue = value[key];
  return isRecord(nestedValue) ? nestedValue : undefined;
};

const getString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim().length > 0 ? value : undefined;

export const toSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getFeatureAction = (featureName: string): AuthFeature["action"] => {
  const normalizedName = featureName.trim().toLowerCase();

  if (normalizedName.startsWith("create ")) return "create";
  if (normalizedName.startsWith("read ")) return "read";
  if (normalizedName.startsWith("update ")) return "update";
  if (normalizedName.startsWith("delete ")) return "delete";

  return "other";
};

const getSidebarLabelFromName = (featureName: string) =>
  featureName.replace(/^(create|read|update|delete)\s+/i, "").trim();

const isSidebarCandidate = (feature: AuthFeature) =>
  Boolean(feature.menuName?.trim() || feature.frontendUrl?.trim()) || feature.action === "read";

const getSidebarHref = (value?: string | null) => {
  const href = value?.trim();

  if (!href) {
    return undefined;
  }

  if (/^https?:\/\//i.test(href) || href.startsWith("/")) {
    return href;
  }

  return `/${href.replace(/^\/+/, "")}`;
};

const getFeatureScore = (feature: AuthFeature) =>
  (feature.action === "read" ? 100 : 0) +
  (feature.menuName?.trim() ? 10 : 0) +
  (feature.frontendUrl?.trim() ? 5 : 0);

const normalizeFeature = (value: unknown): AuthFeature | null => {
  if (!isRecord(value)) {
    return null;
  }

  const name = getString(value.name);

  if (!name) {
    return null;
  }

  const action = getFeatureAction(name);
  const sidebarLabel = getString(value.menuName) || getSidebarLabelFromName(name) || name;

  return {
    id: typeof value.id === "string" || typeof value.id === "number" ? value.id : undefined,
    name,
    description: value.description === null ? null : getString(value.description),
    frontendUrl: value.frontendUrl === null ? null : getString(value.frontendUrl),
    icon: value.icon === null ? null : getString(value.icon),
    menuName: value.menuName === null ? null : getString(value.menuName),
    category: value.category === null ? null : getString(value.category),
    createdBy: value.createdBy === null ? null : getString(value.createdBy),
    createdDate: value.createdDate === null ? null : getString(value.createdDate),
    lastUpdatedBy: value.lastUpdatedBy === null ? null : getString(value.lastUpdatedBy),
    lastUpdatedDate: value.lastUpdatedDate === null ? null : getString(value.lastUpdatedDate),
    applicationRoles: Array.isArray(value.applicationRoles) ? value.applicationRoles : [],
    action,
    sidebarLabel,
  };
};

export const groupFeaturesForSidebar = (features: AuthFeature[]): SidebarMenuGroup[] => {
  const groups = new Map<string, SidebarMenuGroup>();

  const sidebarFeatures = features
    .filter(isSidebarCandidate)
    .sort((left, right) => getFeatureScore(right) - getFeatureScore(left));

  sidebarFeatures.forEach((feature) => {
    const groupLabel = feature.category?.trim() || "General";
    const groupKey = toSlug(groupLabel) || "general";
    const itemLabel = feature.sidebarLabel;
    const itemKey = toSlug(itemLabel) || String(feature.id) || "item";

    const existingGroup = groups.get(groupKey) ?? {
      key: groupKey,
      label: groupLabel,
      items: [],
    };

    if (!groups.has(groupKey)) {
      groups.set(groupKey, existingGroup);
    }

    if (existingGroup.items.some((item) => item.key === itemKey)) {
      return;
    }

    existingGroup.items.push({
      key: itemKey,
      label: itemLabel,
      href: getSidebarHref(feature.frontendUrl),
      icon: feature.icon?.trim() || undefined,
      feature,
    });
  });

  return Array.from(groups.values())
    .map((group) => ({
      ...group,
      items: group.items.sort((left, right) => left.label.localeCompare(right.label)),
    }))
    .sort((left, right) => left.label.localeCompare(right.label));
};

const normalizeAuthUser = (candidate: UnknownRecord): AuthUser => {
  const features = Array.isArray(candidate.features)
    ? candidate.features
        .map(normalizeFeature)
        .filter((feature): feature is AuthFeature => feature !== null)
    : [];

  return {
    ...candidate,
    username: getString(candidate.username),
    role: getString(candidate.role),
    loginMethod: getString(candidate.loginMethod),
    userConfig: candidate.userConfig,
    features,
    featureGroups: groupFeaturesForSidebar(features),
  };
};

export const getStoredAuth = (): AuthSession | null => {
  const authString = localStorage.getItem(AUTH_STORAGE_KEY);

  if (authString) {
    try {
      const parsedAuth = JSON.parse(authString);

      if (isRecord(parsedAuth)) {
        const token = getString(parsedAuth.token);
        if (token) {
          return {
            token,
            refreshToken: getString(parsedAuth.refreshToken),
            user: isRecord(parsedAuth.user) ? normalizeAuthUser(parsedAuth.user) : undefined,
          };
        }
      }
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }

  const legacyToken = localStorage.getItem(TOKEN_STORAGE_KEY);

  if (!legacyToken) {
    return null;
  }

  return { token: legacyToken };
};

export const getStoredUser = (): AuthUser | null => getStoredAuth()?.user ?? null;

export const getSidebarMenuGroups = (): SidebarMenuGroup[] => getStoredUser()?.featureGroups ?? [];

export const getAuthToken = (): string | null => getStoredAuth()?.token ?? null;

export const setStoredAuth = (session: AuthSession) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  localStorage.setItem(TOKEN_STORAGE_KEY, session.token);
};

export const clearStoredAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
};

export const normalizeAuthSession = (payload: unknown): AuthSession | null => {
  if (!isRecord(payload)) {
    return null;
  }

  const candidates = [
    payload,
    getRecord(payload, "data"),
    getRecord(payload, "result"),
    getRecord(payload, "auth"),
    getRecord(payload, "session"),
    getRecord(getRecord(payload, "data") ?? {}, "data"),
    getRecord(getRecord(payload, "data") ?? {}, "auth"),
  ].filter(Boolean) as UnknownRecord[];

  for (const candidate of candidates) {
    const token =
      getString(candidate.token) ??
      getString(candidate.accessToken) ??
      getString(candidate.access_token) ??
      getString(candidate.jwt);

    if (!token) {
      continue;
    }

    const explicitUser =
      getRecord(candidate, "user") ??
      getRecord(candidate, "profile") ??
      getRecord(candidate, "account");

    const userSource =
      explicitUser ||
      (candidate.username ||
      candidate.role ||
      candidate.loginMethod ||
      candidate.features ||
      "userConfig" in candidate
        ? candidate
        : undefined);

    return {
      token,
      refreshToken: getString(candidate.refreshToken) ?? getString(candidate.refresh_token),
      user: userSource ? normalizeAuthUser(userSource) : undefined,
    };
  }

  return null;
};
