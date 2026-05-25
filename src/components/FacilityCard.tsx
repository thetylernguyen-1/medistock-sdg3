"use client";

import { DemoInventoryBadge } from "@/components/cards/demo-inventory-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Clinic } from "@/types/medistock";

type FacilityCardProps = {
  clinic: Clinic;
  matchingServices: string[];
  distanceLabel?: string;
  isSelectedForComparison: boolean;
  onToggleCompare: (clinicId: string) => void;
};

export function FacilityCard({
  clinic,
  matchingServices,
  distanceLabel,
  isSelectedForComparison,
  onToggleCompare,
}: FacilityCardProps) {
  return (
    <Card className="border-slate-200 bg-white/95 shadow-sm">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>{clinic.name}</CardTitle>
            <p className="mt-1 text-sm text-slate-500">{clinic.county}{clinic.subCounty ? ` · ${clinic.subCounty}` : ""}</p>
          </div>
          {distanceLabel ? (
            <Badge className="bg-sky-100 text-sky-900 hover:bg-sky-100">{distanceLabel}</Badge>
          ) : null}
        </div>
        <p className="text-sm text-slate-600">{clinic.address}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-7 text-slate-600">{clinic.description}</p>
        <div className="flex flex-wrap gap-2">
          {matchingServices.map((service) => (
            <Badge key={service} variant="outline" className="border-teal-200 text-teal-800">
              {service}
            </Badge>
          ))}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-medium text-slate-900">Availability</p>
            <DemoInventoryBadge />
          </div>
          <p className="mt-2 text-sm text-slate-600">{clinic.availabilityNote}</p>
        </div>
        <button
          type="button"
          onClick={() => onToggleCompare(clinic.id)}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
            isSelectedForComparison
              ? "border-sky-700 bg-sky-700 text-white"
              : "border-sky-200 bg-sky-50 text-sky-900 hover:border-sky-400"
          }`}
        >
          {isSelectedForComparison ? "Remove from comparison" : "Add to comparison"}
        </button>
      </CardContent>
    </Card>
  );
}
