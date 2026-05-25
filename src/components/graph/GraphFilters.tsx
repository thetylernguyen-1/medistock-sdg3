"use client";

import { Filter, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SupplyGraphOption, SupplyNetworkFilters } from "@/lib/graph-data";

type GraphFiltersProps = {
  filters: SupplyNetworkFilters;
  options: {
    county: SupplyGraphOption[];
    medicine: SupplyGraphOption[];
    stockStatus: SupplyGraphOption[];
    risk: SupplyGraphOption[];
  };
  onChange: (key: keyof SupplyNetworkFilters, value: string) => void;
  onReset: () => void;
};

export function GraphFilters({ filters, options, onChange, onReset }: GraphFiltersProps) {
  return (
    <div className="relative overflow-hidden rounded-[1.5rem] border border-white/60 bg-white/80 p-4 shadow-[0_18px_45px_-32px_rgba(14,116,144,0.55)] backdrop-blur">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(14,165,233,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,165,233,0.06)_1px,transparent_1px)] bg-[size:32px_32px] opacity-60" />
      <div className="relative flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-800">
            <Filter className="size-4 text-teal-700" />
            <p className="text-sm font-semibold">Graph filters</p>
          </div>
          <Button variant="outline" size="sm" onClick={onReset}>
            <RotateCcw className="size-3.5" />
            Reset
          </Button>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="grid gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">County</label>
            <Select value={filters.county} onValueChange={(value) => value && onChange("county", value)}>
              <SelectTrigger className="w-full border-teal-100 bg-white/90 text-slate-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.county.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Medicine</label>
            <Select value={filters.medicine} onValueChange={(value) => value && onChange("medicine", value)}>
              <SelectTrigger className="w-full border-teal-100 bg-white/90 text-slate-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.medicine.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Stock status</label>
            <Select value={filters.stockStatus} onValueChange={(value) => value && onChange("stockStatus", value)}>
              <SelectTrigger className="w-full border-teal-100 bg-white/90 text-slate-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.stockStatus.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Risk</label>
            <Select value={filters.risk} onValueChange={(value) => value && onChange("risk", value)}>
              <SelectTrigger className="w-full border-teal-100 bg-white/90 text-slate-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.risk.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
