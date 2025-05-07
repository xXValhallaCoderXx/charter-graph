import React from "react";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  options: SelectOption[];
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}
const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, className = "", id, onChange, value = "", ...rest }, ref) => {
    return (
      <select
        id={id}
        value={value}
        ref={ref}
        className={`rounded border px-3 py-2 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 focus:border-blue-500 ${className}`}
        onChange={onChange}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }
);


Select.displayName = "Select";

export default Select;
