"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, CircleAlert } from "lucide-react";

import { DemoInventoryBadge } from "@/components/cards/demo-inventory-badge";
import { SearchableCombobox } from "@/components/forms/searchable-combobox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { demoInventory } from "@/data/demo-inventory";
import { essentialMedicines } from "@/data/essential-medicines";
import { facilities } from "@/data/facilities";
import { stockRequests } from "@/data/mock-data";
import {
  findCaseInsensitiveMatch,
  getClosestMatches,
  type SearchOption,
} from "@/lib/search-normalization";

type RequestErrors = {
  facility?: string;
  medicine?: string;
  quantity?: string;
};

export function RequestFormPreview() {
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

  const requestCandidate =
    demoInventory.find((item) => item.status === "Out of Stock") ??
    demoInventory.find((item) => item.status === "Low Stock") ??
    demoInventory[0];
  const defaultFacility = facilityOptions.find((option) => option.value === requestCandidate?.facilityId) ?? facilityOptions[0];
  const defaultMedicine = medicineOptions.find((option) => option.value === requestCandidate?.medicineId) ?? medicineOptions[0];

  const [facilityInput, setFacilityInput] = useState(defaultFacility?.label ?? "");
  const [medicineInput, setMedicineInput] = useState(defaultMedicine?.label ?? "");
  const [quantityInput, setQuantityInput] = useState(requestCandidate?.status === "Out of Stock" ? "60" : "40");
  const [neededBy, setNeededBy] = useState("Within 48 hours");
  const [reason, setReason] = useState(
    `Demo request for ${defaultMedicine?.label ?? "an essential medicine"} at ${defaultFacility?.label ?? "a Kenya facility"}. Use this preview to show non-patient supply coordination only.`,
  );
  const [errors, setErrors] = useState<RequestErrors>({});
  const [suggestions, setSuggestions] = useState<{ facility: SearchOption<string>[]; medicine: SearchOption<string>[] }>({
    facility: [],
    medicine: [],
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [savedRequest, setSavedRequest] = useState<(typeof stockRequests)[number] | null>(null);

  const facilityMatch = findCaseInsensitiveMatch(facilityOptions, facilityInput);
  const medicineMatch = findCaseInsensitiveMatch(medicineOptions, medicineInput);

  function validateForm() {
    const nextErrors: RequestErrors = {};
    const nextSuggestions = {
      facility: [] as SearchOption<string>[],
      medicine: [] as SearchOption<string>[],
    };
    const parsedQuantity = Number(quantityInput);

    if (!facilityMatch) {
      nextErrors.facility = "Choose a known Kenya facility from the demo dataset.";
      nextSuggestions.facility = getClosestMatches(facilityOptions, facilityInput);
    }

    if (!medicineMatch) {
      nextErrors.medicine = "Choose a known medicine from the essential medicines list.";
      nextSuggestions.medicine = getClosestMatches(medicineOptions, medicineInput);
    }

    if (quantityInput.trim() === "") {
      nextErrors.quantity = "Enter the quantity requested.";
    } else if (Number.isNaN(parsedQuantity)) {
      nextErrors.quantity = "Quantity requested must be a number.";
    } else if (parsedQuantity < 0) {
      nextErrors.quantity = "Quantity requested cannot be negative.";
    }

    setErrors(nextErrors);
    setSuggestions(nextSuggestions);

    return Object.keys(nextErrors).length === 0 && facilityMatch && medicineMatch;
  }

  function handleSubmit() {
    setSuccessMessage("");

    if (!validateForm() || !facilityMatch || !medicineMatch) return;

    const nextRequest = {
      id: `REQ-KE-DEMO-${String(Date.now()).slice(-4)}`,
      clinicName: facilityMatch.label,
      medicineName: medicineMatch.label,
      quantityRequested: Number(quantityInput),
      status: "Pending" as const,
    };

    setSavedRequest(nextRequest);
    setFacilityInput(facilityMatch.label);
    setMedicineInput(medicineMatch.label);
    setErrors({});
    setSuggestions({ facility: [], medicine: [] });
    setSuccessMessage("Demo medicine request saved.");
  }

  return (
    <Card className="border-sky-100 bg-white/95 shadow-sm">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>Stock request form</CardTitle>
          <DemoInventoryBadge />
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="facility">Facility</Label>
            <SearchableCombobox
              id="facility"
              placeholder="Search a Kenya facility"
              options={facilityOptions}
              value={facilityInput}
              error={errors.facility}
              onValueChange={(value) => {
                setFacilityInput(value);
                setSuccessMessage("");
              }}
            />
            {errors.facility ? (
              <p className="text-sm text-rose-700">{errors.facility}</p>
            ) : null}
            {!facilityMatch && suggestions.facility.length ? (
              <p className="text-xs text-amber-700">
                No exact match found. Did you mean: {suggestions.facility.map((option) => option.label).join(", ")}?
              </p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="request-medicine">Medicine</Label>
            <SearchableCombobox
              id="request-medicine"
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
            ) : null}
            {!medicineMatch && suggestions.medicine.length ? (
              <p className="text-xs text-amber-700">
                No exact match found. Did you mean: {suggestions.medicine.map((option) => option.label).join(", ")}?
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          <div className="grid gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label htmlFor="requested-qty">Quantity requested</Label>
              <DemoInventoryBadge />
            </div>
            <Input
              id="requested-qty"
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
                Current demo stock signal: {requestCandidate?.status ?? "In Stock"} with {requestCandidate?.quantity ?? 0} units recorded.
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="needed-by">Needed by</Label>
            <Input id="needed-by" value={neededBy} onChange={(event) => setNeededBy(event.target.value)} />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="reason">Reason</Label>
          <Textarea id="reason" value={reason} onChange={(event) => setReason(event.target.value)} />
        </div>

        {successMessage ? (
          <Alert className="border-emerald-200 bg-emerald-50 text-emerald-950">
            <CheckCircle2 className="text-emerald-700" />
            <AlertTitle>{successMessage}</AlertTitle>
            <AlertDescription>
              The request stays in local demo state only and does not represent a live supply order.
            </AlertDescription>
          </Alert>
        ) : null}

        {(errors.facility || errors.medicine || errors.quantity) && !successMessage ? (
          <Alert variant="destructive" className="border-rose-200 bg-rose-50">
            <CircleAlert className="text-rose-700" />
            <AlertTitle>Please review the request details.</AlertTitle>
            <AlertDescription>
              Use a known Kenya facility, a known essential medicine, and a valid quantity to save a demo request.
            </AlertDescription>
          </Alert>
        ) : null}

        <Button className="w-full bg-sky-700 hover:bg-sky-800" onClick={handleSubmit}>
          Save demo request
        </Button>

        {savedRequest ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="font-medium text-slate-900">{savedRequest.medicineName}</p>
            <p className="text-sm text-slate-500">{savedRequest.clinicName}</p>
            <p className="mt-3 text-sm text-slate-600">
              {savedRequest.quantityRequested} units requested · {neededBy}
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
