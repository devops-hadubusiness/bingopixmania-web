// packages
import { Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { ColorPicker } from "@/components/pickers/color-picker";

// entities
import { ContactTagProps, createContactTagSchema, CreateContactTagSchema } from "@/entities/contact/contact";

// types
type CreateTagFormProps = {
  tags: ContactTagProps[];
  onCancel: () => void;
  onCreated: (createdTag: ContactTagProps) => void;
};

// variables
const loc = "components/forms/create-tag-form";

export function CreateTagForm({ tags, onCancel, onCreated }: CreateTagFormProps) {
  const form = useForm<CreateContactTagSchema>({ resolver: zodResolver(createContactTagSchema) });

  function _handleCreateTag() {
    if (tags.find((t) => t.name === form.getValues("name"))) form.setError("name", { message: "Tag já cadastrada." });
    else onCreated(form.getValues());
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(_handleCreateTag)} className="flex flex-col gap-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormLabel>Nome: *</FormLabel>
              <FormControl>
                <Input {...field} className="bg-zinc-100/80 dark:bg-zinc-950/80" placeholder="Digite o nome" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem className="w-auto mt-14">
              <FormLabel>Cor: *</FormLabel>
              <FormControl>
                <ColorPicker
                  align="start"
                  side="top"
                  onChange={(color: string) => {
                    form.setValue("color", color);
                  }}
                  value={form.getValues("color")}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full mt-4 pt-4 bg-background border-t flex items-center gap-x-2 justify-end">
          <Button variant="ghost" type="button" className="flex gap-x-2" onClick={onCancel}>
            Cancelar
            <X className="size-4" />
          </Button>

          <Button type="submit" className="flex gap-x-2">
            Adicionar
            <Check className="size-5" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
