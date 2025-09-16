export interface ReimbursementRequest {
  employeeId: number;
  category: string;
  amount: number;
  description: string;
  requestDate: Date;
  documentPaths: string[];
}

export interface ReimbursementResponse {
  id: number;
  reimbursementId: number;
  employeeId: number;
  employeeName: string;
  category: string;
  amount: number;
  description: string;
  status: string;
  requestDate: Date;
  approvedDate?: Date;
  rejectedDate?: Date;
  managerComments?: string;
  financeComments?: string;
  managerApprovalDate?: Date;
  financeApprovalDate?: Date;
  attachments?: string[];
}