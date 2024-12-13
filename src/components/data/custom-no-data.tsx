// packages
import { IconType } from "react-icons";
import { ClassNameValue } from "tailwind-merge";
import clsx from "clsx";

// components
import { Button } from "@/components/ui/button";

// types
type CustomNoDataProps = {
  title?: string;
  icon?: IconType;
  iconClass?: ClassNameValue;
  description?: string;
  iconButton?: IconType;
  iconButtonClass?: ClassNameValue;
  textButton?: string;
  action?: boolean;
  actionButton?: () => void;
  isLoading?: boolean;
};

export function CustomNoData(props: CustomNoDataProps) {
  return (
    <div className={clsx("w-full flex justify-center items-center flex-col gap-2 rounded-xl p-8 border border-dashed border-primary dark:border-gray-500 bg-background dark:bg-accent")}>
      {props.icon && <props.icon className={clsx(props.iconClass, 'text-primary brightness-150 dark:text-foreground')} />}
      {props.title && <h2 className={clsx("font-semibold text-2xl", "dark:text-foreground brightness-150 text-primary text-center")}>{props.title}</h2>}
      {props.description && <p className={clsx("text-sm", "dark:text-foreground/50 text-zinc-700/50 text-center")}>{props.description}</p>}
      {props.action && props.actionButton && props.textButton && (
        <Button disabled={props.isLoading} className="gap-2" onClick={props.actionButton}>
          {props.iconButton && <Button className={clsx(props.iconButtonClass)} />}
          {props.textButton}
        </Button>
      )}
    </div>
  );
}
