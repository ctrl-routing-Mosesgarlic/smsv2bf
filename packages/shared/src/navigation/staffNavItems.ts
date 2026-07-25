import { SCHOOL_ROUTES } from '@cbc/config/routes';

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

export const STAFF_NAV_ITEMS: Record<string, NavItem[]> = {
  librarian: [
    { label: 'Catalogue', href: SCHOOL_ROUTES.staffLibrary },
    { label: 'Borrowings', href: `${SCHOOL_ROUTES.staffLibrary}/borrowings` },
    { label: 'Fines', href: `${SCHOOL_ROUTES.staffLibrary}/fines` },
  ],
  lab_technician: [
    { label: 'Laboratory Inventory', href: SCHOOL_ROUTES.staffLaboratory },
  ],
  ict_technician: [
    { label: 'ICT Equipment', href: SCHOOL_ROUTES.staffIct },
  ],
  school_nurse: [
    { label: 'Student Health', href: SCHOOL_ROUTES.staffHealth },
  ],
  boarding_master: [
    { label: 'Hostel Overview', href: SCHOOL_ROUTES.staffHostel },
    { label: 'Allocations', href: `${SCHOOL_ROUTES.staffHostel}/allocations` },
    { label: 'Attendance', href: `${SCHOOL_ROUTES.staffHostel}/attendance` },
  ],
  dormitory_master: [
    { label: 'Hostel Overview', href: SCHOOL_ROUTES.staffHostel },
    { label: 'Allocations', href: `${SCHOOL_ROUTES.staffHostel}/allocations` },
    { label: 'Attendance', href: `${SCHOOL_ROUTES.staffHostel}/attendance` },
  ],
  matron: [
    { label: 'Hostel Overview', href: SCHOOL_ROUTES.staffHostel },
    { label: 'Allocations', href: `${SCHOOL_ROUTES.staffHostel}/allocations` },
    { label: 'Attendance', href: `${SCHOOL_ROUTES.staffHostel}/attendance` },
  ],
  store_keeper: [
    { label: 'Inventory', href: SCHOOL_ROUTES.staffInventory },
  ],
  driver: [
    { label: 'My Routes', href: SCHOOL_ROUTES.staffTransport },
  ],
  security_officer: [
    { label: 'Dashboard', href: SCHOOL_ROUTES.staffDashboard },
  ],
  kitchen_staff: [
    { label: 'Dashboard', href: SCHOOL_ROUTES.staffDashboard },
  ],
  maintenance_staff: [
    { label: 'Dashboard', href: SCHOOL_ROUTES.staffDashboard },
  ],
};

export function getStaffNavItems(roleKey: string): NavItem[] {
  return STAFF_NAV_ITEMS[roleKey] || [];
}
