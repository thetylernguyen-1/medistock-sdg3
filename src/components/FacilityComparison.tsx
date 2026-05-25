"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Clinic } from "@/types/medistock";

type FacilityComparisonItem = {
  clinic: Clinic;
  matchingServices: string[];
  distanceLabel?: string;
};

type FacilityComparisonProps = {
  facilities: FacilityComparisonItem[];
};

export function FacilityComparison({ facilities }: FacilityComparisonProps) {
  if (!facilities.length) return null;

  return (
    <Card className="border-slate-200 bg-white/95 shadow-sm">
      <CardHeader>
        <CardTitle>Facility comparison</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-2">
        {facilities.map((facility) => (
          <div key={facility.clinic.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-slate-900">{facility.clinic.name}</p>
                <p className="text-sm text-slate-500">{facility.clinic.address}</p>
              </div>
              {facility.distanceLabel ? (
                <Badge className="bg-sky-100 text-sky-900 hover:bg-sky-100">{facility.distanceLabel}</Badge>
              ) : null}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {facility.matchingServices.map((service) => (
                <Badge key={service} variant="outline" className="border-teal-200 text-teal-800">
                  {service}
                </Badge>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-600">{facility.clinic.availabilityNote}</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">{facility.clinic.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
