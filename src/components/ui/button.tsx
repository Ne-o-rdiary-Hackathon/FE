import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button body4 inline-flex shrink-0 items-center justify-center rounded-8 border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-primary-normal focus-visible:ring-3 focus-visible:ring-primary-normal/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-red-normal aria-invalid:ring-3 aria-invalid:ring-red-normal/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary-normal text-text-white hover:bg-primary-normal-hover",
        outline:
          "border-border-1 bg-bg-normal hover:bg-bg-gray hover:text-text-primary aria-expanded:bg-bg-gray aria-expanded:text-text-primary",
        secondary:
          "bg-primary-light text-text-primary hover:bg-primary-light-hover aria-expanded:bg-primary-light aria-expanded:text-text-primary",
        ghost:
          "hover:bg-bg-gray hover:text-text-primary aria-expanded:bg-bg-gray aria-expanded:text-text-primary",
        destructive:
          "bg-red-normal/10 text-red-normal hover:bg-red-normal/20 focus-visible:border-red-normal/40 focus-visible:ring-red-normal/20",
        link: "text-primary-normal underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "body5 h-6 gap-1 rounded-4 px-2 in-data-[slot=button-group]:rounded-8 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "body5 h-7 gap-1 rounded-4 px-2.5 in-data-[slot=button-group]:rounded-8 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-4 in-data-[slot=button-group]:rounded-8 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-4 in-data-[slot=button-group]:rounded-8",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonProps = ButtonPrimitive.Props & VariantProps<typeof buttonVariants>;

const Button = ({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) => (
  <ButtonPrimitive
    data-slot="button"
    className={cn(buttonVariants({ variant, size, className }))}
    {...props}
  />
);

export { Button, buttonVariants };
