"use client"

import { useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

export interface IQuantityButtonProps {
  min?: number;
  max?: number;
  initalValue?: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

const QuantityButton: React.FC<IQuantityButtonProps> = ({ max, min = 0, initalValue = 1, onIncrease, onDecrease }) => {
  const [value, setValue] = useState(initalValue);

  const incrementQuantity = useCallback(() => {
    if (max && value >= max)
      return;

    onIncrease();
    setValue(val => val + 1);
  }, [max, value, onIncrease]);

  const decrementQuantity = useCallback(() => {
    if (min && value <= min)
      return;

    onDecrease();
    setValue(val => val - 1);
  }, [min, value, onDecrease]);

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