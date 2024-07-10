import React from "react";
import Header from "@/views/Header";
import { Carousel } from "flowbite-react";
import { IUser } from "@/views/Header";
import Features from "@/views/Features";
import Products from "../Products";

const HomeView: React.FC = () => {
  const user: IUser = {};
  const isLogin = false;
  return (
    <>
      <Header user={user} isLogin={isLogin} />
      <Features />
      <Products id="products" />
    </>
  );
};

export default HomeView;
