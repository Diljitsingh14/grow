"use client"

import { useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

export interface IQuantityButtonProps {
  min?: number;
  max?: number;
}

// const PlusIcon = () => (
//   <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
//     <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5" />
//   </svg>
// );

// const MinusIcon = () => (
//   <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
//     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14" />
//   </svg>
// )

const QuantityButton: React.FC<IQuantityButtonProps> = ({ max, min = 1 }) => {
  const [value, setValue] = useState(1);

  const incrementQuantity = useCallback(() => {
    if (max && value >= max)
      return;
    setValue(val => val + 1);
  }, [max, value]);

  const decrementQuantity = useCallback(() => {
    if (min && value <= min)
      return;
    setValue(val => val - 1);
  }, [min, value]);

  return (
    <div className="inline-grid rounded-lg grid-cols-3 gap-2 border">
      <button
        onClick={decrementQuantity}
        className="text-orange-600 border rounded-none rounded-s-lg border-orange-600 focus:ring-1 focus:ring-orange-600 px-2 py-1 focus:outline-none flex items-center justify-center"
      >
        <FontAwesomeIcon icon={faMinus} />
      </button>
      <span className="my-2 mx-5">
        {value}
      </span>
      <button
        className="text-orange-600 border rounded-none rounded-e-lg border-orange-600 focus:ring-1 focus:ring-orange-600 px-2 py-1 focus:outline-none flex items-center justify-center"
        onClick={incrementQuantity}
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  )
}

export default QuantityButton;