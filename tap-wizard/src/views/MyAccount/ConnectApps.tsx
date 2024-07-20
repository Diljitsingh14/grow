import ConnectAppTab from "@/components/ConnectAppTab";
import { CONNECT_APPS_TYPES } from "@/constants/myaccounts";
import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { signIn } from "next-auth/react";

const ConnectAccountsView = () => {
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
        onClickConnect={() => signIn("google", { callbackUrl: "/my_account" })}
      ></ConnectAppTab>
      <ConnectAppTab></ConnectAppTab>
    </div>
  );
};

export default ConnectAccountsView;
