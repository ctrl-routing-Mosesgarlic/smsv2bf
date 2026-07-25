export const PLATFORM_ROUTES = {
  dashboard: "/dashboard",
  tenants: "/tenants",
  schools: "/schools",
  schoolGroups: "/school-groups",
  users: "/users",
  roles: "/roles",
  subscription: "/subscription",
  subscriptionPlans: "/subscription-plans",
  planFeatures: "/plan-features",
  accessPolicies: "/access-policies",
  auditLogs: "/audit-logs",
  billing: "/billing",
  compliance: "/compliance",
} as const;

export const PLATFORM_ROUTE_PATHS = Object.values(PLATFORM_ROUTES);
