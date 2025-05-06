/* eslint-disable react/display-name */
/* eslint-disable react/display-name */
import React, { ElementType, forwardRef } from "react";
import { cx } from "@/shared/lib/class-joiner";

const SIZE_MAP = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
} as const;

const WEIGHT_MAP = {
  thin: "font-thin",
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
  black: "font-black",
} as const;

const VARIANT_MAP = {
  h1: { as: "h1", size: "4xl", fw: "bold" },
  h2: { as: "h2", size: "3xl", fw: "bold" },
  h3: { as: "h3", size: "2xl", fw: "semibold" },
  h4: { as: "h4", size: "xl", fw: "semibold" },
  h5: { as: "h5", size: "lg", fw: "semibold" },
  body: { as: "p", size: "md", fw: "normal" },
  caption: { as: "span", size: "xs", fw: "normal" },
} as const;

type SizeKey = keyof typeof SIZE_MAP;
type WeightKey = keyof typeof WEIGHT_MAP;
type VariantKey = keyof typeof VARIANT_MAP;

type OwnProps<E extends ElementType> = {
  variant?: VariantKey;
  size?: SizeKey;
  fw?: WeightKey;
  as?: E;
};

export type TypographyProps<E extends ElementType = "span"> = OwnProps<E> &
  Omit<React.ComponentPropsWithoutRef<E>, keyof OwnProps<E>>;

function TypographyInner<E extends ElementType = "span">(
  { as, variant, size, fw, className, children, ...rest }: TypographyProps<E>,
  ref: React.Ref<Element>
) {
  const preset = variant ? VARIANT_MAP[variant] : undefined;
  const Tag = (as || preset?.as || "span") as ElementType;

  const classes = cx(
    SIZE_MAP[size ?? preset?.size ?? "md"],
    WEIGHT_MAP[fw ?? preset?.fw ?? "normal"],
    className
  );

  return (
    <Tag ref={ref} className={classes} {...rest}>
      {children}
    </Tag>
  );
}

const Typography = forwardRef(TypographyInner) as <
  E extends ElementType = "span"
>(
  props: TypographyProps<E> & { ref?: React.Ref<Element> }
) => React.ReactElement | null;

export default Typography;
