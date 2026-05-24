import Link from "next/link";
import { notFound } from "next/navigation";

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
            {clinic.address} · {clinic.area} · {clinic.phone}
          </p>
        </div>
      </div>

      <Card className="border-slate-200 bg-white/95 shadow-sm">
        <CardHeader>
          <CardTitle>Services and stock summary</CardTitle>
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
                </div>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{item.quantity}</p>
                <p className="text-sm text-slate-500">Units currently recorded</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
