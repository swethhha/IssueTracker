export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: NavigationItem[];
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'main',
    title: 'Main',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/dashboard',
        icon: 'feather icon-home'
      }
    ]
  },
  {
    id: 'employee-services',
    title: 'Employee Services',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'payroll',
        title: 'Payroll',
        type: 'item',
        url: '/payroll',
        icon: 'feather icon-dollar-sign'
      },
      {
        id: 'loans',
        title: 'Loans',
        type: 'item',
        url: '/loans',
        icon: 'feather icon-credit-card'
      },
      {
        id: 'reimbursements',
        title: 'Reimbursements',
        type: 'item',
        url: '/reimbursements',
        icon: 'feather icon-file-text'
      },
      {
        id: 'insurance',
        title: 'Insurance',
        type: 'item',
        url: '/insurance',
        icon: 'feather icon-shield'
      },
      {
        id: 'medical-claims',
        title: 'Medical Claims',
        type: 'item',
        url: '/medical-claims',
        icon: 'feather icon-heart'
      }
    ]
  },
  {
    id: 'management',
    title: 'Management',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'approvals',
        title: 'Approvals',
        type: 'collapse',
        icon: 'feather icon-check-circle',
        children: [
          {
            id: 'payroll-approvals',
            title: 'Payroll Approvals',
            type: 'item',
            url: '/approvals/payroll'
          },
          {
            id: 'loan-approvals',
            title: 'Loan Approvals',
            type: 'item',
            url: '/approvals/loans'
          },
          {
            id: 'reimbursement-approvals',
            title: 'Reimbursement Approvals',
            type: 'item',
            url: '/approvals/reimbursements'
          }
        ]
      }
    ]
  }
];
