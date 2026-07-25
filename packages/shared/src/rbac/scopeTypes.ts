import type { ScopeType } from '../types';

export const SCOPE_TYPES: ScopeType[] = [
  'tenant',
  'school_group',
  'school',
  'grade_level',
  'stream',
  'department',
  'year_group',
];

export const SCOPE_LABELS: Record<ScopeType, string> = {
  tenant: 'Tenant',
  school_group: 'School Group',
  school: 'School',
  grade_level: 'Grade Level',
  stream: 'Stream',
  department: 'Department',
  year_group: 'Year Group',
};
