/* eslint-disable jsx-a11y/alt-text */
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const ImageFallback = (props: any) => {
  const { src, fallback, ...rest } = props;
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    setImageSrc(src);
  }, [src]);

  return (
    <Image
      {...rest}
      src={imageSrc}
      onError={() => {
        setImageSrc(fallback);
      }}
    />
  );
};

export default ImageFallback;
