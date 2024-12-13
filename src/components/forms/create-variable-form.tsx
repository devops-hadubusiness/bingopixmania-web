// packages
import { Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// entities
import { ContactVariableProps, createContactVariableSchema, CreateContactVariableSchema } from "@/entities/contact/contact";

// types
type CreateVariableFormProps = {
  variables: ContactVariableProps[];
  columns?: string[];
  onCancel: () => void;
  onCreated: (createdVariable: ContactVariableProps) => void;
};

// variables
const loc = "components/forms/create-variable-form";

export function CreateVariableForm({ variables, columns, onCancel, onCreated }: CreateVariableFormProps) {
  const form = useForm<CreateContactVariableSchema>({ resolver: zodResolver(createContactVariableSchema) });

  function _handleCreateVariable() {
    if (variables.find((t) => t.name === form.getValues("name"))) form.setError("name", { message: "Variável já cadastrada.", type: "custom" });
    else onCreated(form.getValues());
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(_handleCreateVariable)} className="flex flex-col gap-2">
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
          name="value"
          render={({ field }) => (
            <FormItem className="w-auto">
              <FormLabel>Valor: *</FormLabel>
              <FormControl>
                <Textarea {...field} className="resize-none min-h-40" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {columns?.length && (
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem className="w-auto">
                <FormLabel>Coluna:</FormLabel>
                <Select disabled onValueChange={(value) => field.onChange(value)} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {columns.map((column, index) => (
                      <SelectItem key={index} value={column}>
                        {column}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {Object.values(form.formState.errors || {}).filter((e) => e.type === "custom") && (
          <FormMessage>
            {Object.values(form.formState.errors)
              .filter((e) => e.type === "custom")
              .reduce((total, current) => (total += `${current?.message?.split(".").join("")}, `), "")
              .slice(0, -2)}
          </FormMessage>
        )}

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
