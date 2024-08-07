import MyCalendar from "@/components/Calendar";
import { SIDEBAR_MENU_ITEMS } from "@/constants/myaccounts";
import { AUTH_API } from "@/constants/urls";
import { logout } from "@/utils/common/logout";
import axiosInstance from "@/utils/http/axiosInstance";
import ConnectAccountsView from "@/views/MyAccount/ConnectApps";
import Sidebar from "@/views/MyAccount/SideBar";
import { useSession, signOut } from "next-auth/react";
import React, { useEffect, useState } from "react";

interface MainContentProps {
  selectedTab?: string;
}

const MainContent: React.FC<MainContentProps> = ({ selectedTab }) => {
  const [currentTab, setCurrentTab] = useState<string>(
    SIDEBAR_MENU_ITEMS[0].key
  );
  const { data: session, update } = useSession();

  const saveOauthAccounts = async (data: any) => {
    try {
      const response = await axiosInstance.post(
        AUTH_API.CONNECT_OAUTH_ACCOUNT,
        {
          provider: data?.provider,
          provider_account_id: data?.id,
          access_token: data?.accessToken,
          expires_at: data?.expiresAt,
          scope: data?.scope,
          token_type: data?.tokenType,
          id_token: data?.idToken,
        }
      );
      if (response.status == 201) {
        await update({ isAuthSaved: true });
        await signOut();
      }
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (session && !session?.isAuthSaved) {
      saveOauthAccounts(session);
    }
  }, [session]);

  const handleTabChange = (key: string) => {
    setCurrentTab(key);
    if (key == SIDEBAR_MENU_ITEMS[3].key) {
      logout();
    }
  };

  let content;

  switch (currentTab) {
    case SIDEBAR_MENU_ITEMS[0].key:
      content = <div>My Account Content</div>;
      break;
    case SIDEBAR_MENU_ITEMS[1].key:
      content = <ConnectAccountsView />;
      break;
    case SIDEBAR_MENU_ITEMS[2].key:
      content = <MyCalendar />;
      break;
    case SIDEBAR_MENU_ITEMS[3].key:
      content = <div>Log Out Content</div>;
      break;
    default:
      content = <div>Select a menu item</div>;
  }

  return (
    <div className="flex">
      <Sidebar selectedTab={currentTab} onChangeTab={handleTabChange} />
      <div className="flex-1 ml-64 p-5 transition-margin duration-300 ease-in-out">
        {content}
      </div>
    </div>
  );
};

export default MainContent;
