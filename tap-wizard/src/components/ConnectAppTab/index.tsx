import React, { useEffect, useState } from "react";

import {
  Button,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { CONNECT_APPS_TYPES, IConnectApps } from "@/constants/myaccounts";
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface TConnectAppTab {
  accountType?: string;
  onClickConnect?: () => void;
  connectedAccounts?: any[];
}

const ConnectAppTab: React.FC<TConnectAppTab> = ({
  accountType,
  onClickConnect,
  connectedAccounts,
}) => {
  const [account, setAccount] = useState<IConnectApps>(CONNECT_APPS_TYPES.more);

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "google":
        return <FontAwesomeIcon icon={faGoogle} className="text-blue-500" />;
      case "facebook":
        return <FontAwesomeIcon icon={faFacebook} className="text-blue-500" />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (accountType == CONNECT_APPS_TYPES["facebook"].key) {
      setAccount(CONNECT_APPS_TYPES.facebook);
    } else if (accountType == CONNECT_APPS_TYPES["google"].key) {
      setAccount(CONNECT_APPS_TYPES.google);
    }

    //Fetch connect accounts for the app
    // set into store
  }, []);

  const handleDisconnect = (accountId: string) => {
    // Handle disconnect logic
    console.log(`Disconnect account with id: ${accountId}`);
  };

  return (
    <div
      style={{
        background: account.theme.background,
        color: account.theme.textColor,
      }}
    >
      <Disclosure as="div" className="p-6 mt-2" defaultOpen={false}>
        <DisclosureButton className="group flex w-full items-center justify-between">
          <span className="text-sm/6 font-medium text-white group-data-[hover]:text-white/80">
            {account.icon} {account.label}
          </span>

          <span className="flex align-items-center items-center">
            <Button
              onClick={onClickConnect}
              className="inline-flex items-center gap-2 rounded-md bg-white my-2 py-1 px-3 text-xs font-semibold text-blue-500 shadow-inner shadow-white/10 focus:outline-none data-[hover]:text-white data-[hover]:bg-blue-400 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
            >
              {account.icon} connect
            </Button>
            <ChevronDownIcon className="size-5 fill-white/60 group-data-[hover]:fill-white/50 group-data-[open]:rotate-180" />
          </span>
        </DisclosureButton>
        <DisclosurePanel className="mt-2 text-sm/5 text-white/50 border-t-2 py-2 my-2">
          <div className="space-y-4">
            {connectedAccounts?.length ? (
              connectedAccounts.map((acc) => (
                <div
                  key={acc.provider_account_id}
                  className="flex items-center p-4 border rounded-md shadow-sm bg-white hover:bg-gray-50 transition-colors"
                >
                  <img
                    src={acc?.social_profile?.picture}
                    alt={acc?.social_profile?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getProviderIcon(acc.provider)}
                        <span className="font-medium text-blue-400 font-bold">
                          {acc?.social_profile?.name}
                        </span>
                      </div>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() =>
                          handleDisconnect(acc.provider_account_id)
                        }
                      >
                        Disconnect
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      {acc?.social_profile?.email}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs">No Account connected</p>
            )}
          </div>
        </DisclosurePanel>
      </Disclosure>
    </div>
  );
};

export default ConnectAppTab;
