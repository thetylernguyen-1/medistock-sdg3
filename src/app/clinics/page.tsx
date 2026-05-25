import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clinics } from "@/data/mock-data";

export default function ClinicsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Clinics</h1>
        <p className="max-w-3xl text-slate-600">
          Browse Kenya-focused demo facilities across urban and rural areas and open each
          profile to review services, availability notes, and simulated inventory.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {clinics.map((clinic) => (
          <Card key={clinic.id} className="border-slate-200 bg-white/95 shadow-sm">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>{clinic.name}</CardTitle>
                  <p className="mt-1 text-sm text-slate-500">{clinic.area}</p>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  <Badge className="bg-sky-100 text-sky-900">{clinic.facilityType}</Badge>
                  <Badge variant="outline" className="border-teal-200 text-teal-800">
                    {clinic.county}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">{clinic.address}</p>
              {clinic.ownership ? (
                <p className="text-sm text-slate-500">Ownership: {clinic.ownership}</p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                {clinic.services.map((service) => (
                  <Badge key={service} variant="outline" className="border-teal-200 text-teal-800">
                    {service}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-slate-500">Source: {clinic.source}</p>
              <Link href={`/clinics/${clinic.id}`} className="text-sm font-medium text-teal-700 hover:text-teal-900">
                View clinic detail
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
