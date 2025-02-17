import ConnectAppTab from "@/components/ConnectAppTab";
import { CONNECT_APPS_TYPES } from "@/constants/myaccounts";
import React, { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { signIn } from "next-auth/react";
import axiosInstance from "@/utils/http/axiosInstance";
import { AUTH_API } from "@/constants/urls";
import { fetchConnectedOAuthAccounts } from "@/utils/services/turnx/accounts";

const ConnectAccountsView = () => {
  const [connectedAccounts, setConnectedAccounts] = useState<any[]>([]);

  // const filterByProvider = async ()=>{
  //   const connectedAccounts.map((account)=>{

  //   })
  // }

  const fetchConnectedAccounts = async () => {
    try {
      const response = await fetchConnectedOAuthAccounts();
      if (response.status == 200) setConnectedAccounts(response?.data?.results);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnectedAccounts();
  }, []);

  const handleDisconnect = async (accountId: string) => {
    // Handle disconnect logic
    const url = `${AUTH_API.CONNECT_OAUTH_ACCOUNT}${accountId}/`;
    try {
      const res = await axiosInstance.delete(url);
      if (res.status == 204) {
        await fetchConnectedAccounts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h3 className="my-2 text-xl">
        <FontAwesomeIcon icon={faLink} /> Connected Apps
      </h3>
      <ConnectAppTab
        accountType={CONNECT_APPS_TYPES.facebook.key}
      ></ConnectAppTab>
      <ConnectAppTab
        accountType={CONNECT_APPS_TYPES.google.key}
        connectedAccounts={connectedAccounts}
        onClickDisconnect={handleDisconnect}
        onClickConnect={() => signIn("google", { callbackUrl: "/my_account" })}
      ></ConnectAppTab>
      <ConnectAppTab></ConnectAppTab>
    </div>
  );
};

export default ConnectAccountsView;
