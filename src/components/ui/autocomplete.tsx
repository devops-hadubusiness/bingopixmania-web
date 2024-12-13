import React, { useState, Fragment } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { FaCheck, FaChevronDown } from 'react-icons/fa'
import { Badge } from './badge'
import { FiX } from 'react-icons/fi'
import { cn } from '@/lib/utils'

interface Option {
  value: string
  label: string
}

interface AutocompleteProps {
  options: Option[]
  placeholder?: string
  value: string[]
  onChange: (selected: string[]) => void
  inputClassName?: string
  controlClassName?: string
  menuClassName?: string
  optionClassName?: string
  selectedOptionClassName?: string
  activeOptionClassName?: string
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  options,
  placeholder = 'Selecione...',
  value,
  onChange,
  inputClassName = '',
  controlClassName = '',
  menuClassName = '',
  optionClassName = '',
  selectedOptionClassName = '',
  activeOptionClassName = '',
}) => {
  const [query, setQuery] = useState('')

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) =>
          option.label.toLowerCase().includes(query.toLowerCase()),
        )

  const handleRemove = (option: string) => {
    onChange(value.filter((selected) => selected !== option))
  }

  const handleSelect = (selectedValues: string[]) => {
    const uniqueValues = Array.from(new Set(selectedValues))
    onChange(uniqueValues)
  }

  return (
    <div className={cn('relative rounded-md', controlClassName)}>
      <Combobox value={value} onChange={handleSelect} multiple>
        <div className="relative">
          <div
            className={cn(
              'relative w-full cursor-default overflow-hidden rounded-md border border-input bg-background text-left shadow-md  sm:text-sm',
              controlClassName,
            )}
          >
            <div className="flex flex-wrap items-center gap-1 px-2 py-2">
              {value?.map((selectedValue) => {
                const selectedOption = options.find(
                  (option) => option.value === selectedValue,
                )
                return selectedOption ? (
                  <Badge
                    key={selectedValue}
                    className="flex items-center gap-2 bg-gray-200 px-2 py-1 rounded"
                  >
                    {selectedOption.label}
                    <FiX
                      className="cursor-pointer"
                      onClick={() => handleRemove(selectedValue)}
                    />
                  </Badge>
                ) : null
              })}
              <Combobox.Input
                className={cn(
                  'flex-grow border-none pl-3 pr-10 text-sm leading-5 text-zinc-800 dark:text-zinc-300 bg-transparent',
                  inputClassName,
                )}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={placeholder}
              />
            </div>
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <FaChevronDown
                className="h-4 w-4 opacity-50"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options
              className={cn(
                'absolute mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50',
                menuClassName,
              )}
            >
              {filteredOptions.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nada encontrado.
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <Combobox.Option
                    key={option.value}
                    className={({ active }) =>
                      cn(
                        'relative cursor-default select-none py-1.5 pl-8 pr-2 text-sm rounded-sm',
                        active ? activeOptionClassName : optionClassName,
                      )
                    }
                    value={option.value} // Use the string value directly
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={cn(
                            'block truncate',
                            selected ? selectedOptionClassName : 'font-normal',
                          )}
                        >
                          {option.label}
                        </span>
                        {selected && (
                          <span
                            className={cn(
                              'absolute inset-y-0 left-0 flex items-center pl-2',
                              active
                                ? 'dark:text-zinc-200 text-zinc-800'
                                : 'text-zinc-600',
                            )}
                          >
                            <FaCheck className="h-4 w-4" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  )
}

export default Autocomplete
