"use client";
import {
  Button,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  faUser,
  faUserGear,
  faArrowRightToBracket,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import classNames from "classnames";

import styles from "./styles.module.css";
import Link from "next/link";
import { LOGIN_ROUTE } from "@/constants/routes";
import Image from "next/image";
import { getCartItems, ICartItem } from "@/utils/common/cart";

interface NavigationItem {
  name: string;
  href: string;
  current: boolean;
}
export interface IUser {
  session?: string;
  name?: string;
  email?: string;
}

interface IHeader {
  user?: IUser;
  isLogin: boolean;
}

const navigation: NavigationItem[] = [
  { name: "Home", href: "#", current: true },
  { name: "Products", href: "#products", current: false },
  { name: "Services", href: "#", current: false },
  //   { name: "Contact us", href: "#", current: false },
  { name: "Contact us", href: "#", current: false },
];

const userMenuItems = [
  {
    name: "My Account",
    key: "my-acc",
    link: "/my_account",
    icon: <FontAwesomeIcon icon={faUser} />,
  },
  {
    name: "Settings",
    key: "my-acc-settings",
    link: "/my_account?tab=settings",
    icon: <FontAwesomeIcon icon={faUserGear} />,
  },
  {
    name: "Sign out",
    key: "sign-out",
    link: "/my_account?tab=logout",
    icon: <FontAwesomeIcon icon={faArrowRightToBracket} />,
  },
];

const Header: React.FC<IHeader> = ({ user, isLogin }) => {
  const cartItems = getCartItems();
  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <DisclosureButton
                  className={`"relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white hidden ${styles.sm_v}`}
                >
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>
              <div
                className={classNames(
                  styles.logo,
                  "flex flex-shrink-0 items-center"
                )}
              >
                <img
                  className="h-8 w-auto"
                  src="/images/logo/brand-light.png"
                  alt="Tap-wizard"
                />
              </div>
              {/* main items */}
              <div
                className={`flex ${styles.sm_h} flex-1 items-center justify-center sm:items-stretch sm:justify-start`}
              >
                <div className="">
                  <div className=" space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              {/* User section  */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Cart  */}

                <Menu as="div" className="relative mx-auto flex">
                  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <div className="cart cursor-pointer">
                      <FontAwesomeIcon
                        icon={faCartShopping}
                        className="text-white mx-3"
                      />
                    </div>
                  </MenuButton>
                  <MenuItems
                    transition
                    style={{
                      mixBlendMode: "luminosity",
                      background: "rgba(255,255,255,0.5)",
                    }}
                    className="absolute right-0 z-10 mt-5 top-0 w-48 origin-center rounded-sm bg-black py-1 shadow-lg ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    {cartItems ? (
                      Object.values(cartItems).map((item: ICartItem) => (
                        <MenuItem key={item.id}>
                          <div className="block px-4 py-2 text-sm text-white">
                            <span>{item.name}</span> -{" "}
                            <span>{item.quantity}</span> x{" "}
                            <span>${item.price}</span>
                          </div>
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem>
                        <div className="block px-4 py-2 text-sm text-white">
                          Cart is empty
                        </div>
                      </MenuItem>
                    )}
                  </MenuItems>
                </Menu>
                {/* login & anonymous user  */}
                {isLogin ? (
                  <Menu as="div" className="relative mx-auto flex">
                    <button
                      type="button"
                      className="relative rounded-full mx-4 bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                    {/* Profile dropdown */}

                    <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <Image
                        height={8}
                        width={8}
                        className="h-8 w-8 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                    </MenuButton>
                    <MenuItems
                      transition
                      style={{
                        mixBlendMode: "luminosity",
                        background: "rgba(0,0,0,0.5)",
                      }}
                      className="absolute right-0 z-10 mt-5 top-5 w-48 origin-top-right rounded-sm bg-black py-1 shadow-lg ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                    >
                      {userMenuItems.map((item) => (
                        <MenuItem key={item.key}>
                          {({ focus }) => (
                            <Link
                              href={item.link}
                              className={classNames(
                                focus ? "bg-gray-100 text-black" : "text-white",
                                "block px-4 py-2 text-sm "
                              )}
                            >
                              <span className="mx-2">{item.icon}</span>{" "}
                              {item.name}
                            </Link>
                          )}
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Menu>
                ) : (
                  <div className="flex justify-content-center">
                    <Link
                      href={LOGIN_ROUTE}
                      className="rounded bg-sky-600 py-2 px-4 text-sm text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700"
                    >
                      Login
                    </Link>
                    <Button className="rounded bg-sky-600 py-2 px-4 text-sm text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700">
                      Sign up
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DisclosurePanel className="">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
};

export default Header;
