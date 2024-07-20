import { SIDEBAR_MENU_ITEMS } from "@/constants/myaccounts";
import Link from "next/link";
import React, { useState } from "react";

interface SidebarProps {
  selectedTab: string;
  onChangeTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedTab, onChangeTab }) => {
  return (
    <div className="w-64 h-screen p-5 bg-gray-800 text-white">
      <div className="mb-5 text-lg font-bold">
        <Link href="/">
          <img
            src="/images/logo/brand-light.png"
            alt="turnx "
            className="w-full h-[70px]"
          />
        </Link>
      </div>
      <ul>
        {SIDEBAR_MENU_ITEMS.map((item) => {
          return (
            <li
              key={item.key}
              className={`p-2 cursor-pointer ${
                selectedTab === item.key ? "bg-gray-700" : ""
              }`}
              onClick={() => onChangeTab(item.key)}
            >
              <div className="flex">
                {item.icon} <span className="mx-2"> {item.label} </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
