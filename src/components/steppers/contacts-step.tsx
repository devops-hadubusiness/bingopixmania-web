// packages
import { useState, useEffect } from "react";

// components
import { ContactsForm } from "@/components/forms/contacts-form";
import { ImportContactsForm } from "@/components/forms/import-contacts-form";

// entities
import { ContactProps } from "@/entities/contact/contact";

// variables
const loc = "components/steppers/contacts-stepper";

// types
type ContextProps = "TABLE" | "FORM";
type ContactsStepProps = {
  onUploaded(contacts: ContactProps[]): void;
  togglePreviousButton(cb?: () => void): void;
};

export function ContactsStep({ onUploaded, togglePreviousButton }: ContactsStepProps) {
  const [context, setContext] = useState<ContextProps>("TABLE");

  useEffect(() => {
    togglePreviousButton(context === "FORM" ? () => () => setContext("TABLE") : undefined);
  }, [context]);

  return (
    <div className="w-full flex flex-col gap-4 min-h-full">
      {context === "TABLE" && <ContactsForm changeContext={ctx => setContext(ctx)} onSelected={onUploaded} />}
      {context === "FORM" && <ImportContactsForm onUploaded={onUploaded} />}
    </div>
  );
}
