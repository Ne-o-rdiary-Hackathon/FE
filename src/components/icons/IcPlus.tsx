import { BaseIcon } from "./BaseIcon";
import type { IconProps } from "./icon.types";

export const IcPlus = (props: IconProps) => (
  <BaseIcon {...props}>
    <path
      d="M12 5v14M5 12h14"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
    />
  </BaseIcon>
);
