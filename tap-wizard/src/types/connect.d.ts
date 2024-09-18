export interface IConnectApps {
  label: string;
  key: string;
  theme: {
    background: string;
    textColor: string;
  };
  icon: ReactNode;
  isMultiAccount: boolean;
  connectedAccounts: any[];
}
