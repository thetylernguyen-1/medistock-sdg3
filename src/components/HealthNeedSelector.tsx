"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { healthNeedCategories } from "@/data/facilities";
import type { HealthNeedCategoryId } from "@/types/facility";

type HealthNeedSelectorProps = {
  selectedNeeds: HealthNeedCategoryId[];
  onToggle: (categoryId: HealthNeedCategoryId) => void;
};

export function HealthNeedSelector({ selectedNeeds, onToggle }: HealthNeedSelectorProps) {
  return (
    <Card className="border-slate-200 bg-white/95 shadow-sm">
      <CardHeader>
        <CardTitle>1. Choose your health need</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {healthNeedCategories.map((category) => {
            const isSelected = selectedNeeds.includes(category.id);

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onToggle(category.id)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isSelected
                    ? "border-teal-600 bg-teal-600 text-white"
                    : "border-teal-100 bg-teal-50 text-teal-900 hover:border-teal-300"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>
        {selectedNeeds.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {healthNeedCategories
              .filter((category) => selectedNeeds.includes(category.id))
              .map((category) => (
                <div key={category.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="bg-teal-100 text-teal-900 hover:bg-teal-100">{category.label}</Badge>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{category.guidance}</p>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            Select one or more categories to match facilities to the type of care you need.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
