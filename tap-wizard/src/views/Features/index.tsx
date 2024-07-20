"use client";
import React from "react";
import { Carousel } from "flowbite-react";
import type { CustomFlowbiteTheme } from "flowbite-react";
import { Flowbite } from "flowbite-react";
import classNames from "classnames";

import styles from "./styles.module.css";

const customTheme: CustomFlowbiteTheme = {
  carousel: {
    scrollContainer: {
      base: "flex h-full snap-mandatory overflow-y-hidden overflow-x-scroll scroll-smooth",
      snap: "snap-x",
    },
    item: {
      base: `absolute left-1/2 top-1/2 block w-full -translate-x-1/2 -translate-y-1/2 `,
    },
  },
};

const Features: React.FC = () => {
  return (
    <Flowbite theme={{ theme: customTheme }}>
      <div className={classNames(styles.h90vh)}>
        <Carousel className="rounded-none" slide={true}>
          {/* <div
            style={{
              background: 'url("/images/slides/1.png")',
              backgroundSize: "contain",
              height: "100vh",
              width: "100%",
            }}
          ></div>
          <div
            style={{
              background: 'url("/images/slides/2.png")',
              backgroundSize: "contain",
              height: "100vh",
              width: "100%",
            }}
          ></div>
          <div
            style={{
              background: 'url("/images/slides/3.png")',
              backgroundSize: "contain",
              height: "100vh",
              width: "100%",
            }}
          ></div> */}
          <img src="/images/slides/1.png" alt="..." />
          <img src="/images/slides/2.png" alt="..." />
          <img src="/images/slides/3.png" alt="..." />
        </Carousel>
      </div>
    </Flowbite>
  );
};

export default Features;
