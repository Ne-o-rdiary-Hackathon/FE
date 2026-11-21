import { BaseIcon } from "./BaseIcon";
import type { IconProps } from "./icon.types";

export const IcCheck = (props: IconProps) => (
  <BaseIcon {...props}>
    <path
      d="M5 12.5l4.5 4.5L19 7.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </BaseIcon>
);
