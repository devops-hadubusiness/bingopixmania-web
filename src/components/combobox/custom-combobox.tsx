"use client";

// packages
import { useState, forwardRef, useEffect } from "react";
import { Check, ListFilter, ChevronDown } from "lucide-react";

// lib
import { useMediaQuery } from "@/lib/hooks";

// components
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// utils
import { generateUUID } from "@/utils/uuids-util";

// types
import { LucideIconProps } from "@/types/components/icons-types";
type CustomComboboxProps = {
  items: any[];
  value?: any[];
  valueKey: string;
  titleKey: string;
  titlePrefix?: string;
  bgKey?: string;
  bgValue?: string;
  placeholder?: string;
  className?: string;
  icon?: LucideIconProps;
  disabled?: boolean;
  onChange?: (receivedSelectedItems: any[]) => void;
};
type ItemsListProps = {
  items: any[];
  selectedItems: any[];
  setSelectedItems: (item: any) => void;
  valueKey: string;
  titleKey: string;
  titlePrefix?: string;
  bgKey?: string;
  bgValue?: string;
};

export function CustomCombobox(props: CustomComboboxProps) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [open, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>(props.value || []);
  const [inputWidth, setInputWidth] = useState<number>();
  const inputsIds = [generateUUID(), generateUUID()];

  useEffect(() => {
    if (!inputWidth) return;
    if (props.onChange) props.onChange(selectedItems);
  }, [selectedItems, inputWidth]);

  useEffect(() => {
    if (!inputWidth) return;
    if (selectedItems.length != (props.value?.length || 0)) setSelectedItems(props.value);
  }, [props.value, inputWidth]);

  useEffect(() => {
    if ((props.bgKey || props.bgValue || props.titlePrefix) && !inputWidth) {
      const input = document.querySelector(inputsIds.reduce((total, current) => (total += `[id="${current}"],`), "").slice(0, -1)) as HTMLDivElement;
      if (!input) return;
      setInputWidth(input.clientWidth);
    }
  }, [selectedItems, inputWidth]);

  if (!isMobile) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className={`max-w-[150px] flex flex-row justify-start align-center relative px-8 h-10 rounded-md border border-input bg-zinc-100/80 dark:bg-zinc-950/80 py-2 text-sm ${props.className || ""}`} disabled={props.disabled}>
            {props.icon ? <props.icon className="size-4 absolute left-2 top-auto" /> : <ListFilter className="size-4 absolute left-2 top-auto" />}

            {props.bgKey || props.bgValue || props.titlePrefix ? (
              <div id={inputsIds[0]} className="flex gap-x-1 w-full truncate max-w-[var(--max-w)]" style={{ "--max-w": `${inputWidth}px` }}>
                {selectedItems.length ? (
                  selectedItems.map((item, index) => (
                    <div key={index} className="rounded-lg px-2 bg-[var(--bg)] hover:bg-[var(--bg)] text-[var(--text)]" style={{ "--bg": props.bgValue ? props.bgValue : props.bgKey ? item[props.bgKey] : "", "--text": props.bgValue || props.bgKey ? '#fff' : "" }}>
                      {props.titlePrefix ?? ""}
                      <span className="text-sm truncate">{item[props.titleKey]}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground truncate">{props.placeholder || "Selecionar ..."}</span>
                )}
              </div>
            ) : (
              <span className="text-sm text-muted-foreground truncate">{selectedItems.length ? selectedItems.reduce((total, current) => (total += `${current[props.titleKey]}, `), "").slice(0, -2) : props.placeholder || "Selecionar ..."}</span>
            )}

            <ChevronDown className="size-4 absolute right-2 top-auto" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0" align="start">
          <ItemsList items={props.items} selectedItems={selectedItems} setSelectedItems={setSelectedItems} titleKey={props.titleKey} titlePrefix={props.titlePrefix} valueKey={props.valueKey} bgKey={props.bgKey} bgValue={props.bgValue} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className={`xsAndDown:w-full smAndUp:max-w-[150px] flex flex-row justify-start align-center relative px-8 h-10 rounded-md border border-input bg-background dark:bg-gray-900 py-2 text-sm gap-x-1 ${props.className || ""}`} disabled={props.disabled}>
          {props.icon ? <props.icon className="size-4 absolute left-2 top-auto" /> : <ListFilter className="size-4 absolute left-2 top-auto" />}

          {props.bgKey || props.bgValue || props.titlePrefix ? (
            <div id={inputsIds[1]} className="flex gap-x-1 w-full truncate max-w-[var(--max-w)]" style={{ "--max-w": `${inputWidth}px` }}>
              {selectedItems.length ? (
                selectedItems.map((item, index) => (
                  <div key={index} className="rounded-lg px-2 bg-[var(--bg)] hover:bg-[var(--bg)] text-[var(--text)]" style={{ "--bg": props.bgValue ? props.bgValue : props.bgKey ? item[props.bgKey] : "", "--text": props.bgValue || props.bgKey ? '#fff' : "" }}>
                    {props.titlePrefix ?? ""}
                    <span className="text-sm truncate">{item[props.titleKey]}</span>
                  </div>
                ))
              ) : (
                <span className="text-sm text-muted-foreground truncate">{props.placeholder || "Selecionar ..."}</span>
              )}
            </div>
          ) : (
            <span className="text-sm text-muted-foreground truncate">{selectedItems.length ? selectedItems.reduce((total, current) => (total += `${current[props.titleKey]}, `), "").slice(0, -2) : props.placeholder || "Selecionar ..."}</span>
          )}

          <ChevronDown className="size-4 absolute right-2 top-auto" />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="pt-[1px]">
        <ItemsList items={props.items} selectedItems={selectedItems} setSelectedItems={setSelectedItems} titleKey={props.titleKey} titlePrefix={props.titlePrefix} valueKey={props.valueKey} bgKey={props.bgKey} bgValue={props.bgValue} />
      </DrawerContent>
    </Drawer>
  );
}

function ItemsList(props: ItemsListProps) {
  const isMobile = useMediaQuery("(max-width: 767px)");

  function _isItemSelected(item: any) {
    return !!props.selectedItems.find((si) => si[props.valueKey] === item[props.valueKey]);
  }

  return (
    <Command className={isMobile ? `min-w-full` : `max-w-[350px] min-w-[250px]`}>
      <CommandInput placeholder="Pesquisar ..." />
      <CommandList>
        <CommandEmpty className="text-sm text-center truncate p-4 text-muted-foreground">Nenhum registro encontrado.</CommandEmpty>
        <CommandGroup>
          {props.items.map((item, index) => (
            <CommandItem
              key={index}
              value={item[props.valueKey]}
              onSelect={() => {
                props.setSelectedItems((prev) => {
                  const result = Array.from(prev);
                  const existentIndex = prev.findIndex((p) => p[props.valueKey] == item[props.valueKey]);
                  if (existentIndex != -1) result.splice(existentIndex, 1);
                  else result.push(item);

                  return result;
                });
              }}
              className="text-sm pl-8 pr-4 py-1 flex flex-row flex-nowrap w-full rounded-lg hover:cursor-pointer relative"
            >
              <div className="flex rounded-lg px-2 bg-[var(--bg)] hover:bg-[var(--bg)] text-[var(--text)]" style={{ "--bg": props.bgValue ? props.bgValue : props.bgKey ? item[props.bgKey] : "", "--text": props.bgValue || props.bgKey ? '#fff' : "" }}>
                {props.titlePrefix ?? ""}
                {_isItemSelected(item) && <Check className="size-4 absolute left-2 top-auto text-foreground" />}
                <span className="truncate">{item[props.titleKey]}</span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
