// packages
import { Dispatch, SetStateAction } from "react";

// components
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// types
type ConfirmationAlertProps = {
  isOpenConfirmation: boolean;
  setIsOpenConfirmation: Dispatch<SetStateAction<boolean>>;
  title: string;
  description: string;
  className?: string;
  confirm: string;
  cancel: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

export function ConfirmationAlert(props: ConfirmationAlertProps) {
  return (
    <AlertDialog open={props.isOpenConfirmation} onOpenChange={props.setIsOpenConfirmation}>
      <AlertDialogContent className={`bg-background rounded-md border-none ${props.className || ""} lg:max-w-screen-lg overflow-y-auto max-h-screen`}>
        <AlertDialogHeader>
          <AlertDialogTitle>{props.title}</AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-800 dark:text-zinc-200">{props.description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex flex-row smAndDown:flex-wrap mdAndUp:justify-end gap-2 w-auto">
          <AlertDialogAction className="bg-primary hover:bg-primary hover:brightness-125 text-white smAndDown:w-1/2 mdAndUp:w-auto px-10" onClick={props.onConfirm}>
            {props.confirm}
          </AlertDialogAction>

          <AlertDialogAction className="bg-background hover:bg-accent text-foreground smAndDown:w-1/2 mdAndUp:w-auto px-10" onClick={props.onCancel}>
            {props.cancel}
          </AlertDialogAction>
          {/* <AlertDialogCancel onClick={props.onCancel} className="bg-zinc-300/40 dark:bg-zinc-900/70">
            {props.cancel}
          </AlertDialogCancel> */}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
