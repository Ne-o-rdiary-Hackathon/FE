import { BaseIcon } from "./BaseIcon";
import type { IconProps } from "./icon.types";

export const IcClose = (props: IconProps) => (
  <BaseIcon {...props}>
    <path
      d="M6 6l12 12M18 6L6 18"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
    />
  </BaseIcon>
);
