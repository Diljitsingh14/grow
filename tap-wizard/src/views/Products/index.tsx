"use client";
import React, { useEffect, useState } from "react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import Product from "@/components/Product";
import { getProducts } from "@/utils/services/product";
import { IProduct } from "@/types/product";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const Products = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const productContentLoader = (num: number) =>
    [...Array(num)].map((_, index) => (
      <SwiperSlide key={index}>
        <div className="bg-white p-4 rounded-lg shadow-md animate-pulse">
          <div className="h-40 bg-gray-300 rounded-md mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-6 bg-gray-300 rounded w-1/4"></div>
        </div>
      </SwiperSlide>
    ));
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const { data } = await getProducts();
        setProducts(data?.results || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div
      id="product-from-home"
      className="container mx-auto mb-2 py-4 bg-gray-100"
    >
      <h2 className="text-center text-2xl font-bold mb-8">Products</h2>
      <div className="w-full relative">
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={40}
          navigation
          pagination={{ clickable: true }}
          scrollbar={{ draggable: false, hide: true }}
          className="px-6"
          style={{ paddingLeft: "5rem", paddingRight: "5rem" }}
          breakpoints={{
            480: { slidesPerView: 1, spaceBetween: 10 },
            640: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 30 },
            1024: { slidesPerView: 4, spaceBetween: 40 },
          }}
        >
          {isLoading
            ? // Show loading skeleton when fetching products
              productContentLoader(4)
            : // Show products once loaded
              products.map((product) => (
                <SwiperSlide key={product.id}>
                  <Product
                    id={`${product.id}`}
                    name={product.name}
                    label={product.name}
                    image={product.images?.[0]?.image || "/placeholder.png"}
                    desc={product.description}
                    price={parseFloat(product.price)}
                  />
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Products;
