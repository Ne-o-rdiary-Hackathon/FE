import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ChipVariant = "outline" | "filled";

interface ChipVariantClassNames {
  selected: string;
  unselected: string;
}

const CHIP_VARIANT_CLASS_NAMES: Record<ChipVariant, ChipVariantClassNames> = {
  outline: {
    selected:
      "border-primary-normal bg-primary-light text-primary-normal font-semibold",
    unselected: "border-border-1 text-text-secondary-1 bg-bg-normal",
  },
  filled: {
    selected: "border-transparent bg-primary-normal text-text-white",
    unselected: "border-transparent bg-bg-gray text-text-secondary-1",
  },
};

interface ChipProps {
  isSelected: boolean;
  onClick: () => void;
  children: ReactNode;
  variant?: ChipVariant;
  className?: string;
}

export const Chip = ({
  isSelected,
  onClick,
  children,
  variant = "outline",
  className,
}: ChipProps) => {
  const variantClassNames = CHIP_VARIANT_CLASS_NAMES[variant];

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onClick}
      className={cn(
        "border transition-colors",
        isSelected ? variantClassNames.selected : variantClassNames.unselected,
        className
      )}
    >
      {children}
    </button>
  );
};
