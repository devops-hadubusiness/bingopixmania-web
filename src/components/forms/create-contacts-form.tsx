// packages
import { useState } from "react";
import Papa from "papaparse";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// components
import { FileInput } from "@/components/upload/file-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";

// entities
import {
  ContactProps,
  CreateContactSchema,
  createContactSchema,
} from "@/entities/contact/contact";

// store
import { useStore } from "@/store/store";
import { Card, CardContent } from "../ui/card";
import { CustomDataTable } from "../table/custom-data-table";
import { ColumnDef } from "@tanstack/react-table";

// variables
const loc = "components/steppers/contacts-stepper";

// types
type CreateContactsFormProps = {
  onUploaded(contacts: ContactProps[]): void;
};

export function CreateContactsForm({ onUploaded }: CreateContactsFormProps) {
  const store = useStore();
  const [tableDta, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contactsCounts, setContactCounts] = useState({
    total: 0,
    valid: 0,
    invalid: 0,
  });

  const form = useForm<CreateContactSchema>({
    resolver: zodResolver(createContactSchema),
    defaultValues: {
      companyId: store.company?.id,
      userId: store.user?.id,
      contacts: [],
    },
  });

  const _processCSV = (file: File) => {
    try {
      setIsLoading(true);

      Papa.parse(file, {
        complete: (results) => {
          setIsLoading(true);
          const parsedContacts = results.data
            .map((row: any) => {
              console.log(row);
              const [name, phone] = row;
              return { name, phone };
            })
            .filter(Boolean) as ContactProps[];

          const validContacts = [];
          const invalidContacts = [];
console.warn('PARSED CONTACTS: ', parsedContacts)
          parsedContacts.forEach((contact) => {
            const cleanedPhone = contact.phone?.replace(/\D/g, "");
console.log(cleanedPhone?.length, cleanedPhone)
            if ([12, 13].includes(cleanedPhone?.length) && cleanedPhone.startsWith("55")) {
              validContacts.push({ ...contact, phone: `+${cleanedPhone}` });
            } else {
              invalidContacts.push(contact);
            }
          });

          if (!validContacts.length) {
            toast.error("Nenhum contato válido.");
            return;
          }

          setContactCounts({
            total: parsedContacts.length,
            valid: validContacts.length,
            invalid: invalidContacts.length,
          });

          form.setValue("contacts", validContacts);
          onUploaded(validContacts);
          toast.success("Contatos processados com sucesso");
          setTableData(form.getValues("contacts"));

          // TODO: Chamar API para criação dos contatos válidos no banco
        },
        header: false,
      });
    } catch (err) {
      console.error(`Unhandled error at _processCSV function. Details: ${err}`);
    } finally {
      form.trigger();
      setIsLoading(false);
    }
  };

  const columns: ColumnDef<ContactProps>[] = [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => <div>{row.original.name}</div>,
    },
    {
      accessorKey: "phone",
      header: "Telefone",
      cell: ({ row }) => <div>{row.original.phone}</div>,
    },
  ];

  return (
    <div className="h-full flex flex-col gap-y-4">
      {/* TODO: colocar para poder selecionar contatos ou fazer upload na hora. Esse componente será reaproveitado na tela "Contatos" */}

      <Form {...form}>
        <form
          onKeyDown={(evt) => evt.key === "Enter" && evt?.preventDefault()}
          className="w-full disabled:cursor-not-allowed"
        >
          <FormField
            control={form.control}
            name={"contacts"}
            disabled={isLoading}
            render={({ field }) => (
              <FormItem className="text-left w-full">
                <FormControl>
                  <FileInput
                    acceptedFiles={[".csv"]}
                    onFileUpload={_processCSV}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>

        <div className="flex justify-around">
          <Card className="bg-rose-300/60 dark:bg-zinc-700/60 ring ring-offset-0 dark:ring-zinc-200 ring-zinc-800 dark:hover:shadow-zinc-200 hover:shadow-lg hover:shadow-zinc-200">
            <CardContent className="flex flex-col items-center p-4">
              <span className="font-bold">TOTAL DE CONTATOS:</span>
              <span className="text-3xl font-extrabold">
                {contactsCounts.total}
              </span>
            </CardContent>
          </Card>
          <Card className="bg-zinc-300/60 dark:bg-zinc-700/60 ring ring-offset-0 ring-lime-500 hover:shadow-lg hover:shadow-lime-500">
            <CardContent className="flex flex-col items-center p-4">
              <span className="font-bold">CONTATOS VÁLIDOS:</span>
              <span className="text-3xl font-extrabold">
                {contactsCounts.valid}
              </span>
            </CardContent>
          </Card>
          <Card className="bg-zinc-300/60 dark:bg-zinc-700/60 ring ring-offset-0 ring-rose-500 hover:shadow-lg hover:shadow-rose-500">
            <CardContent className="flex flex-col items-center p-4">
              <span className="font-bold">CONTATOS INVÁLIDOS:</span>
              <span className="text-3xl font-extrabold">
                {contactsCounts.invalid}
              </span>
            </CardContent>
          </Card>
        </div>

        {contactsCounts.valid > 0 && (
          <CustomDataTable columns={columns} data={tableDta} />
        )}

        {/* <Label>Tabela listando os contatos importados.</Label>
        <Label>Colocar skeletons e loaders</Label>
        <Label>Cards acima da tabela: quantitativo de contatos, quantitativo de contatos válidos, quantitativo contatos inválidos</Label> */}
        {/* Verificar números inválidos/mal formatados que não batam com a .length mínima de um número e/ou não bata com o pattern de um telefone.  */}
        {/* Nos inválidos, colocar um badge vermelho na tabela */}
        {/*  É necessario todos os números terem o 55 antes tbm, remover todos os espaços e tudo que não for número de 1 a 9 em cada telefone tb */}
        {/* Colocar um card de informacao/warning informando a questao do 55 antes, e outras dicas de formato aceitado pelo sistema. */}
        {/* Só liberar o botão pro próximo step caso tenha adicionado pelo menos 1 contato válido */}

        {/* TODO: remover */}
        {/* <button onClick={() => onUploaded(new Array(10).fill({ name: 'teste', phone: '55349912345678' }))}>TESTE</button> */}
      </Form>
    </div>
  );
}