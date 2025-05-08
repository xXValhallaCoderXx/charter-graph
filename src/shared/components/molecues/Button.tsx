"use client";
import { FC } from "react";

interface IButtonProps {
  onClick?: () => void;
  label: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: "filled" | "outline";
  size?: "xs" | "small" | "medium" | "large";
  color?: "primary" | "secondary" | "success" | "danger" | "warning" | "info";
}

const colorMap = {
  primary: {
    filled: "bg-blue-500 text-white hover:bg-blue-600",
    outline: "border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white",
    disabledFilled: "bg-gray-400 text-white hover:bg-gray-400",
    disabledOutline: "border-gray-400 text-gray-400 hover:bg-transparent",
  },
  secondary: {
    filled: "bg-gray-500 text-white hover:bg-gray-600",
    outline: "border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white",
    disabledFilled: "bg-gray-400 text-white hover:bg-gray-400",
    disabledOutline: "border-gray-400 text-gray-400 hover:bg-transparent",
  },
  success: {
    filled: "bg-green-500 text-white hover:bg-green-600",
    outline:
      "border-green-500 text-green-500 hover:bg-green-500 hover:text-white",
    disabledFilled: "bg-gray-400 text-white hover:bg-gray-400",
    disabledOutline: "border-gray-400 text-gray-400 hover:bg-transparent",
  },
  danger: {
    filled: "bg-red-500 text-white hover:bg-red-600",
    outline: "border-red-500 text-red-500 hover:bg-red-500 hover:text-white",
    disabledFilled: "bg-gray-400 text-white hover:bg-gray-400",
    disabledOutline: "border-gray-400 text-gray-400 hover:bg-transparent",
  },
  warning: {
    filled: "bg-yellow-500 text-white hover:bg-yellow-600",
    outline:
      "border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white",
    disabledFilled: "bg-gray-400 text-white hover:bg-gray-400",
    disabledOutline: "border-gray-400 text-gray-400 hover:bg-transparent",
  },
  info: {
    filled: "bg-cyan-500 text-white hover:bg-cyan-600",
    outline: "border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white",
    disabledFilled: "bg-gray-400 text-white hover:bg-gray-400",
    disabledOutline: "border-gray-400 text-gray-400 hover:bg-transparent",
  },
};

const Button: FC<IButtonProps> = ({
  onClick,
  label,
  type = "button",
  disabled = false,
  variant = "filled",
  size = "medium",
  color = "primary",
}) => {
  const sizeClasses = {
    xs: "py-1 px-2 text-xs h-6",
    small: "py-1 px-2 text-sm h-8",
    medium: "py-2 px-4 text-base h-10",
    large: "py-3 px-6 text-lg h-12",
  };

  const colorClasses =
    colorMap[color][
      disabled
        ? variant === "filled"
          ? "disabledFilled"
          : "disabledOutline"
        : variant
    ];

  return (
    <button
      type={type}
      className={`font-bold rounded cursor-pointer transition duration-200 ease-in-out ${
        disabled ? "cursor-not-allowed" : ""
      } ${sizeClasses[size]} ${colorClasses} ${
        variant === "outline" ? "bg-transparent border-2" : ""
      }`}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
