// packages
import * as React from "react";
import ReactDatePicker from "react-datepicker";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { FiCalendar, FiX } from "react-icons/fi";

// types
type DatePickerProps = {
  selected?: Date | string;
  onChange: (dateString?: string) => void;
  minDate?: Date | string;
};

const CustomInput = React.forwardRef(({ value, onClick, onClear }: any, ref: any) => (
  <div className="relative flex items-center bg-zinc-200/50 dark:bg-zinc-950/50 border rounded-lg h-10 w-full">
    <FiCalendar className="absolute left-3 text-gray-500" onClick={onClick} />
    <input ref={ref} value={value} onClick={onClick} readOnly className="w-full pl-10 bg-transparent border-none text-sm h-full outline-none cursor-pointer" />
    {value && <FiX className="absolute right-3 text-gray-500 cursor-pointer" onClick={onClear} />}
  </div>
));

export function DatePicker({ selected, onChange, minDate }: DatePickerProps) {
  const handleClear = () => onChange(undefined);

  const handleChange = (date: Date | null) => {
    if (date) {
      onChange(format(date, "yyyy-MM-dd"));
    } else {
      onChange(undefined);
    }
  };

  return (
    <ReactDatePicker
      minDate={minDate}
      placeholderText="Selecione uma data"
      selected={selected ? new Date(selected) : undefined}
      onChange={handleChange}
      locale={ptBR}
      dateFormat="dd/MM/yyyy"
      showMonthDropdown
      showYearDropdown
      dropdownMode="select"
      className="w-full"
      customInput={<CustomInput onClear={handleClear} />}
      disabledKeyboardNavigation
    />
  );
}
