import ConnectAppTab from "@/components/ConnectAppTab";
import { CONNECT_APPS_TYPES } from "@/constants/myaccounts";
import React, { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { signIn } from "next-auth/react";
import axiosInstance from "@/utils/http/axiosInstance";
import { AUTH_API } from "@/constants/urls";

const ConnectAccountsView = () => {
  const [connectedAccounts, setConnectedAccounts] = useState<any[]>([]);

  // const filterByProvider = async ()=>{
  //   const connectedAccounts.map((account)=>{

  //   })
  // }

  const fetchConnectedAccounts = async () => {
    try {
      const response = await axiosInstance.get(
        `${AUTH_API.CONNECT_OAUTH_ACCOUNT}`
      );

      if (response.status == 200) setConnectedAccounts(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchConnectedAccounts();
  }, []);

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
        onClickConnect={() => signIn("google", { callbackUrl: "/my_account" })}
      ></ConnectAppTab>
      <ConnectAppTab></ConnectAppTab>
    </div>
  );
};

export default ConnectAccountsView;
