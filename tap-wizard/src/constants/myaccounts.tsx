import {
  ArrowLeftEndOnRectangleIcon,
  Cog6ToothIcon,
  LinkIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { ReactNode } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
import {
  faCalendarDays,
  faNetworkWired,
} from "@fortawesome/free-solid-svg-icons";

export const SIDEBAR_MENU_ITEMS = [
  {
    label: "Settings",
    key: "sb-m0",
    icon: <Cog6ToothIcon width={25} />,
  },
  {
    label: "Connected Apps",
    key: "sb-m1",
    icon: <LinkIcon width={25} />,
  },
  {
    label: "Calendar",
    key: "sb-m2",
    icon: <CalendarIcon width={25} />,
  },
  {
    label: "Logout",
    key: "sb-m3",
    icon: <ArrowLeftEndOnRectangleIcon width={25} />,
  },
];

export interface IConnectApps {
  label: string;
  key: string;
  theme: {
    background: string;
    textColor: string;
  };
  icon: ReactNode;
  isMultiAccount: boolean;
  connectedAccounts: any[];
}

export const CONNECT_APPS_TYPES = {
  facebook: {
    label: "Facebook",
    key: "fb",
    theme: {
      background: "cornflowerblue",
      textColor: "white",
    },
    icon: <FontAwesomeIcon icon={faFacebook} />,
    connectedAccounts: [],
    isMultiAccount: true,
    buttonLabel: <></>,
  },
  google: {
    label: "Google",
    key: "google",
    theme: {
      background: "crimson",
      textColor: "white",
    },
    icon: <FontAwesomeIcon icon={faGoogle} />,
    connectedAccounts: [],
    isMultiAccount: true,
  },
  more: {
    label: "Connect More Accounts",
    key: "connect more",
    theme: {
      background: "darkseagreen",
      textColor: "white",
    },
    icon: <FontAwesomeIcon icon={faNetworkWired} />,
    isMultiAccount: false,
    connectedAccounts: [],
  },
};
