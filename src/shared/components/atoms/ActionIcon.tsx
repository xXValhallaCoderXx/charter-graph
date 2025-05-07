import { FC, ReactNode, ButtonHTMLAttributes } from "react";
import { cx } from "@/shared/lib/class-joiner";

export interface ActionIconProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode; // Should be a Tabler icon component
  size?: "xs" | "sm" | "md" | "lg";
  color?: "default" | "primary" | "danger";
  rounded?: boolean;
  tooltip?: string;
  variant?: "filled" | "outline";
}

const sizeMap = {
  xs: "w-4 h-4 p-1",
  sm: "w-6 h-6 p-1.5",
  md: "w-8 h-8 p-2",
  lg: "w-9.5 h-9.5 p-2.5",
};

const colorMap = {
  default: {
    filled: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
  },
  primary: {
    filled: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
  },
  danger: {
    filled: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-red-600 text-red-600 hover:bg-red-50",
  },
};

const disabledClass = "opacity-50 cursor-not-allowed pointer-events-none";

export const ActionIcon: FC<ActionIconProps> = ({
  children,
  size = "md",
  color = "default",
  rounded = true,
  tooltip,
  variant = "filled",
  className,
  disabled,
  ...props
}) => (
  <button
    type="button"
    className={cx(
      "inline-flex items-center justify-center cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400",
      sizeMap[size],
      colorMap[color][variant],
      rounded ? "rounded-full" : "rounded",
      disabled && disabledClass,
      className
    )}
    title={tooltip}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);

export default ActionIcon;
