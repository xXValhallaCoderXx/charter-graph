"use client";

import { FC } from "react";

interface IButtonProps {
  onClick?: () => void;
  label: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: "filled" | "outline";
  size?: "xs" | "small" | "medium" | "large";
}

const Button: FC<IButtonProps> = ({
  onClick,
  label,
  type = "button",
  disabled = false,
  variant = "filled",
  size = "medium",
}) => {
  const sizeClasses = {
    xs: "py-1 px-2 text-xs h-6",
    small: "py-1 px-2 text-sm h-8",
    medium: "py-2 px-4 text-base h-10",
    large: "py-3 px-6 text-lg h-12",
  };

  const variantClasses = {
    filled: `bg-blue-500 text-white hover:bg-blue-600 ${
      disabled ? "bg-gray-400 hover:bg-gray-400" : ""
    }`,
    outline: `bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white ${
      disabled ? "border-gray-400 text-gray-400 hover:bg-transparent" : ""
    }`,
  };

  return (
    <button
      type={type}
      className={`font-bold rounded cursor-pointer transition duration-200 ease-in-out ${
        disabled ? "cursor-not-allowed" : ""
      } ${sizeClasses[size]} ${variantClasses[variant]}`}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
