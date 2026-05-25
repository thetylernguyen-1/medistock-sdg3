"use client";

import { useMemo, useState } from "react";
import { LocateFixed, Search, TriangleAlert } from "lucide-react";

import { FacilityComparison } from "@/components/FacilityComparison";
import { FacilityList } from "@/components/FacilityList";
import { HealthNeedSelector } from "@/components/HealthNeedSelector";
import { SDGImpactCard } from "@/components/SDGImpactCard";
import { DemoInventoryBadge } from "@/components/cards/demo-inventory-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { healthNeedCategories } from "@/data/facilities";
import { useDemoInventoryState } from "@/lib/demo-inventory-state";
import {
  findCaseInsensitiveMatch,
  getClosestMatches,
  normalizeSearchTerm,
  type SearchOption,
} from "@/lib/search-normalization";
import { calculateHaversineDistanceKm, formatDistanceKm } from "@/utils/distance";
import type { HealthNeedCategoryId } from "@/types/facility";

type UserLocation = {
  latitude: number;
  longitude: number;
};

export default function FindMedicinePage() {
  const { snapshot } = useDemoInventoryState();
  const [selectedNeeds, setSelectedNeeds] = useState<HealthNeedCategoryId[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [locationMessage, setLocationMessage] = useState("");
  const [selectedComparisonIds, setSelectedComparisonIds] = useState<string[]>([]);

  const facilityOptions = useMemo<SearchOption<string>[]>(
    () =>
      snapshot.clinics.map((clinic) => ({
        label: clinic.name,
        value: clinic.id,
        keywords: [clinic.county, clinic.subCounty ?? "", clinic.address, ...clinic.serviceTags, ...clinic.services],
      })),
    [snapshot.clinics],
  );

  const closestSearchMatches = useMemo(() => {
    if (!searchInput.trim()) return [];
    return getClosestMatches(facilityOptions, searchInput);
  }, [facilityOptions, searchInput]);

  const filteredFacilities = useMemo(() => {
    const normalizedSearch = normalizeSearchTerm(searchInput);

    return snapshot.clinics
      .filter((clinic) => {
        const matchesNeed =
          selectedNeeds.length === 0
            ? true
            : selectedNeeds.some((need) => clinic.serviceTags.includes(need));

        const searchTarget = normalizeSearchTerm(
          `${clinic.name}${clinic.county}${clinic.subCounty ?? ""}${clinic.address}${clinic.serviceTags.join("")}${clinic.services.join("")}`,
        );
        const matchesSearch = normalizedSearch ? searchTarget.includes(normalizedSearch) : true;

        return matchesNeed && matchesSearch;
      })
      .map((clinic) => {
        const matchingServices =
          selectedNeeds.length === 0
            ? clinic.services
            : clinic.serviceTags
                .filter((tag) => selectedNeeds.includes(tag))
                .map((tag) => healthNeedCategories.find((category) => category.id === tag)?.label ?? tag);

        const distanceKm = location
          ? calculateHaversineDistanceKm(location, {
              latitude: clinic.latitude,
              longitude: clinic.longitude,
            })
          : null;

        return {
          clinic,
          matchingServices,
          distanceKm,
          distanceLabel: distanceKm === null ? undefined : formatDistanceKm(distanceKm),
        };
      })
      .sort((left, right) => {
        if (location && left.distanceKm !== null && right.distanceKm !== null) {
          return left.distanceKm - right.distanceKm;
        }
        return left.clinic.name.localeCompare(right.clinic.name);
      });
  }, [location, searchInput, selectedNeeds, snapshot.clinics]);

  const comparisonFacilities = filteredFacilities.filter((facility) =>
    selectedComparisonIds.includes(facility.clinic.id),
  );

  function toggleHealthNeed(categoryId: HealthNeedCategoryId) {
    setSelectedNeeds((current) =>
      current.includes(categoryId)
        ? current.filter((entry) => entry !== categoryId)
        : [...current, categoryId],
    );
  }

  function toggleComparison(clinicId: string) {
    setSelectedComparisonIds((current) =>
      current.includes(clinicId)
        ? current.filter((entry) => entry !== clinicId)
        : [...current, clinicId],
    );
  }

  function handleUseLocation() {
    if (!navigator.geolocation) {
      setLocation(null);
      setLocationMessage("Distance ranking is unavailable on this device.");
      return;
    }

    setLocationMessage("Requesting your location for distance ranking...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationMessage("Distance ranking is enabled for the current results.");
      },
      () => {
        setLocation(null);
        setLocationMessage("Distance ranking is unavailable because location access was denied or could not be confirmed.");
      },
      { enableHighAccuracy: false, timeout: 8000 },
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Find the right facility</h1>
        <p className="max-w-3xl text-slate-600">
          Identify nearby Kenya health facilities that match the type of care you need,
          compare them clearly, and optionally rank them by distance when location access is allowed.
        </p>
      </div>

      <HealthNeedSelector selectedNeeds={selectedNeeds} onToggle={toggleHealthNeed} />

      <Card className="border-slate-200 bg-white/95 shadow-sm">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>2. Search and location tools</CardTitle>
            <DemoInventoryBadge />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="grid gap-2">
              <label htmlFor="facility-search" className="text-sm font-medium text-slate-700">
                Search facilities, regions, or service tags
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="facility-search"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Try Nairobi, pharmacy, maternal care, or Kisumu"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800"
                />
              </div>
              <p className="text-xs text-slate-500">
                Search is case-insensitive, ignores extra spaces, and checks facility names, areas, and service tags.
              </p>
              {searchInput.trim() && !findCaseInsensitiveMatch(facilityOptions, searchInput) && closestSearchMatches.length ? (
                <p className="text-xs text-amber-700">
                  No exact match found. Did you mean: {closestSearchMatches.map((option) => option.label).join(", ")}?
                </p>
              ) : null}
            </div>
            <div className="grid gap-3">
              <button
                type="button"
                onClick={handleUseLocation}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 text-sm font-medium text-white hover:bg-teal-700"
              >
                <LocateFixed className="size-4" />
                Use my location
              </button>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                {locationMessage || "Distance ranking is off until you choose to share your location."}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-950">
            For this MVP, facilities are ranked using Haversine distance between the user and facility coordinates.
            In a production version with road-network data, this module could be replaced by Dijkstra or A* to optimize actual travel time.
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-white/95 shadow-sm">
        <CardHeader>
          <CardTitle>3. Matching facilities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <Badge className="bg-sky-100 text-sky-900 hover:bg-sky-100">
              {filteredFacilities.length} facility matches
            </Badge>
            {selectedNeeds.length ? (
              <Badge variant="outline" className="border-teal-200 text-teal-800">
                Filtered by {selectedNeeds.length} health need{selectedNeeds.length > 1 ? "s" : ""}
              </Badge>
            ) : null}
          </div>
          <FacilityList
            facilities={filteredFacilities}
            selectedComparisonIds={selectedComparisonIds}
            onToggleCompare={toggleComparison}
          />
        </CardContent>
      </Card>

      <FacilityComparison facilities={comparisonFacilities} />

      <SDGImpactCard />

      <Card className="border-amber-200 bg-amber-50 shadow-sm">
        <CardContent className="flex items-start gap-3 p-5 text-sm leading-7 text-amber-950">
          <TriangleAlert className="mt-1 size-4 text-amber-700" />
          <p>
            This tool supports healthcare navigation and service discovery only. It does not provide diagnosis, treatment advice, or real-time availability guarantees.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
