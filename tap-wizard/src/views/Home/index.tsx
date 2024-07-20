import React from "react";
import Header from "@/views/Header";
import { Carousel } from "flowbite-react";
import { IUser } from "@/views/Header";
import Features from "@/views/Features";
import Products from "../Products";
import AuthButton from "@/components/AuthButton";

const HomeView: React.FC = () => {
  const user: IUser = {};
  const isLogin = false;
  return (
    <>
      <Header isLogin={isLogin} />
      <Features />
      <Products id="products" />
      <AuthButton></AuthButton>
    </>
  );
};

export default HomeView;
