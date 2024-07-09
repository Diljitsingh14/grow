"use client";
import React, { useEffect } from "react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import styles from "./styles.module.css";

import { Card } from "flowbite-react";
import { Button } from "@headlessui/react";

interface IProduct {
  name?: string;
  id: string;
  desc: string;
  price: number;
  image: string;
  label: string;
}

const products: IProduct[] = [
  {
    name: "generic-google-qr-nfc",
    id: "1",
    desc: "The generic Google review card with NFC tag.",
    price: 9,
    image: "/images/products/generic-google-qr-nfc.png",
    label: "Generic Google QR with NFC",
  },
  {
    name: "generic-fb-qr-nfc",
    id: "2",
    desc: "The generic Facebook following card with NFC tag.",
    price: 9,
    image: "/images/products/generic-fb-qr-nfc.png",
    label: "Generic Facebook QR with NFC",
  },
  {
    name: "generic-ig-qr-nfc",
    id: "3",
    desc: "The generic Instagram following card with NFC tag.",
    price: 9,
    image: "/images/products/generic-ig-qr-nfc.png",
    label: "Generic Instagram QR with NFC",
  },
  {
    name: "generic-google-qr",
    id: "4",
    desc: "The generic Google review card QR only.",
    price: 7,
    image: "/images/products/generic-google-qr.png",
    label: "Generic Google QR",
  },
  {
    name: "generic-fb-qr",
    id: "5",
    desc: "The generic Facebook following card.",
    price: 7,
    image: "/images/products/generic-fb-qr.png",
    label: "Generic Facebook following QR card",
  },
  {
    name: "generic-ig-qr",
    id: "6",
    desc: "The generic Instagram Follow with only QR.",
    price: 7,
    image: "/images/products/generic-ig-qr.png",
    label: "Generic Instagram following QR card",
  },
];

const Product: React.FC<IProduct> = (props) => {
  const { label, price, image, desc, id } = props;
  return (
    <Card href="#" className="max-w-sm">
      <div className="container text-center justify-center items-center">
        <h5 className="text-base font-bold tracking-tight text-gray-900 dark:text-white">
          {label}
        </h5>
        <img
          src={image}
          alt={label}
          className={`${styles["product-image"]} mx-auto my-3`}
        />
        <p className="font-normal text-gray-700 dark:text-gray-400 text-sm my-2">
          {desc}
        </p>
        <Button className="inline-flex items-center gap-2 rounded-md bg-blue-500 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
          Buy @ $ {price} <sup>CAD</sup>
        </Button>
      </div>
    </Card>
  );
};

const Products: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h2 className="text-center text-2xl font-bold mb-8">Products</h2>
      <div className="w-full relative">
        <Swiper
          // install Swiper modules
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={50}
          slidesPerView={4}
          navigation
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          onSwiper={(swiper) => console.log(swiper)}
          onSlideChange={() => console.log("slide change")}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <Product {...product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Products;
