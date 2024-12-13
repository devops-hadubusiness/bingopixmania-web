import { ComponentType } from "react";
import { IconType } from "react-icons";

export type RouteProps = {
  name: string;
  path?: string;
  icon?: IconType;
  description?: string;
  children?: Array<RouteProps>;
  category?: "page" | "tool" | "service";
  tooltip?: {
    text: string;
    className?: string;
  };
  component?: ComponentType;
  disabled?: () => boolean;
  allowed?: () => boolean;
  showOnHome?: () => boolean;
  showOnTopbar?: () => boolean;
  showOnSideDrawer?: () => boolean;
};
