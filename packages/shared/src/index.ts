export type {
  ApiError,
  ApiResponse,
  PaginatedResponse,
  AuthUser,
  UserRoleClaim,
  AuthTokens,
  LoginRequest,
  OtpRequest,
  TenantContext,
  SchoolContext,
  AppContextValue,
  User,
  UserProfile,
  UserRole,
  UserAttribute,
  ScopeType,
  Role,
  Permission,
  RoleTier,
  UserRoleAssignment,
  AccessPolicy,
  PolicyEffect,
  PolicyCondition,
  AbacOperator,
  SubscriptionPlan,
  PlanFeatureAssignment,
  TenantSubscription,
  Tenant,
  SchoolGroup,
  School,
} from './types';

export { HttpClient, HttpClientProvider, HttpClientContext, useHttpClient, queryClient } from './api';

export { authService, AuthProvider, AuthContext, LoginForm, ForgotPasswordForm, OtpVerificationForm } from './auth';
export { useAuth } from './auth';

export { AppContextProvider, useTenant, useSchool } from './tenant';

export { usePermissions, PermissionGate, RoleGate, SCOPE_TYPES, SCOPE_LABELS } from './rbac';

export {
  ROLE_DEFAULT_ROUTES,
  getDefaultRouteForRole,
  isPlatformRole,
  isSchoolRole,
  STAFF_NAV_ITEMS,
  getStaffNavItems,
} from './navigation';
export type { NavItem } from './navigation';

export { ExternalSessionBanner } from './external/ExternalSessionBanner';

export {
  SUBSCRIPTION_PLANS,
  PLAN_FEATURE_MATRIX,
  getPlanFeatureLabels,
  formatFeatureValue,
  getYearlyPrice,
  getPlansGrouped,
} from './pricing';
