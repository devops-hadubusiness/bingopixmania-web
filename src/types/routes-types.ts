// packages
import { ComponentType, ForwardRefExoticComponent, RefAttributes } from "react";
import { IconType } from "react-icons";
import { LucideProps } from "lucide-react";

export type RouteProps = {
  name: string;
  path?: string;
  group?: string;
  icon?: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>> | IconType;
  description?: string;
  children?: Array<RouteProps>;
  category?: "page" | "tool" | "service";
  tooltip?: {
    text: string;
    className?: string;
  };
  component?: ComponentType;
  highlight?: boolean
  button?: boolean
  disabled?: () => boolean;
  allowed?: () => boolean;
  showOnHome?: () => boolean;
  showOnTopbar?: () => boolean;
  showOnSideDrawer?: () => boolean;
};
