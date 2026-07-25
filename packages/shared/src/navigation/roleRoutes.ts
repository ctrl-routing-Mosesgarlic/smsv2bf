import { PLATFORM_ROUTES, SCHOOL_ROUTES, AUTH_ROUTES } from '@cbc/config/routes';

export const ROLE_DEFAULT_ROUTES: Record<string, string> = {
  // Platform Tier (web-admin app)
  platform_owner: PLATFORM_ROUTES.dashboard,
  super_admin: PLATFORM_ROUTES.dashboard,
  tenant_admin: PLATFORM_ROUTES.dashboard,
  group_admin: PLATFORM_ROUTES.dashboard,

  // Governance Tier (web-school)
  school_admin: SCHOOL_ROUTES.adminDashboard,
  principal: SCHOOL_ROUTES.adminDashboard,
  deputy_principal: SCHOOL_ROUTES.adminDashboard,
  director_of_studies: SCHOOL_ROUTES.adminDashboard,
  dean_of_students: SCHOOL_ROUTES.adminDashboard,
  head_of_year: SCHOOL_ROUTES.adminDashboard,
  school_registrar: SCHOOL_ROUTES.adminDashboard,
  school_secretary: SCHOOL_ROUTES.adminDashboard,
  career_guidance_counselor: SCHOOL_ROUTES.adminDashboard,

  // Departmental + Teaching Tiers (web-school)
  head_of_department: SCHOOL_ROUTES.teacherDashboard,
  games_master: SCHOOL_ROUTES.teacherDashboard,
  sports_coordinator: SCHOOL_ROUTES.teacherDashboard,
  class_teacher: SCHOOL_ROUTES.teacherDashboard,
  subject_teacher: SCHOOL_ROUTES.teacherDashboard,
  special_needs_teacher: SCHOOL_ROUTES.teacherDashboard,
  counselor_teacher: SCHOOL_ROUTES.teacherDashboard,

  // Finance Tier (web-school)
  bursar: SCHOOL_ROUTES.financeDashboard,
  finance_officer: SCHOOL_ROUTES.financeDashboard,
  accounts_clerk: SCHOOL_ROUTES.financeDashboard,

  // Support Staff Tier (web-school)
  librarian: SCHOOL_ROUTES.staffLibrary,
  lab_technician: SCHOOL_ROUTES.staffLaboratory,
  ict_technician: SCHOOL_ROUTES.staffIct,
  school_nurse: SCHOOL_ROUTES.staffHealth,
  boarding_master: SCHOOL_ROUTES.staffHostel,
  dormitory_master: SCHOOL_ROUTES.staffHostel,
  matron: SCHOOL_ROUTES.staffHostel,
  store_keeper: SCHOOL_ROUTES.staffInventory,
  driver: SCHOOL_ROUTES.staffTransport,
  security_officer: SCHOOL_ROUTES.staffDashboard,
  kitchen_staff: SCHOOL_ROUTES.staffDashboard,
  maintenance_staff: SCHOOL_ROUTES.staffDashboard,

  // External Members Tier (web-school)
  bom_member: SCHOOL_ROUTES.externalGovernance,
  bom_chair: SCHOOL_ROUTES.externalGovernance,
  sponsor: SCHOOL_ROUTES.externalSponsorship,
  external_examiner: SCHOOL_ROUTES.externalExamination,
  school_inspector: SCHOOL_ROUTES.externalInspection,
  auditor: SCHOOL_ROUTES.externalAudit,
  nemis_officer: SCHOOL_ROUTES.externalNemis,
  odpc_officer: SCHOOL_ROUTES.externalCompliance,

  // Student & Parent Tier
  student: SCHOOL_ROUTES.studentDashboard,
  student_leader: SCHOOL_ROUTES.studentDashboard,
  parent: SCHOOL_ROUTES.parentDashboard,
  guardian: SCHOOL_ROUTES.parentDashboard,
};

export function getDefaultRouteForRole(roleKey: string): string {
  return ROLE_DEFAULT_ROUTES[roleKey] || AUTH_ROUTES.login;
}

export function isPlatformRole(roleKey: string): boolean {
  return ['platform_owner', 'super_admin', 'tenant_admin', 'group_admin'].includes(roleKey);
}

export function isSchoolRole(roleKey: string): boolean {
  return !isPlatformRole(roleKey);
}
