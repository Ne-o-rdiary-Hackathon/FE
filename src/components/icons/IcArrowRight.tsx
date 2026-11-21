import { BaseIcon } from "./BaseIcon";
import type { IconProps } from "./icon.types";

export const IcArrowRight = (props: IconProps) => (
  <BaseIcon {...props}>
    <path
      d="M5 12h14M12 5l7 7-7 7"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </BaseIcon>
);
