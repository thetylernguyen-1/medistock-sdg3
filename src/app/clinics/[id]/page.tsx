import Link from "next/link";
import { notFound } from "next/navigation";

import { DemoInventoryBadge } from "@/components/cards/demo-inventory-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { clinics } from "@/data/mock-data";

type ClinicDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return clinics.map((clinic) => ({ id: clinic.id }));
}

export default async function ClinicDetailPage({ params }: ClinicDetailPageProps) {
  const { id } = await params;
  const clinic = clinics.find((entry) => entry.id === id);

  if (!clinic) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Link href="/clinics" className="text-sm font-medium text-teal-700 hover:text-teal-900">
          Back to clinics
        </Link>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{clinic.name}</h1>
          <p className="mt-2 text-slate-600">
            {clinic.address} · {clinic.area}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge className="bg-sky-100 text-sky-900">{clinic.facilityType}</Badge>
            <Badge variant="outline" className="border-teal-200 text-teal-800">
              {clinic.county}
            </Badge>
            {clinic.ownership ? (
              <Badge variant="outline" className="border-slate-200 text-slate-700">
                {clinic.ownership}
              </Badge>
            ) : null}
          </div>
        </div>
      </div>

      <Card className="border-slate-200 bg-white/95 shadow-sm">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Services and stock summary</CardTitle>
            <DemoInventoryBadge />
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {clinic.services.map((service) => (
              <Badge key={service} className="bg-teal-100 text-teal-900 hover:bg-teal-100">
                {service}
              </Badge>
            ))}
          </div>
          <Separator />
          <div className="grid gap-4 md:grid-cols-2">
            {clinic.inventory.map((item) => (
              <div key={item.medicineId} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-medium text-slate-900">{item.medicineName}</h2>
                    <p className="text-sm text-slate-500">Updated {item.updatedAt}</p>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    <Badge
                      className={
                        item.status === "In Stock"
                          ? "bg-emerald-100 text-emerald-900"
                          : item.status === "Low Stock"
                            ? "bg-amber-100 text-amber-900"
                            : "bg-rose-100 text-rose-900"
                      }
                    >
                      {item.status}
                    </Badge>
                    <DemoInventoryBadge />
                  </div>
                </div>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{item.quantity}</p>
                <p className="text-sm text-slate-500">Simulated units currently recorded</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500">
            Facility details are part of the MediStock Kenya demo dataset. Inventory figures are
            demo-only and do not reflect real-time stock.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
