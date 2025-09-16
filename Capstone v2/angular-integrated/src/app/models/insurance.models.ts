export interface InsurancePolicy {
  id: number;
  name: string;
  description: string;
  coverage: string;
}

export interface InsuranceEnrollment {
  id?: number;
  employeeId: number;
  policyId: number;
  policyName?: string;
  status: string;
  enrollmentDate: Date;
  approvedBy?: string;
  rejectedReason?: string;
}

export interface InsuranceEnrollmentRequest {
  policyId: number;
  employeeId?: number;
}