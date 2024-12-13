// packages
import { useEffect, useState } from "react";

// components
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

// types
export type CustomDialogProps = {
  children?: Readonly<React.ReactNode>;
  open: boolean;
  title?: string;
  description?: string;
  className?: string;
  onClose?: () => void;
};

export const CustomDialog = ({ children, ...props }: CustomDialogProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(props.open);

  useEffect(() => {
    setIsOpen(props.open);
  }, [props.open]);

  useEffect(() => {
    if (!isOpen && props.onClose) props.onClose();
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => setIsOpen(open)}>
      <DialogContent className={`bg-background rounded-md border-none focus-visible:outline-none ${props.className || ""} lg:max-w-screen-lg overflow-y-auto max-h-screen`}>
        <DialogHeader className="flex flex-col w-full items-start justify-between gap-y-2">
          <DialogTitle>{props.title}</DialogTitle>
          <DialogDescription>{props.description}</DialogDescription>
        </DialogHeader>

        <Separator className="w-full mb-4" />

        {children}
      </DialogContent>
    </Dialog>
  );
};
