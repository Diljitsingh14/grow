import React from "react";
import Carousel from "./carousel";

const ProductList = [
  {
    google_review_nfc_qr: {
      name: "Google Review NFC + QR",
      key: "grNQ",
      label: "Google Review NFC with QR",
      imgUri: "",
      desc: "",
    },
    google_revie_qr: {
      name: "Google Review NFC + QR",
      key: "grQ",
      label: "Google Review NFC with QR",
      imgUri: "",
      desc: "",
    },
  },
];

const Product = () => {
  return <div className="product"></div>;
};

const Products = () => {
  return (
    <>
      <Carousel></Carousel>
    </>
  );
};

export default Products;
