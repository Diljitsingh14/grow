import React from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import { Button } from "@headlessui/react";

const Services = () => {
  return (
    <section className="space-y-8">
      <h1 className="justify-center text-center text-2xl font-bold">
        Services
      </h1>
      <div className="flex flex-col md:flex-row">
        <div className={styles.img_cont}>
          <Image
            width={2048}
            height={1540}
            src="/images/services/1.png"
            alt="Service 1"
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className={`${styles.info_1} bg-black text-white w-full md:w-1/2 p-8 flex items-center justify-center`}
        >
          <div>
            <h2 className="text-2xl font-bold mb-4">TurnX</h2>
            <p className="text-lg mb-4">
              TurnX is a comprehensive solution for your business needs.
            </p>
            <ul className="list-disc list-inside mb-4">
              <li>24/7 Customer Support</li>
              <li>Appointment Scheduling</li>
              <li>Product Recommendations</li>
              <li>Order Tracking</li>
            </ul>
            <Button className="bg-blue-500 text-black px-4 py-2 rounded-md">
              Try now
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className={styles.img_cont}>
          <Image
            width={2048}
            height={1540}
            src="/images/services/2.png"
            alt="Service 2"
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className={`${styles.info_2} bg-white text-black w-full md:w-1/2 p-8 flex items-center justify-center`}
        >
          <div>
            <h2 className="text-2xl font-bold mb-4">LLaboto</h2>
            <p className="text-lg mb-4">
              LLaboto offers advanced features to streamline your operations.
            </p>
            <ul className="list-disc list-inside mb-4">
              <li>Feedback Collection</li>
              <li>Special Offers and Promotions</li>
              <li>Integration with Social Media</li>
              <li>Analytics and Insights</li>
            </ul>
            <Button className="bg-blue-400 text-white px-4 py-2 rounded-md">
              Explore
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
