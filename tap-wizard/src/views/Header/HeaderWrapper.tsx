"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import checkAuth from "@/utils/common/authTest";
import Header from ".";

const byPassRoutes: string[] = ["/"];

function HeaderWrapper() {
  const [data, setData] = useState({ auth: false });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const pathname = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      const data = await checkAuth();
      setData(data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const isLoggedIn: boolean = !!(data?.auth ?? false);
  const shouldShow: boolean =
    byPassRoutes.includes(pathname as string) || !isLoggedIn;

  return <>{!isLoading && shouldShow && <Header isLogin={isLoggedIn} />}</>;
}

export default HeaderWrapper;
