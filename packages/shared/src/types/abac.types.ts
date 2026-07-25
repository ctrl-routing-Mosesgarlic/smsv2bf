export interface AccessPolicy {
  id: string;
  name: string;
  effect: PolicyEffect;
  conditions: PolicyCondition[];
  priority: number;
  is_active: boolean;
}

export type PolicyEffect = 'grant' | 'deny';

export interface PolicyCondition {
  attribute: string;
  operator: AbacOperator;
  value: string | string[];
}

export type AbacOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'in'
  | 'not_in'
  | 'starts_with'
  | 'ends_with';
