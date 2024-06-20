import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

interface AlertProps {
  type: "info" | "danger" | "success" | "warning" | "dark";
  className?: string;
  children: React.ReactNode;
}

const Alert: React.FC<AlertProps> = ({ type, className, children }) => {
  const alertClasses = classNames(
    "p-4 mb-4 text-sm rounded-lg",
    {
      "text-blue-800 bg-blue-50 dark:bg-gray-800 dark:text-blue-400":
        type === "info",
      "text-red-800 bg-red-50 dark:bg-gray-800 dark:text-red-400":
        type === "danger",
      "text-green-800 bg-green-50 dark:bg-gray-800 dark:text-green-400":
        type === "success",
      "text-yellow-800 bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300":
        type === "warning",
      "text-gray-800 bg-gray-50 dark:bg-gray-800 dark:text-gray-300":
        type === "dark",
    },
    className
  );
  return (
    <div className={alertClasses} role="alert">
      {children}
    </div>
  );
};

export default Alert;
