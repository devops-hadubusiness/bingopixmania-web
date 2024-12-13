// packages
import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Upload } from "lucide-react";

// components
import { CustomCombobox } from "@/components/combobox/custom-combobox";
import { Button } from "@/components/ui/button";
import { CreateContactDialog } from "@/components/dialogs/create-contact-dialog";

// constants
import { DDDs } from "@/constants/filters-constants";

// hooks
import { useToast } from "@/hooks/use-toast";

// lib
import { api } from "@/lib/axios";

// store
import { useStore } from "@/store/store";

// entities
import { contact_status, ContactProps, ContactTagProps, ContactVariableProps, formatted_contact_status } from "@/entities/contact/contact";
import { CampaignProps } from "@/entities/campaign/campaign";

// types
type ContactsFormProps = {
  changeContext(context: "FORM" | "TABLE"): void;
  onSelected(contacts: ContactProps[]): void;
};

// variables
const loc = "components/forms/contacts-form";

export function ContactsForm({ changeContext, onSelected }: ContactsFormProps) {
  const { toast } = useToast();
  const store = useStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreatingContact, setIsCreatingContact] = useState<boolean>(false);
  const [contacts, setContacts] = useState<ContactProps[]>([]);
  const [tags, setTags] = useState<ContactTagProps[]>([]);
  const [variables, setVariables] = useState<ContactVariableProps[]>([]);
  const [addedContacts, setAddedContacts] = useState<ContactProps[]>([]);
  const [validContactsCount, setValidContactsCount] = useState<number>(0);

  // TODO: tipar aqui com a entity
  const [campaigns, setCampaigns] = useState<CampaignProps[]>([]);

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

  async function _fetchContacts() {
    try {
      setIsLoading(true);

      const response = await api.get("/", {
        params: {
          action: "contacts_user_by_status",
          userId: store.user?.id,
          companyId: store.company?.id,
          status: JSON.stringify([contact_status.PENDING, contact_status.HAS_WHATSAPP]),
        },
      });

      console.warn(response.data.body);
      if (response.data.body?.length > 0) {
        setContacts(response.data.body[0].contacts || []);

        // TODO: arrumar aqui, fazer o new Set baseado no nome da tag e da variavel
        const distinctTags = Array.from(new Set(response.data.body[0].contacts.map((c) => (c.tags ? (typeof c.tags === "string" ? eval(JSON.parse(c.tags || "[]")) : c.tags) : [])).flat()));
        const distinctVariables = Array.from(new Set(response.data.body[0].contacts.map((c) => (c.variables ? (typeof c.variables === "string" ? eval(JSON.parse(c.variables || "[]")) : c.variables) : [])).flat()));

        setTags(distinctTags);
        setVariables(distinctVariables);
      } else setContacts([]);
    } catch (err) {
      console.error(`Unhandled error at ${loc}._fetchContacts function. Details: ${err}`);
      toast({ variant: "destructive", title: "Ops ...", description: "Não foi possível buscar os contatos." });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    _fetchContacts();
  }, []);

  return (
    <div className="w-full flex smAndDown:flex-wrap items-start xs:justify-center smAndUp:justify-between gap-y-4 gap-x-2">
      <Button variant="default" className="xsAndDown:w-full flex gap-x-2" disabled={isLoading} onClick={() => setIsCreatingContact(true)}>
        <Plus className="size-5" />
        Cadastrar
      </Button>

      <Button variant="default" onClick={() => changeContext("FORM")} className="xsAndDown:w-full flex gap-x-2" disabled={isLoading}>
        <Upload className="size-5" />
        Importar
      </Button>

      <div className="flex flex-wrap flex-grow smAndDown:justify-center mdAndUp:justify-end items-center gap-2">
        {/* <div className="flex flex-col gap-y-1 smAndDown:flex-grow">
          <span className="text-sm font-medium leading-none">Campanhas:</span>
          <CustomCombobox items={campaigns} valueKey="ref" titleKey="name" placeholder="Filtrar" disabled={true} />
        </div> */}

        <div className="flex flex-col gap-y-1 smAndDown:flex-grow">
          <span className="text-sm font-medium leading-none">Tags:</span>
          <CustomCombobox items={tags} valueKey="ref" titleKey="name" placeholder="Filtrar" />
        </div>

        <div className="flex flex-col gap-y-1 smAndDown:flex-grow">
          <span className="text-sm font-medium leading-none">DDD:</span>
          <CustomCombobox items={DDDs} valueKey="key" titleKey="value" placeholder="Filtrar" />
        </div>

        <div className="flex flex-col gap-y-1 smAndDown:flex-grow">
          <span className="text-sm font-medium leading-none">Status:</span>
          <CustomCombobox
            items={Object.entries(contact_status)
              .filter(([key]) => key != contact_status.DELETED)
              .map(([key]) => ({ key, value: formatted_contact_status[key] }))}
            valueKey="key"
            titleKey="value"
            placeholder="Filtrar"
          />
        </div>
      </div>

      {isCreatingContact && (
        <CreateContactDialog
          open={isCreatingContact}
          tags={tags}
          variables={variables}
          cb={(createdContact?: ContactProps) => {
            if (createdContact) setContacts((prev) => [createdContact, ...prev]);
            setIsCreatingContact(false);
          }}
        />
      )}
      {/* <CustomDataTable columns={columns} data={contacts} loading={isLoading} className="w-2/3">
        <div className="flex flex-row gap-x-2">
          <Button disabled className="flex gap-x-2">
            Tags
          </Button>

          <Button disabled className="flex gap-x-2">
            Prefixos
          </Button>
        </div>
      </CustomDataTable> */}
    </div>
  );
}
