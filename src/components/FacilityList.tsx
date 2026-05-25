"use client";

import { FacilityCard } from "@/components/FacilityCard";
import type { Clinic } from "@/types/medistock";

type FacilityListItem = {
  clinic: Clinic;
  matchingServices: string[];
  distanceLabel?: string;
};

type FacilityListProps = {
  facilities: FacilityListItem[];
  selectedComparisonIds: string[];
  onToggleCompare: (clinicId: string) => void;
};

export function FacilityList({ facilities, selectedComparisonIds, onToggleCompare }: FacilityListProps) {
  if (!facilities.length) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white/80 p-8 text-sm text-slate-600">
        No facilities match the current health needs and search filters. Try a different category, clear the search, or disable near-me ranking if it is too restrictive.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {facilities.map((facility) => (
        <FacilityCard
          key={facility.clinic.id}
          clinic={facility.clinic}
          matchingServices={facility.matchingServices}
          distanceLabel={facility.distanceLabel}
          isSelectedForComparison={selectedComparisonIds.includes(facility.clinic.id)}
          onToggleCompare={onToggleCompare}
        />
      ))}
    </div>
  );
}
