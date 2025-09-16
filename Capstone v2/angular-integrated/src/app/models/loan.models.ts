export interface LoanRequest {
  employeeId?: number;
  loanType: string;
  amount: number;
  duration: number;
  reason: string;
  documents?: LoanDocument[];
}

export interface LoanResponse {
  id: number;
  employeeId: number;
  employeeName: string;
  loanType: string;
  amount: number;
  duration: number;
  reason: string;
  status: string;
  applicationDate: Date;
  approvedDate?: Date;
  rejectedReason?: string;
  documents: LoanDocument[];
}

export interface LoanDocument {
  id?: number;
  documentType: string;
  fileName: string;
  filePath: string;
  uploadDate: Date;
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