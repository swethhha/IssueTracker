export interface MedicalClaimRequest {
  employeeId?: number;
  claimAmount: number;
  claimDate: Date;
  description: string;
  hospitalName: string;
  treatmentType: string;
  documentPaths?: string[];
}

export interface MedicalClaimResponse {
  claimId: number;
  employeeId: number;
  employeeName: string;
  claimAmount: number;
  claimDate: Date;
  description: string;
  hospitalName: string;
  treatmentType: string;
  status: string;
  managerApprovalDate?: Date;
  financeApprovalDate?: Date;
  rejectionReason?: string;
  createdAt: Date;
}