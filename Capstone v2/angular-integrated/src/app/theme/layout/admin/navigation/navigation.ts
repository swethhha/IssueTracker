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
        icon: 'material-icons-outlined home'
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
        icon: 'material-icons-outlined payments'
      },
      {
        id: 'loans',
        title: 'Loans',
        type: 'item',
        url: '/loans',
        icon: 'material-icons-outlined account_balance_wallet'
      },
      {
        id: 'reimbursements',
        title: 'Reimbursements',
        type: 'item',
        url: '/reimbursements',
        icon: 'material-icons-outlined receipt_long'
      },
      {
        id: 'insurance',
        title: 'Insurance',
        type: 'item',
        url: '/insurance',
        icon: 'material-icons-outlined security'
      },
      {
        id: 'medical-claims',
        title: 'Medical Claims',
        type: 'item',
        url: '/medical-claims',
        icon: 'material-icons-outlined local_hospital'
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
        icon: 'material-icons-outlined check_circle',
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
        ],
        breadcrumbs: false
      },
      {
        id: 'analytics',
        title: 'Analytics',
        type: 'item',
        url: '/analytics',
        icon: 'material-icons-outlined analytics'
      }
    ]
  }
];
