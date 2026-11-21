import type { InputHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  trailing?: ReactNode;
  inputClassName?: string;
}

export const Input = ({
  trailing,
  className,
  inputClassName,
  value,
  ...props
}: InputProps) => {
  const hasValue = String(value ?? "").length > 0;

  return (
    <div
      className={cn(
        "rounded-xl bg-bg-normal flex h-12 items-center justify-between gap-3 border px-4",
        hasValue ? "border-primary-normal" : "border-border-1",
        className
      )}
    >
      <input
        type="text"
        value={value}
        className={cn(
          "text-text-title placeholder:text-text-secondary-2 min-w-0 flex-1 bg-transparent outline-none",
          hasValue ? "body3 font-semibold" : "body3",
          inputClassName
        )}
        {...props}
      />
      {trailing}
    </div>
  );
};
