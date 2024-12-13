// packages
import { useState, useEffect } from "react";
import { Trash, Plus } from "lucide-react";
import Papa from "papaparse";

// components
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FileInput } from "@/components/upload/file-input";
import { Button } from "@/components/ui/button";

// hooks
import { useToast } from "@/hooks/use-toast";

// entities
import { ContactProps } from "@/entities/contact/contact";

// types
type ImportContactsFormProps = {
  onUploaded(contacts: ContactProps[]): void;
};

// variables
const loc = "components/forms/import-contacts-form";

export function ImportContactsForm({ onUploaded }: ImportContactsFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [addedContacts, setAddedContacts] = useState<ContactProps[]>([]);
  const [validContactsCount, setValidContactsCount] = useState<number>(0);

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

          const { validContacts, invalidContacts } = _validateContacts(parsedContacts);

          if (!validContacts.length) {
            toast({ variant: "destructive", title: "Ops ...", description: "Nenhum contato válido." });
            return;
          }

          setValidContactsCount(validContactsCount + validContacts.length);
          const allValidContacts = [...addedContacts, ...validContacts.filter((vc) => !addedContacts.some((ac) => ac.name != vc.name && ac.phone != vc.phone))];
          setAddedContacts(allValidContacts);
          // onUploaded(allValidContacts);
          // toast({ variant: "success", title: "Sucesso", description: "Contatos processados com sucesso." });
          setIsLoading(false);
        },
        header: false,
      });
    } catch (err) {
      console.error(`Unhandled error at ${loc}._processCSV function. Details: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const _validateContacts = (contacts: ContactProps[]): { validContacts: ContactProps[]; invalidContacts: any[] } => {
    const validContacts: ContactProps[] = [];
    const invalidContacts = [];

    for (let c of contacts) {
      const cleanedPhone = c.phone?.replace(/\D/g, "");

      if ([12, 13].includes(cleanedPhone?.length) && cleanedPhone.startsWith("55")) {
        validContacts.push({ ...c, phone: `+${cleanedPhone}` });
      } else invalidContacts.push(c);
    }

    return { validContacts, invalidContacts };
  };

  function _removeContact(contact: ContactProps) {
    const remainingContacts = addedContacts.filter((ac) => ac.name != contact.name && ac.phone != contact.phone);
    setAddedContacts(remainingContacts);
    setValidContactsCount(remainingContacts.length);
  }

  useEffect(() => {
    onUploaded(addedContacts);
  }, [addedContacts]);

  return (
    <div className="flex w-full flex-col justify-center gap-y-4">
      <div className="w-full flex smAndDown:flex-wrap items-center xs:justify-center smAndUp:justify-start gap-y-4 gap-x-2">
        <Button variant="default" className="xsAndDown:w-full flex gap-x-2" disabled={isLoading}>
          <Plus className="size-5" />
          Cadastrar
        </Button>
      </div>

      <div className="flex flex-col w-full min-h-[650px] max-h-[650px] rounded-md">
        <div className="bg-gray-900 text-white rounded-t-md py-2 text-center">
          <span className="font-semibold text-sm">CONTATOS: {validContactsCount}</span>
        </div>

        {addedContacts?.length ? (
          <div className="overflow-y-auto p-4 flex flex-row flex-wrap gap-2 py-4 border border-b-0 bg-background dark:bg-gray-700">
            {addedContacts.map((c, index) => (
              <div key={index} className={`py-2 px-4 bg-accent border dark:border-gray-500 hover:cursor-grab transition-transform duration-500 ease-in-out rounded-md mdAndDown:w-full lg:w-[calc(50%_-_8px)] xlAndUp:w-[calc(33.3%_-_8px)] flex max-h-[38px]`}>
                <div className="grow flex flex-col truncate">
                  <span className="text-sm truncate">{c.name ? `${c.name} (${c.phone})` : c.phone}</span>
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" onClick={() => _removeContact(c)} className="hover:bg-transparent" size="xs">
                      <Trash className="size-4 text-red-500" />
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent className="bg-accent text-xs">Remover</TooltipContent>
                </Tooltip>
              </div>
            ))}
          </div>
        ) : null}

        <div className="w-full flex justify-end text-center">
          <FileInput acceptedFiles={[".csv"]} onFileUpload={_processCSV} multiple={true} className="rounded-none rounded-b-md" />
        </div>
      </div>
    </div>
  );
}
