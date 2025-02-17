"use client";
import React, { useEffect, useState } from "react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

import Product, { IProduct } from "@/components/Product";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { getProducts } from "@/utils/services/product";

const PRODUCTS: IProduct[] = [
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

interface IProducts {
  id: string;
}

const Products: React.FC<IProducts> = ({ id }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fetchProducts = async () => {
    setIsLoading(true);
    const { data } = await getProducts();
    setProducts(data?.results);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div id={id} className="container mx-auto mb-2 py-4 bg-gray-100">
      <h2 className="text-center text-2xl font-bold mb-8">Products</h2>
      <div className="w-full relative">
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={40}
          navigation
          pagination={{ clickable: true }}
          scrollbar={{ draggable: false, hide: true }}
          onSwiper={(swiper) => {}}
          onSlideChange={() => {}}
          className="px-6"
          style={{ paddingLeft: "5rem", paddingRight: "5rem" }}
          breakpoints={{
            480: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
          }}
        >
          {PRODUCTS.map((product) => (
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
