export interface Account {
  id: string;
  name: string;
  type: string;
  status: string;
  lastActivity: string;
}

export interface TrustAccount extends Account {
  trustType: string;
  taxId: string;
  formationDate: string;
  taxYearEnd: string;
  usPersonStatus: boolean;
  trustStructure: 'Revocable' | 'Irrevocable';
  grantorStatus: 'Grantor Trust' | 'Non-Grantor Trust';
  formedToInvest: boolean;
  mailingAddress: {
    street: string;
    suite?: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  role: 'Signer' | 'Admin' | 'Editor' | 'Viewer';
  email: string;
}

export interface AccountTeamProps {
  accountId: string;
}

export interface AccountDetailsProps {
  accountId: string;
}
