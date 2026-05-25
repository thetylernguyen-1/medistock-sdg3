"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, CircleAlert } from "lucide-react";

import { DemoInventoryBadge } from "@/components/cards/demo-inventory-badge";
import { SearchableCombobox } from "@/components/forms/searchable-combobox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { essentialMedicines } from "@/data/essential-medicines";
import { facilities } from "@/data/facilities";
import { useDemoInventoryState } from "@/lib/demo-inventory-state";
import {
  findCaseInsensitiveMatch,
  getClosestMatches,
  normalizeSearchTerm,
  type SearchOption,
} from "@/lib/search-normalization";
import type { DemoInventoryRecord, StockStatus } from "@/types/medistock";

const MINIMUM_REQUIRED = 35;

type BulkErrors = {
  facilities?: string;
  medicine?: string;
  quantity?: string;
};

function buildUpdatedAt() {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

function deriveStockStatus(quantity: number): StockStatus {
  if (quantity <= 0) return "Out of Stock";
  if (quantity <= MINIMUM_REQUIRED) return "Low Stock";
  return "In Stock";
}

function statusBadgeClass(status: StockStatus) {
  if (status === "Out of Stock") return "bg-rose-100 text-rose-900";
  if (status === "Low Stock") return "bg-amber-100 text-amber-900";
  return "bg-emerald-100 text-emerald-900";
}

export function BulkDemoUpdatePanel() {
  const { saveUpdates } = useDemoInventoryState();
  const countyOptions = useMemo(
    () => ["all", ...Array.from(new Set(facilities.map((facility) => facility.county))).sort((a, b) => a.localeCompare(b))],
    [],
  );
  const medicineOptions = useMemo<SearchOption<string>[]>(
    () =>
      essentialMedicines.map((medicine) => ({
        label: medicine.name,
        value: medicine.id,
        keywords: [medicine.category, medicine.form],
      })),
    [],
  );

  const [countyFilter, setCountyFilter] = useState("all");
  const [facilitySearch, setFacilitySearch] = useState("");
  const [selectedFacilityIds, setSelectedFacilityIds] = useState<string[]>([]);
  const [medicineInput, setMedicineInput] = useState("Paracetamol");
  const [quantityInput, setQuantityInput] = useState("0");
  const [errors, setErrors] = useState<BulkErrors>({});
  const [suggestions, setSuggestions] = useState<SearchOption<string>[]>([]);
  const [successMessage, setSuccessMessage] = useState("");

  const filteredFacilities = useMemo(() => {
    const normalizedSearch = normalizeSearchTerm(facilitySearch);

    return facilities.filter((facility) => {
      const countyMatch = countyFilter === "all" ? true : facility.county === countyFilter;
      const searchMatch = normalizedSearch
        ? normalizeSearchTerm(`${facility.name}${facility.county}${facility.subCounty ?? ""}${facility.areaOrAddress ?? ""}`).includes(normalizedSearch)
        : true;
      return countyMatch && searchMatch;
    });
  }, [countyFilter, facilitySearch]);

  const medicineMatch = findCaseInsensitiveMatch(medicineOptions, medicineInput);
  const parsedQuantity =
    quantityInput.trim() === "" || Number.isNaN(Number(quantityInput)) ? null : Number(quantityInput);
  const derivedStatus = parsedQuantity === null ? "In Stock" : deriveStockStatus(parsedQuantity);

  function toggleFacility(facilityId: string) {
    setSelectedFacilityIds((current) =>
      current.includes(facilityId) ? current.filter((id) => id !== facilityId) : [...current, facilityId],
    );
    setSuccessMessage("");
  }

  function validateForm() {
    const nextErrors: BulkErrors = {};

    if (selectedFacilityIds.length === 0) {
      nextErrors.facilities = "Select at least one facility before applying a bulk update.";
    }

    if (!medicineMatch) {
      nextErrors.medicine = "Choose a known medicine from the essential medicines list.";
      setSuggestions(getClosestMatches(medicineOptions, medicineInput));
    } else {
      setSuggestions([]);
    }

    if (quantityInput.trim() === "") {
      nextErrors.quantity = "Enter a quantity before applying the bulk update.";
    } else if (parsedQuantity === null) {
      nextErrors.quantity = "Quantity must be a number.";
    } else if (parsedQuantity < 0) {
      nextErrors.quantity = "Quantity cannot be negative.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0 && medicineMatch && parsedQuantity !== null;
  }

  function handleApply() {
    setSuccessMessage("");
    if (!validateForm() || !medicineMatch || parsedQuantity === null) return;

    const updates: DemoInventoryRecord[] = selectedFacilityIds.map((facilityId) => ({
      facilityId,
      medicineId: medicineMatch.value,
      medicineName: medicineMatch.label,
      quantity: parsedQuantity,
      status: deriveStockStatus(parsedQuantity),
      updatedAt: buildUpdatedAt(),
      isDemo: true,
    }));

    saveUpdates(updates);
    setErrors({});
    setSuggestions([]);
    setSuccessMessage(`Demo inventory updated for ${updates.length} facilities.`);
  }

  return (
    <Card className="border-sky-100 bg-white/95 shadow-sm">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>Bulk demo update</CardTitle>
          <DemoInventoryBadge />
        </div>
        <Badge className="w-fit bg-sky-100 text-sky-900 hover:bg-sky-100">
          Prototype testing tool - demo inventory only
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="county-filter">County filter</Label>
              <select
                id="county-filter"
                value={countyFilter}
                onChange={(event) => setCountyFilter(event.target.value)}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800"
              >
                {countyOptions.map((county) => (
                  <option key={county} value={county}>
                    {county === "all" ? "All counties" : county}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="facility-search">Search facilities by name</Label>
              <Input
                id="facility-search"
                value={facilitySearch}
                onChange={(event) => setFacilitySearch(event.target.value)}
                placeholder="Type a facility name"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => setSelectedFacilityIds(filteredFacilities.map((facility) => facility.id))}
              >
                Select all filtered
              </Button>
              <Button variant="outline" type="button" onClick={() => setSelectedFacilityIds([])}>
                Clear selection
              </Button>
            </div>
            {errors.facilities ? <p className="text-sm text-rose-700">{errors.facilities}</p> : null}
            <div className="max-h-72 overflow-auto rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="grid gap-2">
                {filteredFacilities.map((facility) => (
                  <label
                    key={facility.id}
                    className="flex items-start gap-3 rounded-xl border border-transparent bg-white px-3 py-2 text-sm text-slate-700 shadow-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFacilityIds.includes(facility.id)}
                      onChange={() => toggleFacility(facility.id)}
                      className="mt-1 size-4 rounded border-slate-300 text-teal-600"
                    />
                    <span>
                      <span className="block font-medium text-slate-900">{facility.name}</span>
                      <span className="block text-xs text-slate-500">{facility.county}{facility.subCounty ? ` - ${facility.subCounty}` : ""}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="bulk-medicine">Medicine</Label>
              <SearchableCombobox
                id="bulk-medicine"
                placeholder="Search an essential medicine"
                options={medicineOptions}
                value={medicineInput}
                error={errors.medicine}
                onValueChange={(value) => {
                  setMedicineInput(value);
                  setSuccessMessage("");
                }}
              />
              {errors.medicine ? <p className="text-sm text-rose-700">{errors.medicine}</p> : null}
              {!medicineMatch && suggestions.length ? (
                <p className="text-xs text-amber-700">
                  No exact match found. Did you mean: {suggestions.map((option) => option.label).join(", ")}?
                </p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label htmlFor="bulk-quantity">Quantity</Label>
                <DemoInventoryBadge />
              </div>
              <Input
                id="bulk-quantity"
                type="number"
                value={quantityInput}
                onChange={(event) => {
                  setQuantityInput(event.target.value);
                  setSuccessMessage("");
                }}
                className={errors.quantity ? "border-rose-300 focus-visible:border-rose-400 focus-visible:ring-rose-100" : ""}
              />
              {errors.quantity ? <p className="text-sm text-rose-700">{errors.quantity}</p> : null}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-slate-900">Calculated status</p>
                <Badge className={statusBadgeClass(derivedStatus)}>{derivedStatus}</Badge>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                You are about to update {(medicineMatch?.label ?? medicineInput) || "the selected medicine"} to quantity{" "}
                {(parsedQuantity ?? quantityInput) || 0} for {selectedFacilityIds.length} selected facilities.
              </p>
            </div>

            {successMessage ? (
              <Alert className="border-emerald-200 bg-emerald-50 text-emerald-950">
                <CheckCircle2 className="text-emerald-700" />
                <AlertTitle>{successMessage}</AlertTitle>
                <AlertDescription>
                  The updated demo inventory is stored in local prototype state and can appear in Find Medicine, Dashboard, and Supply Network.
                </AlertDescription>
              </Alert>
            ) : null}

            {(errors.facilities || errors.medicine || errors.quantity) && !successMessage ? (
              <Alert variant="destructive" className="border-rose-200 bg-rose-50">
                <CircleAlert className="text-rose-700" />
                <AlertTitle>Bulk update needs a few fixes.</AlertTitle>
                <AlertDescription>
                  Select facilities, choose a known medicine, and enter a valid quantity before applying the update.
                </AlertDescription>
              </Alert>
            ) : null}

            <Button className="w-full bg-sky-700 hover:bg-sky-800" onClick={handleApply}>
              Apply bulk demo update
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
