export const SCHOOL_ROUTES = {
  adminDashboard: "/admin/dashboard",
  teacherDashboard: "/teacher/dashboard",
  financeDashboard: "/finance/dashboard",
  staffDashboard: "/staff/dashboard",
  staffLibrary: "/staff/library",
  staffLaboratory: "/staff/laboratory",
  staffIct: "/staff/ict",
  staffHealth: "/staff/health",
  staffHostel: "/staff/hostel",
  staffInventory: "/staff/inventory",
  staffTransport: "/staff/transport",
  externalGovernance: "/external/governance",
  externalSponsorship: "/external/sponsorship",
  externalExamination: "/external/examination",
  externalInspection: "/external/inspection",
  externalAudit: "/external/audit",
  externalNemis: "/external/nemis",
  externalCompliance: "/external/compliance",
  studentDashboard: "/student/dashboard",
  parentDashboard: "/parent/dashboard",
} as const;

export const SCHOOL_ROUTE_PATHS = Object.values(SCHOOL_ROUTES);
