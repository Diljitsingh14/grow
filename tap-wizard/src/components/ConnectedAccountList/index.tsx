import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { isExpire } from "@/utils/common/helper";
import Image from "next/image";

// Define the interface for the account data
interface Account {
  id: string;
  provider: string;
  expires_at: number;
  social_profile: {
    picture: string;
    name: string;
    email: string;
  };
  provider_account_id: string;
}

// Define the interface for the ConnectedAccountList props
interface ConnectedAccountListProps {
  connectedAccounts?: Account[];
  onClickDisconnect?: (id: string) => void;
  onClickAccount?: (id: string) => void;
  isOnlyView?: boolean;
  selectedAccountList?: string[];
}

// Function to get the provider icon based on provider name
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

// The ConnectedAccountList component
const ConnectedAccountList: React.FC<ConnectedAccountListProps> = ({
  connectedAccounts,
  onClickDisconnect,
  onClickAccount,
  isOnlyView,
  selectedAccountList = [],
}) => {
  return (
    <div className="space-y-4">
      {connectedAccounts?.length ? (
        connectedAccounts.map((acc) => (
          <div
            key={acc.provider_account_id}
            onClick={() => {
              if (onClickAccount) onClickAccount(acc.id);
            }}
            className={`flex items-center cursor-pointer p-4 border border-gray-400 ease-in rounded-md hover:shadow-xl ${
              selectedAccountList.includes(acc.id)
                ? "bg-black hover:bg-blue-100 shadow-2xl"
                : "bg-white hover:bg-gray-50"
            } transition-colors`}
          >
            <Image
              src={acc?.social_profile?.picture ?? '#'}
              alt={acc?.social_profile?.name}
              className="w-12 h-12 rounded-full object-cover"
              width={100}
              height={100}
            />

            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getProviderIcon(acc.provider)}
                  <span className="text-blue-400 font-bold">
                    {acc?.social_profile?.name}
                  </span>
                </div>
                <div className="flex-row">
                  {!isOnlyView && (
                    <>
                      <div className="div">
                        <button
                          className={`${
                            isExpire(acc.expires_at)
                              ? "text-yellow-500 hover:text-yellow-700 border-yellow-400"
                              : "text-red-500 hover:text-red-700 border-red-400"
                          } border-2 rounded-lg px-2`}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering onClickAccount
                            if (onClickDisconnect) onClickDisconnect(acc.id);
                          }}
                        >
                          {isExpire(acc.expires_at)
                            ? "Reconnect"
                            : "Disconnect"}
                        </button>
                      </div>

                      {isExpire(acc.expires_at) && (
                        <div className="div">
                          <span className="text-red-500 text-xs text-left px-2">
                            Expired
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
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
  );
};

export default ConnectedAccountList;
