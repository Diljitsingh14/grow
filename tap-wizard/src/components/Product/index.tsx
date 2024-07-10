import React from "react";
import styles from "./styles.module.css";

import { Card } from "flowbite-react";
import { Button } from "@headlessui/react";

export interface IProduct {
  name?: string;
  id: string;
  desc: string;
  price: number;
  image: string;
  label: string;
}

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

export default Product;
