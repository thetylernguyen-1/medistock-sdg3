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
import { Textarea } from "@/components/ui/textarea";
import { demoInventory } from "@/data/demo-inventory";
import { essentialMedicines } from "@/data/essential-medicines";
import { facilities } from "@/data/facilities";
import { useDemoInventoryState } from "@/lib/demo-inventory-state";
import {
  findCaseInsensitiveMatch,
  getClosestMatches,
  type SearchOption,
} from "@/lib/search-normalization";
import type { DemoInventoryRecord, StockStatus } from "@/types/medistock";

const MINIMUM_REQUIRED = 35;

type FormErrors = {
  clinic?: string;
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

export function StockFormPreview() {
  const facilityOptions = useMemo<SearchOption<string>[]>(
    () =>
      facilities.map((facility) => ({
        label: `${facility.name} (${facility.county})`,
        value: facility.id,
        keywords: [facility.name, facility.county, facility.subCounty ?? "", facility.areaOrAddress ?? ""],
      })),
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

  const defaultRecord = demoInventory.find((item) => item.status === "Low Stock") ?? demoInventory[0];
  const defaultFacility = facilityOptions.find((option) => option.value === defaultRecord?.facilityId) ?? facilityOptions[0];
  const defaultMedicine = medicineOptions.find((option) => option.value === defaultRecord?.medicineId) ?? medicineOptions[0];

  const { records: inventoryRecords, saveUpdates } = useDemoInventoryState();
  const [clinicInput, setClinicInput] = useState(defaultFacility?.label ?? "");
  const [medicineInput, setMedicineInput] = useState(defaultMedicine?.label ?? "");
  const [quantityInput, setQuantityInput] = useState(String(defaultRecord?.quantity ?? ""));
  const [notes, setNotes] = useState(
    `Demo inventory review for ${defaultFacility?.label ?? "Kenya facility"}. Last simulated update: ${defaultRecord?.updatedAt ?? "24 May 2026, 08:00"}.`,
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [suggestions, setSuggestions] = useState<{ clinic: SearchOption<string>[]; medicine: SearchOption<string>[] }>({
    clinic: [],
    medicine: [],
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [savedRecord, setSavedRecord] = useState<DemoInventoryRecord | null>(null);

  const clinicMatch = findCaseInsensitiveMatch(facilityOptions, clinicInput);
  const medicineMatch = findCaseInsensitiveMatch(medicineOptions, medicineInput);
  const matchingRecord =
    clinicMatch && medicineMatch
      ? inventoryRecords.find(
          (record) => record.facilityId === clinicMatch.value && record.medicineId === medicineMatch.value,
        ) ?? null
      : null;

  const parsedQuantity =
    quantityInput.trim() === "" || Number.isNaN(Number(quantityInput)) ? null : Number(quantityInput);
  const derivedStatus = parsedQuantity === null ? matchingRecord?.status ?? "In Stock" : deriveStockStatus(parsedQuantity);

  function validateForm() {
    const nextErrors: FormErrors = {};
    const nextSuggestions = {
      clinic: [] as SearchOption<string>[],
      medicine: [] as SearchOption<string>[],
    };

    if (!clinicMatch) {
      nextErrors.clinic = "Choose a known Kenya facility from the demo dataset.";
      nextSuggestions.clinic = getClosestMatches(facilityOptions, clinicInput);
    }

    if (!medicineMatch) {
      nextErrors.medicine = "Choose a known medicine from the essential medicines list.";
      nextSuggestions.medicine = getClosestMatches(medicineOptions, medicineInput);
    }

    if (quantityInput.trim() === "") {
      nextErrors.quantity = "Enter a quantity before saving the update.";
    } else if (parsedQuantity === null) {
      nextErrors.quantity = "Quantity must be a number.";
    } else if (parsedQuantity < 0) {
      nextErrors.quantity = "Quantity cannot be negative.";
    }

    setErrors(nextErrors);
    setSuggestions(nextSuggestions);

    return Object.keys(nextErrors).length === 0 && clinicMatch && medicineMatch && parsedQuantity !== null;
  }

  function handleSave() {
    setSuccessMessage("");

    if (!validateForm() || !clinicMatch || !medicineMatch || parsedQuantity === null) {
      return;
    }

    const nextRecord: DemoInventoryRecord = {
      facilityId: clinicMatch.value,
      medicineId: medicineMatch.value,
      medicineName: medicineMatch.label,
      quantity: parsedQuantity,
      status: deriveStockStatus(parsedQuantity),
      updatedAt: buildUpdatedAt(),
      isDemo: true,
    };

    saveUpdates([nextRecord]);
    setClinicInput(clinicMatch.label);
    setMedicineInput(medicineMatch.label);
    setSavedRecord(nextRecord);
    setErrors({});
    setSuggestions({ clinic: [], medicine: [] });
    setSuccessMessage("Demo inventory update saved.");
  }

  return (
    <Card className="border-teal-100 bg-white/95 shadow-sm">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>Inventory update form</CardTitle>
          <DemoInventoryBadge />
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="clinic">Clinic</Label>
          <SearchableCombobox
            id="clinic"
            placeholder="Search a Kenya facility"
            options={facilityOptions}
            value={clinicInput}
            error={errors.clinic}
            onValueChange={(value) => {
              setClinicInput(value);
              setSuccessMessage("");
            }}
          />
          {errors.clinic ? (
            <p className="text-sm text-rose-700">{errors.clinic}</p>
          ) : (
            <p className="text-xs text-slate-500">Search by facility name, county, or area.</p>
          )}
          {!clinicMatch && suggestions.clinic.length ? (
            <p className="text-xs text-amber-700">
              No exact match found. Did you mean: {suggestions.clinic.map((option) => option.label).join(", ")}?
            </p>
          ) : null}
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="medicine">Medicine</Label>
            <SearchableCombobox
              id="medicine"
              placeholder="Search an essential medicine"
              options={medicineOptions}
              value={medicineInput}
              error={errors.medicine}
              onValueChange={(value) => {
                setMedicineInput(value);
                setSuccessMessage("");
              }}
            />
            {errors.medicine ? (
              <p className="text-sm text-rose-700">{errors.medicine}</p>
            ) : (
              <p className="text-xs text-slate-500">Matching ignores case and extra whitespace.</p>
            )}
            {!medicineMatch && suggestions.medicine.length ? (
              <p className="text-xs text-amber-700">
                No exact match found. Did you mean: {suggestions.medicine.map((option) => option.label).join(", ")}?
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label>Stock status</Label>
              <DemoInventoryBadge />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge className={statusBadgeClass(derivedStatus)}>{derivedStatus}</Badge>
                <p className="text-xs text-slate-500">Low stock threshold: {MINIMUM_REQUIRED} units</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Label htmlFor="quantity">Quantity</Label>
            <DemoInventoryBadge />
          </div>
          <Input
            id="quantity"
            type="number"
            value={quantityInput}
            onChange={(event) => {
              setQuantityInput(event.target.value);
              setSuccessMessage("");
            }}
            className={errors.quantity ? "border-rose-300 focus-visible:border-rose-400 focus-visible:ring-rose-100" : ""}
          />
          {errors.quantity ? (
            <p className="text-sm text-rose-700">{errors.quantity}</p>
          ) : (
            <p className="text-xs text-slate-500">
              {matchingRecord
                ? `Current demo quantity for ${matchingRecord.medicineName}: ${matchingRecord.quantity} units.`
                : "Enter the new demo quantity to calculate stock status automatically."}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" value={notes} onChange={(event) => setNotes(event.target.value)} />
        </div>

        {successMessage ? (
          <Alert className="border-emerald-200 bg-emerald-50 text-emerald-950">
            <CheckCircle2 className="text-emerald-700" />
            <AlertTitle>{successMessage}</AlertTitle>
            <AlertDescription>
              The saved value is reflected in this page&apos;s local demo state and remains clearly marked as demo inventory.
            </AlertDescription>
          </Alert>
        ) : null}

        {(errors.clinic || errors.medicine || errors.quantity) && !successMessage ? (
          <Alert variant="destructive" className="border-rose-200 bg-rose-50">
            <CircleAlert className="text-rose-700" />
            <AlertTitle>Please review the highlighted fields.</AlertTitle>
            <AlertDescription>
              Use known Kenya facilities and essential medicines, then enter a valid quantity to continue.
            </AlertDescription>
          </Alert>
        ) : null}

        <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={handleSave}>
          Save demo update
        </Button>

        {savedRecord && clinicMatch ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium text-slate-900">{clinicMatch.label}</p>
                <p className="text-sm text-slate-500">{savedRecord.medicineName}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={statusBadgeClass(savedRecord.status)}>{savedRecord.status}</Badge>
                <DemoInventoryBadge />
              </div>
            </div>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{savedRecord.quantity}</p>
            <p className="text-sm text-slate-500">Updated locally at {savedRecord.updatedAt}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
