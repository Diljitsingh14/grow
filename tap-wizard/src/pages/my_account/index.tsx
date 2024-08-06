import MyCalendar from "@/components/Calendar";
import { SIDEBAR_MENU_ITEMS } from "@/constants/myaccounts";
import { logout } from "@/utils/common/logout";
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
