export interface LoanRequest {
  employeeId?: number;
  loanType: string;
  amount: number;
  tenureMonths: number;
  purpose: string;
  acceptTerms: boolean;
  documents?: LoanDocument[];
}

export interface LoanResponse {
  loanId: number;
  employeeId: number;
  employeeName: string;
  loanType: string;
  amount: number;
  tenureMonths: number;
  purpose: string;
  status: string;
  appliedDate: Date;
  approvedDate?: Date;
  monthlyInstallment: number;
  managerApproved?: boolean;
  financeApproved?: boolean;
  documents?: LoanDocument[];
}

export interface LoanDocument {
  id?: number;
  documentType: string;
  fileName: string;
  filePath: string;
  uploadDate?: Date;
}

export interface LoanDocumentDTO {
  id: number;
  fileName: string;
  filePath?: string;
}

export enum LoanType {
  Personal = 'Personal',
  Education = 'Education',
  Medical = 'Medical',
  Emergency = 'Emergency',
  Home = 'Home'
}

export enum DocumentType {
  IdentityProof = 'Identity Proof',
  AddressProof = 'Address Proof',
  SalarySlip = 'Salary Slip',
  BankStatement = 'Bank Statement',
  LoanSpecific = 'Loan Specific Document'
}