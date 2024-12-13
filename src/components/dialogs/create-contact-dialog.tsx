// packages
import { useState } from "react";

// components
import { CustomDialog } from "@/components/dialogs/custom-dialog";
import { CreateContactForm } from "@/components/forms/create-contact-form";
import { CreateTagForm } from "@/components/forms/create-tag-form";
import { CreateVariableForm } from "@/components/forms/create-variable-form";

// entities
import { ContactProps, ContactTagProps, ContactVariableProps } from "@/entities/contact/contact";

// types
type CreateContactDialogProps = {
  open: boolean;
  tags: ContactTagProps[];
  variables: ContactVariableProps[];
  cb: (createdContact?: ContactProps) => void;
};

// variables
const loc = "components/dialogs/create-contact-dialog";

export function CreateContactDialog({ open, tags, variables, cb }: CreateContactDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(open);
  const [isCreatingTag, setIsCreatingTag] = useState<boolean>(false);
  const [createdTags, setCreatedTags] = useState<ContactTagProps[]>([]);
  const [isCreatingVariable, setIsCreatingVariable] = useState<boolean>(false);
  const [createdVariables, setCreatedVariables] = useState<ContactVariableProps[]>([]);

  function _handleTagCreation(createdTag: ContactTagProps) {
    setCreatedTags((prev) => [...prev, createdTag]);
    setIsCreatingTag(false);
  }

  function _handleVariableCreation(createdVariable: ContactVariableProps) {
    setCreatedVariables((prev) => [...prev, createdVariable]);
    setIsCreatingVariable(false);
  }

  return (
    <CustomDialog
      open={isOpen}
      title={isCreatingTag ? "Nova Tag" : isCreatingVariable ? "Nova Variável" : "Novo Contato"}
      className="overflow-x-hidden"
      onClose={() => {
        setIsOpen(false);
        cb(undefined);
      }}
    >
      {!isCreatingTag && !isCreatingVariable && <CreateContactForm tags={[...tags, ...createdTags]} variables={[...variables, ...createdVariables]} createTag={() => setIsCreatingTag(true)} createVariable={() => setIsCreatingVariable(true)} />}
      {isCreatingTag && <CreateTagForm tags={[...tags, ...createdTags]} onCancel={() => setIsCreatingTag(false)} onCreated={_handleTagCreation} />}
      {isCreatingVariable && <CreateVariableForm variables={[...variables, ...createdVariables]} onCancel={() => setIsCreatingVariable(false)} onCreated={_handleVariableCreation} />}
    </CustomDialog>
  );
}
