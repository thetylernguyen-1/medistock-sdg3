"use client";

import { useMemo, useState } from "react";
import { ChevronsUpDown, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { normalizeSearchTerm, type SearchOption } from "@/lib/search-normalization";

type SearchableComboboxProps<T extends string> = {
  id: string;
  options: SearchOption<T>[];
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
  onOptionSelect?: (option: SearchOption<T>) => void;
  error?: string;
};

export function SearchableCombobox<T extends string>({
  id,
  options,
  placeholder,
  value,
  onValueChange,
  onOptionSelect,
  error,
}: SearchableComboboxProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = useMemo(() => {
    const normalizedValue = normalizeSearchTerm(value);
    if (!normalizedValue) return options.slice(0, 8);

    return options
      .filter((option) => {
        const haystack = normalizeSearchTerm(`${option.label}${option.keywords?.join("") ?? ""}`);
        return haystack.includes(normalizedValue);
      })
      .slice(0, 8);
  }, [options, value]);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
        <Input
          id={id}
          value={value}
          placeholder={placeholder}
          autoComplete="off"
          className={cn(
            "border-slate-200 bg-white pl-9 pr-9",
            error ? "border-rose-300 focus-visible:border-rose-400 focus-visible:ring-rose-100" : "",
          )}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            window.setTimeout(() => setIsOpen(false), 120);
          }}
          onChange={(event) => {
            onValueChange(event.target.value);
            setIsOpen(true);
          }}
        />
        <ChevronsUpDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-slate-400" />
      </div>
      {isOpen && filteredOptions.length ? (
        <div className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_24px_48px_-32px_rgba(15,23,42,0.35)]">
          {filteredOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-teal-50 hover:text-teal-900"
              onMouseDown={(event) => {
                event.preventDefault();
                onValueChange(option.label);
                onOptionSelect?.(option);
                setIsOpen(false);
              }}
            >
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
