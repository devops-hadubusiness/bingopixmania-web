// packages
import { useState } from "react";
import { withMask } from "use-mask-input";
import { Check, Plus, Tag, Hash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { CustomCombobox } from "@/components/combobox/custom-combobox";

// entities
import { CreateContactSchema, createContactSchema, ContactTagProps, ContactVariableProps } from "@/entities/contact/contact";

// store
import { useStore } from "@/store/store";

// types
type CreateContactFormProps = {
  tags: ContactTagProps[];
  variables: ContactVariableProps[];
  createTag: () => void;
  createVariable: () => void;
};

// variables
const loc = "components/forms/create-contact-form";

export function CreateContactForm({ tags, variables, createTag, createVariable }: CreateContactFormProps) {
  const store = useStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedTags, setSelectedTags] = useState<ContactTagProps[]>([]);
  const [selectedVariables, setSelectedVariables] = useState<ContactVariableProps[]>([]);

  const form = useForm<CreateContactSchema>({
    resolver: zodResolver(createContactSchema),
    defaultValues: {
      companyId: store.company?.id,
      userId: store.user?.id,
    },
  });

  async function _createContact() {
    // TODO: criar na API
    // TODO: mandar tudo com .trim(), e remover caracteres especiais e espaços do telefone
    // TODO: chamar cb(createdContact)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(_createContact)} className="flex flex-col gap-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Nome:</FormLabel>
              <FormControl>
                <Input {...field} className="bg-zinc-100/80 dark:bg-zinc-950/80" placeholder="Digite o nome" disabled={isLoading} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Telefone: *</FormLabel>
              <FormControl>
                <Input {...field} ref={withMask("(99) [9]9999 - 9999")} placeholder="Digite o telefone" className="bg-zinc-100/80 dark:bg-zinc-950/80" disabled={isLoading} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Tags:</FormLabel>
              <FormControl>
                <div className="flex items-end justify-between gap-x-2">
                  <CustomCombobox
                    value={selectedTags}
                    items={tags}
                    valueKey="name"
                    titleKey="name"
                    bgKey="color"
                    placeholder="Selecione ou cadastre"
                    icon={Tag}
                    className="max-w-[auto] smAndUp:max-w-[auto] w-full"
                    onChange={(receivedSelectedTags: ContactTagProps[]) => setSelectedTags(receivedSelectedTags)}
                    disabled={isLoading}
                  />

                  <Button variant="default" type="button" className="h-full mb-0.5" disabled={isLoading} onClick={createTag}>
                    <Plus className="size-5" />
                  </Button>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="variables"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Variáveis:</FormLabel>
              <FormControl>
                <div className="flex items-start justify-between gap-x-2">
                  <CustomCombobox
                    value={selectedVariables}
                    items={variables}
                    valueKey="name"
                    titleKey="name"
                    titlePrefix="#"
                    bgValue="#116a55"
                    placeholder="Selecione ou cadastre"
                    icon={Hash}
                    className="max-w-[auto] smAndUp:max-w-[auto] w-full"
                    onChange={(receivedSelectedVariables: ContactVariableProps[]) => setSelectedVariables(receivedSelectedVariables)}
                    disabled={isLoading}
                  />

                  <Button variant="default" type="button" disabled={isLoading} onClick={createVariable}>
                    <Plus className="size-5" />
                  </Button>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full mt-4 pt-4 bg-background border-t flex items-center gap-x-2 justify-end">
          <Button type="submit" className="flex gap-x-2" disabled={isLoading}>
            Cadastrar
            <Check className="size-5" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
