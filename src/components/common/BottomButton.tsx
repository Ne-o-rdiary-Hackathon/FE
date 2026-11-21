import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type BottomButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const BottomButton = ({
  className,
  type = "button",
  ...props
}: BottomButtonProps) => (
  <button
    type={type}
    className={cn(
      "body3 font-medium bg-primary-normal text-text-white rounded-8 min-h-13 w-full px-4 focus-visible:outline-primary-normal focus-visible:outline-2 focus-visible:outline-offset-2 disabled:bg-gray-1 disabled:text-text-disable",
      className
    )}
    {...props}
  />
);
