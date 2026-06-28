export const queryKeys = {
  auth: {
    profile: ["auth", "profile"] as const,
  },
  tasks: {
    all: ["tasks"] as const,
    list: (params: object) => ["tasks", "list", params] as const,
    detail: (id: number) => ["tasks", id] as const,
  },
  habits: {
    all: ["habits"] as const,
    list: (params: object) => ["habits", "list", params] as const,
    detail: (id: number) => ["habits", id] as const,
    history: (id: number) => ["habits", id, "history"] as const,
  },
  categories: {
    all: ["categories"] as const,
  },
  tracking: {
    summary: ["tracking", "summary"] as const,
    dashboard: ["tracking", "dashboard"] as const,
  },
  achievements: {
    all: ["achievements"] as const,
    list: (params: object) => ["achievements", "list", params] as const,
    my: ["achievements", "my"] as const,
  },
  challenges: {
    all: ["challenges"] as const,
    list: (params: object) => ["challenges", "list", params] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    list: (params: object) => ["notifications", "list", params] as const,
    unreadCount: ["notifications", "unread-count"] as const,
  },
}
