// packages
import { useState } from "react";
import { Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { CustomDialog } from "@/components/dialogs/custom-dialog";

// types
type CreateCampaignDialogSchema = z.infer<typeof createCampaignDialogSchema>;
type CreateCampaignDialogProps = {
  open: boolean;
  cb: (data: CreateCampaignDialogSchema) => any;
};

// schemas
const createCampaignDialogSchema = z.object({
  name: z.string({ message: "Informe o nome." }).min(1, "Nome inválido.").max(255, "Limite de caracteres: 255"),
});

// variables
const loc = "components/dialogs/create-campaign-dialog";

export function CreateCampaignDialog({ open, cb }: CreateCampaignDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(open);

  const form = useForm<CreateCampaignDialogSchema>({
    resolver: zodResolver(createCampaignDialogSchema),
    defaultValues: {
      name: "",
    },
  });

  const _submitForm = () => {
    form.handleSubmit(cb(form.getValues()));
  };

  return (
    <CustomDialog
      open={isOpen}
      title="Nova Campanha"
      onClose={() => {
        setIsOpen(false);
        cb({ name: "" });
      }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(_submitForm)} className="flex items-end gap-x-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nome da Campanha: *</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-zinc-100/80 dark:bg-zinc-950/80" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="flex gap-x-2">
            Criar
            <Check className="size-5" />
          </Button>
        </form>
      </Form>
    </CustomDialog>
  );
}
