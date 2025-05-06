import React, { InputHTMLAttributes, forwardRef } from "react";
import { cx } from "@/shared/lib/class-joiner";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, disabled, error, ...props }, ref) => (
        <input
            ref={ref}
            className={cx(
                "block w-full rounded border px-3 py-2 text-sm transition focus:outline-none",
                disabled
                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    : "bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
                error && "border-red-500 focus:border-red-500 focus:ring-red-500",
                className
            )}
            disabled={disabled}
            aria-invalid={error}
            {...props}
        />
    )
);

Input.displayName = "Input";

export default Input;