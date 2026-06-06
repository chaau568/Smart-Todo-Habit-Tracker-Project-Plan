export const queryKeys = {
  auth: {
    profile: ["auth", "profile"] as const,
  },
  tasks: {
    all: ["tasks"] as const,
    detail: (id: number) => ["tasks", id] as const,
  },
  habits: {
    all: ["habits"] as const,
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
    my: ["achievements", "my"] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    unreadCount: ["notifications", "unread-count"] as const,
  },
}
