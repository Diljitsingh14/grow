import { SIDEBAR_MENU_ITEMS } from "@/constants/myaccounts";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import React, { useState } from "react";

interface SidebarProps {
  selectedTab: string;
  onChangeTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedTab, onChangeTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`fixed h-screen bg-gray-800 text-white transition-width duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex justify-between items-center p-5">
        {!isCollapsed && (
          <Link href="/">
            <img
              src="/images/logo/brand-light.png"
              alt="turnx "
              className="w-full h-[70px]"
            />
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white focus:outline-none mx-2"
        >
          {isCollapsed ? <Bars3Icon width={25} /> : <XMarkIcon width={25} />}
        </button>
      </div>
      <ul className="mt-5">
        {SIDEBAR_MENU_ITEMS.map((item) => (
          <li
            key={item.key}
            className={`p-2 cursor-pointer ${
              selectedTab === item.key ? "bg-gray-700" : ""
            }`}
            onClick={() => onChangeTab(item.key)}
          >
            <div
              className={`flex items-center ${
                isCollapsed ? "justify-center" : ""
              }`}
            >
              {item.icon}
              {!isCollapsed && <span className="ml-2">{item.label}</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
