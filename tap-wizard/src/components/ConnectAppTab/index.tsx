import React, { useEffect, useState } from "react";
import {
  Button,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { CONNECT_APPS_TYPES } from "@/constants/myaccounts";
import ConnectedAccountList from "@/components/ConnectedAccountList"; // Import the new component
import { IConnectApps } from "@/types/connect";

interface TConnectAppTab {
  accountType?: string;
  onClickConnect?: () => void;
  onClickDisconnect?: (id: string) => void;
  connectedAccounts?: any[];
}

const ConnectAppTab: React.FC<TConnectAppTab> = ({
  accountType,
  onClickConnect,
  connectedAccounts,
  onClickDisconnect,
}) => {
  const [account, setAccount] = useState<IConnectApps>(CONNECT_APPS_TYPES.more);

  useEffect(() => {
    if (accountType === CONNECT_APPS_TYPES["facebook"].key) {
      setAccount(CONNECT_APPS_TYPES.facebook);
    } else if (accountType === CONNECT_APPS_TYPES["google"].key) {
      setAccount(CONNECT_APPS_TYPES.google);
    }

    // Fetch connected accounts for the app
    // Set into store
  }, [accountType]);

  return (
    <div
      style={{
        background: account.theme.background,
        color: account.theme.textColor,
      }}
    >
      <Disclosure as="div" className="p-6 mt-2" defaultOpen={false}>
        <div className="inline-flex w-full">
          <span className="text-sm/6 font-medium text-white group-hover:text-white/80">
            {account.icon} {account.label}
          </span>
          <div className="ml-auto flex">
            <Button
              onClick={onClickConnect}
              className="inline-flex items-center gap-2 rounded-md bg-white my-2 py-1 px-3 text-xs font-semibold text-blue-500 shadow-inner shadow-white/10 focus:outline-none hover:text-white hover:bg-blue-400"
              >
              {account.icon} Connect
            </Button>
            <DisclosureButton className="group flex w-full items-center justify-between">
              <ChevronDownIcon className="size-5 fill-white/60 group-hover:fill-white/50 group-open:rotate-180" />
            </DisclosureButton>
          </div>
        </div>
        <DisclosurePanel className="mt-2 text-sm/5 text-white/50 border-t-2 py-2 my-2">
          {/* Use the new ConnectedAccountList component */}
          <ConnectedAccountList
            connectedAccounts={connectedAccounts}
            onClickDisconnect={onClickDisconnect}
          />
        </DisclosurePanel>
      </Disclosure> 
    </div>
  );
};

export default ConnectAppTab;
