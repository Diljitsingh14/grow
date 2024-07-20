import { SIDEBAR_MENU_ITEMS } from "@/constants/myaccounts";
import ConnectAccountsView from "@/views/MyAccount/ConnectApps";
import Sidebar from "@/views/MyAccount/SideBar";
import React, { useState } from "react";

interface MainContentProps {
  selectedTab?: string;
}

const MainContent: React.FC<MainContentProps> = ({ selectedTab }) => {
  const [currentTab, setCurrentTab] = useState<string>(
    SIDEBAR_MENU_ITEMS[0].key
  );
  let content;

  const handleTabChange = (key: string) => {
    setCurrentTab(key);
  };

  switch (currentTab) {
    case SIDEBAR_MENU_ITEMS[0].key:
      content = <div>My Account Content</div>;
      break;
    case SIDEBAR_MENU_ITEMS[1].key:
      content = <ConnectAccountsView></ConnectAccountsView>;
      break;
    case SIDEBAR_MENU_ITEMS[2].key:
      content = <div>Log Out Content</div>;
      break;
    default:
      content = <div>Select a menu item</div>;
  }

  return (
    <div className="flex">
      <Sidebar selectedTab={currentTab} onChangeTab={handleTabChange}></Sidebar>
      <div className="flex-1 p-5">{content}</div>;
    </div>
  );
};

export default MainContent;
