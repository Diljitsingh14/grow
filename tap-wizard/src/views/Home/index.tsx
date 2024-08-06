// views/Home.tsx
import React, { useEffect, useState } from "react";
import checkAuth from "@/utils/common/authTest";
import Header from "@/views/Header";
import { Carousel } from "flowbite-react";
import { IUser } from "@/views/Header";
import Features from "@/views/Features";
import Products from "../Products";
import AuthButton from "@/components/AuthButton";
import Footer from "../Footer";
import Services from "../Services";

const HomeView: React.FC = () => {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const fetchAuthStatus = async () => {
      const data = await checkAuth();
      setIsLogin(data?.is_authenticated || false);
    };

    fetchAuthStatus();
  }, []);

  const user: IUser = {};

  return (
    <>
      <Header isLogin={isLogin} />
      <Features />
      <Products id="products" />
      {/* <AuthButton></AuthButton> */}
      <Services />
      <Footer />
    </>
  );
};

export default HomeView;
